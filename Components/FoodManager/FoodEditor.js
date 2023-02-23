import { Component } from "/Front_engine/classes/Component.js";
import { DatabaseTableMaker } from "/Components/DatabaseTableMaker/DatabaseTableMaker.js";

export class FoodEditor extends Component{
    constructor(parent, params={}){
        super(parent);
        this.state = {};
        this.changed_cells = [];
        this.ingredients_list = [];

        this.all_db_editors=[
            new DatabaseTableMaker(this, "Ingredient"),
            new DatabaseTableMaker(this, "Plat"),
            new DatabaseTableMaker(this, "Plat"),
        ]

        this.all_db_editors[1].include_many("Ingredient", "Recette", []);
    }

    render(){
        var html = "";
        html += "<link rel='stylesheet' href='Components/FoodManager/FoodEditor.css'></link>";
        this.all_db_editors.forEach(element => {
            html += this.render_kid(element, "class='food_editor_colomn'");
        });
        return html;
    }
}