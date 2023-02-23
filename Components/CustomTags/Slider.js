import { Component } from "/Front_engine/classes/Component.js";

export class CustomSlider extends Component{
    constructor(parent, min=0, max=100, step=1, default_value=null){
        super(parent);
        this.slider = null;
        this.txt_input = null;

        this.on_rendering(this.get_inputs, {});

        this.min = min;
        this.max = max;
        this.step = step;

        if(default_value === null){
            this.value = min + ((max - min) / 2);
        }else{
            this.value = default_value;
        }

        this.onchange_handler = {};

        this.next_handler_id = 0;
    }

    get_inputs(){
        this.slider = this.div.querySelector("#custom_slider_range");
        this.txt_input = this.div.querySelector("#custom_slider_text");
    }

    change_value(input){
        if(input.value > this.max){
            this.txt_input.value = this.max;
            this.slider.value = this.max;
            this.value = this.max;
        }else{
            if(input.value < this.min){
                this.txt_input.value = this.min;
                this.slider.value = this.min;
                this.value = this.min;
            }else{
                if(input.getAttribute('type') == 'range'){
                    this.txt_input.value = input.value;
                }else{
                    this.slider.value = input.value;
                }
                this.value = input.value;
            }
        }
        this._on_change();
    }

    add_onchange_listener(func, args){
        const listener = {
            "func": func,
            "args": args,
        }
        this.onchange_handler[""+this.next_handler_id] = listener;
        this.next_handler_id++;
        return (""+ (this.next_handler_id-1))
    }

    _on_change(){
        Object.keys(this.onchange_handler).forEach(key => {
            const handler = this.onchange_handler[key];
            handler.func(handler.args);
        });
    }

    render(){
        var html = "";
        html += "<input id='custom_slider_range' value="+this.value+" oninput='"+this.self()+".change_value(this)' type='range' min='"+this.min+"' max='"+this.max+"' step='"+this.step+"'>"
        html += "<input id='custom_slider_text' value="+this.value+"  oninput='"+this.self()+".change_value(this)' type='number' min='"+this.min+"' max='"+this.max+"' step='"+this.step+"'>"
        return html;
    }
}