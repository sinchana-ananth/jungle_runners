/*
  Sinchana, Claire, Chloe, Samuel 
  06/06/2022
  ISU Final Javascript Source code 
  This file holds the source code for our game for our ISU Final
*/


// GLOBAL VARIABLES \\

// Variables to store names of players
let player1Name=prompt("What's your name, player 1?"); //asks for player 1's name, is used on the leaderboard
while (player1Name==""|| player1Name == null || player1Name == undefined)
{
  player1Name=prompt("Please enter a name, player 1."); //asks for name again if not entered
}

let player2Name=prompt("What's your name, player 2?"); //asks for player 2's name, is used on the leaderboard
while (player2Name=="" || player2Name == null || player2Name == undefined)
{
  player2Name=prompt("Please enter a name, player 2."); //asks for name again if not entered
}
greeting(); //greets the players

player1Name = customize(player1Name); //calls on this function to convert name into all CAPS and take the first 2 letters
player2Name = customize(player2Name);//calls on this function to convert name into all CAPS and take the first 2 letters

// Creates an object variable that stores all the keys [Keys will be used in all UPDATE and CREATE functions]
let Keys = {}; //w,a,s,d and up,down,left,right used (Map1 and Map2)

// to store ENTER key
let enter; // is used on the lose scene and leaderboard

//Creates an array where the player can collide with the obstacles and the player cannot move through the obstacle. 
let Obstacles = []; // Used in map 1 and map2 to detect collisions 

//Creates an array of Objects player1 can collide with (the purple water)
let PurpleObstacles = []; // Used in map 1 and map 2 to detect when the red player hits purple parts 
//Creates an array of Objects player2 can collide with (the red water)
let RedObstacles = []; // Used in map 1 and map 2 to detect when the blue player hits red parts
//Creates an array of obstacles that no players can collide with (the green water)
let Poison = []; //Used in map 1 and map 2 to detect when both players collide with poision  

//Animations
let Anim = {}; //Animations for the player 1 and player 2. Used in maps 1 and maps 2 (IMPORTANT)

//Hearts to display the lives
let Hearts = []; // used in map 1 and map 2

//Music variables
let backgroundMusic; //background music used in map 1 and map 2
let gemCollection; //sound effect for when gems are collected, is used in map 1 and map 2

//Gem count for all maps, counts the number of gems players collect
let gemCount1 = 0; // used in map 1
let gemCount2 = 0; // used in map 2

//End doors for both maps
let endDoor; // used in map 1
let endDoor2; //used in map 2

//Gem text 
let gemStatusMap1; //shows the gemCount for map1
let gemStatusMap2; //shows the gemCoutn for map2

//leaf obstacles for all maps
let leaf; // is used in map 1 and map 2
let leafSpeed; // is used in map 1 and map 2
let leaf2; // is used in map 1 and map 2
let leaf2Speed; // is used in map 1 and map 2

//Map 1 variables 
let map1Header; // is used in map 1
//Collectable gems; (format for naming: what colour and what map)
//all of the gems below are used in map 1 
let purp1Gem1; 
let purp2Gem1;
let purp3Gem1;
let red1Gem1;
let red2Gem1;
let red3Gem1;

//Map 2 variables
let map2Header; //used on map 2
// spinning ninja stars used on map 2
let star1;
let star2;
let star3;
let star4;
let star5;
let star6;
let star7;
//Collectable gems; (format for naming: what colour and what map)
//all of the gems below are used in map 2
let purp1Gem2; 
let purp2Gem2;
let purp3Gem2;
let purp4Gem2;
let purp5Gem2;
let red1Gem2;
let red2Gem2;
let red3Gem2;
let red4Gem2;
let red5Gem2;
//Leaderboard variables
let leaderboardHeader; //main title
let map1LBTxt; //map 1
let map2LBTxt; //map 2

//stores time players take to reach the door for map 1
let player1Time;
let player2Time;

let playerTimes = [] //stores the player times for maps

//Stores the times for all players 
let PlayerTimes = [
  [],// Creates an array for map1 
  [], // Creates an array for map2 
]; 

//Lose scene variables
let loseTxt;
let pressEnTxt;

// CUSTOM CLASSES \\

//Timer Class 
class Timer{
  //Takes a parameter EndTime which is the time limit 
  constructor(EndTime){
    this.MaxTime = EndTime; // Puts the MaxTime which is the time limit 
    this.PastTime = Date.now(); //This updates/gets the past time to the EPOC time 
  }

  //Returns the amount of time remaining
  timeRemaining(){
    let CurrentTime = Date.now(); //Gets the current time 
    //
    return Math.floor(this.MaxTime - ((CurrentTime - this.PastTime)/1000)); // Returns the time in seconds 
  }

  //Checks the time and checks if it has passed the end time
  // Returns false if time remaining is less than end time else returns true 
  checkTime(){
  
    // Gets the current time
    let CurrentTime = Date.now(); 
    // Calculates the time passed and converts it into seconds  
    let TimePassed = ((CurrentTime - this.PastTime)/1000); 
    // Calculates the time remaining by taking the max time and subtracting 
    // time passed and then flooring it to prevent float point issues in text
    let TimeRemaining = Math.floor(this.MaxTime - TimePassed); 
     
    if(TimeRemaining <= 0)
    {
      return false; 
    }
    else
    {
      return true; 
    }
  }
}

//Character class

//Creates a character class with a built in character controller 
class Character{
  // creates a class variable and checks how long the player has jumped so far 
  //HasJumped = 0; 
  
  constructor(Position,Name,Animation){
    //Public Properties 
    this.Name = Name;  

    //Positioning Properties 
    Anim[this.Name].x = Position.x; 
    Anim[this.Name].y = Position.y; 

    //Player Position
    this.CurrentPosition = { //Creates an object that stores the current position 
      x: Position.x, // Stores the x position
      y: Position.y // Stores the y position 
    }
  
    //Physics 
    Anim[this.Name].setGravityY(200); // Sets the player's gravity to 200 
    Anim[this.Name].body.setCollideWorldBounds(true); // Sets the player so they collide with the world bounds 
    Anim[this.Name].body.setSize(40, 65, 30,55); // Sets the body size and offset for the body collider 
    
    //Abilities (If we have time we will add)
    this.CurrentAbility = undefined; 
    
    //Jumping
    this.JumpPower = 150; // Jump force of the 
    
    //Walk Speed 
    this.CurrentSpeed = 0; // Sets the current speed of the character
    this.Acceleration = 20;  // Sets how fast the character will accelerate 
    this.MaxSpeed = 200; // Sets the max velocity 
    this.StopForce = 300; // Sets the stop force (Drag)

    //Character Health
    this.Health = 100; // Something we don't need lol

    //Animations 
    this.RunRight = Animation.R; // Running right animation 
    this.RunLeft = Animation.L; // Running left animation

    //Start\\
    //This initilizes the character so it renders on creation 
    //Gets the specific player name and calls the method .play() to render the character. 
    Anim[this.Name].play(this.RunRight); 
    
  }
  // Creates a custom class function that allows the move() method to be called to move a specific character's sprite. 
  move(Direction){
    let lowerDirection = Direction.toLowerCase(); // Creates a variable for the direction and puts it in all lowercase
    
    switch(lowerDirection){
      case("d"): 
        // Checks if the current character's animation is playing. 
        //If it is then do not play the animation again else play the animation 
        //this.AnimationState = "Right"; 
        if(Anim[this.Name].anims.isPlaying == false){
          Anim[this.Name].play(this.RunRight); // Finds the correct Animation and plays it 
        }

        //Checks the current speed if it is at max 
        if(this.CurrentSpeed < this.MaxSpeed){
          //Allows the player to accelerate by adding the current speed 
          this.CurrentSpeed += this.Acceleration; 
        }
        // Sets the current player's x velocity to the current speed 
        Anim[this.Name].body.setVelocityX(this.CurrentSpeed); 
        break; 

      case("a"):
        // Checks if the current character's animation is playing. 
        //If it is then do not play the animation again else play the animation 
        if(Anim[this.Name].anims.isPlaying == false){
          Anim[this.Name].play(this.RunLeft); // Finds the correct Animation and plays it 
        }
  
        //Checks the current speed if it is at max 
        if(this.CurrentSpeed < this.MaxSpeed){
          this.CurrentSpeed += this.Acceleration; ; 
        }
         // Sets the current player's x velocity to the current speed 
        Anim[this.Name].body.setVelocityX(-this.CurrentSpeed); 
        break; 
      
      case("w"): 
        //Gets the current player 
        let CurrentPlayer = Anim[this.Name]; 

        // Checks if the player is not in the air by checking it's y velocity 
        if(CurrentPlayer.body.velocity.y == 0){
          // Allows the player to jump once the player is no longer flying/in the air 
          Anim[this.Name].body.setVelocityY(-this.JumpPower); 
        }
         
        break; 

      default: 
        //Sets drag on the player so the player slows down if the player is not inputting any values
        Anim[this.Name].body.setDragX(this.StopForce); 
        //Returns the current speed back to zero to reset the acceleration factor
        this.CurrentSpeed = 0; 
        break; 
    }
  }

