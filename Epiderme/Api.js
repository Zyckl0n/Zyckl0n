import { NOTIFICATION } from "/Zyckl0n/Components/Notification/Notification.js";

class Api{
    constructor(url_api){
        this.url_api = url_api;
    }

    async hello_world(){
        var response = await fetch(this.url_api + "/test")
        .then((response) => response.json())
        .then((data) => console.log(JSON.stringify(data)))
    }
    
    manage_unknown_error(error){
        this.manage_error("Error from front : " + String(error));
    }

    manage_error(response){
        if(typeof response == "string"){
            this.display_error_notif(response)
        }
        if(response.sqlMessage != undefined){
            this.display_error_notif(response.sqlMessage);
        }
        return null;
    }

    display_error_notif(msg){
        NOTIFICATION.notify(msg)
    }

    async fetch(url, options=""){
        const final_url = this.url_api + "/" + url + "?" + options
        try{
            var response = await fetch(final_url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
            }).then((data) => {
                return data.json();
            })
            console.log(final_url);
            if(response.error_code == "0"){
                console.log(response)
                return response.data;
            }else{
                return this.manage_error(response.data);
            }
        }catch(e){
            console.error(e);
            this.manage_unknown_error(e);
        }
    }

    async post(url, obj, options="", json=true){
        const final_url = this.url_api + "/" + url + "?" + options
        var embeded_obj = {"data" : obj}
        try{
            var response = await fetch(final_url, {
                method: 'POST',
                headers: (json?{
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }:{}),
                body: (json?JSON.stringify(embeded_obj):obj)
            }).then((data) => {
                return data.json();
            })

            if(response.error_code === 0){
                console.log(response)
                return response.data;
            }else{
                return this.manage_error(response.data);
            }

        }catch(e){
            console.error(e);
            this.manage_unknown_error(e);
        }
    }
}

// export const API = new Api("http://localhost:3000");
export const API = new Api("https://46.101.175.15:3000");
