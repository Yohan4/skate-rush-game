
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
            x: 150,
            y: groundLevel
        };
        this.dead = false;
        this.lives = 5;
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
        this.colliding = false;
        
        
    }

    jump(){
        if(this.onGround){
            this.velocity.y = -600;
            this.onGround = false;
            updateScore(1);
        }
    }

    onCollision(lives){
        if (!this.colliding) {
            this.colliding = true;
            this.lives -= 1;
            if (lives.length > 0) {
                lives.pop();
            }
        }
    }

    endCollision(){
        this.colliding = false;
    }
    
    update(deltaTime){
        deltaTime /= 1000;
        if(!this.onGround){
            this.velocity.y += gravity *deltaTime;
            this.location.y += this.velocity.y*deltaTime ;
            this.width = this.jumping.frameWidth;
            this.height = this.jumping.frameHeight;

            if (this.location.y > groundLevel){
                this.location.y = groundLevel;
                this.onGround = true;
                this.velocity.y = 0;
            }
        } else {
            this.width = this.skateboarding.frameWidth;
            this.height = this.skateboarding.frameHeight;
            this.skateboarding.update(deltaTime);
        }

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

class obstacles {
    constructor(image, x , y, speed, points){
        this.image = image;
        this.location = {
            x,
            y,
        };
        this.speed = speed;
        this.width = image.width;
        this.height = image.height;
        this.points = points;
    }

    update(){
        this.location.x -= this.speed;

    }
    draw(){
        context.drawImage (this.image, this.location.x, this.location.y, this.width, this.height);
    }
}

class fixed_objects {
    constructor({image, x , y}){
        this.image = image;
        this.location = {
            x,
            y,
        };
        this.width = image.width;
        this.height = image.height;
        this.alive = true;
    }

    draw(){
        context.drawImage (this.image, this.location.x, this.location.y);
    }

}


const backgroundLayer = new staticBackground(background_image);
let lastTime = 0;
let player;
let heartImage;
let powerUpArray = [];
let powerUps = [];
let obstaclesArray = [];
let activeObstacles = [];
let score = 0;
let lastPowerUpTime = 0;
let lastObstacleTime = 0;
let obstacleTimeInterval = getRandomInterval(1500, 3000);
let timeInterval = 15000;

function updateScore(points){
    score += points;
}

function drawScore(context){
    context.font = "20px Arial";
    context.fillstyle = "black";
    context.fillText("Score: " + score, 10, 50);

}

// function to generate a power up randomly from powerUpArray and store the selected power up in active powerUps array

function generatePowerUp(){
    const powerData = powerUpArray[Math.floor(Math.random() * powerUpArray.length)];
    const PositionX = canvas.width;
    const PositionY = Math.floor(Math.random() * 101) + 310;
    const speed = 2.0;
    const randomPowerUp = new PowerUp(powerData.image, PositionX, PositionY, speed, powerData.points)
    powerUps.push(randomPowerUp);
}

// function to check collision betwen player and POWER UPS

function powerUpCollision(player, powerUp) {
    const powerCenterXStart = powerUp.location.x + powerUp.width / 4;
    const powerCenterXEnd = powerUp.location.x + (powerUp.width * 3 / 4);
    const powerCenterYStart = powerUp.location.y + powerUp.height / 4;
    const powerCenterYEnd = powerUp.location.y + (powerUp.height * 3 / 4);

    return (
        player.location.x < powerCenterXEnd &&
        player.location.x + player.width > powerCenterXStart &&
        player.location.y < powerCenterYEnd &&
        player.location.y + player.height > powerCenterYStart
    );
}

// function to create heart images on canvas

function createLives(heartImage){
    const lives = [];
    const positionX = canvas.width - 280;
    const spacing = 50;

    for (let i=0; i < 5; i++){
        lives.push(new fixed_objects({
            image: heartImage,
            x: positionX + i * spacing,
            y: 20
        }));
    }

    return lives;

}

// function to generate obstacle

function generateObstacle(){
    const obstacleData = obstaclesArray[Math.floor(Math.random() * obstaclesArray.length)];
    const PositionX = canvas.width;
    const PositionY = obstacleData.y;
    const speed = 1.5;
    return new obstacles(obstacleData.image, PositionX, PositionY, speed, obstacleData.points);

}


function getRandomInterval(minimum, maximum) {
    return Math.floor(Math.random() * (maximum - minimum +1)) + minimum;
}


// function to check collison betwen player and obstacle

function obstacleCollision(player, obstacle) {

    const obstacleCenterXStart = obstacle.location.x + obstacle.width / 4;
    const obstacleCenterXEnd = obstacle.location.x + (obstacle.width * 3 / 4);
    const obstacleCenterYStart = obstacle.location.y + obstacle.height / 4;
    const obstacleCenterYEnd = obstacle.location.y + (obstacle.height * 3 / 4);

    return (
        player.location.x < obstacleCenterXEnd &&
        player.location.x + player.width > obstacleCenterXStart &&
        player.location.y < obstacleCenterYEnd &&
        player.location.y + player.height > obstacleCenterYStart
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

// Asynchronous is used to load images

async function loadImages(){
    try {
        // Load Layer images
        const layer_one = await loadImage("../assets/images/lamp.png");
        const layer_two = await loadImage("../assets/images/road.png");

        // Load Player images
        const skateboarding = await loadImage("../assets/images/skateboy_run.png");
        const jumping = await loadImage("../assets/images/skateboy_jump.png");

        // Load Heart images
        heartImage =  await loadImage("../assets/images/heart.png");
        const lives = createLives(heartImage)
        
        // Load and store power ups images in array
        powerUpArray = [
            { image: await loadImage("../assets/images/50_points.png"), points:50 },
            { image: await loadImage("../assets/images/100_points.png"), points:100 },
            { image: await loadImage("../assets/images/120_points.png"), points:120 },
            { image: await loadImage("../assets/images/125_points.png"), points:125 },
            { image: await loadImage("../assets/images/special_power.png"), points:1 }
        ];

        // Load and store obstacles images in array
        obstaclesArray = [
            { image: await loadImage("../assets/images/barrier.png"), points:3, y: 570 },
            { image: await loadImage("../assets/images/bear.png"), points:8, y: 490 },
            { image: await loadImage("../assets/images/big_wheel.png"), points:6, y: 520 },
            { image: await loadImage("../assets/images/cat.png"), points:3 , y: 530 },
            { image: await loadImage("../assets/images/cats.png"), points:5, y: 520  },
            { image: await loadImage("../assets/images/cones.png"), points:3, y: 560  },
            { image: await loadImage("../assets/images/small_wheel.png"), points:2, y: 560 }

        ];

        player = new Player(skateboarding, jumping, falling);
        const second_layer = new layer({image:layer_two, speed:1.3, x:0, y:530, layerType:'layer_two'});
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

            let collisionDetected = false;

            // update and draw obstacles
            activeObstacles.forEach(obstacle => {
                obstacle.update();
                obstacle.draw(context);

                if(obstacleCollision(player, obstacle)){
                    collisionDetected = true;
                    player.onCollision(lives);

                }
                    
                
            });

            if (!collisionDetected && player.colliding) {
                player.endCollision();
            }

            // Remove off-screen obtsacles and power-ups from active array
            activeObstacles = activeObstacles.filter(obstacle => obstacle.location.x + obstacle.width > 0);
            powerUps = powerUps.filter(powerUp => powerUp.location.x + powerUp.width > 0 && !powerUp.collected);

            // generate new power-up after time interval
            lastPowerUpTime += deltaTime;
            if (lastPowerUpTime > timeInterval) {
                generatePowerUp();
                lastPowerUpTime = 0;
            }

            // generate new obstacle after time interval
            lastObstacleTime += deltaTime;
            if (lastObstacleTime > obstacleTimeInterval) {
                console.log('Attempting to generate a new obstacle.');
                const newObstacle = generateObstacle();
                activeObstacles.push(newObstacle);
                console.log('New obstacle generated:', newObstacle);
                lastObstacleTime = 0;
                obstacleTimeInterval = getRandomInterval(1560,3000);
            }

            lives.forEach(life => life.draw());


            requestAnimationFrame(animate);
        }

        animate(0);
    } catch (error) {
        console.error('An error occured while loading the image', error);
    }
}

loadImages();

// Detect when spacebar is clicked

window.addEventListener('keydown', (event) => {
    if (event.key === ' ' && player) {
        event.preventDefault();
        player.jump();
    }
});

// Detect when left mouse is clicked on canvas only

canvas.addEventListener('mousedown', (event) => {
    if (event.button === 0 && player) {
        player.jump();
    }
});





