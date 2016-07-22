(function(){

var highscore = localStorage.getItem("highscore");
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 780;
canvas.height = 780;
document.body.appendChild(canvas);

// scope variables
var validKey;
var foodEaten;
var difficulty;
var walls;
var gameStarted = false;
var gamePaused = false;
var gameSpeed = 100;
var gameRunning;
var wallsOn = false;
var gameOver = false;
var scoreModifier = 1;
var direction;
var tempX = [];       // temporary array to store X values
var tempY = [];

//  GET ALL THE IMAGES READY
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
  heroReady = true;
};
heroImage.src = "assets/cheza.png";

var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
  bgReady = true;
};
bgImage.src = "assets/background.png";

var foodReady = false;
var foodImage = new Image();
foodImage.onload = function () {
  foodReady = true;
};
foodImage.src = "assets/block_yellow.png";

var burgerImage = new Image();
burgerImage.src = "assets/burger.gif";

var pauseImage = new Image();
pauseImage.src = "assets/paused.jpg";

var hero = {
	speed: 800, // movement in pixels per second
};
var food = {
  x: 32 + (Math.random() * (canvas.width - 64)),
  y: 32 + (Math.random() * (canvas.height - 64))
};
var $snakeBody = [{
  x: hero.x,
  y: hero.y
}];   // the first element of snake Body is equal to our characters x and y values.


var updateMultiplier = function() {
  difficulty = $( "input:radio[name=difficulty]:checked" ).val();
  walls = $( "input:radio[name=walls]:checked" ).val();

  if (walls === "on") {
    scoreModifier = 1.5;
  } else {
    scoreModifier = 1;
  }

  if (difficulty === "easy") {
    scoreModifier = scoreModifier * 0.75;
  }

  if (difficulty === "hard") {
    scoreModifier = scoreModifier * 1.25;
  }

  $('.score-multiplier').html(scoreModifier);
  $('.score-multiplier').css ("font-size", (scoreModifier * 30));
  console.log(scoreModifier);
};


var updateDifficulty = function () {
  if (walls === "on") {
    wallsOn = true;
  } else {
    wallsOn = false;
  }

  if (difficulty === "easy") {
    gameSpeed = 400; // Refresh screen every 400 ms
  }

  if (difficulty === "normal") {
    gameSpeed = 100;
  }

  if (difficulty === "hard") {
    gameSpeed = 50;
  }
};



// GAME OVER SCREEN
var showScore = function() {
  clearInterval(gameRunning);

    ctx.globalAlpha = "0.5";
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,800,800);

    ctx.globalAlpha = "1";
    ctx.font = "100px Orbitron";
    ctx.strokeStyle = "#FFF";
    ctx.strokeText("YOU LOSE", 90,175);

    ctx.font = "30px verdana";
    ctx.strokeStyle = "#FFF";
    ctx.strokeText("You scored " + points() + " points!", 200,350);

    if (points() > highscore) {
      highscore = points();
      localStorage.setItem("highscore", highscore);
    }
    ctx.font = "30px verdana";
    ctx.strokeStyle = "#FFF";
    ctx.strokeText("Your high score is " + highscore + " points.", 135,450);

    ctx.font = "22px verdana";
    ctx.strokeStyle = "#FFF";
    ctx.strokeText("Press Space or Tap the Screen to Play Again", 150, 600);

    ctx.font = "19px verdana";
    ctx.strokeStyle = "#FFF";
    ctx.strokeText("Press Q to Change Difficulty", 260, 660);
};




var resetFood = function () {
  var tempFoodX = 32 + (Math.random() * (canvas.width - 64));                   // MAKE A RANDOM X VALUE
  var tempFoodY = 32 + (Math.random() * (canvas.height - 64));                  // MAKE A RANDOM Y VALUE
  var foodTouching;

    for (var i = 1; i < $snakeBody.length; i++) {         // CHECK IF THESE RANDOM VALUES ARE TOUCHING EACH PART OF THE BODY
      if (
        tempFoodX <= ($snakeBody[i].x + 25) &&
        $snakeBody[i].x <= (tempFoodX + 25) &&
        tempFoodY<= ($snakeBody[i].y + 25) &&
        $snakeBody[i].y <= (tempFoodY + 25)
      ) {
        foodTouching = true;
      }
    }
    if (foodTouching) {
      console.log("tHE FOOD IS TOUCHING!!");
    }
	food.x = tempFoodX;                                                        // MOVE THE FOOD TO THE NEW X AND Y VALUE
	food.y = tempFoodY;
  addSnakeBody(2);
};

