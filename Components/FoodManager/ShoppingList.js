import { Component } from "/Zyckl0n/Front_engine/classes/Component.js";

export class ShoppingList extends Component{
    constructor(parent, params={}){
        super(parent);
        this.state = {}
    }

    list_item(){
        var html = "";
        html += "<div class='shopping_list_item'>"
            html += "<div>Cordon bleu</div>";
            html += "<div>3</div>";
        html += "</div>"
        return html;
    }

    render(){
        var html = "";
        html += "<div class='shopping_header'>";
        html += "Liste de course"
        html += "</div>";
        html += "<div class='shopping_body'>";
            html += "<div class='shopping_list'>";
                html += this.list_item();
                html += this.list_item();
                html += this.list_item();
                html += this.list_item();
            html += "</div>";
            html += "<div class='shopping_list_footer'>";
                html += "<div>Prix total :</div>";
                html += "<div>10.33€</div>";
            html += "</div>";
        html += "</div>";
        return html;
    }
}