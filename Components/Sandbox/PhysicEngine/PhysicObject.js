var TIME_DILATATION = 0.1;

class Vector2{
    constructor(x=0, y=0){
        this.x = x;
        this.y = y;
    }

    static add(a, b){
        return new Vector2(a.x + b.x, a.y + b.y) ;
    }

    static sub(a, b){
        return new Vector2(a.x - b.x, a.y - b.y) ;
    }

    normalize(){
        if(this.x > this.y){
            this.y /= this.x;
            this.x = 1;
        }else{
            this.x /= this.y;
            this.y = 1;
        }
        return this;
    }

    add(added_vec2, factor=1){
        this.x += added_vec2.x * factor;
        this.y += added_vec2.y * factor;
    }

    get magnitude(){
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }
}

export class PhysicObject{
    constructor(size, x, y, color="#FFFFFF"){
        this.size = size;
        this.acceleration = new Vector2(0,9.8);
        this.velocity = new Vector2();
        this.position = new Vector2(x, y);
        this.color = color;
        this.bounciness = 1;
    }

    render(ctx){
        ctx.beginPath();
        ctx.arc(this.position.x,this.position.y,this.size,0,2*Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    
    get_normal(vec){
        return Vector2.sub(vec, this).normalize();
    }

    tick(){
        if(this.static){
            return;
        }
        this.position.add(this.velocity, TIME_DILATATION);
        this.velocity.add(this.acceleration, TIME_DILATATION);
    }
}

export class PhysicSquare extends PhysicObject{
    constructor(sizeX, sizeY, x, y, color="#FFFFFF"){
        super();
        this.size = new Vector2(sizeX, sizeY);
        this.acceleration = new Vector2(0,0);
        this.velocity = new Vector2();
        this.position = new Vector2(x, y);
        this.color = color;
        this.bounciness = 1;
    }

    render(ctx){
        ctx.beginPath();
        ctx.rect(this.position.x,this.position.y,this.size.x, this.size.y,);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    
    get_normal(vec){
        return Vector2.sub(vec, this).normalize();
    }
}