var snakeCalcX = function(i,e) {
  if (i !== 0){
  var result;
              switch(direction) {
                  case "up":
                      result = $snakeBody[i-1].x;
                      break;
                  case "down":
                      result = $snakeBody[i-1].x;
                      break;
                  case "left":
                      result = $snakeBody[i-1].x +40;
                      break;
                  case "right":
                      result = $snakeBody[i-1].x -30;
                      break;
              }

    return result;
}
};



var snakeCalcY = function(i) {
  if (i !== 0){
  var result;
      switch(direction) {     // move the snake depending on which direction was pressed last
          case "up":
              result = $snakeBody[i-1].y + 35;
              break;
          case "down":
              result = $snakeBody[i-1].y -35;
              break;
          case "left":
              result = $snakeBody[i-1].y +5;
              break;
          case "right":
              result = $snakeBody[i-1].y +5;
              break;
      }
    return result;
}
};



function addSnakeBody(amount) {
  for (var i = 0; i < amount; i++) {
    var snakeLength = $snakeBody.length;
    var $newSnakePart = {x: snakeCalcX(snakeLength), y:snakeCalcY(snakeLength)};        // MAKE A NEW OBJECT WITH X AND Y VALUE THAT IS RELATIVE TO THE DIRECTION THE HEAD IS FACING
    $snakeBody.push($newSnakePart);                                 // ADD THIS NEW OBJECT TO THE SNAKE BODY ARRAY
  }
}


// DRAW THE SHIT UP

var render = function () {
  if (bgReady) {
		ctx.drawImage(bgImage, 0, 0, 780, 780);  // Make sure the background is drawn in every frame.
	}

  if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y, 33, 33);  // draw the head at its current x and y value
    $snakeBody[0].x = hero.x; // change the value of the first element in snake body (the head) to the hero value
    $snakeBody[0].y = hero.y; // do same for y value
	}

  if (foodReady) {
    ctx.drawImage(burgerImage, food.x, food.y, 30, 30);   // Draw the food, wherever we have decided its X and Y value should be, (a randomizer function)
  }

  for (var i = 1; i < $snakeBody.length; i++) {  // for the amount of objects in the snake body
    $snakeBody[i].x = tempX[i];      // set its position as the previous snake body
    $snakeBody[i].y = tempY[i];
    tempX[i] = $snakeBody[i - 1].x;   // store the position of the previous snake body
    tempY[i] = $snakeBody[i - 1].y;
    ctx.drawImage(foodImage, $snakeBody[i].x, $snakeBody[i].y, 30, 30); // draw the snake body at its new x and y value
  }
};

/// CHECK KEYDOWN EVENTS
addEventListener("keydown", function (e) {
    keyLastPressed = e.keyCode;

      if (gamePaused === false) {
            if ((keyLastPressed === 38) && (direction !== "down")) {  // if you press the Up key, and players direction is not currently down
              e.preventDefault();
              validKey = 38;                                          // change the key input to Up
            }
            if ((40 === keyLastPressed)&& (direction !== "up")) {
              e.preventDefault();
              validKey = 40; // down
            }
            if ((37 === keyLastPressed) && (direction !== "right")) {
              validKey = 37; // left
            }
            if ((39 === keyLastPressed) &&(direction !== "left")) {
              validKey = 39; // right
            }
          }

    if (81 === keyLastPressed) {
        if ((gameStarted === true) && (gameOver === true)) {
          $('.menu').show();
          stopGame();
          gameOver = false;
        }
    }
    // if you hit space bar, and the game is running, pause the game
    // if you hit space bar, and the game is over, restart the game.
    if (32 === keyLastPressed) {
      if (gameStarted === true) {
          if (gameOver === false) {
              if (gamePaused === false) {
                clearInterval(gameRunning);
                gamePaused = true;
                ctx.globalAlpha = 0.5;
                ctx.drawImage(pauseImage, 100, 270, 600, 200);
              } else {
                ctx.globalAlpha = 1;
                main();
                gamePaused = false;
              }
            } else {
              stopGame();
              gameOver = false;
              startGame();
      }
    }
  }
}, false);






