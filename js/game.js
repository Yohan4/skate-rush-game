
const canvas = document.getElementById("game")
const context = canvas.getContext('2d')
canvas.height = 750;
canvas.width = 1420;


const falling = new Image();
falling.src = "../assets/images/skateboy_fall.png";

const background_image = new Image();
background_image.src =  "../assets/images/background_platform.png";


const groundLevel = 580;
const gravity =  700;



class Player {
    constructor(skateboarding,jumping,falling){  
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
        this.jumping = new Spritesheet(jumping, 2, 143, 146, 500);
        this.falling = new Spritesheet(falling, 3, 46.44, 146, 60)
        this.velocity = {
            x:0,
            y:0
        };
        this.onGround = true;
        this.width = 143;
        this.height = 146;
        
    }

    jump(){
        if(this.onGround){
            this.velocity.y = -650;
            this.onGround = false;
            updateScore(1);
        }
    }
    update(deltaTime){
        deltaTime /= 1000;
        if(!this.onGround){
            this.velocity.y += gravity *deltaTime;
            this.location.y += this.velocity.y*deltaTime ;

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
        this.animationSpeed = animationSpeed / 1000;

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

class staticBackground {
    constructor(image){
        this.location = {
            x: 0,
            y: 0
        };
        this.image = image;
    }

    draw() {
        context.drawImage(this.image, this.location.x, this.location.y, canvas.width, canvas.height-200);
    }
}

class layer {
    constructor({image, speed, x, y, layerType}) {
        this.location = {
            x,
            y,
        };
        this.image = image;
        this.speed = speed;
        this.width = image.width;
        this.height = image.height;
        this.layerType = layerType;
    }

    update(){
        this.location.x -= this.speed;
        let spacing;
        let totalWidth;
        if(this.layerType === 'layer_one'){
            spacing = 120
        } else {
            spacing = 0;        
        }
        totalWidth = this.width + spacing;

        if (this.location.x <= -totalWidth){
            this.location.x += totalWidth;
        }
    }
   

    draw(context) {
        let PositionX =this.location.x;

        let spacing;
        let totalWidth;

        if(this.layerType === 'layer_one'){
            spacing = 120
        } else {
            spacing = 0;        
        }
        totalWidth = this.width + spacing;

        while (PositionX < canvas.width) {
            context.drawImage (this.image, PositionX, this.location.y, this.width, this.height);
            PositionX += totalWidth;
        }
        
    }

}

class PowerUp {
    constructor(image, x, y, speed, points){
        this.image = image;
        this.location = {
            x,
            y,
        };
        this.speed = speed;
        this.width = image.width;
        this.height = image.height;
        this.points = points;
        this.collected = false;
    }

    update(){
        this.location.x -= this.speed;

    }
    draw(){
        context.drawImage (this.image, this.location.x, this.location.y, this.width, this.height);
    }
}


const backgroundLayer = new staticBackground(background_image);
let lastTime = 0;
let player;
let powerUpArray = [];
let powerUps = [];
let score = 0;
let lastPowerUpTime = 0;
const timeInterval = 15000;

function updateScore(points){
    score += points;
}

function drawScore(context){
    context.font = "20px Arial";
    context.fillstyle = "black";
    context.fillText("Score: " + score, 10, 50);

}

function generatePowerUp(){
    const powerData = powerUpArray[Math.floor(Math.random() * powerUpArray.length)];
    const PositionX = canvas.width;
    const PositionY = Math.floor(Math.random() * 101) + 310;
    const speed = 0.5;
    const randomPowerUp = new PowerUp(powerData.image, PositionX, PositionY, speed, powerData.points)
    powerUps.push(randomPowerUp);
}

function powerUpCollision(player, powerUp) {
    return (
        //check horizantal collison
        player.location.x < powerUp.location.x + powerUp.width &&
        player.location.x + player.width > powerUp.location.x &&
        //check vertical collision
        player.location.y < powerUp.location.y + powerUp.height &&
        player.location.y + player.height > powerUp.location.y
    );
}


function loadImage(src){
    return new Promise((resolve, reject) => {
        const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = reject;
            image.src = src;
    });
} 



async function loadImages(){
    try {
        // Load Layer images
        const layer_one = await loadImage("../assets/images/lamp.png");
        const layer_two = await loadImage("../assets/images/road.png");

        // Load Player images
        const skateboarding = await loadImage("../assets/images/skateboy_run.png");
        const jumping = await loadImage("../assets/images/skateboy_jump.png");
        
        // Load and store power ups images in array
        powerUpArray = [
            { image: await loadImage("../assets/images/50_points.png"), points:50 },
            { image: await loadImage("../assets/images/100_points.png"), points:100 },
            { image: await loadImage("../assets/images/120_points.png"), points:120 },
            { image: await loadImage("../assets/images/125_points.png"), points:125 },
            { image: await loadImage("../assets/images/special_power.png"), points:1 }
        ];

        player = new Player(skateboarding, jumping, falling);
        const second_layer = new layer({image:layer_two, speed:1, x:0, y:530, layerType:'layer_two'});
        const first_layer = new layer({image:layer_one, speed:0.8, x:40, y:300, layerType:'layer_one'});

        requestAnimationFrame(animate);

        // game loop
        function animate(timestamp){
            const deltaTime = timestamp - lastTime;
            lastTime = timestamp;
            context.clearRect(0, 0, canvas.width,canvas.height)

            first_layer.update();
            second_layer.update();
            backgroundLayer.draw(context);
            first_layer.draw(context);
            second_layer.draw(context);

            // update and draw player
            if (player) {
                player.update(deltaTime); 
                player.draw(context);
                drawScore(context); 
            }
            
            // update and draw power-ups
            powerUps.forEach(powerUp => {
                powerUp.update();
                powerUp.draw(context);
                if (powerUpCollision(player, powerUp)) {
                    console.log("Collision detected with power-up");  
                    updateScore(powerUp.points);
                    powerUp.collected = true;
                }

            });

            // Remove off-screen power-up
            powerUps = powerUps.filter(powerUp => powerUp.location.x + powerUp.width > 0 && !powerUp.collected);

            // generate new power-up after time interval
            lastPowerUpTime += deltaTime;
            if (lastPowerUpTime > timeInterval) {
                generatePowerUp();
                lastPowerUpTime = 0;
            }


            requestAnimationFrame(animate);
        }

        animate(0);
    } catch (error) {
        console.error('An error occured while loading the image', error);
    }
}

loadImages();


window.addEventListener('keydown', (event) => {
    if (event.key === ' ' && player) {
        event.preventDefault();
        player.jump();
    }
});

canvas.addEventListener('mousedown', (event) => {
    if (event.button === 0 && player) {
        player.jump();
    }
});





