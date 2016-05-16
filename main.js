// things to do
// ADD A MOVE QUEUE
// MAYBE ADD WASD
// MAKE A SCORE COUNTER
// add a lose screen
// add a difficult setting screen
// add a score calculator and score meter
// store score in local storage

// posssible allow player to set width
var highscore = localStorage.getItem("highscore");

var foodEaten;
var difficulty;
var walls;

gameStarted = false;


var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 780;
canvas.height = 780;
document.body.appendChild(canvas);

var gameSpeed = 100;
var gameRunning;
var wallsOn = false;
var gameOver = false;

var scoreModifier = 1;


//  GET ALL THE IMAGES READY



var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
  heroReady = true;
};
heroImage.src = "cheza.png";

var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
  bgReady = true;
};
bgImage.src = "https://raw.githubusercontent.com/lostdecade/simple_canvas_game/master/images/background.png";


var foodReady = false;
var foodImage = new Image();
foodImage.onload = function () {
  foodReady = true;
};
foodImage.src = "block_yellow.png";


var updateMultiplier = function() {
  difficulty = $( "input:radio[name=difficulty]:checked" ).val();
  walls = $( "input:radio[name=walls]:checked" ).val();
  console.log(difficulty);
  console.log(walls);

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
    gameSpeed = 400;
  }

  if (difficulty === "normal") {
    gameSpeed = 100;
  }

  if (difficulty === "hard") {
    gameSpeed = 50;
  }
};








var burgerImage = new Image();
burgerImage.src = "burger.gif";

var pauseImage = new Image();
pauseImage.src = "paused.jpg";


var hero = {
	speed: 800 // movement in pixels per second
};



var food = {};
// draw cherry

food.x = 32 + (Math.random() * (canvas.width - 64));
food.y = 32 + (Math.random() * (canvas.height - 64));


hero.x = 384;
hero.y = 384;

var $snakeBody = [{x: hero.x, y: hero.y}];   // the first element of snake Body is equal to our characters x and y values.



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
        ctx.strokeText("Press Space to Play Again", 250, 600);


        ctx.font = "19px verdana";
        ctx.strokeStyle = "#FFF";
        ctx.strokeText("Press Q to Change Difficulty", 260, 660);



};




var reset = function () {

  var tempFoodX = 32 + (Math.random() * (canvas.width - 64));                   // MAKE A RANDOM X VALUE
  var tempFoodY = 32 + (Math.random() * (canvas.height - 64));                  // MAKE A RANDOM Y VALUE
  var foodTouching;



                        for (var i = 1; i < $snakeBody.length; i++) {         // CHECK IF THESE RANDOM VALUES ARE TOUCHING EACH PART OF THE BODY
                          if (
                            tempFoodX <= ($snakeBody[i].x + 25)
                            && $snakeBody[i].x <= (tempFoodX + 25)
                            && tempFoodY<= ($snakeBody[i].y + 25)
                            && $snakeBody[i].y <= (tempFoodY + 25)

                          ) {
                            foodTouching = true;
                          }
                        }

                        if (foodTouching) {
                          console.log("tHE FOOD IS TOUCHING!!");
                        }


	food.x = tempFoodX;                                                        // MOVE THE FOOD TO THE NEW X AND Y VALUE
	food.y = tempFoodY;
  addSnakeBody();
  addSnakeBody();

};

var direction;

var snakeCalcX = function(i,e) {
  if (i === 0) {
  return hero.x ;
} else {
  var result;
              switch(direction) {
                  case "up":
                      result = $snakeBody[i-1].x;
                      break;
                  case "down":
                      result = $snakeBody[i-1].x;
                      break;
                      case "left":
                          result = $snakeBody[i-1].x + 40;
                          break;
                      case "right":
                        result = $snakeBody[i-1].x -30;
                        break;
              }

    return result;

}
};



