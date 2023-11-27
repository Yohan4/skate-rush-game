
const canvas = document.getElementById("game")
const context = canvas.getContext('2d')
canvas.height = 750;
canvas.width = 1420;


const skateboarding = new Image();
skateboarding.src = "../assets/images/skateboy_run.png";

const  jumping = new Image();
jumping.src = "../assets/images/skateboy_jump.png";

const falling = new Image();
falling.src = "../assets/images/skateboy_fall.png";

const groundLevel = 580;
const gravity =  0.33;



class Player {
    constructor(){  
        this.location = {
            x: 100,
            y: 580
        };
        this.dead = false;
        this.lives = 4;
        this.start = false;
        this.game_over = false;
        this._score = true;
        this.skateboarding = new Spritesheet(skateboarding, 9, 120.6, 146, 500);
        this.jumping = new Spritesheet(jumping, 7, 142, 146, 500);
        this.falling = new Spritesheet(falling, 3, 46.44, 146, 60)
        this.velocity = {
            x:0,
            y:0
        };
        this.onGround = true;
        
    }

    jump(){
        if(this.onGround){
            this.velocity.y = -15;
            this.onGround = false;
        }
    }
    update(deltaTime){
        if(!this.onGround){
            this.velocity.y += gravity;
            this.location.y += this.velocity.y;

            if (this.location.y > groundLevel){
                this.location.y = groundLevel;
                this.onGround = true;
                this.velocity.y = 0;
            }
        }
        this.onGround ? this.skateboarding.update(deltaTime) : this.jumping.update(deltaTime);
    }

    draw(context){
        // change sprites to jumping if not on ground else show skateboarding sprite
        if (!this.onGround){
        this.jumping.draw(context, this.location.x, this.location.y);
        } else{
            this.skateboarding.draw(context,this.location.x, this.location.y);
        }
    }

}

class Spritesheet {
    constructor(spriteImage, columns,frameWidth,frameHeight,animationSpeed) {
        this.image = spriteImage;
        this.columns = columns;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.animationSpeed =animationSpeed;

        this.currentFrame = 0;
        this.frameTimer = 0;
        this.totalFrames = columns;
    }

    update(deltaTime) {
        this.frameTimer += deltaTime;

        if (this.frameTimer >= this.animationSpeed) {
            this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
            this.frameTimer = 0;
        }
    }

    draw(context, x, y) {
        let frameX = (this.currentFrame % this.columns) * this.frameWidth;

        context.drawImage(this.image, frameX, 0, this.frameWidth, this.frameHeight, x, y, this.frameWidth, this.frameHeight);
    }

    
}

const player = new Player();
let lastTime = 0;

// game loop
function animate(timestamp){

    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    context.clearRect(0, 0, canvas.width, canvas.height)
    player.skateboarding.update(deltaTime);
    player.jumping.update(deltaTime);
    player.update(deltaTime);
    player.draw(context);
    requestAnimationFrame(animate);
}

animate(0);

window.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        event.preventDefault();
        player.jump();
    }
});





