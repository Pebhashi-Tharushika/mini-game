class Background{
    constructor(gameWidth, gameHeight){
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;

        this.image = document.getElementById("background-image");
        this.x = 0;
        this.y = 0;
        this.width = 2400;
        this.height = 1060;
        this.speed = 3;
    }

    draw(context){
        context.drawImage(this.image,this.x - this.width, this.y, this.width, this.height);
        context.drawImage(this.image,this.x, this.y, this.width, this.height);
        context.drawImage(this.image,this.x + this.width, this.y, this.width, this.height);
    }
    forward(){
        this.x -= this.speed;
        if(this.x < -this.width) this.x = 0;
    }
    backward(){
        this.x += this.speed;
        if(this.x > this.width) this.x = 0;
    }

}

export {Background}