  //Creates a custom function that sets the player at a specific position 
  setPosition(Vector2){
    //Basic type checking to make sure no invalid parameters are given 
    if(typeof(Vector2) != "object" || typeof(Vector2.x) != "number" || typeof(Vector2.y) != "number"){
      console.error(`Expected Vector2 object | got ${typeof(Vector2)}`);
      return 
    }
    // Sets the current sprite's position to the position provided in the parameter
    Anim[this.Name].x = Vector2.x; 
    Anim[this.Name].y = Vector2.y; 

    //Updates the current position to the current position that was stated in the parameter (Vector2) 
    this.CurrentPosition = {x: Vector2.x, y: Vector2.y};  
  }

  //Creates a custom function that gets the player's current position 
  getPosition(){
    return this.CurrentPosition; 
  }

  //Creates a custom function that updates the current position with the player's position 
  updatePosition(){
    //Sets the current position with the current position of the sprite/player
    this.CurrentPosition.x = Anim[this.Name].x; 
    this.CurrentPosition.y = Anim[this.Name].y; 
    }    
  }

//Positioning Class 
//Creates a x and y vector when given an array 
class Vector2{
  constructor(Array){
    if(typeof(Array) != "object"){
      console.error(`Array Expected got ${typeof(Array)}`); 
      return undefined
    }
    return {"x":Array[0], "y":Array[1]}; // Returns an object with an x and y value 
  }
}

// FUNCTIONS \\

//Function to greet players to our game (no parameters, no return)
function greeting(){
    let welcomeMessage ="Hello, "+player1Name+", "+player2Name+"! Welcome to Jungle Runners!";
    alert(welcomeMessage);
  }

//Function Random Numbers 
// -- The minimum random value 
// -- The maximum random value 
function Random(Min,Max){
  return Math.floor(Math.random() * Max) + Min; 
}

// This function animates the title screen down 
function Animate(Object,TargetPosition,Delay){
  setTimeout(function(){ // Sets a timeout to delay the recursive function 
    if(Object.y <= TargetPosition){// Checks if the object's y position has reached the target y position 
     Object.y += 2; // Increments the y position y 2 pixels 
     Animate(Object,TargetPosition,Delay); // Calls itlsef 
    }
  },Delay); // Waits for the delay 
} 

//This function stores and logs all information on the player's time and name 
function StoreTime(Name,Time,Map){
  //Creates a local variable that stores the object for the name and time 
  let Data = {
    "Name": Name,
    "Time": Time,
    "Map": Map
  };

  //Push the object into the array called [PlayerTimes]
  if(Map == 1){
   // console.log(PlayerTimes[0],1); 
    if(PlayerTimes[0].length <= 0){
      return PlayerTimes[0].push(Data); 
    }
    
    //Checks if the player is already added into the array 
    for (let i = 0; i < PlayerTimes[0].length; i++) {
      let CurrentIndex = PlayerTimes[0][i]; 
      if(CurrentIndex && CurrentIndex.Name != Name){
        //Pushes the data into array 1 inside the player times array
        return PlayerTimes[0].push(Data); 
      }
    }
  }
  else if(Map == 2)
  {

    if(PlayerTimes[1].length <= 0){
      return PlayerTimes[1].push(Data); 
    }
    
    //Checks if the player is already added into the array 
    for (let i = 0; i < PlayerTimes[0].length; i++) {
      let CurrentIndex = PlayerTimes[1][i]; 
      if(CurrentIndex && CurrentIndex.Name != Name){
        //Pushes the data into array 1 inside the player times array
        return PlayerTimes[1].push(Data); 
      }
    }
  }
  return Data // Returns the data object 
}

//Function to make team's name into all capital letters and returns the first 2 letters (parameters, return)
function customize(name)
  {
    name = name.toUpperCase(); // converts the name to all upper case
    name = name.slice(0, 2); // gets the first 2 characters
    return name;
  }

//Function to spin objects (parameters, no return)
function rotation(object)
  {
    object.rotation += 0.2;
  }

//Bubble sorting function
function bubbleSort(Array) {
  let tempVar = 0;
  for (let x=0; x<Array.length; x++) {
    for (let i=0; i<Array.length-1; i++) {
      if (Array[i].Time > Array[i+1].Time) {
        tempVar = numbers[i]; 
        Array[i] = Array[i+1];
        Array[i+1] = tempVar; 
      }
    }
  }
  return Array;
}

// MAIN MENU SCENE STARTS HERE \\
class mainMenu extends Phaser.Scene{
  constructor(config){
    super(config)
  }

  preload(){
    //Loads the background image of the main menu
    this.load.image("Background","../../ASSETS/SPRITES/MainMenu/Background.png");

    //Loads the play button 
    this.load.image("Play","../../ASSETS/SPRITES/MainMenu/PlayButton.png"); 

    //Loads the button for instructions
    this.load.image("Instructions","../../ASSETS/SPRITES/MainMenu/instructionsLogo.png"); 
  }

  create(){
    var cache; // Used as a temp variable
    //Adds the background image 
    this.physics.add.image(625,400,"Background"); 

    //Adds the play button image and sets it to the temp variable cache
    cache = this.physics.add.image(625,500,"Play").setInteractive(); 
    cache.setScale(0.05); 

    //When the player hovers over the play button it will set a light tint 
    cache.on("pointerover",function(pointer){
      this.setTint(0xcccccc); 
    });

    //When the player hovers out of the play button it will clear the tint
    cache.on("pointerout",function(pointer){
      this.clearTint(); 
    });
    
    // When the player clicks on the button, it will set a dark tint 
    cache.on("pointerdown",function(pointer){
      this.setTint(0xa6a6a6); 
    });

    //When the player clicks on the button it loads up the next scene and clears the tint 
    cache.on("pointerup",function(pointer){
      this.clearTint(); 
      //game.scene.start("lobby"); 
      game.scene.start("map1"); 
      game.scene.remove("mainMenu"); 
    });

    //Adds text onto the main menu 
    cache = this.add.text(110,-150,"Jungle Runners",{fontFamily: 'Papyrus',fontSize: 150,color: '#bfffd2'});
    cache.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2); //sets a shadow behind the text
    Animate(cache,200,0); 

    // INSTRUCTIONS BUTTON 
    
    //Adds the instructions button image
    cache = this.physics.add.image(30,770,"Instructions").setInteractive(); 
    cache.setScale(0.05); 

    //When the player hovers over the ? button, it will set a light tint 
    cache.on("pointerover",function(pointer){
      this.setTint(0xcccccc); 
    });

    //When the player hovers out of the ? button, it will clear the tint
    cache.on("pointerout",function(pointer){
      this.clearTint(); 
    });
    
    // When the player clicks on the button, it will set a dark tint 
    cache.on("pointerdown",function(pointer){
      this.setTint(0xa6a6a6); 
    });
    
    //When the player clicks on the button it will direct them to the instructions page
    cache.on("pointerup",function(pointer){
      this.clearTint(); 
      window.location.href = "https://finalgameisu.sinchanaananth1.repl.co/WEBPAGES/INSTRUCTIONS/"; 
      game.scene.remove('mainMenu'); 
    });     
  }
} // MAIN MENU SCREEN ENDS HERE \\

// MAP 1 SCENE STARTS HERE \\
class map1 extends Phaser.Scene{
  constructor(config){
    super(config)
  }
  // Local variables 
  Player1; // Stores the player 1
  Player2; // Stores the player 2 
  TimeText; // Holds the text for the time remaining 
  Timer; // Stores the timer for this level
  DeathAnimation; // Stores the death animation sprite 

  Player1FinishTime; // Stores the finish time for player1 
  Player2FinishTime; // Stores the finish time for player2 

  //Variable for the current lives for this stage 
  TotalLives = 5; 
  
  preload(){
    //MUSIC
    //background music
    this.load.audio("bgMusic","../../ASSETS/MUSIC/backgroundMusic.mp3");
    //gem collection effect
    this.load.audio("gemCol","../../ASSETS/EFFECTS/gemCollectSound.wav");
    
    this.load.image("Theleaf","../../ASSETS/SPRITES/MainSprites/leaf.png");
    // loads the background for the map 1 scene
    this.load.image("map1Background","../../ASSETS/SPRITES/MainSprites/gameBackground.png");
    // loads the end door for the map
    this.load.image("door","../../ASSETS/SPRITES/MainSprites/door.png");
    // loads a black square to hold number of lives and timer for the game
    this.load.image("square1","../../ASSETS/SPRITES/MainSprites/blackSquare.jpg");
    
    // loads a purple square for poison
    this.load.image("purple","../../ASSETS/SPRITES/MainSprites/purple.png");
    // loads a green square for character 1
    this.load.image("poison","../../ASSETS/SPRITES/MainSprites/green.png");
    // loads a red square for character 2
    this.load.image("red","../../ASSETS/SPRITES/MainSprites/red.png");
    
    // loads a small brick
    this.load.image("smallBrick","../../ASSETS/SPRITES/MainSprites/brick3Small.png");
    // loads a medium brick
    this.load.image("medBrick","../../ASSETS/SPRITES/MainSprites/brick1Medium.png");
    // loads a large brick
    this.load.image("largeBrick","../../ASSETS/SPRITES/MainSprites/brick2Long.png");

    // loads the gem for character 1
    this.load.image("gem1","../../ASSETS/SPRITES/MainSprites/gem1.png");
    
    // loads the gem for character 2
    this.load.image("gem2","../../ASSETS/SPRITES/MainSprites/gem2.png");

    //Loads player 1's character animations 
    this.load.spritesheet("RunR","../../ASSETS/SPRITES/Player1/RunRight.png",{frameWidth: 48,frameHeight: 48}); 
    this.load.spritesheet("RunL","../../ASSETS/SPRITES/Player1/RunLeft.png",{frameWidth: 48, frameHeight: 48}); 

    //Loads player 2's character animations 
    this.load.spritesheet("RunR1","../../ASSETS/SPRITES/Player2/RunRight.png",{frameWidth: 46,frameHeight: 46}); 
    this.load.spritesheet("RunL1","../../ASSETS/SPRITES/Player2/RunLeft.png",{frameWidth: 46, frameHeight: 46}); 

    //Loads sparkle animation for when characters collide with poison or leaves
    this.load.spritesheet("death","../../ASSETS/SPRITES/MainSprites/sparklesSpritesheet.png",{frameWidth: 41,frameHeight: 39}); 

    //Loads in the heart image 
    this.load.image("Heart","../../ASSETS/SPRITES/MainSprites/lives.png"); 
  }
  
