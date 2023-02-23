class Router{
    constructor(){
        const path = window.location.hash.split('/').slice(1);
    }

    
}

export const ROUTER = new Router();