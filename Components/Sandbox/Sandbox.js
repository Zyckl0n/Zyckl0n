import { Component } from "/Zyckl0n/Front_engine/classes/Component.js";
import { PhysicObject, PhysicSquare } from "./PhysicEngine/PhysicObject.js";

export const main_comp_class = class Sandbox extends Component{
    constructor(parent, params={}){
        super(parent);
        this.on_rendering(this.recover_dom_element, {})
        this.objects = [];
        
        this.shape={
            "square": PhysicSquare,
            "circle": PhysicObject
        }
        this.current_shape = "circle";
    }

    recover_dom_element(){
        this.particle_canvas = this.div.querySelector("#particle_canvas");
        this.ctx = this.particle_canvas.getContext("2d");
        this.refresh_canvas_resolution();
        setInterval(
            this.tick.bind(this)
        , 16);
    }

    refresh_canvas_resolution(){
        this.particle_canvas.width = document.getElementById("main_frame").scrollWidth;
        this.particle_canvas.height = document.getElementById("main_frame").scrollHeight;
    }

    pop_object(x, y){
        var item=null;
        switch (this.current_shape) {
            case "square":
                item = new PhysicSquare(50, 50, x, y);
                break;
            case "circle":
                item = new PhysicObject(10, x, y);
                break;
            default:
                break;
        }
        this.objects.push(item)
    }

    click_canvas(event){
        this.pop_object(event.layerX, event.layerY);
    }

    tick(){
        this.clear_canvas();
        this.objects.forEach(obj => {
            obj.tick();
            obj.render(this.ctx);
        });
    }

    clear_canvas(){
        // this.ctx.clearRect(0, 0, this.particle_canvas.width, this.particle_canvas.height);
        this.ctx.fillStyle = "#14141450";
        this.ctx.rect(0, 0, this.particle_canvas.width, this.particle_canvas.height);
        this.ctx.fill();
    }

    select_shape(btn, shape){
        
        Array.from(btn.parentNode.querySelectorAll(".circular_btn")).forEach(element => {
            element.classList.remove("active");
        });
        btn.classList.add("active");
        this.current_shape = shape;
    }

    render(){
        var html = "";
        html += "<link rel='stylesheet' href='Components/Sandbox/Sandbox.css'></link>";
        html += "<canvas onclick='"+this.self()+".click_canvas(event)' id='particle_canvas'></canvas>";
        html += "<div class='shape_selector'>";
            html += "<div class='circular_btn active' onclick='"+this.self()+".select_shape(this, \"circle\")'> <img src='/Zyckl0n/Images/Sandbox/circle.svg'> </div>"
            html += "<div class='circular_btn' onclick='"+this.self()+".select_shape(this, \"square\")'> <img src='/Zyckl0n/Images/Sandbox/square.svg'> </div>"
        html += "</div>";
        return html;
    }
}