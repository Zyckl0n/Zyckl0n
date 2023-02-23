import { Component } from "/Front_engine/classes/Component.js";

export const main_comp_class = class SpecialThanks extends Component{
    constructor(parent, params={}){
        super(parent);
        this.current_helper = -1;
        this.helpers = [
            {
                "name" : "Usagif",
                "link" : "https://usagif.com/",
                "logo" : "/Components/SpecialThanks/helper_logo/usagif_logo.svg",
                "reasons" : [
                    "- For all of your free to use images !",
                    "- The background of this page",
                    "- The cog image used during loading"
                ]
            },
            {
                "name" : "SVG Repo",
                "link" : "https://www.svgrepo.com/",
                "logo" : "/Components/SpecialThanks/helper_logo/SVG_Repo_logo.svg",
                "reasons" : [
                    "For the icons free to use :",
                    "- All buttons on my website",
                    "- The user friendly experience"
                ]
            }
        ]
        this.scrolling_position = 0;
        this.scrolling_per_steps = 400;
        this.max_scrolling_position = (this.scrolling_per_steps * (1+ this.helpers.length))-1;
        this.current_step_of_scrolling = 0;
        this.on_rendering(this.render_home_screen.bind(this), {})
    }

    handle_scroll(e){
        this.scrolling_position += e.deltaY;
        if(this.scrolling_position < 0) this.scrolling_position = 0;
        if(this.scrolling_position > this.max_scrolling_position) this.scrolling_position = this.max_scrolling_position;

        const old_step = this.current_step_of_scrolling;
        this.current_step_of_scrolling = Math.floor(this.scrolling_position / this.scrolling_per_steps);

        console.log("" + this.scrolling_position + " --> " + this.current_step_of_scrolling);
        if(this.current_step_of_scrolling != old_step){
            this.handle_step_change();
        }
    }

    handle_step_change(){
        if(this.current_step_of_scrolling == 0){
            this.render_home_screen()
        }else{
            this.render_thanks_to(this.helpers[ (this.current_step_of_scrolling-1) % this.helpers.length])
        }
    }

    sequential_fading(){
        const main_container = this.div.querySelector('#Main_content');
        const elements = main_container.querySelectorAll("*[sequential_fade]");
        elements.forEach(element => {
            element.classList.add("fade")
            element.classList.add("sequential_fade")
        });
        this.process_unfade(Array.from(elements) );
    }

    async process_unfade(elements){
        if(elements.length > 0){
            var delay = parseFloat(elements[0].getAttribute("sequential_fade"))*1000;
            setTimeout(() => {
                this.real_unfade(elements)
            }, delay);
        }
    }

    real_unfade(elements){
        elements[0].classList.remove("fade");
        elements.shift();
        this.process_unfade(elements);
        console.log("Unfading")
    }

    render_thanks_to(helper){
        var html = "";
        html += "<div class='Main_title_container'>";
            html += "<div id='Main_title' sequential_fade='0'>";
                html += "Thank you"
            html += "</div>";
            html += "<a href='"+helper.link+"' class='Main_subject_container'>";
                html += "<div sequential_fade='0.2' id='Main_subject'>"+helper.name+"</div>"
                html += "<div class='see_website_arrow'>></div>"
            html += "</a>";
        html += "</div>";
        html += "<div class='Main_body_container'>";
            html += "<div id='Main_text_container'>"
                let i = 2;
                helper.reasons.forEach(reason => {
                    i++;
                    html += "<div class='Main_reason_additional' sequential_fade='0.2'>";
                        html += reason
                    html += "</div>";
                });
            html += "</div>";
            html += "<a target='_blank' href='"+helper.link+"' sequential_fade='0.2' class='Main_logo_container'>"
                html += "<img sequential_fade='0.2' src='"+helper.logo+"' />"
            html += "</a>";
        html += "</div>";
        this.div.querySelector("#Main_content").innerHTML = html;
        this.sequential_fading();
    }

    render_next_helper(){
        this.current_helper += 1;
        this.render_thanks_to(this.helpers[this.current_helper % this.helpers.length])
    }

    render_home_screen(){
        var html = "";
        html += "<div class='Main_title_container'>";
            html += "<div id='Main_title' sequential_fade='0'>";
                html += "Special Thanks page"
            html += "</div>";
            html += "<a class='Main_subject_container'>";
            html += "</a>";
        html += "</div>";
        html += "<div class='Main_body_container'>";
            html += "<div id='Main_text_container'>"
                html += "<div class='Main_reason_additional' sequential_fade='0.2'>";
                    html += "I made this website, and all of the app collection in the pannel alone, <br> <br> But as a developper, i'm not a artist, thankfully internet is "
                    html += "full of skilled artist ! <br> <br>Because i think their work deserve it, i decided to create this page in order to mention their names. If you're one of them and you dont want me to show your name tell me !"
                html += "</div>";
            html += "</div>";
            html += "<a sequential_fade='0.2' class='Main_logo_container'>"
                html += "<img src='Images/profile_picture.PNG' style='border-radius:50%' />"
                html += "Yep, That's my profile picture, click me if you want to check who i am !"
            html += "</a>";
        html += "</div>";
        this.div.querySelector("#Main_content").innerHTML = html;
        this.sequential_fading();
    }

    render(){
        var html = "<img class='main_starfall_bg' style='' src='/Images/SpecialThanks/startfall_bg.gif' />";
        html += "<link rel='stylesheet' href='Components/SpecialThanks/SpecialThanks.css'></link>";
        html += "<div onwheel='"+this.self()+".handle_scroll(event)' id='Main_content'>";
        html += "</div>";
        return html;
    }
}