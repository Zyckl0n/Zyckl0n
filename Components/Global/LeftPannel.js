import { Component } from "../../Front_engine/classes/Component.js";
import { get_main_frame } from "./MainFrame.js";

export class LeftPannel extends Component{
    constructor(parent, params={}){
        super(parent);
        this.state = {}
        this.displayed = false;
        this.apps = ["FoodManager", "ProjectManager", "ASCIIArt", "SpecialThanks", "Sandbox"]
    }

    click_arrow(arrow){
        this.displayed = !this.displayed;
        if(this.displayed){
            arrow.parentNode.classList.add("active");
        }else{
            arrow.parentNode.classList.remove("active");
        }
    }

    click_block(app_name){
        get_main_frame().change_current_app(app_name);
    }

    render_block(app_name){
        var html = "";
        html += "<div class='left_panel_block' onclick='"+this.self()+".click_block(\""+app_name+"\")'>";
            html += "<img class='left_panel_block' src='/Zyckl0n/Images/App_Logo/"+app_name+"_small.png' />"
        html += "</div>";
        return html;
    }

    render(){
        var html = "";
        html += "<link rel='stylesheet' href='Components/Global/left_panel.css'></link>";

        html += "<div class='panel_grip' onclick='"+this.self()+".click_arrow(this)'>";
            html += "<img id='background' src='Images/volet.svg' />";
            html += "<img id='arrow' src='Images/arrow.svg' />";
        html += "</div>";
        this.apps.forEach(app => {
            html += this.render_block(app);
        });
        return html;
    }
}