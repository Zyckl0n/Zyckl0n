import { Component } from "/Zyckl0n/Front_engine/classes/Component.js";
import { API } from "/Zyckl0n/Epiderme/Api.js";
import { REGISTRIES } from "/Zyckl0n/Epiderme/Registry.js";
import { NOTIFICATION } from "/Zyckl0n/Components/Notification/Notification.js";

export class DatabaseTableMaker extends Component{
    constructor(parent, _table_name){
        super(parent);
        this.state = {}
        this.base_name = "basederoche";
        this.changed_cells = [];
        this.item_list = [];
        this.title = "Liste des "+_table_name+" !"
        this.table_name = _table_name;
        this.linked_tables = null;

        this.registry = REGISTRIES.get_registry(_table_name);
    }

    initialize_column_name(api_response){
        this.colomn_name = [];
        api_response.forEach(element => {
            if(element["COLUMN_NAME"] != "id"+this.table_name){
                this.colomn_name.push(element["COLUMN_NAME"])
            }
        });
    }

    /*************************************************/
    /* MAIN CRUD
    /*************************************************/
    delete_item(id){
        document.getElementById(this.id).querySelector("#item_id_"+id).remove();
        this.registry.delete_item(id);
    }

    async fetch_list(){
        this.currently_rendered_junction_table = {};
        try{
            // Récuperation de la liste des colomne de la table
            await this.registry.get_columns().then((ret)=>{this.initialize_column_name(ret)})

            // Récuperation de tout les objet de la table
            this.registry.get_all_items().then((ret)=>{this.item_list = ret}).then(this.refresh_displayed_list.bind(this))
        }catch(e){
            NOTIFICATION.notify("Error from API or DB : " + e)
        }
    }

    async create_a_item(){
        var obj = {
            "table_name" : this.table_name,
        }
        const new_item = await API.post("create_a_item", obj, "table_name=" + this.table_name);
        if(new_item == null){
            NOTIFICATION.notify("Error while getting the new created item.")
        }else{
            document.getElementById(this.id).querySelector("#"+this.table_name+"_editor_list").innerHTML += this.render_item_obj(new_item)
            const input = document.getElementById(this.id).querySelector("#item_id_" + new_item["id"+this.table_name]).querySelector("#"+this.colomn_name[0]+"_input");
            input.value = "";
            input.focus();
        }
    }

    async send_item_list_to_api(btn){
        const saved_list = this.changed_cells;
        this.changed_cells = [];
        
        for(var key in saved_list){
            var obj = saved_list[key]

            await API.post("update_item", obj, "table_name="+this.table_name)
            .then(()=>{this.enable_edition(this.div.querySelector("#item_id_" + saved_list[key].id))});
        } 
        btn.querySelector("img").src = "/Images/Tick.svg";
    }

    /*************************************************/
    /* MAIN Pannel
    /*************************************************/

    // Main Confirm button handler
    confirm_edit(btn){
        btn.querySelector("img").src = "/Images/cog.gif";
        for(var key in this.changed_cells){
            this.disable_edition(document.getElementById(this.id).querySelector("#item_id_" + this.changed_cells[key].id));
        }
        this.send_item_list_to_api(btn);
    }

    // Refresh the main table diplay
    refresh_displayed_list(){
        this.state_has_changed = true;
        var html = "";
        this.refresh_legend();
        this.refresh_search();
        this.item_list.forEach(element => {
            html += this.render_item_obj(element);
        });
        document.getElementById(this.id).querySelector("#"+this.table_name+"_editor_list").innerHTML = html;
    }

    // Disable the edition of a row
    disable_edition(element){
        element.classList.add("updating");
        const inputs_of_the_cell = element.querySelectorAll("input");
        inputs_of_the_cell.forEach(elem => {
            elem.classList.remove("modified")
            elem.setAttribute("value", elem.value);
        });
    }

    // Enable the edition of a row
    enable_edition(element){
        element.classList.remove("updating");
    }

    // Change a attribute value handler
    change_item_attribute(id, input){
        this.state_has_changed = true;
        var new_value = input.value;
        var base_value = input.getAttribute("placeholder");

        var edited_cell = input.parentNode.parentNode;

        var potential_new_obj = {
            "id": id.substring(3)
        };

        var inputs = [];
        this.colomn_name.forEach(colomn => {
            var my_input = edited_cell.querySelector("#"+colomn+"_input");
            potential_new_obj[colomn] = my_input.value;
            inputs.push(my_input);
        });

        if(base_value == new_value){
            input.classList.remove("modified");

            var have_only_default_value = true;
            inputs.forEach(element => {
                if(element.value != element.getAttribute("value")){
                    have_only_default_value = false;
                }
            });
            if(have_only_default_value){
                delete this.changed_cells[id];
            }else{
                this.changed_cells[id] = potential_new_obj;
            }
        }else{
            input.classList.add("modified");
            this.changed_cells[id] = potential_new_obj;
        }
    }