  create(){
    
    backgroundMusic=this.sound.add("bgMusic",{volume: 0.05}); //adds sound to game screen
    backgroundMusic.play(); //plays music

    gemCollection=this.sound.add("gemCol"); //adds sound effect
      
    this.physics.add.image(625,400,"map1Background"); // adds the background to our gamE
    
    // TOP LEVEL
    this.addObject("smallBrick",new Vector2([57,150])); 

    // 2ND LEVEL
    this.addObject("largeBrick",new Vector2([202,300])); 
    this.addObject("medBrick",new Vector2([505,300])); 
    this.addObject("medBrick",new Vector2([695,300]));
    this.addObject("medBrick",new Vector2([885,300]));
    this.addObject("smallBrick", new Vector2([1038,300])); 
    RedObstacles.push(this.physics.add.image(505,283,"red").setDisplaySize(187, 20)); // Adds the red obstacle into the array redObstacles
    PurpleObstacles.push(this.physics.add.image(885,283,"purple").setDisplaySize(187, 22)); // Adds the purple obstacles into the purple obstacles array
    
    red1Gem1 = this.physics.add.image(505,240,"gem2").setDisplaySize(60,60);
    purp1Gem1 = this.physics.add.image(885,240,"gem1").setDisplaySize(60,60);

    // 3RD LEVEL 
    this.addObject("medBrick",new Vector2([1160,480]));
    this.addObject("medBrick",new Vector2([973,480]));
    this.addObject("medBrick",new Vector2([785,480]));
    
    Poison.push(this.physics.add.image(973,465,"poison").setDisplaySize(187, 20)); // Adds all poison obstacles into the array poison
    red2Gem1 = this.physics.add.image(1160,420,"gem2").setDisplaySize(60,60);
    purp2Gem1 = this.physics.add.image(785,420,"gem1").setDisplaySize(60,60);

    // 4TH LEVEL 
    this.addObject("medBrick",new Vector2([94,600]));
    this.addObject("medBrick",new Vector2([284,600]));
    this.addObject("medBrick",new Vector2([474,600])); 
    red3Gem1 = this.physics.add.image(650,570,"gem2").setDisplaySize(60,60);
    purp3Gem1 = this.physics.add.image(94,545,"gem1").setDisplaySize(60,60);
    
    // BOTTOM LEVEL 
    this.addObject("smallBrick",new Vector2([57,780])); 
    this.addObject("smallBrick",new Vector2([173,780])); 
    this.addObject("smallBrick",new Vector2([289,780])); 
    this.addObject("smallBrick",new Vector2([405,780])); 
    this.addObject("smallBrick",new Vector2([521,780])); 
    this.addObject("smallBrick",new Vector2([637,780])); 
    this.addObject("smallBrick",new Vector2([753,780])); 
    this.addObject("smallBrick",new Vector2([869,780])); 
    this.addObject("smallBrick",new Vector2([985,780])); 
    this.addObject("smallBrick",new Vector2([985,780])); 
    this.addObject("smallBrick",new Vector2([1101,780])); 
    this.addObject("smallBrick",new Vector2([1217,780])); 
    endDoor = this.physics.add.image(867,720,"door");
    
    // adds poison
    Poison.push(this.physics.add.image(345,766,"poison").setDisplaySize(696, 20));
    Poison.push(this.physics.add.image(1160,766,"poison").setDisplaySize(232, 20));

    //leaf obstacles
    let x; //x coordinate
    let y; //y coordinate
    
    leaf=this.physics.add.image(x,y,"Theleaf").setDisplaySize(35, 35); //leaf 1
    x=0;
    y=437;
    leafSpeed=5; 

    leaf2=this.physics.add.image(x,y,"Theleaf").setDisplaySize(35, 35); //leaf 2
    x=0;
    y=557;
    leaf2Speed=5;

    //adds the death animation
    this.DeathAnimation = this.add.sprite(-100,-100);

    //animation set
    this.addAnimation("Die","death",32,60); //Adds the death animation 
    
    //Creates Player 1 
    Anim["playerOne"] = this.physics.add.sprite(100,100); 
    this.addAnimation("RunRight","RunR",3,30); 
    this.addAnimation("RunLeft","RunL",3,30); 

    this.Player1 = new Character(new Vector2([57,90]),"playerOne",{R: "RunRight",L: "RunLeft"});
  
    this.addCollision(Anim["playerOne"],Obstacles); 

    //Creates Player 2 
    Anim["playerTwo"] = this.physics.add.sprite(100,100); 
    this.addAnimation("RunRight1","RunR1",3,30); 
    this.addAnimation("RunLeft1","RunL1",3,30); 

    this.Player2 = new Character(new Vector2([57,200]),"playerTwo",{R: "RunRight1",L: "RunLeft1"});
  
    this.addCollision(Anim["playerTwo"],Obstacles); 
    
    //Adds in the keys 
    this.addKeys(["w","a","s","d","up","down","left","right"]); 

    //Adds in 5 hearts at the top left corner 
    Hearts[Hearts.length] = this.physics.add.image(25,35,"Heart"); 
    Hearts[Hearts.length - 1].setScale(0.05); 

    Hearts[Hearts.length] = this.physics.add.image(80,35,"Heart"); 
    Hearts[Hearts.length - 1].setScale(0.05); 

    Hearts[Hearts.length] = this.physics.add.image(135,35,"Heart"); 
    Hearts[Hearts.length - 1].setScale(0.05); 

    Hearts[Hearts.length] = this.physics.add.image(190,35,"Heart"); 
    Hearts[Hearts.length - 1].setScale(0.05); 

    Hearts[Hearts.length] = this.physics.add.image(245,35,"Heart"); 
    Hearts[Hearts.length - 1].setScale(0.05); 

    //TEXT
    map1Header=this.add.text(500,10,"MAP 1",{fontFamily:"Papyrus",fontSize:50,color:"#bfffd2"}); //adds instruction message
    map1Header.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2); //sets shadow behind text

    //Time text 
    this.Timer = new Timer(50); // Creates a new timer with 45 seconds 
    //this.Timer = new Timer(5); 
    this.TimeText = this.add.text(910,8,`Time Left: 30`,{fontFamily: "Papyrus",fontSize: 50}); 

