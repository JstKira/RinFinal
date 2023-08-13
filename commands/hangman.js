

const axios = require('axios');
const { tlnag, cmd, getBuffer, prefix, Config } = require('../lib');

const wordList = ['ناروتو', 'لوفي', 'غورين', 'كينغ', 'ميكاسا'];
const MAX_INCORRECT_GUESSES = 6;

function selectRandomWord() {
  const randomIndex = Math.floor(Math.random() * wordList.length);
  return wordList[randomIndex];
}

function initializeGameState() {
  const word = selectRandomWord();
  const guessedLetters = new Set();
  const incorrectGuesses = 0;
  return { word, guessedLetters, incorrectGuesses };
}

function displayGameState(word, guessedLetters, incorrectGuesses) {
  const maskedWord = word
    .split('')
    .map(letter => (guessedLetters.has(letter) ? letter : '_'))
    .join(' ');
  return `
    Word: ${maskedWord}
    Incorrect Guesses: ${incorrectGuesses}
  `;
}

function isGameWon(word, guessedLetters) {
  const wordLetters = new Set(word.split(''));
  for (const letter of wordLetters) {
    if (!guessedLetters.has(letter)) {
      return false;
    }
  }
  return true;
}

cmd({
  pattern: 'المشنقة',
  desc: 'Play Hangman',
  category: 'العاب',
  use: '',
}, async (Void, citel) => {
  const { word, guessedLetters, incorrectGuesses } = initializeGameState();
  const recipient = '<recipient_phone_number>'; // Replace with the recipient's phone number

  // Send the initial game state
  await sendWhatsAppMessage(displayGameState(word, guessedLetters, incorrectGuesses), recipient);

  async function handleGuess(guess) {
    if (!/^[a-zA-Z]+$/.test(guess)) {
      await sendWhatsAppMessage('تخمين خاطئ!😬 أعد المحاولة', recipient);
      return;
    }

    guess = guess.toLowerCase();

    if (guessedLetters.has(guess)) {
      await sendWhatsAppMessage('لقد خمنت هذا الحرف بالفعل، جرب حرف اخر', recipient);
      return;
    }

    guessedLetters.add(guess);

    if (word.includes(guess)) {
      if (isGameWon(word, guessedLetters)) {
        await sendWhatsAppMessage(`لقد فزت! 👌🏻، الكلمة هي: "${word}".`, recipient);
      } else {
        await sendWhatsAppMessage(displayGameState(word, guessedLetters, incorrectGuesses), recipient);
      }
    } else {
      incorrectGuesses++;

      if (incorrectGuesses === MAX_INCORRECT_GUESSES) {
        await sendWhatsAppMessage(`انتهت اللعبة! لقد خسرت 🥲، الكلمة هي: "${word}".`, recipient);
      } else {
        await sendWhatsAppMessage(displayGameState(word, guessedLetters, incorrectGuesses), recipient);
      }
    }
  }

  // Listen for user guesses
  tlnag.on('message', async message => {
    if (message.from === citel.from && message.to === citel.to && message.pattern === 'guess') {
      const guess = message.arguments[0];
      await handleGuess(guess);
    }
  });
});

async function sendWhatsAppMessage(message, recipient) {
  try {
    await axios.post('https://api.whatsapp.com/send', {
      message,
      recipient
    });
    console.log('Message sent successfully.');
  } catch (error) {
    console.error('Failed to send message:', error);
  }
}