    toggle_extra_row(extra_name){
        const extra_row = this.div.querySelector("#DB_extra_row_" + extra_name);
        console.log(extra_row)
        if(extra_row.classList.contains("hidden")){
            extra_row.classList.remove("hidden");
        }else{
            extra_row.classList.add("hidden");
        }
    }

    close_extra_row(btn){
        const extra_row = btn.parentNode.parentNode;
        if(extra_row.classList.contains("hidden")){
            extra_row.classList.remove("hidden");
        }else{
            extra_row.classList.add("hidden");
        }
    }

    /*************************************************/
    /* Juction table
    /*************************************************/

    // Initilize a juction table
    include_many(subitem_table_name, junction_table_name, extra_column=[]){
        if(this.linked_tables == null){
            this.linked_tables = {};
        }
        this.linked_tables[junction_table_name] = {
            "table_name" : subitem_table_name,
            "junction_table" : junction_table_name,
            "extra_column": extra_column
        }

        this.currently_rendered_junction_table = {};
    }

    /**
     * Pen button handler, Fetch the linked items of a row inside a junction table
     * @param {DOMElement} btn The pen button clicked to start this event
     * @param {Int} id The id of the item (Row) as the container in the junction table
     */
    toggle_linked_attribute(btn, id, junction_table_name){
        const linked_attribute_body = btn.parentNode.parentNode.parentNode.querySelector('#DB_table_item_cell_linked');

        // Si la table est déja celle en cour d'edition, On ne fais rien sauf la masquer
        if(this.currently_rendered_junction_table[id] == junction_table_name){
            this.toggle_linked_attribute_visibility(linked_attribute_body);
            return;
        }else{
            this.fetch_included_attribute(linked_attribute_body, id, junction_table_name);
            this.currently_rendered_junction_table[id] = junction_table_name;
        }
    }

    // Show or hide the juction table pannel under a items (row) 
    toggle_linked_attribute_visibility(body, force=null){
        if(force === null){
            force = body.classList.contains("hide");
        }

        if(force){
            body.classList.remove("hide")
            body.style.maxHeight = "" + body.scrollHeight + "px";
        }else{
            body.classList.add("hide")
            body.style.maxHeight = "0px";
        }
    }

    // Fetch the data in the juction table. Then fill the HTML table in fill_included_attribute
    async fetch_included_attribute(body, id, junction_table_name){
        await API.fetch("get_a_linked_attribute", 
            "id_container=" + id + 
            "&id_container_name="+"id"+this.table_name+
            "&id_contained_name=" + "id" + this.linked_tables[junction_table_name]["table_name"]+
            "&contained_table_name="+this.linked_tables[junction_table_name]["table_name"] + 
            "&container_table_name="+this.table_name+
            "&junction_table_name="+ this.linked_tables[junction_table_name]["junction_table"]
        ).then((ret)=>{this.fill_included_attribute(body, ret, this.linked_tables[junction_table_name], id)})
    }

    // Fill the body using ret as content
    fill_included_attribute(body, ret, link_to_table, item_id){
        var html = "";
        body.innerHTML = "";
        console.log(ret);
        
        ret.forEach(element => {
            var id_row = element["id"+link_to_table["junction_table"]]
            html += "<div class='DB_table_linked_table_item' id='"+id_row+"'>";
                html+= "<div class='DB_table_linked_table_item_attribute'>"+element["name"]+"</div>";
                Object.keys(element).forEach(key => {
                    if(key!= "name" && key != "id" + this.table_name && key != "id"+link_to_table["junction_table"] && key != "id"+link_to_table["table_name"])
                    html+= "<div class='DB_table_linked_table_item_attribute'>"+"<input class='DB_table_item_attribute' id_attribute=\""+key+"\" oninput='"+this.self()+".linked_attribute_input_change(this)' value='"+element[key]+"'>"+"</div>";
                });
                html += "<div class='circular_btn' onclick='"+this.self()+".delete_junction_row(\""+link_to_table["junction_table"]+"\", "+id_row+", this)' > <img src='/Images/close.svg'> </div>";
            html += "</div>";
        });
        html += "<div class='DB_table_linked_table_item'>";
            html += "<div class='circular_btn' onclick='"+this.self()+".new_juctiontable_row(this, \""+link_to_table["junction_table"]+"\", "+item_id+")' > <img src='/Images/add.svg'> </div>";
            html += "<div class='circular_btn' onclick='"+this.self()+".confirm_linked_attribute_edition(this, \""+link_to_table["junction_table"]+"\")'> <img src='/Images/Tick.svg'> </div>";
        html += "</div>";
        body.innerHTML = html;
        this.toggle_linked_attribute_visibility(body, true);
    }

