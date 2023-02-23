export class Component{
    /**********************************************************/
    /* Function related to the object Component
    /**********************************************************/
    constructor(_parent){
        this.parent = _parent;
        this.state = {};
        this.id = e7();

        this.state_has_changed = false;
        this.last_result = null;

        this._div = null;
        
        this.last_input_focused = -1;
        front_engine_component_annuary[this.id] = this;
        this.post_rendering_function = null; 
        this.post_rendering_arguments = null;
    }

    self(){
        return "front_engine_component_annuary[\""+this.id+"\"]";
    }

    get div(){
        if(!document.documentElement.contains(this._div)){
            this._div = document.getElementById(this.id)
        }
        return this._div;
    }

    /**********************************************************/
    /* Function used by me, For testing
    /**********************************************************/
    dev_generate_a_lot_of_input(amount){
        var end = "";
        for (let i = 0; i < amount; i++) {
            end += this.stateInput("type='text'", "input_de_test_"+i, "test");
        }
        return end;
    }

    /**********************************************************/
    /* Function manipulating state
    /**********************************************************/  
    changeState(string_index, value){
        this.state_has_changed = true;
        var index = string_index.split("/");

        var ref = this.state;
        for (let i = index.length; i > 1; i--) {
            const element = index[i-1];
            if(ref[element] == null) ref[element] = {};
            ref = ref[element];
        }
        ref[index[0]] = value;
        this.__render();
    }

    /**********************************************************/
    /* Manipulating inputs
    /**********************************************************/
    input(options, input_index){
        var html = "<input input_index="+ input_index + " " + options+" >";
        return html;
    }

    stateInput(options, input_index, state_name, on_input=""){
        var new_options =  options + " value='"+this.state[state_name]+"' oninput='"+on_input+";"+this.self()+".changeStateInput(\""+state_name+"\",this)'";
        return this.input(new_options, input_index);
    }

    changeStateInput(string_index, inp){
        this.last_input_focused = inp.getAttribute("input_index");
        this.changeState(string_index, inp.value);
        var recreated_input = document.querySelector("[input_index=\""+this.last_input_focused+"\"]");
        recreated_input.focus();
        recreated_input.setSelectionRange(inp.selectionStart, inp.selectionStart);
        this.last_input_focused = -1;
    }

    /**********************************************************/
    /* Rendering
    /**********************************************************/
    render_kid(kid, extra_option=""){
        var html = kid.__render(true, extra_option);
        return html;
    }

    __render(byParent, extra_option=""){
        var html = "";
        if(this.last_result != null && !this.state_has_changed){
            html = this.last_result;
        }else{
            html = "<div "+extra_option+" id=\""+this.id+"\">";
            html += this.render();
            html += "</div>";
            this.last_result = html;
        }
        
        if(this.post_rendering_function !== null){
            window.requestAnimationFrame(this.__post_rendering.bind(this));
        }

        if(byParent){
            return html;
        }else{
            try{
                document.getElementById(this.id).innerHTML = html;
            }catch(e){
                return html;
            }
        }

        
    }

    __post_rendering(){
        this.post_rendering_function(this.post_rendering_arguments);
    }

    on_rendering(func, args){
        this.post_rendering_arguments = args;
        this.post_rendering_function = func;
    }

    /**********************************************************/
    /* Function that should be overrwritten
    /**********************************************************/
    render(){
        var html = "";
        html = "This is the basic Component class ! Override the render() method in order to make your own component :)"
        this.last_result = html;
    }
}

var lut = []; for (var i=0; i<256; i++) { lut[i] = (i<16?'0':'')+(i).toString(16); }
function e7() {
    var d0 = Math.random()*0xffffffff|0;
    var d1 = Math.random()*0xffffffff|0;
    var d2 = Math.random()*0xffffffff|0;
    var d3 = Math.random()*0xffffffff|0;
    return lut[d0&0xff]+lut[d0>>8&0xff]+lut[d0>>16&0xff]+lut[d0>>24&0xff]+'-'+
    lut[d1&0xff]+lut[d1>>8&0xff]+'-'+lut[d1>>16&0x0f|0x40]+lut[d1>>24&0xff]+'-'+
    lut[d2&0x3f|0x80]+lut[d2>>8&0xff]+'-'+lut[d2>>16&0xff]+lut[d2>>24&0xff]+
    lut[d3&0xff]+lut[d3>>8&0xff]+lut[d3>>16&0xff]+lut[d3>>24&0xff];
}