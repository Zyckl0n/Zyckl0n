import { Component } from "/Front_engine/classes/Component.js";
import { FoodButtonset } from "./FoodButtonset.js";
import { ShoppingList } from "./ShoppingList.js";
import { FoodCalendar } from "./FoodCalendar.js";
import { FoodEditor } from "./FoodEditor.js";
import { FoodPreferences } from "./FoodPreferences.js";

export const main_comp_class = class FoodManager extends Component{
    constructor(parent, params={}){
        super(parent);
        this.state = {}
        this.buttonset = new FoodButtonset(this);
        this.shopping_list = new ShoppingList(this);

        // --- Main frames
        this.food_calendar = new FoodCalendar(this);
        this.food_editor = new FoodEditor(this);
        this.food_preferences = new FoodPreferences(this);

        this.displayed_main_frame = "home"
    }

    render_main_frame(){
        var html = "<div id='food_main_frame'>";
        switch (this.displayed_main_frame) {
            case "home":
                html += this.render_kid(this.food_calendar, "class='food_calendar'")
                break;
            case "edit":
                html += this.render_kid(this.food_editor, "class='food_editor'")
                break;
            case "preference":
                html += this.render_kid(this.food_preferences, "class='food_preferences'")
                break;
            default:
                break;
        }
        html += "</div>";
        return html;
    }

    change_main_frame(new_frame){
        this.displayed_main_frame = new_frame;
        var dom_main_frame = document.getElementById("food_main_frame");

        dom_main_frame.style.transition = "opacity .1s ease-in-out";
        dom_main_frame.style.opacity = "0";

        setTimeout(() => {
            dom_main_frame.innerHTML = this.render_main_frame();
        }, 150);

        setTimeout(() => {
            dom_main_frame.style.opacity = "1";
        }, 300);
    }

    async refresh_calendar(){
        this.food_calendar.refresh_calendar();
    }

    render(){
        var html = "";
        html += "<link rel='stylesheet' href='Components/FoodManager/FoodManager.css'></link>";
        html += "<div class='food_left_group'>"
            html += this.render_kid(this.buttonset, "class='food_buttonset'")
            html += this.render_main_frame();
        html +="</div>";
        html += this.render_kid(this.shopping_list, "class='food_shoppinglist'")
        return html;
    }
}