    delete_junction_row(table_name, id, btn){
        REGISTRIES.get_registry(table_name).delete_item(id);
        btn.parentNode.remove();
    }

    // Change value of a input handler (Inside junction table pan)
    linked_attribute_input_change(input){
        if(input.value != input.getAttribute('value')){
            input.classList.add("modified");
        }else{
            input.classList.remove("modified"); 
        }
    }

    // Confirm the edition of the juction table
    confirm_linked_attribute_edition(btn, junction_table_name){
        const container = btn.parentNode.parentNode;
        var edited_rows = container.querySelectorAll(".DB_table_linked_table_item");

        edited_rows.forEach(row => {
            const inputs_list = row.querySelectorAll(".modified");
            console.log(inputs_list)

            if(inputs_list.length > 0){
                var obj_to_edit = {
                    id: row.getAttribute("id"),
                }
                inputs_list.forEach(inp => {
                    obj_to_edit[inp.getAttribute('id_attribute')] = inp.value;
                });
                
                API.post("update_item", obj_to_edit, "table_name="+this.linked_tables[junction_table_name]["junction_table"])
            }
        });
    }

    async new_juctiontable_row(btn, junction_table_name, item_id){
        const btn_container = btn.parentNode; 
        const container = btn_container.parentNode; 
        const subitems_table_name = this.linked_tables[junction_table_name]["table_name"];
        const list_of_subitems = await REGISTRIES.get_registry(subitems_table_name).get_all_items();

        var html = "";
        html += "<select id='new_juction_table_row_select' class='DB_table_linked_table_item_attribute'>";
        list_of_subitems.forEach(subitem => {
            html += "<option style='color:black;' value='"+subitem["id" + subitems_table_name]+"' >";
                html += subitem["name"];
            html += "</option>";
        });
        html += "</select>";
        html += "<div onclick='"+this.self()+".confirm_new_juctiontable_row(this, \""+junction_table_name+"\", "+item_id+")' class='circular_btn'><img src='/Images/Tick.svg'></div>";

        // Insertion
        var div = document.createElement("div");
        div.setAttribute("class", "DB_table_linked_table_item");
        div.setAttribute("id", "new_linked_item_row");
        div.innerHTML = html;

        container.insertBefore(div, btn_container);

        // Refresh the max height of the container
        this.toggle_linked_attribute_visibility(container, true)
    }

    async confirm_new_juctiontable_row(btn, junction_table_name, item_id){
        const subitem_table_name = this.linked_tables[junction_table_name]["table_name"];
        const select = btn.parentNode.querySelector("#new_juction_table_row_select");
        const junction_table_pan = btn.parentNode.parentNode;
        var obj = {};
        obj["id" + this.table_name] = item_id;
        obj["id" + subitem_table_name] = select.value;

        await REGISTRIES.get_registry(junction_table_name).insert_item(obj);
        this.fetch_included_attribute(junction_table_pan, item_id, junction_table_name);
    }

    /*************************************************/
    /* Extra features
    /*************************************************/
    refresh_legend(){
        var html = "";
        Object.keys(this.item_list[0]).forEach(column_name => {
            if(column_name != "id" + this.table_name)
            html += "<div class='column_name'>" + column_name + '</div>';
        });
        this.refresh_extra_row("legend", html);
    }

    refresh_search(){
        var html = "<input class='DB_table_search' oninput='"+this.self()+".filter_table(this)' />";
        this.refresh_extra_row("search", html)
    }

    refresh_extra_row(name_of_the_extra_row, content){
        var html = content;
        var placeholder_width = 30;
        if(this.linked_tables != null){
            placeholder_width += 30 * Object.keys(this.linked_tables).length
        }
        html += "<div style='min-width:"+placeholder_width+"px'><div onclick='"+this.self()+".close_extra_row(this)' class='circular_btn'><img src='/Images/close.svg'></div></div></div>";
        this.div.querySelector("#DB_extra_row_" + name_of_the_extra_row).innerHTML = html;
    }

