import { Component } from "/Front_engine/classes/Component.js";
import { NOTIFICATION } from "/Components/Notification/Notification.js";
import { get_navbar } from "./NavBar.js";

export class MainFrame extends Component{
    constructor(parent, params={}){
        super(parent);
        this.state = {}
        
        this.currently_rendered_app = "Tool-Box";
        this.loaded_app = {"Tool-Box" : null};
        this.notification_system = NOTIFICATION;
        this.routing();
    }

    // --- Display a new app on the main frame.
    async change_current_app(new_app){
        // --- Hide the currently displayed app before switching
        try{document.getElementById("main_frame_transition").classList.add("active");}catch(e){}

        // --- Loading the new module
        const starting_load_time = Date.now();
        if(!Object.keys(this.loaded_app).includes(new_app)){
            const test = await import("/Components/"+new_app+"/"+new_app+".js");
            this.loaded_app[new_app] = new test.main_comp_class();
        }
        this.currently_rendered_app = new_app;
        const loading_duration = Date.now() - starting_load_time;
        console.log("App " + new_app + " loaded in " + loading_duration + "ms.")

        // --- Waiting for the Css transition to hide the body before rendering the new app
        if(loading_duration < 200){
            setTimeout(() => {
                document.getElementById("main_frame").innerHTML = this.render_current_app();
            }, 200 - loading_duration);
        }else{
            document.getElementById("main_frame").innerHTML = this.render_current_app();
        }
        
        // --- Display the result
        setTimeout(() => {
            document.getElementById("main_frame_transition").classList.remove("active");
        }, Math.max(0, 400 - loading_duration));
    }

    render_home(){
        var html = "";
        html += "<div class='main_frame_placeholder'>";
            html += "<h3>Home page</h3>";
            html += "<h3>Work in progress</h3>";
            html += "<img style='height:50px' src='/Images/cog.gif' />"
        html += "</div>";
        return html
    }

    render_current_app(){
        get_navbar().change_title(this.currently_rendered_app);
        switch (this.currently_rendered_app) {
            case "Tool-Box":
                return this.render_home(); 
            default:
                return this.render_kid(this.loaded_app[this.currently_rendered_app], "class='"+this.currently_rendered_app+"' ");
        }
    }

    async routing(){
        var rendered_app_routed = "Tool-Box";
        const path = window.location.hash.split('/');
        if(path.length > 1){
            rendered_app_routed = path[1];
            this.change_current_app(rendered_app_routed);
        }
    }

    render(){
        var html = "";
        html += "<link rel='stylesheet' href='Components/Global/MainFrame.css'></link>";
        html += this.render_kid(this.notification_system, "class='notification_main_frame'");
        html += "<div id='main_frame_transition'>"
        html += "</div>"
        html += "<div id='main_frame'>"
        html += "Loading..."
        html += "</div>"
        return html;
    }
}

var main_frame = new MainFrame();
export function get_main_frame(){
    return main_frame;
}