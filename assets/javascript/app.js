// Open Trivia DB Game //
// - No objects used in this code
// - Alerts are annoying but they stop (pause) game align with interval timer
// - A full game timer could be used, jumped on API for Trivia, needs some
// - CSS work, add menu to select categories, etc.

// Not clear on window.onload v. function ()
window.onload = function() {
   $("#submit-button").on("click", checkAnswer());
};

// Event listener for Start Game
$("#start-button").on("click", function() {
  $("#display-game").empty();
  $("#start-button").hide();
  resetGame();
  getNewQuestion();
});

// GLOBAL VARIABLES //
// ====================================== //
// Guess timer value
var guessTimer = 10;
// Timer interval 1 sec
var guessInterval;
// Object to store Open Triva DB response
var triviaResponse = {};
// Selected answer
var selValue = "";
// Number of wins
var correctGuesses = 0;
// Number of losses
var incorrectGuesses = 0;
// Number of rounds
var numberQuestions = 10;
// URL we need to query the Open Trivia DB
var queryURL = "https://opentdb.com/api.php?amount=1&category=11&difficulty=medium&type=multiple";
// Note: We're only requesting a single question at a time, we could ask for numberQuestions
// We could also add parameters for categories, genre, etc. 

// MAIN GAME FUNCTIONS //
// ====================================== //
// Start the Open Trivia DB Game
displayStartBoard();

// AJAX call to Open Trivia DB
function getNewQuestion() {
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    // Assign Open Trivia DB response to object
    triviaResponse = response;
    // Start guess timer
    startGuessTimer();
    // Call Display Question/Choices
    displayQuestionChoices();
  }); 
}
  // Check answer and score guess
  function checkAnswer() {
  $('#submit-button').click(function() {
    selValue = $('input[name=answer]:checked').val();
    if (selValue == triviaResponse.results[0].correct_answer) {
      correctGuesses++;
      alert("That's Correct!");
      checkScore();
    }
    else {
      incorrectGuesses++;
      alert("Sorry. That's incorrect.");
      checkScore();
    }
  });
}
// Check score see if game is over
function checkScore() {
  numberQuestions--;
  if (numberQuestions == 0) {
    // game over, show score, replay game
    console.log("Game Over");
    stopGuessTimer();
    $("#question-list").empty();
    $("#guess-timer").empty();
    displayScoreBoard();
  }
  else {
    getNewQuestion();
    displayScoreBoardLog();
  }   
}
// Reset game board
function resetGame() {
  guessTimer = 10;
  correctGuesses = 0;
  incorrectGuesses = 0;
  numberQuestions = 10;
  stopGuessTimer();
}

// TIMER FUNCTIONS //
// ====================================== //
// Guess countdown timer start
function startGuessTimer() {
  clearInterval(guessInterval);
  guessTimer = 10;
  $("#guess-timer").html("<h3> Countdown: " + guessTimer + "</h3>");
  guessInterval = setInterval(decrementGuessTimer, 1000);
}
// Guess countdown timer stop
function stopGuessTimer() {
  clearInterval(guessInterval);
}

// Guess countdown timer decrementer
function decrementGuessTimer() {
  guessTimer--;
  $("#guess-timer").html("<h3> Countdown: " + guessTimer + "</h3>");
  if (guessTimer === -1) {
    stopGuessTimer();
    alert("Time is up!");
    incorrectGuesses++;
    numberQuestions--;
    displayScoreBoardLog();
    getNewQuestion();
  }
}

// ALL DISPLAY FUNCTIONS //
// ====================================== //
// Display question and choices 
function displayQuestionChoices() {
  $("#submit-button").show();
  $("#question-list").empty();
  displayQuestion();
  var magicNumber = getRandomInt(0, triviaResponse.results[0].incorrect_answers.length);
  for (var i=0; i < triviaResponse.results[0].incorrect_answers.length; i++){
    if (magicNumber == i) {
      displayCorrectAnswer();
      i--;
      magicNumber=-999;
    }
    else {
      displayIncorrectAnswer(i);
    }
  }
  if (magicNumber == triviaResponse.results[0].incorrect_answers.length){
  displayCorrectAnswer();
  }
}
// Display trivia question
function displayQuestion() {
  $("#question-list").append(triviaResponse.results[0].question+"<p>");
}
// Display correct answer
function displayCorrectAnswer(){
  var a = $("<input>");
      a.attr("type", "radio");
      a.attr("name", "answer");
      a.attr("value", triviaResponse.results[0].correct_answer);
      $("#question-list").append(a);
      $("#question-list").append(" "+triviaResponse.results[0].correct_answer+"*<p>");
}
// Display incorrect answer
function displayIncorrectAnswer(i) {
  var a = $("<input>");
      a.attr("type", "radio");
      a.attr("name", "answer");
      a.attr("value", triviaResponse.results[0].incorrect_answers[i]);
      $("#question-list").append(a);
      $("#question-list").append(" "+triviaResponse.results[0].incorrect_answers[i]+"<p>");
}
  // Display start game board 
  function displayStartBoard() {
  $("#submit-button").hide();
  $("#display-game").append("<h3>Welcome to Open Trivia DB</h3>"+"<p>");
  $("#display-game").append("<h4>The API driven Trivia Game</h4>"+"<p>");
  $("#display-game").append("<p>Press *Start Game* to test your knowledge</p>"+"<p>");
}
// Display final score board 
function displayScoreBoard() {
  $("#start-button").show();
  $("#submit-button").hide();
  $("#display-game").append("<h3>Your final score</h3>"+"<p>");
  $("#display-game").append("Correct number of answers: "+correctGuesses+"<p>");
  $("#display-game").append("Incorrect number of answers: "+incorrectGuesses+"<p>");
}
// Console log score board 
function displayScoreBoardLog() {
  console.log(triviaResponse);
  console.log(selValue);
  console.log("Correct#:", correctGuesses);
  console.log("Incorrect#:", incorrectGuesses);
  console.log("Round#:", numberQuestions);
}
// Get random number between two values
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; 
  //The maximum is inclusive and the minimum is inclusive 
}