    // shows how many gems the team has collected
    gemStatusMap1=this.add.text(1055,70,"Gems: 0",{fontFamily:"Papyrus",fontSize:50,color:"white"});

  }

  update(){
    gemStatusMap1.text="Gems:"+gemCount1; //shows how many gems players have collected
                                             
    let TimePassed = this.Timer.timeRemaining(); 
    this.TimeText.text = `Time Left: ${TimePassed}s`; //displays the timer

    //Checks if the total lives is equal to zero and if so it will start the death scene 
    if(this.TotalLives <= 0){
      
      //Calls the function to store the time in an array 
      StoreTime(player1Name,"DNF",1); 
      StoreTime(player2Name,"DNF",1); 
      game.scene.start("map2"); 
      game.scene.remove("map1"); 
    }
    
    //Check if the player's have run out of time
    if(this.Timer.checkTime() == false){ 
      //Checks if individual players finished the map or not
      if(this.Player1FinishTime == undefined){
        StoreTime(player1Name,"DNF",1); 
      }
      else
      {
        StoreTime(player1Name,"DNF",1); 
      }

      if(this.Player2FinishTime == undefined){
        StoreTime(player2Name,"DNF",1); 
      }
      else
      {
        StoreTime(player2Name,"DNF",1);
      }
      //Kills both players 
      this.deathAnim(this.Player1);
      this.deathAnim(this.Player2); 
      game.scene.start("map2");
      game.scene.remove("map1"); 
    }
    //PURPLE GEM
    //the following will detect collisions between first purple gem and character 1
    if(this.physics.world.overlap(purp1Gem1,Anim["playerOne"])==true)
    {
      gemCollection.play();
      gemCount1=gemCount1+1;
      purp1Gem1.destroy();
    }
    //the following will detect collisions between second purple gem and character 1
    if(this.physics.world.overlap(purp2Gem1,Anim["playerOne"])==true)
    {
      gemCollection.play();
      gemCount1=gemCount1+1;
      purp2Gem1.destroy();
    }
    //the following will detect collisions between third purple gem and character 1
    if(this.physics.world.overlap(purp3Gem1,Anim["playerOne"])==true)
    {
      gemCollection.play();
      gemCount1=gemCount1+1;
      purp3Gem1.destroy();
    }

    //RED GEM
    //the following will detect collisions between first red gem and character 2
    if(this.physics.world.overlap(red1Gem1,Anim["playerTwo"])==true)
    {
      gemCollection.play();
      gemCount1=gemCount1+1;
      red1Gem1.destroy();
    }
    //the following will detect collisions between second red gem and character 2
    if(this.physics.world.overlap(red2Gem1,Anim["playerTwo"])==true)
    {
      gemCollection.play();
      gemCount1=gemCount1+1;
      red2Gem1.destroy();
    }
    //the following will detect collisions between third red gem and character 2
    if(this.physics.world.overlap(red3Gem1,Anim["playerTwo"])==true)
    {
      gemCollection.play();
      gemCount1=gemCount1+1;
      red3Gem1.destroy();
    }

  // leaf opbstacles
   leaf.x+=leafSpeed;
   if(leaf.x>1250){
     let x= 0; 
     let y=437; 
     leaf.x=x;
     leaf.y=y;
     leafSpeed= Random(3,5);
   }
    leaf2.x+=leaf2Speed;
   if(leaf2.x>1250){
     let x= 0; 
     let y= 557;
     leaf2.x=x;
     leaf2.y=y;
     leaf2Speed=Random(3,5);
   }
    //rotates the leaf
    rotation(leaf);
    rotation(leaf2);

    //Detects collision with each of the leaves 
    //Player 1
    if(this.physics.world.overlap(Anim["playerOne"],leaf) == true){
      //Sets the position of the leaf and "Spawns" it somewhere else
      leaf.x = -Random(50,400);
      this.deathAnim(this.Player1); 
    }

    if(this.physics.world.overlap(Anim["playerOne"],leaf2) == true){
      //Sets the position of the leaf and "Spawns" it somewhere else
      leaf2.x = -Random(50,400);
      this.deathAnim(this.Player1);
    }

    //Player 2
    if(this.physics.world.overlap(Anim["playerTwo"],leaf) == true){
      //Sets the position of the leaf and "Spawns" it somewhere else
      leaf.x = -Random(50,400);
      this.deathAnim(this.Player2); 
    }

    if(this.physics.world.overlap(Anim["playerTwo"],leaf2) == true){
      //Sets the position of the leaf and "Spawns" it somewhere else
      leaf2.x = -Random(50,400);
      this.deathAnim(this.Player2);
    }

    if(this.physics.world.overlap(endDoor,Anim["playerOne"])==true)
    {
      this.Player1FinishTime =(this.Timer.MaxTime - this.Timer.timeRemaining());

      //Calls the function to store the time in an array 
      StoreTime(player1Name,this.Player1FinishTime,1); 
      
    }

    if(this.physics.world.overlap(endDoor,Anim["playerTwo"])==true)
    {
      this.Player2FinishTime =(this.Timer.MaxTime - this.Timer.timeRemaining());
      //Calls the function to store the time in an array 
      StoreTime(player2Name,this.Player2FinishTime,1); 
    }

    //checks if both players reach the end door and if they do, then it take you to the map2
    if(this.physics.world.overlap(endDoor,Anim["playerOne"])==true)
    {
      if(this.physics.world.overlap(endDoor,Anim["playerTwo"])==true){
        game.scene.start("map2"); 
        game.scene.remove("map1");
      }
    }

    //Player 1 Controls 
    if(Keys.d.isDown == true){
      this.Player1.move("d"); 
    }

    if(Keys.w.isDown == true){
      this.Player1.move("w"); 
    } 
    else{
       this.Player1.IsJumping = false;  
     }

    if(Keys.a.isDown == true){
      this.Player1.move("a"); 
    }
    
    //Checks if both a and d keys are up then stop the player 
    if(Keys.a.isDown == false && Keys.d.isDown == false){
      this.Player1.move("Stop"); 
    } 
    
    //Update player1's current position 
    this.Player1.updatePosition(); 

    //Checks if player 1 has collided with any of the obstacles
    this.checkCollision(this.Player1.Name); // Calls the method CheckCollision to detect if player 1 has collided with things they aren't allowed to
    
    ////////////   Player 2 Controls  \\\\\\\\\\\\
    if(Keys.right.isDown == true){
      this.Player2.move("d"); 
    }

    if(Keys.left.isDown == true){
      this.Player2.move("a"); 
    } 
    
    if(Keys.up.isDown == true){
      this.Player2.move("w"); 
    }

    //Checks if both a and d keys are up then stop the player 
    if((Keys.left.isDown == false && Keys.right.isDown == false)){
      this.Player2.move("Stop"); 
    }
    
    //Updates the position for player 2 
    this.Player2.updatePosition(); 

    //Checks for collisions for player2
    this.checkCollision(this.Player2.Name); 
  }
  
  //CUSTOM FUNCTIONS \\
  
  //This function adds an animation 
  //Key - Name of your animation 
  //Name - The Name of your loaded animation 
  //Frame - How many frames are inisde your spritesheet 
  //FrameRate - How many frames per second you want to play the animation at 
  //Repeat (OPTIONAL) - How many times you want the animation to repeat
  addAnimation(Key,Name,Frame,FrameRate,Repeat){
    let Frames = []; // Creates a temp array to store the amount of frames
    // Loops through the frames required 
    for(let i = 0; i < Frame; i++){
      Frames.push(i); // Adds the frames into an array 
    }
  
    this.anims.create({
      key: Key,
      frames: this.anims.generateFrameNumbers(Name,{frames:Frames}),
      frameRate: FrameRate,
      repeat: Repeat || 0, 
    }); 
  }
    
  // Adds the keys into the keys array 
  addKeys(Array){
    //Loops through the keybinds that you want to add to
    for (let i = 0; i < Array.length; i++) {
      //Creates a value in the keys array called the keys in the array 
      // Sets the value to the specific keys requested in the array 
      Keys[Array[i]] = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[Array[i].toUpperCase()]); 
    }
  }

  //Creates a custom function that adds an object
  //This function adds the object into a scene and places it in a specific position. 
  addObject(Name,Position,type){
    if(typeof(Position) != "object"){
      console.error(`Invalid position type | Expected Vector2 got ${typeof(Position)}`); 
      return undefined; 
    }

    //Checks if it has a type and if it has a specific type then it will add it to the respective arrays 
    
    //Sets the current object as a variable
    //Positions the sprite and sets the name 
    let CurrentObject = this.physics.add.image(Position.x,Position.y,Name); 
    CurrentObject.body.immovable = true; 
   // CurrentObject.setSize(190,30,true); 
    
    Obstacles.push(CurrentObject); // Pushes this object into the end of the array 
    
    return Obstacles[Obstacles.length - 1] // Returns the last element of the array which is the most recent object added 
  }

  //Creates a custom functions that loops through all the obstacles and sets their collision to the player 
  addCollision(Player,Objects){
    if(typeof(Objects) != "object"){
      console.error(`Invalid Parameter Objects | Expected Array got ${typeof(Objects)}`);
      return 
    }
 
    for(let i = 0; i < Objects.length; i++){
      //Phaser.Physics.Arcade.Collider(Player,Objects[i]); 
       this.physics.add.collider(Player, Objects[i]);
    }
  }
  
  //Checks if the player has collided with anything they aren't supposed to 
  checkCollision(Name){
    //Checks if the death animation is playing and if it is not then it will move the sprite off the screen
    if(this.DeathAnimation.anims.isPlaying == false){
      this.DeathAnimation.x = -100; 
      this.DeathAnimation.y = -100; 
    }
    
    //Checks if the name of this object is playerone 
    //Checking both players manually due to the game only ever requiring two players 
    if(Name.toLowerCase() == "playerone"){

      //Loops through all the red liquid to check if the player collides with it 
      for(let i = 0; i < RedObstacles.length; i++){
        let CurrentObstacle = RedObstacles[i]; // Sets a variable for the current obstacle 
        //Checks if the current obstacle is colliding with player 1 
     
        if(this.physics.world.overlap(Anim["playerOne"],CurrentObstacle) == true && this.DeathAnimation.anims.isPlaying == false){
          //Animates and removes a heart 
          this.deathAnim(this.Player1); 
          this.Player1.setPosition(new Vector2([57,90])); // Sets the position of the player back to spawn
          break;
        }
      }

      //Checks if the player touches the poison and if so then it will set the player's position back to spawn
      for(let i = 0; i < Poison.length; i++){
        let CurrentObstacle = Poison[i]; // Sets a variable for the current obstacle 
        //Checks if the current obstacle is colliding with player 1 
        if(this.physics.world.overlap(Anim["playerOne"],CurrentObstacle) == true){
          //Animates and removes a heart 
          this.deathAnim(this.Player1); 
          break;
          
        }
      }

    }
    else if(Name.toLowerCase() == "playertwo"){
     
      for(let i = 0; i < PurpleObstacles.length; i++){
        let CurrentObstacle = PurpleObstacles[i]; // Sets a variable for the current obstacle 
        //Checks if the current obstacle is colliding with player 1 
        if(this.physics.world.overlap(Anim["playerTwo"],CurrentObstacle) == true){
          this.deathAnim(this.Player2); 
          break; // Breaks the loop
        }
      }

      //Checks if the player touches the poison and if so then it will set the player's position back to spawn
      for(let i = 0; i < Poison.length; i++){
        let CurrentObstacle = Poison[i]; // Sets a variable for the current obstacle 
        //Checks if the current obstacle is colliding with player 2
        if(this.physics.world.overlap(Anim["playerTwo"],CurrentObstacle) == true){
          //Animates and removes a heart 
          this.deathAnim(this.Player2); // Creates and calls the death function
          break; // Breaks the loop
        }
      }
    }
    else{
    
      console.error(`Unable to detect collisions for ${Name}`); 
    }
  }

  //Animation function 
  //This animation function can only animate properties inside the body of a sprite. 
  createAnimation(Object,Property,Target,Speed,Delay,HasFade){
    var self = this; // Gets a reference to itself 
    setTimeout(function(){ // Sets a timeout to delay the recursive function 
    if(Object[Property] <= Target){// Checks if the object's y position has reached the target y position 
     Object[Property] += Speed; // Increments the y position y 2 pixels 

      //Checks if the fade parameter is true 
      //If so then fade the image as well 
      if(HasFade == true && Object.alpha >= 0){
        Object.alpha -= 0.2; 
      }
      
     self.createAnimation(Object,Property,Target,Speed,Delay,HasFade); //Calls itself
    }
  },Delay); // Waits for the delay 
  }

  //Creates a death function 
  //This function automatically creates a death animation and removes a life in the current scene [CALLS: createAnimation]
  deathAnim(Player){
    //Checks if the player has less than or zero 
    
    //Takes away one life from the value TotalLives 
    this.TotalLives -= 1; 
    
    //Animates the hearts moving down
    let LastHeart = Hearts[Hearts.length - 1]; //Gets the last heart added into the array
    this.createAnimation(LastHeart,"y",50,2,0,true); // Creates an animation 
    Hearts.pop(); // Removes a heart from the array 

    //Gets the player's position
    let CurrentPosition = Player.getPosition(); 
    
    this.DeathAnimation.x = CurrentPosition.x; // Sets the death animation to the player's x position 
    this.DeathAnimation.y = CurrentPosition.y; // Sets the death animation to the player's y position
    this.DeathAnimation.play("Die"); 

    if(Player.Name == "playerOne"){
      Player.setPosition(new Vector2([57,90])); // Sets the position of the player1 back to spawn
    }
    else
    {
      Player.setPosition(new Vector2([57,200])); // Sets the position of the player2 back to spawn
    }
    
  }

}// MAP 1 SCENE ENDS HERE \\

