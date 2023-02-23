import { Component } from "/Zyckl0n/Front_engine/classes/Component.js";

export const main_comp_class = class ProjectManager extends Component{
    constructor(parent, params={}){
        super(parent);
        this.state = {}
    }

    render(){
        var html = "";
        html += "<div class='main_frame_placeholder'>";
            html += "<h3>Project Manager</h3>";
            html += "<h3>Work in progress</h3>";
            html += "<img style='height:50px' src='/Zyckl0n/Images/cog.gif' />"
        html += "</div>";
        return html;
    }
}