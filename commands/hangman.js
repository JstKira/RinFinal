const { cmd } = require("../lib/");
const Hangman = require('../lib/hangman');
const words = require('../lib/words');

const cmd = {
  pattern: 'hangman',
  desc: 'Start a game of hangman',
  category: 'Games'
};

cmd.command = async (Void, citel) => {
  const sender = citel.sender;
  const reply = citel.reply;

  const randomWord = getRandomWord();
  const hangman = new Hangman(randomWord);

  reply('Hangman Game Started!');
  reply('Guess the word by entering one letter at a time.');

  hangman.printWordState();

  citel.on('message', (message) => {
    if (message.sender === sender) {
      const letter = message.content.trim();

      hangman.makeGuess(letter);

      if (hangman.maxGuesses === 0 || hangman.word.split('').every(char => hangman.guesses.has(char))) {
        citel.removeAllListeners('message');
      }
    }
  });
};

function getRandomWord() {
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
}

module.exports = cmd;