//MAP 2 SCENE STARTS HERE \\
class map2 extends Phaser.Scene{
  constructor(config){
    super(config)
  }
  // Local variables 
  Player1; // Stores the player 1
  Player2; // Stores the player 2 
  TimeText; // Holds the text for the time remaining 
  Timer; // Stores the timer for this level
  DeathAnimation; // Stores the death animation sprite 

  Player1FinishTime; // Stores the finish time for player1 
  Player2FinishTime; // Stores the finish time for player2 
  
  //Variable for the current lives for this stage 
  TotalLives = 5; 

  //Stores the number of hearts in this scene 
  Hearts = []; 

  preload(){
    // loads the background for the map 1 scene
    this.load.image("map2Background","../../ASSETS/SPRITES/MainSprites/gameBackground2.png");
    //gem collection effect
    this.load.audio("gemCol","../../ASSETS/EFFECTS/gemCollectSound.wav");
    // loads a black square to hold number of lives and timer for the game
    this.load.image("square1","../../ASSETS/SPRITES/MainSprites/blackSquare.jpg");
    // loads the end door for the map
    this.load.image("door2","../../ASSETS/SPRITES/MainSprites/door.png");
    // loads a purple square for poison
    this.load.image("purple","../../ASSETS/SPRITES/MainSprites/purple.png");
    // loads a green square for character 1
    this.load.image("poison","../../ASSETS/SPRITES/MainSprites/green.png");
    // loads a red square for character 2
    this.load.image("red","../../ASSETS/SPRITES/MainSprites/red.png");
    
    // loads a small brick
    this.load.image("smallBrick","../../ASSETS/SPRITES/MainSprites/brick3Small.png");
    // loads a medium brick
    this.load.image("medBrick","../../ASSETS/SPRITES/MainSprites/brick1Medium.png");
    // loads a large brick
    this.load.image("largeBrick","../../ASSETS/SPRITES/MainSprites/brick2Long.png");

    // loads the gem for character 1
    this.load.image("gem1","../../ASSETS/SPRITES/MainSprites/gem1.png");
    
    // loads the gem for character 2
    this.load.image("gem2","../../ASSETS/SPRITES/MainSprites/gem2.png");

    // loads the ninja star
    this.load.image("ninjaStar","../../ASSETS/SPRITES/MainSprites/ninjaStar.png");

    //Adds in the player spritesheets 
    //Loads player 1's character animations 
    this.load.spritesheet("RunR","../../ASSETS/SPRITES/Player1/RunRight.png",{frameWidth: 48,frameHeight: 48}); 
    this.load.spritesheet("RunL","../../ASSETS/SPRITES/Player1/RunLeft.png",{frameWidth: 48, frameHeight: 48}); 

    //Loads player 2's character animations 
    this.load.spritesheet("RunR1","../../ASSETS/SPRITES/Player2/RunRight.png",{frameWidth: 46,frameHeight: 46}); 
    this.load.spritesheet("RunL1","../../ASSETS/SPRITES/Player2/RunLeft.png",{frameWidth: 46, frameHeight: 46}); 

    //Loads sparkle animation for when characters collide with poison or leaves
    this.load.spritesheet("death","../../ASSETS/SPRITES/MainSprites/sparklesSpritesheet.png",{frameWidth: 41,frameHeight: 39}); 

    //Loads in the heart image 
    this.load.image("Heart","../../ASSETS/SPRITES/MainSprites/lives.png"); 
  }

