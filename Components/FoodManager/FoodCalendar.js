import { Component } from "/Front_engine/classes/Component.js";
import { API } from "/Epiderme/Api.js"

const DAY_NAMES = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]

export class FoodCalendar extends Component{
    constructor(parent, params={}){
        super(parent);
        this.state = {}
        this.displayed_days = [2, 5];
        this.offset = 0;
        this.starting_day = Date.now() - ((this.displayed_days[0]+this.offset)*86400000);
        this.ending_day = this.starting_day + ( (this.displayed_days[0] + this.displayed_days[1] + this.offset)*86400000);
    }

    async refresh_calendar(){
        this.liste_of_days = await API.fetch("generate_calendar", "")
        const body = document.getElementById("container_day_of_food");
        body.innerHTML = this.display_list();
    }

    change_offset(offset){
        this.offset += offset;
        this.starting_day = this.starting_day + (offset*86400000);
        this.ending_day = this.ending_day + (offset*86400000);
        document.getElementById("container_day_of_food").innerHTML = this.display_list();
    }

    display_list(){
        var html = "";
        console.log(this.liste_of_days);
        Object.keys(this.liste_of_days).forEach(_date => {
            var date = Date.parse(_date);
            if(date >= this.starting_day && date <= this.ending_day){
                html += this.render_day(new Date(date), this.liste_of_days[_date]);
            }
        });
        return html;
    }

    render_food_cell(titre, plat){
        var html = "";
        html += "<div class='food_day_cell' id='food_day_midi'>";
            html += "<div class='food_cell_title'>";
                html += "<div>"+titre+"</div>";
                html += "<div class='food_cell_buttonset'>";
                    html += "<img class='food_cell_button' src='/Images/Food/skip.png' />"
                    html += "<img class='food_cell_button' src='/Images/Food/regenerate.png' />"
                html+="</div>";
            html += "</div>";
            html += "<div class='food_cell_body'>"+plat["name"]+"</div>";
        html += "</div>";
        return html;
    }

    render_day(date, content){
        console.log(content);
        var html = "";
        var name = DAY_NAMES[date.getDay()];
        var date_str = date.getDate() + "/" + date.getMonth() + "/" + (1900 + date.getYear());
        html += "<div class='food_day'>";
            html += "<div class='food_day_header'>";
                html += "<div class='food_day_title'>";
                    html += name
                html += "</div>";
                html += "<div class='food_day_date'>";
                    html += date_str
                html += "</div>";
            html += "</div>";
            html += "<div class='food_day_body'>";
            try{
                html += this.render_food_cell("Matin", content["matin"])
                html += this.render_food_cell("Midi", content["midi"])
                html += this.render_food_cell("Soir", content["soir"])
            }catch(e){
                console.error(e)
            }
            html += "</div>";
        html += "</div>";
        return html;
    }

    render(){
        var html = "";
        html += "<link rel='stylesheet' href='Components/FoodManager/FoodCalendar.css'></link>";
        html += "<div class='calendar'>";
            html += "<div id='container_day_of_food' class='calendar_body'>";
                html += this.render_day(new Date(Date.parse("30/01/2023")));
            html += "</div>";
            html += "<div class='calendar_footer'>";
                html += "<div onclick='"+this.self()+".change_offset(-1);' class='calendar_footer_left'>";
                html += "<img style='width:100%;height:50px;' src='/Images/Food/UnderCalendar.svg' />"
                html += "<img class='arrow' style='height:20px;position:absolute;right:55%;top:3px;transform:ScaleX(-1)' src='/Images/arrow.svg' />"
                html += "</div>";
                html += "<div class='calendar_footer_center'>";
                    html += "<img style='width:100%;height:30px;' src='/Images/volet_bas.svg' />"
                html += "</div>";
                html += "<div onclick='"+this.self()+".change_offset(1);' class='calendar_footer_right'>";
                    html += "<img style='width:100%;height:50px;transform:scaleX(-1)' src='/Images/Food/UnderCalendar.svg' />"
                    html += "<img class='arrow' style='height:20px;position:absolute;left:55%;top:3px' src='/Images/arrow.svg' />"
                html += "</div>";
            html += "</div>";
        html += "</div>";
        return html;
    }
}