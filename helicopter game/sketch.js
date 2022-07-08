var bg
var bottomGround, topGround
var helicopter, helicopterImg
var obstacleTop, obstacleTopImg
var obstacleBottom, obstacleBottom1, obstacleBottom2
var gameOver, gameOverImg
var restart, restartImg
var backgroundImg

var score = 0;

//game states      
var PLAY = 1;
var END = 0;
var gameState = PLAY;


function preload(){
  bgImg = loadImage("assets/bg.png")
  bgImg2 = loadImage("assets/bgImg2.jpg")

  helicopterImg = loadImage("assets/helicopter.gif")
  
  obsTop1 = loadImage("assets/obsTop1.png")
  obsTop2 = loadImage("assets/obsTop2.png")
  
  obsBottom1 = loadImage("assets/obsBottom1.png")
  obsBottom2 = loadImage("assets/obsBottom2.png")
  obsBottom3 = loadImage("assets/obsBottom3.png")
  
  gameOverImg= loadImage("assets/gameOver.png")
  restartImg = loadImage("assets/restart.png")

jumpSound = loadSound("assets/jump.mp3");
dieSound = loadSound("assets/die.mp3");

}

function setup(){

  createCanvas(400,400)
//background image
bg = createSprite(165,485,1,1);
getBackgroundImg();


//creating top and bottom grounds
bottomGround = createSprite(200,390,800,20);
bottomGround.visible = false;

topGround = createSprite(200,10,800,20);
topGround.visible = false;
      
//creating helicopter     
helicopter = createSprite(100,200,20,50);
helicopter.addImage("helicopter",helicopterImg);
helicopter.scale = 0.3;
//helicopter.debug = true;


//initialising groups
topObstaclesGroup = new Group();
bottomObstaclesGroup = new Group();
barGroup = new Group();

//creating game over and restart sprites
gameOver = createSprite(220,200);
restart = createSprite(220,240);
gameOver.addImage(gameOverImg);
gameOver.scale = 0.5;
restart.addImage(restartImg);
restart.scale = 0.5;
gameOver.visible = false;
restart.visible = false;


}

function draw() {
  

  if(gameState === PLAY){
    if(keyDown("space")) {
       helicopter.velocityY = -6 ;
        jumpSound.play(); } 
        
        //adding gravity 
      helicopter.velocityY = helicopter.velocityY + 2;
 

    

     
    Bar();

     //spawning top and bottom obstacles
     spawnObstaclesTop();
     spawnObstaclesBottom();

//condition for END state
if(topObstaclesGroup.isTouching(helicopter) || helicopter.isTouching(topGround)
|| helicopter.isTouching(bottomGround) || bottomObstaclesGroup.isTouching(helicopter)){

gameState = END;
dieSound.play();
}


//Adding AI for helicopter when touching topObstaclesGroup and topGround

/*if(topObstaclesGroup.isTouching(helicopter) || helicopter.isTouching(topGround)){
  helicopter.velocityY = 6 ;
  jumpSound.play();
}*/


//Adding AI for helicopter when touching topObstaclesGroup and topGround

/*if(balloon.isTouching(bottomGround) || bottomObstaclesGroup.isTouching(helicopter)){
  helicopter.velocityY = -6 ;
  jumpSound.play();
}*/

  }

  if(gameState === END) 
    {

      gameOver.visible = true;
      gameOver.depth = gameOver.depth+1
      restart.visible = true;
      restart.depth = restart.depth+1
          
          //all sprites should stop moving in the END state
          helicopter.velocityX = 0;
          helicopter.velocityY = 0;
          topObstaclesGroup.setVelocityXEach(0);
          bottomObstaclesGroup.setVelocityXEach(0);
          barGroup.setVelocityXEach(0);
          
          //setting -1 lifetime so that obstacles don't disappear in the END state
          topObstaclesGroup.setLifetimeEach(-1);
          bottomObstaclesGroup.setLifetimeEach(-1);
         
          helicopter.y = 200;
          
          //resetting the game
          if(mousePressedOver(restart)) 
          {
                reset();
          }

    } 

    drawSprites();
    Score();     
}

function reset()
{
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  topObstaclesGroup.destroyEach();
  bottomObstaclesGroup.destroyEach();

  score = 0;
}


function spawnObstaclesTop() 
{
  if(World.frameCount % 60 === 0) {
    obstacleTop = createSprite(400,50,40,50);

//obstacleTop.addImage(obsTop1);

obstacleTop.scale = 0.1;
obstacleTop.velocityX = -4;

//random y positions for top obstacles
obstacleTop.y = Math.round(random(10,100));

//generate random top obstacles
var rand = Math.round(random(1,2));
switch(rand) {
  case 1: obstacleTop.addImage(obsTop1);
          break;
  case 2: obstacleTop.addImage(obsTop2);
          break;
  default: break;
}

 //assign lifetime to the variable
obstacleTop.lifetime = 100;

//helicopter.depth = helicopter.depth + 1;

topObstaclesGroup.add(obstacleTop);

  }
}

function spawnObstaclesBottom() 
{
  if(World.frameCount % 60 === 0) {
    obstacleBottom = createSprite(400,350,40,50);

obstacleBottom.addImage(obsBottom1);
obstacleBottom.debug=true


obstacleBottom.scale = 0.07;
obstacleBottom.velocityX = -4;



//generate random bottom obstacles
var rand = Math.round(random(1,3));
switch(rand) {
  case 1: obstacleBottom.addImage(obsBottom1);
          break;
  case 2: obstacleBottom.addImage(obsBottom2);
          break;
  case 3: obstacleBottom.addImage(obsBottom3);
          break;
  default: break;
}

 //assign lifetime to the variable
obstacleBottom.lifetime = 100;

//balloon.depth = helicopter.depth + 1;

bottomObstaclesGroup.add(obstacleBottom);

  }
}

 function Bar() 
 {
         if(World.frameCount % 60 === 0)
         {
           var bar = createSprite(400,200,10,800);
          bar.velocityX = -6
        
          
          bar.velocityX = -6
          bar.depth = helicopter.depth;
          bar.lifetime = 70;

          bar.visible = false;

          barGroup.add(bar);
         }
}

function Score()
{
         if(helicopter.isTouching(barGroup))
         {
           score = score + 1;
         }
        textFont("algerian");
        textSize(30);
        fill("yellow");
        text("Score: "+ score, 250, 50);
       
  
}

// using API calls to set the background image according to time
async function getBackgroundImg(){
  var response = await fetch("http://worldtimeapi.org/api/timezone/Asia/Kolkata");
  var responseJSON = await response.json();

  var datetime = responseJSON.datetime;
  var hour = datetime.slice(11,13);
  
  if(hour>=06 && hour<=19){
    
    bg.addImage(bgImg);
    bg.scale = 1.3
  }
  else{
    
    bg.addImage(bgImg2);
    bg.scale = 1.5
    bg.x=200
    bg.y=200
  }

}