  create(){
    this.physics.add.image(625,400,"map2Background"); // adds the background to our game

    gemCollection = this.sound.add("gemCol"); //adds the gem collection sound effect
    
    // BOTTOM LEVEL 
    this.addObject("smallBrick",new Vector2([57,780])); //Adds a small brick in our game
    this.addObject("smallBrick",new Vector2([173,780]));//Adds a small brick in our game
    this.addObject("smallBrick",new Vector2([289,780]));//Adds a small brick in our game
    this.addObject("smallBrick",new Vector2([405,780]));//Adds a small brick in our game
    this.addObject("smallBrick", new Vector2([521,780]));//Adds a small brick in our game
    this.addObject("smallBrick", new Vector2([637,780]));//Adds ඞ small brick in our game
    this.addObject("smallBrick", new Vector2([753,780]));//Adds a small brick in our game
    this.addObject("smallBrick", new Vector2([869,780]));//Adds a small brick in our game
    this.addObject("smallBrick", new Vector2([985,780])); //Adds a small brick in our game
    this.addObject("smallBrick", new Vector2([1101,780])); //Adds a small brick in our game
    this.addObject("smallBrick", new Vector2([1217,780])); //Adds a small brick in our game
    
    red5Gem2 = this.physics.add.image(869,730,"gem2").setDisplaySize(60,60);
    purp5Gem2 = this.physics.add.image(405,730,"gem1").setDisplaySize(60,60);
    Poison.push(this.physics.add.image(173,766,"poison").setDisplaySize(116, 20));
    endDoor2 = this.physics.add.image(55,720,"door2");

    // 4TH LEVEL
    this.addObject("medBrick", new Vector2([637,650])); 
    red4Gem2 = this.physics.add.image(570,595,"gem2").setDisplaySize(60,60);
    purp4Gem2 = this.physics.add.image(700,595,"gem1").setDisplaySize(60,60);

    // 3RD LEVEL 
    this.addObject("medBrick", new Vector2([94,530]));
    this.addObject("medBrick", new Vector2([284,530]));
    this.addObject("medBrick", new Vector2([474,530]));
    red3Gem2 = this.physics.add.image(35,470,"gem2").setDisplaySize(60,60);
    purp3Gem2 = this.physics.add.image(540,470,"gem1").setDisplaySize(60,60);
    Poison.push(this.physics.add.image(190,515,"poison").setDisplaySize(100, 20));
    Poison.push(this.physics.add.image(380,515,"poison").setDisplaySize(100, 20));
    
    

    // 2ND LEVEL
    this.addObject("medBrick", new Vector2([520,350]));
    this.addObject("medBrick", new Vector2([707,350]));
    red2Gem2 = this.physics.add.image(445,290,"gem2").setDisplaySize(60,60);
    purp2Gem2 = this.physics.add.image(782,290,"gem1").setDisplaySize(60,60);
    
    // TOP LEVEL
    this.addObject("medBrick", new Vector2([97,190]));
    this.addObject("medBrick", new Vector2([284,190]));
    this.addObject("medBrick", new Vector2([1152,190]));
    this.addObject("medBrick", new Vector2([965,190]));
    red1Gem2 = this.physics.add.image(35,130,"gem2").setDisplaySize(60,60);
    purp1Gem2 = this.physics.add.image(1215,130,"gem1").setDisplaySize(60,60);

    // ADDS THE NINJA STARS
    star1=this.physics.add.image(610,300,"ninjaStar").setDisplaySize(60, 50);
    star1.body.setSize(350, 350, 350, 350);
    star2=this.physics.add.image(770,650,"ninjaStar").setDisplaySize(60, 50);
    star2.body.setSize(350, 350, 350, 350);
    star3=this.physics.add.image(505,650,"ninjaStar").setDisplaySize(60, 50);
    star3.body.setSize(350, 350, 350, 350);
    star4=this.physics.add.image(193,480,"ninjaStar").setDisplaySize(60, 50);
    star4.body.setSize(350, 350, 350, 350);
    star5=this.physics.add.image(200,140,"ninjaStar").setDisplaySize(60, 50);
    star5.body.setSize(350, 350, 350, 350);
    star6=this.physics.add.image(1055,140,"ninjaStar").setDisplaySize(60, 50);
    star6.body.setSize(350, 350, 350, 350);
    star7=this.physics.add.image(380,480,"ninjaStar").setDisplaySize(60, 50);
    star7.body.setSize(350, 350, 350, 350);
    
    //adds the sparkles
    this.DeathAnimation = this.add.sprite(-100,-100);

    //animation set
    this.addAnimation("Die","death",32,60); //Adds the death animation 
    
    //Creates Player 1 
    Anim["playerOne"] = this.physics.add.sprite(100,100); 
    this.addAnimation("RunRight","RunR",3,30); 
    this.addAnimation("RunLeft","RunL",3,30); 

    this.Player1 = new Character(new Vector2([57,90]),"playerOne",{R: "RunRight",L: "RunLeft"});
    this.Player1.JumpPower = 260; // Tweaks the individual object's jump power 
    this.addCollision(Anim["playerOne"],Obstacles); 

    //Creates Player 2 
    Anim["playerTwo"] = this.physics.add.sprite(100,100); 
    this.addAnimation("RunRight1","RunR1",3,30); 
    this.addAnimation("RunLeft1","RunL1",3,30); 

    this.Player2 = new Character(new Vector2([1200,90]),"playerTwo",{R: "RunRight1",L: "RunLeft1"});
    this.Player2.JumpPower = 260; // Tweaks the individual object's jump power. 
    this.addCollision(Anim["playerTwo"],Obstacles); 
    
    //Adds in the keys 
    this.addKeys(["w","a","s","d","up","down","left","right"]); 

    //Adds in 5 hearts at the top left corner 
    this.Hearts[this.Hearts.length] = this.physics.add.image(25,35,"Heart"); 
    this.Hearts[this.Hearts.length - 1].setScale(0.05); 

    this.Hearts[this.Hearts.length] = this.physics.add.image(80,35,"Heart"); 
    this.Hearts[this.Hearts.length - 1].setScale(0.05); 

    this.Hearts[this.Hearts.length] = this.physics.add.image(135,35,"Heart"); 
    this.Hearts[this.Hearts.length - 1].setScale(0.05); 

    this.Hearts[this.Hearts.length] = this.physics.add.image(190,35,"Heart"); 
    this.Hearts[this.Hearts.length - 1].setScale(0.05); 

    this.Hearts[this.Hearts.length] = this.physics.add.image(245,35,"Heart"); 
    this.Hearts[this.Hearts.length - 1].setScale(0.05); 

    //Time text 
    this.Timer = new Timer(90); // Creates a new timer with 90 seconds 
    //this.Timer = new Timer(10); 
    this.TimeText = this.add.text(900,8,`Time Left: 30`,{fontFamily: "Papyrus",fontSize: 50}); 
    gemStatusMap2=this.add.text(1055,680,"Gems: 0",{fontFamily:"Papyrus",fontSize:50,color:"white"});
  }

  update(){                                 
    gemStatusMap2.text="Gems:"+gemCount2; //shows how many gems players have collected
    let TimePassed = this.Timer.timeRemaining(); 
    this.TimeText.text = `Time Left: ${TimePassed}s`; 

     //Checks if the player has no more lives and ends the scene 
    if(this.TotalLives <= 0){
     //Calls the function to store the time in an array 
      StoreTime(player1Name,"DNF",2); 
      StoreTime(player2Name,"DNF",2); 
      console.log("SAVED"); 
      game.scene.start("loseScene"); 
      game.scene.remove("map2");
    }
    
    //Check if the player's have run out of time
    if(this.Timer.checkTime() == false){
      //Checks if individual players finished the map or not
      //Saves player1 data
      if(this.Player1FinishTime == undefined){
        StoreTime(player1Name,"DNF",2); 
      }
      else
      {
        StoreTime(player1Name,"DNF",2);
      }

      //Saves player2 data
      if(this.Player2FinishTime == undefined){
        StoreTime(player2Name,"DNF",2); 
      }
      else
      {
        StoreTime(player2Name,"DNF",2); 
      }
      
      
      //Kills both players when time runs out 
      this.deathAnim(this.Player1);
      this.deathAnim(this.Player2); 

      //loads the leaderboard to end the scene
      game.scene.start("leaderboard"); 
      game.scene.remove("map2"); 
    }

    //PURPLE GEM
    //the following will detect collisions between first purple gem and character 1
    if(this.physics.world.overlap(purp1Gem2,Anim["playerOne"])==true)
    {
      gemCollection.play();
      gemCount2=gemCount2+1;
      purp1Gem2.destroy();
    }
    //the following will detect collisions between second purple gem and character 1
    if(this.physics.world.overlap(purp2Gem2,Anim["playerOne"])==true)
    {
      gemCollection.play();
      gemCount2=gemCount2+1;
      purp2Gem2.destroy();
    }
    //the following will detect collisions between third purple gem and character 1
    if(this.physics.world.overlap(purp3Gem2,Anim["playerOne"])==true)
    {
      gemCollection.play();
      gemCount2=gemCount2+1;
      purp3Gem2.destroy();
    }
    //the following will detect collisions between third purple gem and character 1
    if(this.physics.world.overlap(purp4Gem2,Anim["playerOne"])==true)
    {
      gemCollection.play();
      gemCount2=gemCount2+1;
      purp4Gem2.destroy();
    }
    //the following will detect collisions between third purple gem and character 1
    if(this.physics.world.overlap(purp5Gem2,Anim["playerOne"])==true)
    {
      gemCollection.play();
      gemCount2=gemCount2+1;
      purp5Gem2.destroy();
    }

    //RED GEM
    //the following will detect collisions between first red gem and character 2
    if(this.physics.world.overlap(red1Gem2,Anim["playerTwo"])==true)
    {
      gemCollection.play();
      gemCount2=gemCount2+1;
      red1Gem2.destroy();
    }
    //the following will detect collisions between second red gem and character 2
    if(this.physics.world.overlap(red2Gem2,Anim["playerTwo"])==true)
    {
      gemCollection.play();
      gemCount2=gemCount2+1;
      red2Gem2.destroy();
    }
    //the following will detect collisions between third red gem and character 2
    if(this.physics.world.overlap(red3Gem2,Anim["playerTwo"])==true)
    {
      gemCollection.play();
      gemCount2=gemCount2+1;
      red3Gem2.destroy();
    }
    //the following will detect collisions between third red gem and character 2
    if(this.physics.world.overlap(red4Gem2,Anim["playerTwo"])==true)
    {
      gemCollection.play();
      gemCount2=gemCount2+1;
      red4Gem2.destroy();
    }
    //the following will detect collisions between third red gem and character 2
    if(this.physics.world.overlap(red5Gem2,Anim["playerTwo"])==true)
    {
      gemCollection.play();
      gemCount2=gemCount2+1;
      red5Gem2.destroy();
    }
    //the following will detect collisions between the character and the stars for player1
    if(this.physics.world.overlap(star1,Anim["playerOne"]) == true){
      //Sets the position of the leaf and "Spawns" it somewhere else
      this.deathAnim(this.Player1); 
    }
    if(this.physics.world.overlap(Anim["playerOne"],star2) == true){
      //Sets the position of the leaf and "Spawns" it somewhere else
      this.deathAnim(this.Player1); 
    }
    if(this.physics.world.overlap(Anim["playerOne"],star3) == true){
      //Sets the position of the leaf and "Spawns" it somewhere else
      this.deathAnim(this.Player1); 
    }
    if(this.physics.world.overlap(Anim["playerOne"],star4) == true){
      //Sets the position of the leaf and "Spawns" it somewhere else
      this.deathAnim(this.Player1); 
    }
    if(this.physics.world.overlap(Anim["playerOne"],star5) == true){
      //Sets the position of the leaf and "Spawns" it somewhere else
      this.deathAnim(this.Player1); 
    }
    if(this.physics.world.overlap(Anim["playerOne"],star6) == true){
      //Sets the position of the leaf and "Spawns" it somewhere else
      this.deathAnim(this.Player1); 
    }
    if(this.physics.world.overlap(Anim["playerOne"],star7) == true){
      //Sets the position of the leaf and "Spawns" it somewhere else
      this.deathAnim(this.Player1); 
    }

    //the following will detect collisions between the character and the stars for player2
    if(this.physics.world.overlap(star1,Anim["playerTwo"]) == true){
      //Sets the position of the leaf and "Spawns" it somewhere else
      this.deathAnim(this.Player2); 
    }
    if(this.physics.world.overlap(Anim["playerTwo"],star2) == true){
      //Sets the position of the leaf and "Spawns" it somewhere else
      this.deathAnim(this.Player2); 
    }
    if(this.physics.world.overlap(Anim["playerTwo"],star3) == true){
      //Sets the position of the leaf and "Spawns" it somewhere else
      this.deathAnim(this.Player2); 
    }
    if(this.physics.world.overlap(Anim["playerTwo"],star4) == true){
      //Sets the position of the leaf and "Spawns" it somewhere else
      this.deathAnim(this.Player2); 
    }
    if(this.physics.world.overlap(Anim["playerTwo"],star5) == true){
      //Sets the position of the leaf and "Spawns" it somewhere else
      this.deathAnim(this.Player2); 
    }
    if(this.physics.world.overlap(Anim["playerTwo"],star6) == true){
      //Sets the position of the leaf and "Spawns" it somewhere else
      this.deathAnim(this.Player2); 
    }
    if(this.physics.world.overlap(Anim["playerTwo"],star7) == true){
      //Sets the position of the leaf and "Spawns" it somewhere else
      this.deathAnim(this.Player2); 
    }

    //Adds in the times for the players
    if(this.physics.world.overlap(endDoor2,Anim["playerOne"])==true)
    {
      this.Player1FinishTime=(this.Timer.MaxTime - this.Timer.timeRemaining());
      StoreTime(player1Name,this.Player1FinishTime,2); 
    }

    if(this.physics.world.overlap(endDoor2,Anim["playerTwo"])==true)
    {
      this.Player2FinishTime=(this.Timer.MaxTime - this.Timer.timeRemaining());
      StoreTime(player2Name,this.Player2FinishTime,2); 
    }
    
    //checks if both players reach the end door and if they do, then it take you to the leaderboard
    if(this.physics.world.overlap(endDoor2,Anim["playerOne"])==true){
      if(this.physics.world.overlap(endDoor2,Anim["playerTwo"])==true){
        game.scene.start("leaderboard"); 
        game.scene.remove("map2");
      }
    }
    
    //TEXT
    map2Header=this.add.text(500,10,"MAP 2",{fontFamily:"Papyrus",fontSize:50,color:"#bfffd2"}); //adds instruction message
    map2Header.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2); //sets shadow behind text

