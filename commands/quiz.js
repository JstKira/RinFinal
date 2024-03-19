const { cmd, getRandomInt } = require('../lib');
const fs = require('fs');
const eco = require('discord-mongoose-economy');

// Load quiz questions from JSON file
const quizQuestions = JSON.parse(fs.readFileSync('./lib/quiz.json'));

let currentQuestionIndex = 0;
let userScore = 0;
let currentGame = {}; // Store active quiz games with user IDs as keys

// Create a command to start the quiz when the user sends "س"
cmd(
  {
    pattern: "س",
    desc: "بدء سؤال",
    category: "الألعاب",
    filename: __filename,
  },
  async (Void, citel) => {
    // Reset current game state
    currentQuestionIndex = 0;
    userScore = 0;
    currentGame[citel.sender] = true;
    sendQuestion(citel);
  }
);

// Listen for text messages to answer quiz questions
cmd(
  {
    on: "text"
  },
  async (Void, citel, text) => {
    // Check if the user is in an active game
    if (currentGame[citel.sender]) {
        if (citel.quoted.sender !== '966508206360@s.whatsapp.net') {
    return;
} else {
      const guess = citel.text; // Convert input to lowercase for case-insensitive comparison
      const currentQuestion = quizQuestions[currentQuestionIndex];
      // Check if the user's guess matches the correct answer
      if (guess === currentQuestion.answer.toLowerCase()) {
        userScore++; // Increment user's score
        // Reward the player with some virtual currency (adjust as needed)
        await eco.give(citel.sender, "secktor", 500);
        citel.reply(`🎉 *تهانينا!* لقد أجبت بشكل صحيح وفزت بمكافأة قيمتها 500💰.`);
      } else {
        citel.reply(`❌ *خطأ!* الإجابة الصحيحة هي: ${currentQuestion.answer}`);
      }
      // Proceed to the next question or end the game if all questions are answered
      currentQuestionIndex++;
      if (currentQuestionIndex < quizQuestions.length) {
        sendQuestion(citel);
      } else {
        // End of quiz
        citel.reply(`تم الانتهاء من الاختبار! نقاطك: ${userScore}/${quizQuestions.length}`);
        delete currentGame[citel.sender]; // Remove the user from active games
      }
    }
  }
  }
  
);

// Function to send the next question
function sendQuestion(citel) {
  const questionObj = quizQuestions[currentQuestionIndex];
  const questionMessage = `${questionObj.question}\n${questionObj.options.join("\n")}`;
  citel.reply(questionMessage);
}
