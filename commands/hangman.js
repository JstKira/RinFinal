const { cmd } = require("../lib/");

cmd({
  pattern: 'hangman',
  desc: 'Start a game of hangman',
  category: 'Games',
  command: async (Void, citel) => {
    const sender = citel.sender;
    const reply = citel.reply;

    const Hangman = require('../lib/hangman');
    const words = require('../lib/words');

    const randomWord = getRandomWord();
    const hangman = new Hangman(randomWord);

    reply('Hangman Game Started!');
    reply('Guess the word by entering one letter at a time.');

    hangman.printWordState();

    const input = typeof citel.text === "string" ? citel.text.trim() : false;

    if (input && input[1] && input[1] === " ") {
      input = input[0] + input.slice(2);
    }

    if (input.length === 1) {
      const letter = input.trim();

      hangman.makeGuess(letter);

      if (hangman.maxGuesses === 0 || hangman.word.split('').every(char => hangman.guesses.has(char))) {
        // Game over, handle the end of the game
      }
    }
  }
});