/// CHECK GAME STATE EACH FRAME
var update = function (modifier) {
  // check the last player button movement input
  if (38 === validKey) {
    hero.y -= hero.speed * modifier;   // Change the Snake Heads Y value to set speed * the modifier we define later.
    direction = "up";                 // Store his current direction
  }
  if (40 === validKey) { // Player pressed down
    hero.y += hero.speed * modifier;
    direction = "down";
  }
  if (37 === validKey) { // Player pressed left
    hero.x -= hero.speed * modifier;
    direction = "left";
  }
  if (39 === validKey) { // Player pressed right
    hero.x += hero.speed * modifier;
    direction = "right";
  }

  // check if the player is touching the food
  if (
    hero.x <= (food.x + 32) &&            //If snake head is touching the food.
    food.x <= (hero.x + 32) &&
    hero.y <= (food.y + 32) &&
    food.y <= (hero.y + 32)
  ) {
    foodEaten = $snakeBody.length;
    resetFood();
  }

// check if the player touches the walls
  if (wallsOn === false) {
      if (hero.x >= canvas.width) {
          hero.x = 0;
      }

      if (hero.x < -1) {
        hero.x = canvas.width - 33;
      }

      if (hero.y >= canvas.width) {
          hero.y = 0;
      }

      if (hero.y < -1) {
        hero.y = canvas.height - 33;
      }
    }

  if (wallsOn) {
      if (hero.x >= canvas.width) {
          gameOver = true;
        }

      if (hero.x < -1) {
        gameOver = true;
      }

      if (hero.y >= canvas.height) {
        gameOver = true;
        }

      if (hero.y < -1) {
        gameOver = true;
      }
    }

// CHECK IF HERO TOUCHES HIS OWN BODY
    for (var i = 1; i < $snakeBody.length; i++) {
      if (
      hero.x <= ($snakeBody[i].x + 32) && hero.y <= ($snakeBody[i].y + 32) &&
      $snakeBody[i].x <= (hero.x + 32) && $snakeBody[i].y <= (hero.y + 32)
      ) {
        gameOver = true;
      }
    }
};

var stopGame = function () {
  $snakeBody.splice(1, $snakeBody.length);
  tempX.splice(0, tempX.length);
  tempY.splice(0, tempY.length);
  validKey = null;
  keyLastPressed = null;
  direction = "none";
  clearInterval(gameRunning);
};

var startGame = function() {
  $('.menu').hide();
  gameStarted = true;
  updateDifficulty();
  hero.x = 373;
  hero.y = 373;
  main();
};

var points = function (){
  var score = $snakeBody.length * scoreModifier * 55;
  return score;
};

// The main game loop
function main() {
 gameRunning = setTimeout(function() {
  	update(105/2250);
  	render();
  	// Request to do this again ASAP
    if (gameOver === false) {
  	window.setTimeout(requestAnimationFrame(main), 1);
    } else {
      showScore();
    }
  }, gameSpeed);
}
// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;



$( document ).ready(function() {
  $('.modifier').change(updateMultiplier);

  $('.play-button').click(function() {
    startGame();
  });

  updateMultiplier();
  var myElement = document.getElementById('myElement');

  ////////////
  ////////////
  // create a simple instance
  // by default, it only adds horizontal recognizers
  var mc = new Hammer(window);
  // listen to events...
  mc.on("swipeleft swiperight panup pandown tap", function(ev) {
    keyLastPressed = ev.type;

    if (gameOver === true && gameStarted === true) {
      if (ev.type === "tap") {
        stopGame();
        gameOver = false;
        startGame();
      }
    }

    if (ev.type === "swipe") {
      console.log("swiped up");
    }

    if (gamePaused === false) {
          if ((keyLastPressed === "panup") && (direction !== "down")) {  // if you press the Up key, and cherrys direction is not currently down
            console.log("swiped up");
            validKey = 38;                                          // change the key input to Up
          }
          if (("pandown" === keyLastPressed)&& (direction !== "up")) {
            console.log("swiped down");
            validKey = 40; // down
          }
          if (("swipeleft" === keyLastPressed) && (direction !== "right")) {
            validKey = 37; // left
          }
          if (("swiperight" === keyLastPressed) &&(direction !== "left")) {
            validKey = 39; // right
          }
        }
  });
});
})();