    filter_table(input){
        const query = input.value;
        const rows = Array.from(this.div.querySelector("#"+this.table_name+"_editor_list").children);

        rows.forEach(row => {
            var keep_row = false;
            row.querySelectorAll("input").forEach(inp => {
                if(inp.value.includes(query)){
                    keep_row = true;
                }
            });
            if(keep_row){
                row.classList.remove("filter_hide");
            }else{
                row.classList.add("filter_hide");
            }
        });
    }

    /*************************************************/
    /* Rendering 
    /*************************************************/

    // Render a input of a main row
    render_input_of_cell(attribute_name, value, id){
        var html = "";
        html += "<div class='DB_table_item_cell_attribute'>";
            html += "<input autocomplete='off' oninput='"+this.self()+".change_item_attribute(\""+id+"\", this)' id='"+attribute_name+"_input' placeholder='"+value+"' value='"+value+"' class='DB_table_item_attribute'>";
        html += "</div>";
        return html;
    }

    // Render a row (1 for each item in the table)
    render_item_obj(item){
        var html = "";
        var id = "id_" + (item["id" + this.table_name]);
        html += "<div id='item_"+id+"' class='DB_table_item_cell'>";
            html += "<div class='DB_table_item_cell_name_loading'><img style='height:100%' src='/Images/cog.gif' /></div>";
            html += "<div class='DB_table_item_cell_header'>";
                Object.keys(item).forEach(key => {
                    if(key != "id"+this.table_name){
                        html += this.render_input_of_cell(key, item[key], id);
                    }
                });

                if(this.linked_tables != null){
                    Object.keys(this.linked_tables).forEach(key => {
                        var junction_table = this.linked_tables[key];
                        html += "<div class='DB_table_item_right_icon'>";
                            html += "<div onclick='"+this.self()+".toggle_linked_attribute(this, "+(item["id" + this.table_name])+", \""+junction_table["junction_table"]+"\")' class='circular_btn'><img src='/Images/Food/edit.png'></div>"
                        html += "</div>";
                    });
                }
                
                html += "<div class='DB_table_item_right_icon'>";
                        html += "<div onclick='"+this.self()+".delete_item(\""+item["id" + this.table_name]+"\")' class='circular_btn'>X</div>"
                    html += "</div>";
            html += "</div>";

            if(this.linked_tables != null){
                html += "<div id='DB_table_item_cell_linked' class='hide'>";
                    html += "Loading...";
                html += "</div>";
            }
        html += "</div>";
        return html;
    }

    // Render the whole list, That's just Render()
    render_list(){
        var html = "";
        html += "<div class='DB_table_header'>";
            html += "<div class='DB_table_header_title'>"+this.title+"</div>"
            html += "<div class='DB_table_header_buttonset'>";
                html += "<div onclick='"+this.self()+".toggle_extra_row(\"legend\")' class='circular_btn'><img src='/Images/icon_list.svg'></div>";
                html += "<div onclick='"+this.self()+".toggle_extra_row(\"search\")' class='circular_btn'><img src='/Images/icon_search.svg'></div>";
                html += "<div onclick='"+this.self()+".fetch_list()' class='circular_btn'><img src='/Images/refresh.png'></div>";
            html += "</div>";
            html += "<div class='DB_extra_row hidden' id='DB_extra_row_legend'></div>";
            html += "<div class='DB_extra_row hidden' id='DB_extra_row_search'></div>";
        html += "</div>";
        html += "<div id='"+this.table_name+"_editor_list' class='DB_table_body'>";
        html += "</div>";
        html += "<div class='DB_table_footer'>";
            html += "<div onclick='"+this.self()+".create_a_item()' class='DB_table_footer_btn'>";
                html += "<img id='add_"+this.table_name+"_btn' src='/Images/add.svg'>"
            html += "</div>";
            html += "<div class='DB_table_footer_btn' onclick='"+this.self()+".confirm_edit(this)'>";
                html += "<img id='confirm_btn' src='/Images/Tick.svg'>"
            html += "</div>";
        html += "</div>";
        return html;
    }

    render(){
        this.fetch_list();
        var html = "";
        html += this.render_list();
        html += "<link rel='stylesheet' href='Components/DatabaseTableMaker/DatabaseTableMaker.css'></link>";
        return html;
    }
}