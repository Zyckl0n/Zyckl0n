import { Component } from "/Front_engine/classes/Component.js";

export class MinimumComponent extends Component{
    constructor(parent, params={}){
        super(parent);
        this.state = {}
    }

    render(){
        var html = "Component minimum";
        return html;
    }
}