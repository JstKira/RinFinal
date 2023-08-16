const Hangman = require('../lib/hangman.js');
const words = require('../lib/words');

const { cmd } = require("../lib/");
const prefixRegex = /^!/; // Update the prefixRegex according to your command prefix

cmd.command = async (Void, citel) => {
  const sender = citel.sender;
  const reply = citel.reply;

  const randomWord = getRandomWord();
  const hangman = new Hangman(randomWord);

  reply('Hangman Game Started!');
  reply('Guess the word by entering one letter at a time.');

  hangman.printWordState();

  const input = typeof citel.text === "string" ? citel.text.trim() : false;

  if (input && input[1] && input[1] === " ") {
    input = input[0] + input.slice(2);
  }

  const isCommand = input ? prefixRegex.test(input[0]) : false;

  if (isCommand) {
    const letter = input.slice(1).trim();

    hangman.makeGuess(letter);

    if (hangman.maxGuesses === 0 || hangman.word.split('').every(char => hangman.guesses.has(char))) {
      // Game over, handle the end of the game
    }
  }
};

function getRandomWord() {
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
}

module.exports = cmd;
