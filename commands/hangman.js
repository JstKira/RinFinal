const { cmd } = require("../lib/");
const words = require('../lib/words.js');

cmd({
  pattern: 'hangman',
  desc: 'Start a game of hangman',
  category: 'Games'
}, async (Void, citel) => {
  const chosenWord = words[Math.floor(Math.random() * words.length)].toLowerCase();
  let guessedLetters = [];
  let remainingGuesses = 6;
  let revealedWord = '';

  // Initialize the revealed word with dashes
  for (let i = 0; i < chosenWord.length; i++) {
    revealedWord += '-';
  }

  citel.reply('Welcome to Hangman! Guess the word by typing a letter.');

  while (remainingGuesses > 0 && revealedWord.includes('-')) {
    citel.reply(`\n${revealedWord}\nRemaining guesses: ${remainingGuesses}`);

    const response = await citel.sender.nextMessage();
    const guessedLetter = response.body.toLowerCase();

    if (guessedLetters.includes(guessedLetter)) {
      citel.reply(`You already guessed the letter "${guessedLetter}". Try again.`);
      continue;
    }

    guessedLetters.push(guessedLetter);

    if (chosenWord.includes(guessedLetter)) {
      // Update the revealed word with the correctly guessed letter
      let tempWord = '';
      for (let i = 0; i < chosenWord.length; i++) {
        if (chosenWord[i] === guessedLetter) {
          tempWord += guessedLetter;
        } else {
          tempWord += revealedWord[i];
        }
      }
      revealedWord = tempWord;

      citel.reply(`Good guess! The letter "${guessedLetter}" is in the word.`);
    } else {
      remainingGuesses--;

      citel.reply(`Oops! The letter "${guessedLetter}" is not in the word. Remaining guesses: ${remainingGuesses}`);
    }
  }

  if (remainingGuesses > 0) {
    citel.reply(`Congratulations! You guessed the word "${chosenWord}" correctly.`);
  } else {
    citel.reply(`Game over! The word was "${chosenWord}". Better luck next time.`);
  }
});
