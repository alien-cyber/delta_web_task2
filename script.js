const scoreElements = document.querySelectorAll(".score-num");
const startGame = document.querySelector(".start-game-btn");
const result = document.querySelector(".result");
const soundPlay = document.querySelector(".sound-btn");
const soundmuted = document.querySelector(".muted-btn");
const pause= document.querySelector(".pause-btn");
const play = document.querySelector(".play-btn");
const backgroundImage = new Image();
backgroundImage.src = 'img/Designer.png';

const canvas = document.querySelector(".canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const X = canvas.width / 2;
const Y = canvas.height / 1.13;
context = canvas.getContext("2d");

const backgroundSound = createAudio("audio/backgroundSound.mp3");
const shoot = createAudio("audio/shot-and-reload.mp3");
const killingZombie = createAudio("audio/killed_zombie.mp3");
const boomSound = createAudio("audio/boom.mp3");
let muted = false; 
let is_paused=false;  
let gravity=0.5;
class Player {
    constructor() {
        this.speedx=0;
        this.speedy=0;
        this.health=100;

        this.width = 125;
        this.height = 125;
        this.position = {
            x: X - this.width / 2,
            y: Y - this.height / 2,
        }
        this.sprite = {
            right: {
                spriteNum: 1,
                image: createImage("img/spritesheet.png"),
                cropWidth: 192,
                height: 245,
            },
           
            reload: {
                spriteNum: 3,
                image: createImage("img/spritesheet.png"),
                cropWidth: 192,
                height: 245,
            },
            shoot: {
                spriteNum: 4,
                image: createImage("img/spritesheet.png"),
                cropWidth: 192,
                height: 206,
            }
          
        }
        this.currentSpriteNum = 1;
        this.currentSprite = this.sprite.right.image;
        this.currentCropWidth = this.sprite.right.cropWidth;
        this.currentHeight = this.sprite.right.height;
        this.frame = 0;
        this.rotation = 0;
    }

    draw() {
        context.beginPath();
        context.save();
     

        context.drawImage(
            this.currentSprite,
            this.currentCropWidth * this.frame,
            0,
            this.currentCropWidth,
            this.currentHeight,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
     
        context.restore();
        context.closePath();
    }
   newPos() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      if ( this.speedy!=0){
        this.position.y += this.speedy;
      }
        if (this.position.y<(Y - this.height / 2)   ){
            this.speedy+=gravity
            
        }
        else{
            this.speedy=0;
            this.position.y=(Y - this.height / 2)

        }
        
        this.position.x += this.speedx ;
        
    }
    

    update() {
        this.speedx=0;
        if (game_blocks.length === 0){
            if (myGameArea.keys && myGameArea.keys[37] || myGameArea.keys && myGameArea.keys[65]) {this.speedx= -3; }
            if (myGameArea.keys && myGameArea.keys[39] || myGameArea.keys && myGameArea.keys[68]) {this.speedx = 3; }
        } 
        else {
           
            for (let i = 0; i < game_blocks.length; i++) {
                const block = game_blocks[i];
                if (
                    block.position.x < this.position.x + this.width &&
                    block.position.x + block.width > this.position.x )
                    
                    {
                    if (this.position.x >block.position.x) {
                        if ((myGameArea.keys && myGameArea.keys[37]) || (myGameArea.keys && myGameArea.keys[65])) {
                            this.speedx = 0;
                        }
                        if ((myGameArea.keys && myGameArea.keys[39]) || (myGameArea.keys && myGameArea.keys[68])) {
                            this.speedx = 3;
                        }
                    } else if (this.position.x < block.position.x) {
                        if ((myGameArea.keys && myGameArea.keys[37]) || (myGameArea.keys && myGameArea.keys[65])) {
                            this.speedx = -3;
                        }
                        if ((myGameArea.keys && myGameArea.keys[39]) || (myGameArea.keys && myGameArea.keys[68])) {
                            this.speedx = 0;
                        }
                    }
                    break; 
                } else {
                   
                    if ((myGameArea.keys && myGameArea.keys[37]) || (myGameArea.keys && myGameArea.keys[65])) {
                        this.speedx = -3;
                    }
                    if ((myGameArea.keys && myGameArea.keys[39]) || (myGameArea.keys && myGameArea.keys[68])) {
                        this.speedx = 3;
                    }
                }
            }
            
    }
        
        if ((myGameArea.keys && myGameArea.keys[32]  || myGameArea.keys && myGameArea.keys[87] || myGameArea.keys && myGameArea.keys[38]) && this.position.y==(Y - this.height / 2) ) {this.speedy= -10 }
       
    this.newPos();
    
    

        if (this.frame >= 0 && this.currentSpriteNum === this.sprite.shoot.spriteNum) {
            /// After Shoot => Player Reload
            this.currentSpriteNum = this.sprite.reload.spriteNum;
            this.currentSprite = this.sprite.reload.image;
            this.currentCropWidth = this.sprite.reload.cropWidth;
            this.currentHeight = this.sprite.reload.height;
            this.frame = 0;
        } else if (this.frame >= 19) {
            if (this.currentSpriteNum === this.sprite.reload.spriteNum) {
                /// After Reload => Player right
                this.currentSpriteNum = this.sprite.right.spriteNum;
                this.currentSprite = this.sprite.right.image;
                this.currentCropWidth = this.sprite.right.cropWidth;
                this.currentHeight = this.sprite.right.height;
            }
            this.frame = 0;
        } else {
            this.frame++;
        }
        this.draw();
        bullet_position={
            x: (player.position.x+player.width/2 - 15)+78,
            y: (player.position.y+player.height/2)-24,
        };
    }
}
var myGameArea={};
window.addEventListener('keydown', function (e) {
    e.preventDefault();
    myGameArea.keys = (myGameArea.keys || []);
    myGameArea.keys[e.keyCode] = (e.type == "keydown");
})
window.addEventListener('keyup', function (e) {
    myGameArea.keys[e.keyCode] = (e.type == "keydown");
})





class Projectiles{
    constructor(position , velocity , rotation) {
        this.width = 30;
        this.height =30;
        this.image = createImage("img/bullet.png");
        this.position = position;
        this.velocity = velocity;
        this.rotation = rotation;
        this.hypot=Math.hypot(this.width/2,this.height/2);
    }
    state(){
        return 'bullet'
    }
    
    draw() {
        context.beginPath();
        context.save();
        context.translate(this.position.x, this.position.y);
        context.rotate(this.rotation);
        context.translate(-this.position.x, -this.position.y);
        context.drawImage(
            this.image,
            0,
            0,
            1024,
            1024,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
        context.restore();
        context.closePath();
    }

    update() {
        this.draw();
       
        this.velocity.y+=gravity;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

class Enemy{
    constructor(position,velocity,path) {
        this.image = createImage(path);
        this.width = 100; 
        this.height = 100; 
        this.position = position
        this.velocity = velocity;
        this.hypot = Math.hypot(this.width / 2, this.height / 2);
        
        
      

       
        this.frame = 0;
    }
    state(){
        return 'enemy'
    }
    draw() {
        this.radius = 15;
        this.cirX = this.position.x + (this.width - this.height);
        this.cirY = this.position.y + this.height / 2;

        context.beginPath();
        context.save();
       
        // After I See Image  => i crop image from x = 95 & from y = 100
        context.drawImage(
            this.image,
            (this.frame * 200),
            0,
            200,
            312,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
        // context.strokeStyle = "red";
        // context.arc(this.cirX, this.cirY, this.radius, 0, 2 * Math.PI);
        // context.stroke();
        context.restore();
        context.closePath();
    }

    update() {
        if(game_blocks.length!=0){
        for (let index = 0; index < game_blocks.length; index++) {
            const block = game_blocks[index];
        
            if (
                block.position.x < this.position.x + this.width &&
                block.position.x + block.width > this.position.x &&
                block.position.y < this.position.y + this.height &&
                block.position.y + block.height > this.position.y
            ) {
                this.velocity.x = 0;
                if (block.health > 0) {
                    block.health -= 0.1;
                } else {
                    setTimeout(() => {
                        game_blocks.splice(index, 1);
                    }, 0); 
                }
                break; 
            } else {
                
                    this.velocity.x = 0.5;
               
            }
        }
    }
        
        if (this.frame >= 10) {
            this.frame = 0;
        } else {
            setTimeout(() => {
                this.frame++;
            }, 700);
        }
       
        var angle = Math.atan2(player.position.y - this.position.y,player.position.x- this.position.x);
        var speed =Math.cos(angle) * this.velocity.x;
          
        
        this.position.x +=speed;
        this.draw();
       
    }
}

const friction = 0.98;
class Particle{
    constructor(x , y, radius, color, velocity) {
        this.position = {
            x: x,
            y: y,
        }
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
    }
    
    draw() {
        context.beginPath();
        context.save();
        context.globalAlpha = this.alpha;
        context.fillStyle = this.color;
        context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        context.fill();
        context.restore();
        context.closePath();
    }

    update() {
        this.draw();
        this.velocity.x *= friction;
        this.velocity.y *= friction;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.alpha -= 0.01;
    }
}


// Start Game
let player = new Player();
let projectiles = [];
let left_enemies = [];
let right_enemies = [];
let particles = [];


function createImage(path) {
    const img = new Image();
    img.src = path;
    return img;
}

function createAudio(path) {
    const audio = new Audio();
    audio.src = path;
    return audio;
}

/// Enemy Part
function spawnEnemies() {
    /// Width of Zombie = 85   ,   Height of Zombie = 50
    setInterval(() => {
        const position = { x: 0, y: 0 };
        // Random Position
        
        if (Math.random() < 0.5) {
            position.x = 0;
            position.y =Y-30;
            const velocity = {
                x:   0.5,
                y:   0,
            }
             var path='img/walkingdead_left.png'
            left_enemies.push(
                new Enemy(position, velocity,path)
            );
        } else {
            position.x =canvas.width;
            position.y =Y-30;
            const velocity = {
                x:   -0.5,
                y:   0,
            }
            var path='img/walkingdead.png'
            right_enemies.push(
                new Enemy(position, velocity,path)
            );
        }

       

        


    } , 3000);
}

class GameObject {
    constructor(x, y, width, height,health,path) {
        this.position = { x, y };

        this.width = width;
        this.height = height;
        this.img=createImage(path);
        this.health=health;
        
    }
    
    draw() {
        
        context.drawImage(this.img, this.position.x, this.position.y, this.width, this.height);
    }
}
function build_block() {
    let blocks = [];
    let dis = 0;
    let path;
    let str="img/block_?.png"

    for (let i = 0; i < 3; i++) {
       
       path=str.replace("?",i+1);
       let left_block = new GameObject(X - 250 - dis, Y , 80, 80, 100+dis,path);
       let right_block = new GameObject(X + 250 + dis, Y , 80, 80, 100+dis,path);
       dis += 81;
       blocks.push(left_block);
        blocks.push(right_block);
    }

    return blocks;
}
let game_blocks=build_block();
function initGame() {
    
   
    player = new Player();
    player.health=100;
    projectiles = [];
    game_blocks=build_block();
    left_enemies = [];
    right_enemies = [];
    particles = [];
    score = 0;
    setTimeout(()=>{pause.click();},500)
    scoreElements.forEach(scoreEl => {
        scoreEl.innerHTML = score;
    });
    backgroundSound.play();
    
    backgroundSound.volume = muted ? 0 : 0.1;
    animate();
    spawnEnemies();
}


// Animation Part
let animateID;
let score = 0;
function animate() {
    // Request the next frame
    if (!is_paused)
    {animateID = requestAnimationFrame(animate);

    // Draw the background
    context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    // Set the background sound volume
    backgroundSound.volume = muted ? 0 : 0.1;

    // Update the player and draw the aimer
    player.update();
 

    // Draw the game blocks
    game_blocks.forEach((block) => { block.draw(); });

    // Update and remove particles
    particles.forEach((particle, index) => {
        if (particle.alpha <= 0) {
            particles.splice(index, 1);
        } else {
            particle.update();
        }
    });
    

    // Update and handle projectiles
    projectiles.forEach((projectile, index) => {
        projectile.update();
        
        // Check for collision with blocks
        game_blocks.forEach((block) => {
            if (
                block.position.x < projectile.position.x + projectile.width &&
                block.position.x + block.width > projectile.position.x &&
                block.position.y < projectile.position.y + projectile.height &&
                block.position.y + block.height > projectile.position.y
            ) {
                setTimeout(() => {
                    projectiles.splice(index, 1);
                });
            }
        });

        // Remove projectiles that are out of bounds
        if (projectile.position.x > canvas.width || 
            projectile.position.y > canvas.height ||
            projectile.position.x + projectile.width < 0 ||
            projectile.position.y + projectile.height < 0) {
            setTimeout(() => {
                projectiles.splice(index, 1);
            });
        }
    });

    // Update enemies
    left_enemies.forEach(enemy => enemy.update());
    right_enemies.forEach(enemy => enemy.update());

    // Handle left enemies
    left_enemies.forEach((enemy, enemyIndex) => {
        handleEnemy(enemy, enemyIndex, left_enemies);
    });
    // Handle right enemies
    right_enemies.forEach((enemy, enemyIndex) => {
        handleEnemy(enemy, enemyIndex, right_enemies);
    });
}

function handleEnemy(enemy, enemyIndex, enemyArray) {
    // Check for collisions with game blocks
   
    

    // Check for collisions with the player
    const dis = Math.hypot(
        (player.position.x + player.width / 2 - 10) - enemy.cirX,
        (player.position.y + player.height / 2 + 10) - enemy.cirY
    );
    if (dis - enemy.radius - 20 < 1) {
        particles.push(new Particle(
            player.position.x + player.width / 2,
            player.position.y + player.height / 2,
            Math.random() * 3,
            "red",
            {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2,
            }
        ));
        if (player.health <= 0) {
            if (!muted) {
                const zombieEat = createAudio("audio/zombieEat.mp3");
                zombieEat.play();
                backgroundSound.pause();

            }
            cancelAnimationFrame(animateID);
            scoreElements[1].innerHTML = score;
            canvas.style.display = "none";
            result.style.display = "block";
        } else {
            player.health -= 0.1;
        }
    }

    // Check for collisions with projectiles
    projectiles.forEach((projectile, projectileIndex) => {
        const dis = Math.hypot(
            projectile.position.x + projectile.width / 2 - enemy.position.x - enemy.width / 2,
            projectile.position.y + projectile.height / 2 - enemy.position.y - enemy.height / 2
        );
        if (dis + 11 < enemy.hypot + projectile.hypot) {
            if (!muted) {
                shoot.pause();
                killingZombie.play();
            }

            // Create Explosions
            for (let i = 0; i < 15; i++) {
                particles.push(new Particle(
                    enemy.position.x + enemy.width / 2,
                    enemy.position.y + enemy.height / 2,
                    Math.random() * 3,
                    "red",
                    {
                        x: (Math.random() - 0.5) * 2,
                        y: (Math.random() - 0.5) * 2,
                    }
                ));
            }

            setTimeout(() => {
                enemyArray.splice(enemyIndex, 1);
                projectiles.splice(projectileIndex, 1);
            });

            // Update Score
            score += 100;
            scoreElements[0].innerHTML = score;
        }
    });}
    
}




var mousePos;
var mouseDown = false;
var mouseUp = false;
var drawnBack=false;



window.addEventListener("mousemove", (event) => {
    // Angle of " Start Point (Gun Position) to End Point (Mouse Direct) "
    /// Gun Position {x : X+40 , y: Y+25}
    
    const angle = Math.atan2(event.clientY - (Y), event.clientX - (X - 15));
    player.rotation = angle;
    mousePos = {
        x:event.clientX,
        y:event.clientY
    };
    
});
var distBetween = function(p1, p2) {
    return Math.sqrt( Math.pow((p2.x-p1.x), 2)
                    + Math.pow((p2.y-p1.y), 2) );
  }
var first_point;
canvas.addEventListener("mousedown", function(event) {
    
    mousePos = {
        x:event.clientX,
        y:event.clientY
    };
    if (mouseDown==false){
       first_point={
        x:event.clientX,
        y:event.clientY
    };
    }
  mouseDown = true;
  mouseUp = false;
  drawnBack=true;
  
}, false);
var angleBetween = function(p1, p2) {
    return Math.atan2(p2.y-p1.y, p2.x-p1.x);
  }
var bullet_position={
    x: (player.position.x+player.width/2 - 15)+78,
    y: (player.position.y+player.height/2)-24,
};

canvas.addEventListener("mouseup", function(event) {
    mousePos = {
        x:event.clientX,
        y:event.clientY
    };
    drawnBack=false;
  mouseUp = true;
  mouseDown = false;
   var angle=angleBetween(mousePos, first_point)
   
  var speed = Math.min(75,
    
    distBetween(first_point, mousePos)) / 4;
    var velX = Math.cos(angle)*speed;
    var velY = Math.sin(angle)*speed;
  let position = {
      x: (player.position.x+player.width/2 - 15),
      y: (player.position.y+player.height/2),
  }
  let velocity={
    x:velX,
    y:velY
  }
  /// Position Gun from Player position is (40 , 20)
  /// Rotate Coordinate Point 
  position.x += 78;
  position.y -=24;
  
  projectiles.push(
      new Projectiles(position, velocity, angle)
  );

  player.currentSpriteNum = player.sprite.shoot.spriteNum;
  player.currentSprite = player.sprite.shoot.image;
  player.currentCropWidth = player.sprite.shoot.cropWidth;
  player.currentHeight = player.sprite.shoot.height;

  if (!muted) {
      shoot.playbackRate = 2;
      shoot.volume = 0.5;
      shoot.play();
  }
}, false);



var angleBetween = function(p1, p2) {
    return Math.atan2(p2.y-p1.y, p2.x-p1.x);
  }


startGame.addEventListener("click", () => {
    result.style.display = "none";
    canvas.style.display = "block";
    popup("INSTRUCTION:click and drag the mouse and UPmousebutton to shoot ,\nW,SPACEBAR,UPARROW->JUMP\nA,LEFT_ARROW->MOVE LEFT\nD,RIGHT_ARROW->MOVE RIGHT");
    initGame();
});

soundPlay.addEventListener("click", () => {
    muted = true;
    soundPlay.style.display = "none";
    soundmuted.style.display = "block";
    backgroundSound.volume = muted ? 0 : 0.1;
});

soundmuted.addEventListener("click", () => {
    muted = false;
    soundmuted.style.display = "none";
    soundPlay.style.display = "block";
    backgroundSound.volume = muted ? 0 : 0.1;
});
play.addEventListener("click",()=>{
    is_paused=false;
    play.style.display="none";
    pause.style.display="block";
    overlay.style.display = "none"; 
    animate();
   
})
pause.addEventListener("click",()=>{
    is_paused=true;
    pause.style.display="none";
    play.style.display="block";
    overlay.style.display = "block"; 
  
  
})

function closepopup(){
    modal.classList.toggle('active');
    popup_overlay.classList.remove('active');
    

}
function popup(message){
    const message_container=document.getElementById('popup');
    message_container.textContent=message;
    modal.classList.toggle('active');
    popup_overlay.classList.add('active');



}
const popup_overlay=document.getElementById('popup_overlay');
const overlay = document.getElementById("overlay");
const modal=document.getElementById('modal');

function instruct(){
    if (is_paused) {
        popup("resume game to play");
        
    }
}


