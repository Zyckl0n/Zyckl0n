import { Component } from "/Zyckl0n/Front_engine/classes/Component.js";
import { API } from "../../Epiderme/Api.js";
import { CustomSlider } from "../CustomTags/Slider.js";

export const main_comp_class = class ASCIIArt extends Component{
    constructor(parent, params={}){
        super(parent);
        this.state = {}
        this.limitSelector = new CustomSlider(this, 0, 255, 1, 120);
        this.width_selector = new CustomSlider(this, 20, 200, 1);
        this.main_result_container = null;
        this.sliding = false;
        this.color_is_reversed = 0;
    }

    async launch_ASCII(){
        const img_input = this.div.querySelector("#ASCII_image_input");

        const formData = new FormData();
        formData.append('image', img_input.files[0]);
        const content_html = document.getElementById("result_ASCIIART_container");

        var fr = new FileReader();
        fr.onload = function () {
            document.getElementById("uploded_image_preview").src = fr.result;
            document.getElementById("preview_image_side").querySelector("img").src = fr.result
        }
        fr.readAsDataURL(img_input.files[0]);

        await API.post('ASCIIArt/upload', formData, "limit="+this.limitSelector.value+"&width_in_char="+this.width_selector.value+"&reversed=" + this.color_is_reversed, false).then(response => {
            content_html.innerHTML = response
        })

        const prev_img = document.getElementById("preview_image_side").querySelector("img");
        prev_img.style.minWidth = content_html.scrollWidth + "px";
        prev_img.style.minHeight = content_html.scrollHeight + "px";
    }

    switch_result_display_mode(new_mode, btn_pressed){
        if(this.main_result_container == null){
            this.main_result_container = document.getElementById("main_result_container");
        }
        
        Array.from(btn_pressed.parentNode.querySelectorAll(".circular_btn")).forEach(element => {
            element.classList.remove("active");
        });
        btn_pressed.classList.add("active");

        this.main_result_container.classList = "main_result_container " + new_mode; 
    }

    get_default_str(){
        var html = "";
        html += "\n                                                                                                                                                                                                        "
        html += "\n                                                                                                                                                                                                        "
        html += "\n                                                                                                                                                                                                        "
        html += "\n                                                                                                                                                                                                        "
        html += "\n                                                                                                                                                                                                        "
        html += "\n                                                                                                                                                                                                        "
        html += "\n                                                                                                                                                                                                        "
        html += "\n                                                                                                                                                                                                        "
        html += "\n                                                                                                                                                                                                        "
        html += "\n                                                                                                                                                                                                        "
        html += "\n                                                                                                                                                                                                        "
        html += "\n                                                                                                                                                                                                        "
        html += "\n                                                                                                                                                                                                        "
        html += "\n                                                                                                                                                                                                        "
        html += "\n                ,,,,,                 ,,                                                               ,,,,   ,,,,      ,,                                                           "
        html += "\n              ,######|             |###/                                                            ,/#####| |####   ####|                                                           "
        html += "\n            /#/***###             |###|                           ,                                ,###/*    \\##/   ####|                        ,                                  "
        html += "\n          /##\\    **     ,,,,,   |###|    ,,,,,      ,,,,,    ####,,            ,,,               |###\\        ,,  ####|    ,,,,,            ####,,,    ,,,,,,                     "
        html += "\n        ,####,,       ,#######, |###|  ,/#######,,/#######, /######          ,/######,          ,########    ###|  ####   ,/######\\         ,######|  ,/#####\\,                    "
        html += "\n        *##########, |###|*###| |###|  #### \\###*|###/\\###| \\###/           ,###**####|          *\\###/*     ####|  ####   ####*\\###         *####    /##/ *####,                   "
        html += "\n          *##########||###\\,/##* /###|  ####,,### |###| *    |###|           #### ,####|          |###|     ####|  ####   ###\\,/##/          ####   |###|  |###|                   "
        html += "\n,           ***\\##### |####** ,  ####,  #####** , |###\\,  ,  |####,          ####,#####|          |####     ####|  ####,  ####/**,,         |####,  |####, |###*                   "
        html += "\n|##\\,,          |##/* *#######*  |####/ |######/* *#######*  *#####*         \\####*|###|          |####     ####|  \\####/ \\######/           \\####* *\\#######/*                    "
        html += "\n*\\#####,,      ,##*    ******     *\\#*   ******    ******      **/*          **#*  |#***          |####     #/***   *##*   ******             **#*    ***##**                      "
        html += "\n*#######\\,,,##**                                                                                  |****                                                                            "
        html += "\n*\\#######**                                                                                                                                                                    "
        html += "\n *****                                                                                                                                                                       "
        html += "\n                                                                                                                                                                             "
        html += "\n                                                                                                                                                                             "
        html += "\n                                                                                                                                                                             "
        html += "\n                                                                                                                                                                             "
        html += "\n                                                                                                                                                                             "
        html += "\n                                                                                                                                                                             "
        html += "\n                                                                                                                                                                             "
        html += "\n                                                                                                                                                                             "
        html += "\n         ,###,                                                                        ,,####, /##\\                                          |###,                            "
        html += "\n         \\####                                                                       ,######|*####|                                         |####                            "
        html += "\n          ***                                                       ,,,/            |#### **  ****                         ,,,/|            /###/                            "
        html += "\n           ,,/  ,,,/|,#\\,,,##\\,  ,,,/\\ ,##,,    ,/##,,/   |#\\,,/##| ######|         ,#######|  ,,,|  ##\\,,/##| ,,#######   |######          ####*                            "
        html += "\n        ######  /############### |##########, ,/##*####\\  ########*/####***        ,#######*|#####|  ######## /###/**##|  ,####/**          ###|                             "
        html += "\n        **####  ####/*####|*#### *####**####|,###|  \\###| #####***  ####            |####    *\\###|  #####*** #####\\,,,,,  |###|           |/**                              "
        html += "\n          ####  ####| ####| ####  ####  ####*|###\\  |###| ####|     ####            |####     |###|  ####|    \\##########  ####|           ,,,,                              "
        html += "\n          ####  ####| ####| ####  #####\\###/ *####\\,/##/  \\#####|   #####,          |####     |###|  ######*   ,/****####  \\####\\          ####|                             "
        html += "\n          ####, ####| \\###* ###*  ####/###*   *\\#####/*   *\\###/    *\\##/           |####     |###|  *\\###/   *########*    \\###*         *###/                              "
        html += "\n         ***    **    **    **    ####*          ***                   *            |###/     ***                ***          **                                             "
        html += "\n                                 |###/                                               *                                                                                       "
        html += "\n                                 |###|                                                                                                                                       "
        html += "\n                                 ****                                                                                                                                        "
        html += "\n                                                                                                                                                                             "
        html += "\n                                                                                                                                                                             "
        html += "\n                                                                                                                                                                             "
        html += "\n                                                                                                                                                                             "
        html += "\n                                                                                                                                                                             "
        html += "\n                                                                                                                                                                             "
        html += "\n                                                                                                                                                                             "
        html += "\n                                                                                                                                                                             "
        html += "\n                                                                                                                                                                             "
        html += "\n                                                                                                                                                                             "
        html += "\n                                                                                                                                                                             "
        html += "\n                                                                                                                                                                             "
        html += "\n                                                                                                                                                                             "
        return html;
    }

    move_splitted_img(event){
        if(this.main_result_container == null){
            this.main_result_container = document.getElementById("main_result_container");
        }
        var w = this.main_result_container.scrollWidth;
        var x = (event.offsetX / w)*100;

        if(x < 1){
            return;
        }

        document.getElementById("preview_image_side").style.width = "" + x + "%";
        document.getElementById("handle_splited").style.left = "" + x + "%";
    }

    toggle_splited(container, event, force=null){
        if(this.main_result_container == null){
            this.main_result_container = container;
        }

        if(force===null){
            force = this.sliding;
        }

        if(force){
            this.main_result_container.setAttribute("onmousemove", "");
        }else{
            this.main_result_container.setAttribute("onmousemove", this.self()+".move_splitted_img(event)");
        }
        this.sliding = !force;
        this.move_splitted_img(event)
    }

    reverse_color(btn){
        if(btn.classList.contains("active")){
            btn.classList.remove("active")
            this.color_is_reversed = 0;
        }else{
            this.color_is_reversed = 1;
            btn.classList.add("active")
        }
        this.launch_ASCII();
    }

    render(){
        var html = "";
        html += "<link rel='stylesheet' href='Components/ASCIIArt/ASCIIArt.css'></link>";
        html += "<div onmousedown='"+this.self()+".toggle_splited(this, event, false)' onmouseup='"+this.self()+".toggle_splited(this, event, true)' id='main_result_container' class='main_result_container text'>";
            html += "<pre id='result_ASCIIART_container'>"+this.get_default_str()+"</pre>"
            html += "<img id='uploded_image_preview' class='uploded_image_preview' src='/Zyckl0n/Images/ASCIIArt/defaultImage.png'/>"
            html += "<div id='preview_image_side'><img style='min-width:1429px;min-height:915px' src='/Zyckl0n/Images/ASCIIArt/defaultImage.png'/></div>"
            html += "<div id='handle_splited'></div>"
        html += "</div>";
        html += "<div class='main_control_window'>";
            html += "<div class='main_control_subwindow'>";
                html += "<div>Mode d'Affichage</div>"
                html += "<div class='circular_btn' onclick='"+this.self()+".switch_result_display_mode(\"fade\", this)'> <img src='/Zyckl0n/Images/ASCIIArt/fade_icon.svg'> </div>"
                html += "<div class='circular_btn' onclick='"+this.self()+".switch_result_display_mode(\"splited\", this)'> <img src='/Zyckl0n/Images/ASCIIArt/splited_icon.svg'> </div>"
                html += "<div class='circular_btn' onclick='"+this.self()+".switch_result_display_mode(\"image\", this)'> <img src='/Zyckl0n/Images/ASCIIArt/image_icon.svg'> </div>"
                html += "<div class='circular_btn active' onclick='"+this.self()+".switch_result_display_mode(\"text\", this)'> <img src='/Zyckl0n/Images/ASCIIArt/text_icon.svg'> </div>"
            html += "</div>";
            html += "<input oninput='"+this.self()+".launch_ASCII()' type='file' id='ASCII_image_input' />"
            html += "<div class='main_control_subwindow'>";
                html += "<div class='parameter_slider'>Sensibilité";
                    html += this.render_kid(this.limitSelector, "class='custom_slider'");
                html += "</div>";
                html += "<div class='parameter_slider'>Resolution (Largeur)";
                    html += this.render_kid(this.width_selector, "class='custom_slider'");
                html += "</div>";
            html += "</div>";
            html += "<div class='circular_btn' onclick='"+this.self()+".reverse_color(this)'> <img src='/Zyckl0n/Images/color_switch_icon.svg'> </div>"
            html += "<div class='circular_btn' onclick='"+this.self()+".launch_ASCII()'> <img src='/Zyckl0n/Images/regenerate.png'> </div>"
        html += "</div>";
        return html;
    }
}