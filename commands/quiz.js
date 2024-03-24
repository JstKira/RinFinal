const { cmd } = require('../lib');
const fs = require('fs');
const eco = require('discord-mongoose-economy');

// Load quiz questions from JSON file
const quizQuestions = JSON.parse(fs.readFileSync('./lib/quiz.json'));



// Store active quiz games with user IDs as keys
let currentGame = {};

// Function to generate a random integer within a specified range
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Create a command to start the quiz when the user sends "س"
cmd(
  {
    pattern: "س",
    desc: "بدء سؤال",
    category: "الألعاب",
    filename: __filename,
  },
  async (Void, citel) => {
    // Check if the user is already in an active game
    if (currentGame[citel.sender]) {
      citel.reply("لديك لعبة نشطة بالفعل!");
      return;
    }
    
    // Start a new game
    const questionObj = quizQuestions[getRandomInt(0, quizQuestions.length - 1)];
    const questionMessage = `${questionObj.question}\n${questionObj.options.join("\n")}`;
    citel.reply(questionMessage);
    
    // Mark the user as being in an active game
    currentGame[citel.sender] = true;
  }
);


// Listen for text messages to answer the quiz question
cmd(
  {
    on: "text"
  },
  async (Void, citel, text) => {
    // Check if the user is in an active game
    if (!currentGame[citel.sender]) return;
     if (citel.quoted.sender !== '966508206360@s.whatsapp.net') {
      return;
    } else {
    const guess = citel.text; // Convert input to lowercase for case-insensitive comparison
    const currentQuestion = quizQuestions[0]; // Only one question for each game
    
     // Check if the user's guess matches the correct answer
    if (guess === currentQuestion.answer.toLowerCase()) {
      // Reward the player with some virtual currency (adjust as needed)
      await eco.give(citel.sender, "secktor", 500);
      citel.reply(`🎉 *تهانينا!* لقد أجبت بشكل صحيح وفزت بمكافأة قيمتها 500💰.`);
    } else {
      citel.reply(`❌ *خطأ!* الإجابة الصحيحة هي: ${currentQuestion.answer}`);
    }
    
    // End the game after the user's response
    delete currentGame[citel.sender];
  }
);
