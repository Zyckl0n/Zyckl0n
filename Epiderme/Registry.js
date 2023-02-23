import { NOTIFICATION } from "/Zyckl0n/Components/Notification/Notification.js";
import { API } from "/Zyckl0n/Epiderme/Api.js";

class Registry{
    constructor(table_name){
        this.table_name = table_name;
        this.columns = [];
    }

    async get_all_items(){
        return await API.fetch("get_all_items", "table_name=" + this.table_name);
    }

    async get_columns(){
        return await API.fetch("get_attribute", "table_name=" + this.table_name);
    }

    async delete_item(id){
        API.post("delete_item", {'id': id}, "table_name=" + this.table_name);
    }

    async update_item(new_item){

    }

    async insert_item(item){
        API.post("insert_item", item, "table_name=" + this.table_name);
    }
}

class RegistrySet{
    constructor(){
        this.saved_registry = {};
    }

    get_registry(table_name){
        if(this.saved_registry[table_name] == undefined){
            this.saved_registry[table_name] = new Registry(table_name);
        }
        return this.saved_registry[table_name];
    }
}

export const REGISTRIES = new RegistrySet();