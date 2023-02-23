import { Component } from "./Front_engine/classes/Component.js";
import { Index } from "./Components/Index.js";

// The main app
export class Main_app extends Component{
    constructor(_parent){
        super(_parent);
        this.comp = new Index(this);
    }

    render(){
        var html = this.comp.__render(true);
        document.getElementById("main_body_content").innerHTML = html;
    }
}