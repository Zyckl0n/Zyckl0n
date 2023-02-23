import { Component } from "/Front_engine/classes/Component.js";

class Notification extends Component{
    constructor(parent, params={}){
        super(parent);
        this.state = {}
        this.amout_of_cells = 0;
        this.currently_displayed_notification = [];
    }

    close_cell(btn){
        var cell = btn.parentNode;
        this.delete_cell(cell);
    }

    keep_alive(index){
        clearTimeout(this.currently_displayed_notification[index]);
    }

    generate_a_cell(message){
        var html = "";
        this.amout_of_cells += 1;
        this.currently_displayed_notification[this.amout_of_cells] = setTimeout((index)=>{
            this.delete_cell(document.getElementById("notificationcell_" + index));
        }, 5000, this.amout_of_cells)
        html += "<div onclick='"+this.self()+".keep_alive("+this.amout_of_cells+")' id='notificationcell_"+this.amout_of_cells+"' class='notification_cell'>";
            html += "<div class='notif_body'>"; 
                html += message;
            html += "</div>";
            html += "<div onclick='"+this.self()+".close_cell(this)' class='close_btn'> X </div>";
        html += "</div>";
        return html;
    }

    notify(message){
        var html = this.generate_a_cell(message);
        document.getElementById("notification_frame").innerHTML += html;
    }

    delete_cell(cell){
        if(cell == undefined || cell == null){
            return;
        }
        cell.style.opacity = "0";
        setTimeout(() => {
            cell.remove();
        }, 150);        
    }

    render(){
        var html = "";
        html += "<link rel='stylesheet' href='Components/Notification/Notification.css'></link>";
        html += "<div id='notification_frame'>";
        html += "</div>";
        return html;
    }
}

export const NOTIFICATION = new Notification();