    //rotates the ninja stars
    rotation(star1);
    rotation(star2);
    rotation(star3);
    rotation(star4);
    rotation(star5);
    rotation(star6);
    rotation(star7);

    //Player 1 Controls 
    if(Keys.d.isDown == true){
      this.Player1.move("d"); 
    }

    if(Keys.w.isDown == true){
      this.Player1.move("w"); 
    } 
    else{
       this.Player1.IsJumping = false;  
     }

    if(Keys.a.isDown == true){
      this.Player1.move("a"); 
    }

    //Checks if both a and d keys are up then stop the player 
    
    if(Keys.a.isDown == false && Keys.d.isDown == false){
      this.Player1.move("Stop"); 
    } 
    
    //Update player1's current position 
    this.Player1.updatePosition(); 

    //Checks if player 1 has collided with any of the obstacles
    this.checkCollision(this.Player1.Name); // Calls the method CheckCollision to detect if player 1 has collided with things they aren't allowed to

    ////////////   Player 2 Controls  \\\\\\\\\\\\
    if(Keys.right.isDown == true){
      this.Player2.move("d"); 
    }

    if(Keys.left.isDown == true){
      this.Player2.move("a"); 
    } 
    
    if(Keys.up.isDown == true){
      this.Player2.move("w"); 
    }

    //Checks if both a and d keys are up then stop the player 
    if((Keys.left.isDown == false && Keys.right.isDown == false)){
      this.Player2.move("Stop"); 
    }
    
    //Updates the position for player 2 
    this.Player2.updatePosition(); 

    //Checks for collisions for player2
    this.checkCollision(this.Player2.Name); 
  }

  //CUSTOM FUNCTIONS \\
  
  //This function adds an animation 
  //Key - Name of your animation 
  //Name - The Name of your loaded animation 
  //Frame - How many frames are inisde your spritesheet 
  //FrameRate - How many frames per second you want to play the animation at 
  //Repeat (OPTIONAL) - How many times you want the animation to repeat
  addAnimation(Key,Name,Frame,FrameRate,Repeat){
    let Frames = []; // Creates a temp array to store the amount of frames
    // Loops through the frames required 
    for(let i = 0; i < Frame; i++){
      Frames.push(i); // Adds the frames into an array 
    }
  
    this.anims.create({
      key: Key,
      frames: this.anims.generateFrameNumbers(Name,{frames:Frames}),
      frameRate: FrameRate,
      repeat: Repeat || 0, 
    }); 
  }
    
  // Adds the keys into the keys array 
  addKeys(Array){
    //Loops through the keybinds that you want to add to
    for (let i = 0; i < Array.length; i++) {
      //Creates a value in the keys array called the keys in the array 
      // Sets the value to the specific keys requested in the array 
      Keys[Array[i]] = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[Array[i].toUpperCase()]); 
    }
  }

  //Creates a custom function that adds an object
  //This function adds the object into a scene and places it in a specific position. 
  addObject(Name,Position){
    if(typeof(Position) != "object"){
      console.error(`Invalid position type | Expected Vector2 got ${typeof(Position)}`); 
      return undefined; 
    }
      
    //Sets the current object as a variable
    //Positions the sprite and sets the name 
    let CurrentObject = this.physics.add.image(Position.x,Position.y,Name); 
    CurrentObject.body.immovable = true; 
   // CurrentObject.setSize(190,30,true); 
    
    Obstacles.push(CurrentObject); // Pushes this object into the end of the array 
    
    return Obstacles[Obstacles.length - 1] // Returns the last element of the array which is the most recent object added 
  }

  //Creates a custom functions that loops through all the obstacles and sets their collision to the player 
  addCollision(Player,Objects){
    if(typeof(Objects) != "object"){
      console.error(`Invalid Parameter Objects | Expected Array got ${typeof(Objects)}`);
      return 
    }
 
    for(let i = 0; i < Objects.length; i++){
      //Phaser.Physics.Arcade.Collider(Player,Objects[i]); 
       this.physics.add.collider(Player, Objects[i]);
    }
  }
  
  //Checks if the player has collided with anything they aren't supposed to 
  checkCollision(Name){
  
    
    //Checks if the death animation is playing and if it is not then it will move the sprite off the screen
    if(this.DeathAnimation.anims.isPlaying == false){
      this.DeathAnimation.x = -100; 
      this.DeathAnimation.y = -100; 
    }
    
    //Checks if the name of this object is playerone 
    //Checking both players manually due to the game only ever requiring two players 
    if(Name.toLowerCase() == "playerone"){
      //Checks if the player touches the poison and if so then it will set the player's position back to spawn
      for(let i = 0; i < Poison.length; i++){
        let CurrentObstacle = Poison[i]; // Sets a variable for the current obstacle 
        //Checks if the current obstacle is colliding with player 1 
        if(this.physics.world.overlap(Anim["playerOne"],CurrentObstacle) == true){
          //Animates and removes a heart 
          this.deathAnim(this.Player1); 
          break;
          
        }
      }

    }
    else if(Name.toLowerCase() == "playertwo"){
      //Checks if the player touches the poison and if so then it will set the player's position back to spawn
      for(let i = 0; i < Poison.length; i++){
        let CurrentObstacle = Poison[i]; // Sets a variable for the current obstacle 
        //Checks if the current obstacle is colliding with player 2
        if(this.physics.world.overlap(Anim["playerTwo"],CurrentObstacle) == true){
          //Animates and removes a heart 
          this.deathAnim(this.Player2); // Creates and calls the death function
          break; // Breaks the loop
        }
      }
    }
    else{
    
      console.error(`Unable to detect collisions for ${Name}`); 
    }
  }

  //Animation function 
  //This animation function can only animate properties inside the body of a sprite. 
  createAnimation(Object,Property,Target,Speed,Delay,HasFade){
    var self = this; // Gets a reference to itself 
    setTimeout(function(){ // Sets a timeout to delay the recursive function 
    if(Object[Property] <= Target){// Checks if the object's y position has reached the target y position 
     Object[Property] += Speed; // Increments the y position y 2 pixels 

      //Checks if the fade parameter is true 
      //If so then fade the image as well 
      if(HasFade == true && Object.alpha >= 0){
        Object.alpha -= 0.2; 
      }
      
     self.createAnimation(Object,Property,Target,Speed,Delay,HasFade); //Calls itself
    }
  },Delay); // Waits for the delay 
  }

  //Creates a death function 
  //This function automatically creates a death animation and removes a life in the current scene [CALLS: createAnimation]
  deathAnim(Player){
    
    //Takes away one life from the value TotalLives 
    this.TotalLives -= 1; 

    //Animates the hearts moving down
    let LastHeart = this.Hearts[this.Hearts.length - 1]; //Gets the last heart added into the array
    this.createAnimation(LastHeart,"y",50,2,0,true); // Creates an animation 
    this.Hearts.pop(); // Removes a heart from the array 

    //Gets the player's position
    let CurrentPosition = Player.getPosition(); 
    
    this.DeathAnimation.x = CurrentPosition.x; // Sets the death animation to the player's x position 
    this.DeathAnimation.y = CurrentPosition.y; // Sets the death animation to the player's y position
    this.DeathAnimation.play("Die"); 

    if(Player.Name == "playerOne"){
      Player.setPosition(new Vector2([57,90])); // Sets the position of the player1 back to spawn
    }
    else
    {
      Player.setPosition(new Vector2([1175,90])); // Sets the position of the player2 back to spawn
    }
    
  }
} // MAP 2 SCENE ENDS HERE \\

