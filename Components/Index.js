import { Component } from "../Front_engine/classes/Component.js";
import { LeftPannel } from "./Global/LeftPannel.js";
import { get_main_frame, MainFrame } from "./Global/MainFrame.js";
import { get_navbar, NavBar } from "./Global/NavBar.js";

export class Index extends Component{
    constructor(parent, params={}){
        super(parent);
        this.state = {}
        this.left_panel = new LeftPannel(this);
        this.navbar = get_navbar();
        this.main_frame = get_main_frame();
    }

    render(){
        var html = "";
        html += this.render_kid(this.navbar, 'class="navbar"')
        html += this.render_kid(this.left_panel, 'class="left_panel"');
        html += "<div id='fixed_navbar_compensator' style='height:68px'></div>"
        html += this.render_kid(this.main_frame, 'class="main_frame"')
        return html;
    }
}