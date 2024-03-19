const { cmd, getRandomInt } = require('../lib');
const fs = require('fs');

// Load quiz questions from JSON file
const quizQuestions = JSON.parse(fs.readFileSync('./lib/quiz.json'));

let currentQuestionIndex = 0;
let userScore = 0;

// Create a command for starting the quiz
cmd({
    pattern: "س",
    desc: "بدء سؤال",
    category: "الألعاب",
    filename: __filename,
}, async (Void, citel) => {
    currentQuestionIndex = 0;
    userScore = 0;
    sendQuestion(citel);
});

// Function to send the next question
function sendQuestion(citel) {
    if (currentQuestionIndex < quizQuestions.length) {
        const questionObj = quizQuestions[currentQuestionIndex];
        const questionMessage = `${questionObj.question}\n${questionObj.options.join("\n")}`;
        citel.reply(questionMessage);
    } else {
        citel.reply(`تم الانتهاء من الاختبار! نقاطك: ${userScore}/${quizQuestions.length}`);
    }
}

// Create a command for answering quiz questions
cmd({
    pattern: "ج",
    desc: "أجب على السؤال (مثال: .ج أ)",
    category: "الألعاب",
    filename: __filename,
}, async (Void, citel, text) => {
    const userAnswer = text.trim().toUpperCase();
    const currentQuestion = quizQuestions[currentQuestionIndex];

    if (currentQuestion && userAnswer === currentQuestion.correctAnswer) {
        userScore++;
    }

    currentQuestionIndex++;
    sendQuestion(citel);
});