// LEADERBOARD SCENE STARTS HERE \\
class leaderboard extends Phaser.Scene{
  constructor(config){
    super(config)
  }
  //local Variables 
  SortedArray1; // Stores the sorted array for map 1
  SortedArray2; // Stores the sorted array for map 2
  preload(){
    this.load.image("leaderBackground","../../ASSETS/SPRITES/MainMenu/Background.png"); //adds the background
    this.load.image("leadText","../../IMAGES/leadertext.jpeg"); //adds a green square to store results
    this.load.image("leadText2","../../IMAGES/leadertext.jpeg"); //adds a green square to store results
  }

  create(){    
    
    this.physics.add.image(625,400,"leaderBackground"); 
    this.physics.add.image(340,440,"leadText").setDisplaySize(500, 560);; 
    this.physics.add.image(920,440,"leadText2").setDisplaySize(500, 560);; 

    pressEnTxt = this.add.text(450,757,"Click ENTER to play again!",{fontFamily: 'Papyrus',fontSize: 30,color: '#bfffd2'});
    pressEnTxt.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2); //sets a shadow behind the text

    enter=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    //Adds in the text for map 1
    map1LBTxt=this.add.text(115,200,"Map 1:",{fontFamily:"Arial",fontSize:40,color:"#bfffd2"});
    map2LBTxt=this.add.text(700,200,"Map 2:",{fontFamily:"Arial",fontSize:40,color:"#bfffd2"});

    console.log(PlayerTimes); 
    //Checks if the player 1 completed the levels or not 
    if(PlayerTimes[0][0].Time != "DNF" && PlayerTimes[0][1].Time != "DNF"){
      this.SortedArray1 = bubbleSort(PlayerTimes[0]); 
    }
    else
    {
      this.SortedArray1 = PlayerTimes[0];
    }

    //Checks if the player 2 completed the levels or not 
    if(PlayerTimes[1][0].Time != "DNF" && PlayerTimes[1][1].Time != "DNF"){
      this.SortedArray2 = bubbleSort(PlayerTimes[1]); 
    }
    else
    {
      this.SortedArray2 = PlayerTimes[1]; 
    }
    
    //MAP 1
    //Checks if either one of the players didn't make it to the finish and if so put the one who did make it on top
    if(PlayerTimes[0][0].Time == "DNF" && PlayerTimes[0][1].Time != "DNF"){ // Player 2 completed and player 1 did not 
      this.addText(`${this.SortedArray1[1].Name} | Time: ${this.SortedArray1[1].Time}s`,new Vector2([120,300]));
      this.addText(`${this.SortedArray1[0].Name} | Time: ${this.SortedArray1[0].Time}`,new Vector2([120,550]));
      return 
    }
    else if(PlayerTimes[0][0].Time != "DNF" && PlayerTimes[0][1].Time == "DNF"){// Player 1 completed and player 2 did not 
      this.addText(`${this.SortedArray1[0].Name} | Time: ${this.SortedArray1[0].Time}s`,new Vector2([120,300]));
      this.addText(`${this.SortedArray1[1].Name} | Time: ${this.SortedArray1[1].Time}`,new Vector2([120,550]));
    }  
    else if(PlayerTimes[0][0].Time == "DNF" && PlayerTimes[0][1].Time == "DNF"){
      this.addText(`${this.SortedArray1[0].Name} | Time: ${this.SortedArray1[0].Time}`,new Vector2([120,300]));
      this.addText(`${this.SortedArray1[1].Name} | Time: ${this.SortedArray1[1].Time}`,new Vector2([120,550]));
    }
    else // Both players finished
    {
      this.addText(`${this.SortedArray1[0].Name} | Time: ${this.SortedArray1[0].Time}s`,new Vector2([120,300]));
      this.addText(`${this.SortedArray1[1].Name} | Time: ${this.SortedArray1[1].Time}s`,new Vector2([120,550]));
    }

    //MAP 2
    //Checks if either one of the players didn't make it to the finish and if so put the one who did make it on top
    if(PlayerTimes[1][0].Time == "DNF" && PlayerTimes[1][1].Time != "DNF"){ // Player 2 completed and player 1 did not 
      this.addText(`${this.SortedArray2[1].Name} | Time: ${this.SortedArray2[1].Time}s`,new Vector2([700,300]));
      this.addText(`${this.SortedArray2[0].Name} | Time: ${this.SortedArray2[0].Time}`,new Vector2([700,550]));
      return 
    }
    else if(PlayerTimes[1][0].Time != "DNF" && PlayerTimes[1][1].Time == "DNF"){// Player 1 completed and player 2 did not 
      this.addText(`${this.SortedArray2[0].Name} | Time: ${this.SortedArray2[0].Time}s`,new Vector2([700,300]));
      this.addText(`${this.SortedArray2[1].Name} | Time: ${this.SortedArray2[1].Time}`,new Vector2([700,550]));
    }  
    else if(PlayerTimes[1][0].Time == "DNF" && PlayerTimes[1][1].Time == "DNF"){
      this.addText(`${this.SortedArray2[0].Name} | Time: ${this.SortedArray2[0].Time}`,new Vector2([700,300]));
      this.addText(`${this.SortedArray2[1].Name} | Time: ${this.SortedArray2[1].Time}`,new Vector2([700,550]));
    }
    else // Both players finished
    {
      this.addText(`${this.SortedArray2[0].Name} | Time: ${this.SortedArray2[0].Time}s`,new Vector2([700,300]));
      this.addText(`${this.SortedArray2[1].Name} | Time: ${this.SortedArray2[1].Time}s`,new Vector2([700,550]));
    }

    leaderboardHeader=this.add.text(450,30,"Results",{fontFamily:"Papyrus",fontSize:100,color:"#bfffd2"});
    leaderboardHeader.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2); //sets a shadow behind the text
  }

  update(){
    if(enter.isDown==true){
      window.location.reload();  
    }
  }

  //Creates a custom function that adds text onto the screen with a default font family 
  addText(Text,Vector2){
    //Basic type checking
    if(typeof(Vector2) != "object" || typeof(Vector2.x) != "number" || typeof(Vector2.y) != "number"){
      console.error(`Expected vector2 got ${typeof(Vector2)}`);
      return 
    }

    return this.add.text(Vector2.x,Vector2.y,Text,{fontFamily: 'Papyrus',fontSize: 30,color: '#bfffd2'});  // Returns the text object
  }
  
} // LEADERBOARD SCENE ENDS HERE \\

// LOSE SCENE STARTS HERE \\
class loseScene extends Phaser.Scene{
  constructor(config){
    super(config)
  }

  preload(){
    // loads the background for the lose scene
    this.load.image("loseBackground","../../ASSETS/SPRITES/loseScene/loseBg2.png");
  }

  create(){
    this.physics.add.image(625,400,"loseBackground"); // adds the background to our game
    
    loseTxt = this.add.text(300,-150,"You Lost",{fontFamily: 'Papyrus',fontSize: 150,color: '#bfffd2'});
    loseTxt.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2); //sets a shadow behind the text
    Animate(loseTxt,200,0); 

    pressEnTxt = this.add.text(225,-570,"Click ENTER to go back to the leaderboard!",{fontFamily: 'Papyrus',fontSize: 40,color: '#bfffd2'});
    pressEnTxt.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2); //sets a shadow behind the text
    Animate(pressEnTxt,390,0); 

    enter=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  }

  update(){
    if(enter.isDown==true){
      game.scene.start("leaderboard"); 
      game.scene.remove("loseScene");  
    }
  }
} // LOSE SCENE ENDS HERE \\

var config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  autoCenter: Phaser.Scale.CENTER_BOTH,
  width: 1250,//game world width
  height: 800,//game world height
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
      }
  }
}; 

// Creates a new game object and passes in the config object
var game = new Phaser.Game(config);
game.scene.add("mainMenu",mainMenu);
game.scene.add("map1",map1); 
game.scene.add("map2",map2); 
game.scene.add("leaderboard",leaderboard); 
game.scene.add("loseScene",loseScene)
game.scene.start("mainMenu"); 