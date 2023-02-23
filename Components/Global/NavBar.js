import { get_main_frame } from "./MainFrame.js";
import { Component } from "/Zyckl0n/Front_engine/classes/Component.js";

export class NavBar extends Component{
    constructor(parent, params={}){
        super(parent);
        this.state = {}
        this.main_frame = get_main_frame();
        this.current_rendered_app_title = "Tool-Box"
    }

    home_btn(){
        get_main_frame().change_current_app("Tool-Box");
    }

    change_title(new_title){
        this.current_rendered_app_title = new_title;
        var title_dom = document.getElementById("current_rendered_app_title");
        try {
            title_dom.classList.add("faded");
            
            setTimeout(() => {
                title_dom.innerHTML = new_title;
            }, 200);
    
            setTimeout(() => {
                title_dom.classList.remove("faded");
            }, 400);
        }catch{

        }
    }

    render(){
        var html = "";
        html += "<link rel='stylesheet' href='Components/Global/NavBar.css'></link>";
        html += "<div class='main_title'>";
            html += "<h4 id='current_rendered_app_title'>"+this.current_rendered_app_title+"</h4>";
            html += "<img class='navbar_icon' onclick='"+this.self()+".home_btn()' src='Images/Home.png' />";
        html += "</div>";
        return html;
    }
}

var navbar = new NavBar();
export function get_navbar(){
    return navbar;
}