var snakeCalcY = function(i,e) {
  if (i === 0) {
  var weed = "";
}  else {
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



var addSnakeBody = function () {
  var i = $snakeBody.length;
  var $newSnakePart = {x: snakeCalcX(i), y:snakeCalcY(i)};        // MAKE A NEW OBJECT WITH X AND Y VALUE THAT IS RELATIVE TO THE DIRECTION CHERRY IS FACING, THIS WILL BE OVERRIDDEN ANYWAY
  $snakeBody.push($newSnakePart);                                 // ADD THIS NEW OBJECT TO THE SNAKE BODY ARRAY
};



var tempX = [];       // temporary array to store an X value
var tempY = [];

// DRAW THE SHIT UP

var render = function () {
  if (bgReady) {
		ctx.drawImage(bgImage, 0, 0, 780, 780);  // Make sure the background is drawn in every frame.

	}
  if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y, 33, 33);  // Draw the hero
    $snakeBody[0].x = hero.x; // change the value of the snake heads stored X value to reflect his actual value
    $snakeBody[0].y = hero.y;  // same for Y value ^^
	}

  if (foodReady) {
    ctx.drawImage(burgerImage, food.x, food.y, 30, 30);   // Draw the food, wherever we have decided its X and Y value should be, (a randomizer function)
  }



  for (var i = 1; i < $snakeBody.length; i++) {  // for the amount of objects in the snake body

    $snakeBody[i].x = tempX[i];      // make the 1st snake bodys position equal to the 0st snake body
    $snakeBody[i].y = tempY[i];
    tempX[i] = $snakeBody[i - 1].x;   // store the position of the 0st snake body ( the hero )
    tempY[i] = $snakeBody[i - 1].y;
    ctx.drawImage(foodImage, $snakeBody[i].x, $snakeBody[i].y, 30, 30);      // draw the snake body where its x and y value have been set
  }


};










var gamePaused = false;
var keyLastPressed;
var validKey;

addEventListener("keydown", function (e) {
    keyLastPressed = e.keyCode;

      if (gamePaused === false) {
            if ((keyLastPressed === 38) && (direction !== "down")) {  // if you press the Up key, and cherrys direction is not currently down
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




// if you hit space bar, and the game is running, pause the game
// if you hit space bar, and the game is over, restart the game.



    if (81 === keyLastPressed) {
        if ((gameStarted === true) && (gameOver === true)) {
          $('.menu').show();
          stopGame();
          gameOver = false;
        }
    }



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




// Update game objects, this is essentially each game frame
var update = function (modifier) {
  $(".info").html(bodyValue);


  if (38 === validKey) { // Player pressed up
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

  if (
    hero.x <= (food.x + 32)               //If snake head is touching the food.
    && food.x <= (hero.x + 32)
    && hero.y <= (food.y + 32)
    && food.y <= (hero.y + 32)
  ) {
    foodEaten = $snakeBody.length;
    reset();
  }



// CHECK IF HERO TOUCHES THE WALLS OF THE CANVAS, MOVE HIM TO THE OTHER SIDE ACCORDINGLY.


          if (wallsOn === false) {
            if (hero.x >= 769) {
                hero.x = 0;
              }

            if (hero.x < -1) {
              hero.x = 780 - 33;
            }

            if (hero.y >= 769) {
                hero.y = 0;
              }

            if (hero.y < -1) {
              hero.y = 780 - 33;
            }
          }

          if (wallsOn) {
            if (hero.x >= 769) {
                gameOver = true;
              }

            if (hero.x < -1) {
              gameOver = true;
            }

            if (hero.y >= 769) {
              gameOver = true;
              }

            if (hero.y < -1) {
              gameOver = true;
            }
          }


// CHECK IF HERO TOUCHES HIS OWN BODY




  var currentScore = function () {
    var score;
    score = foodEaten*50;
    return score;
  };

  var bodyValue = function(){
    var message = "";
    for (var i = 0; i < $snakeBody.length; i++) {
      message = message + "X value is: " + $snakeBody[i].x + " Y value is: " + $snakeBody[i].y + "<br/>";
    }
    return message;
  };

  $(".info").html(bodyValue, currentScore);


  for (var i = 1; i < $snakeBody.length; i++) {
    if (
      hero.x <= ($snakeBody[i].x + 32)
      && $snakeBody[i].x <= (hero.x + 32)
      && hero.y <= ($snakeBody[i].y + 32)
      && $snakeBody[i].y <= (hero.y + 32)
    ) {

      gameOver = true;


    }
  }
};



//
// The main game loop
var main = function () {

 gameRunning = setTimeout(function() {
	update(105/2250);
	render();
	// Request to do this again ASAP
  if (gameOver === false) {
	window.setTimeout(requestAnimationFrame(main), 1);
} else {
  showScore();
}
}, gameSpeed);   //300 refresh and 256 speed,   200 refresh and 400 speed         (refresh rate / 1000) * speed = 80
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;




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





$( document ).ready(function() {
  $('.modifier').change(updateMultiplier);

  $('.play-button').click(function() {
    startGame();
    console.log("you clicked the play button");
  });

  updateMultiplier();
  var myElement = document.getElementById('myElement');

  // create a simple instance
  // by default, it only adds horizontal recognizers
  var mc = new Hammer(myElement);

  // listen to events...
  mc.on("panleft panright panup pandown tap press", function(ev) {
      myElement.textContent = ev.type +" gesture detected.";
  });
});
