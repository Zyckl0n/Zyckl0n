import { Component } from "/Zyckl0n/Front_engine/classes/Component.js";
import { API } from "/Zyckl0n/Epiderme/Api.js"

export class FoodButtonset extends Component{
    constructor(parent, params={}){
        super(parent);
        this.state = {}
    }

    render_button(type){
        var html = "<div onclick='"+this.self()+".click_btn(\""+type+"\", this)' class='food_circular_button "+type+"'>";
            html += "<img src='/Images/Food/"+type+".png' />"
        html += "</div>";
        return html;
    }

    click_btn(type, btn=null){
        if(type == "regenerate"){
            this.parent.refresh_calendar();
            return;
        }
        this.parent.change_main_frame(type);
        if(btn != null){
            btn.classList.add("active")
        }
    }

    render(){
        var html = "";
        html += this.render_button("home");
        html += this.render_button("edit");
        html += this.render_button("preference");
        html += this.render_button("regenerate");
        return html;
    }
}