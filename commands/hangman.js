const { tlnag, cmd, getBuffer, prefix, Config } = require('../lib');

// Word list for the game
const wordList = ['ناروتو', 'لوفي', 'غورين', 'كينغ', 'ميكاسا'];

// Function to select a random word from the word list
function selectRandomWord() {
  const randomIndex = Math.floor(Math.random() * wordList.length);
  return wordList[randomIndex];
}

// Function to initialize the game state
function initializeGameState() {
  const word = selectRandomWord();
  const guessedLetters = new Set();
  const incorrectGuesses = 0;
  return { word, guessedLetters, incorrectGuesses };
}

// Function to display the current state of the game
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

// Function to check if the game has been won
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
  // Initialize the game state
  const { word, guessedLetters, incorrectGuesses } = initializeGameState();

  // Send the initial game state as a reply
  await citel.reply(displayGameState(word, guessedLetters, incorrectGuesses));

  // Function to handle user guesses
  async function handleGuess(guess) {
    // Ignore non-alphabetic characters
    if (!/^[a-zA-Z]+$/.test(guess)) {
      await citel.reply('تخمين خاطئ!😬 أعد المحاولة');
      return;
    }

    // Convert the guess to lowercase
    guess = guess.toLowerCase();

    // Check if the letter has already been guessed
    if (guessedLetters.has(guess)) {
      await citel.reply('لقد خمنت هذا الحرف بالفعل، جرب حرف اخر');
      return;
    }

    // Add the guessed letter to the set of guessed letters
    guessedLetters.add(guess);

    // Check if the guess is correct
    if (word.includes(guess)) {
      // Check if the game has been won
      if (isGameWon(word, guessedLetters)) {
        await citel.reply(` لقد فزت! 👌🏻، الكلمة هي: "${word}".`);
      } else {
        // Continue the game
        await citel.reply(displayGameState(word, guessedLetters, incorrectGuesses));
      }
    } else {
      // Incorrect guess
      incorrectGuesses++;

      // Check if the game has been lost
      if (incorrectGuesses === 6) {
        await citel.reply(`انتهت اللعبة! لقد خسرت 🥲، الكلمة هي: "${word}".`);
      } else {
        // Continue the game
        await citel.reply(displayGameState(word, guessedLetters, incorrectGuesses));
      }
    }
  }

  // Listen for user guesses
  if (citel.quoted) {
    const guess = citel.body;
    await handleGuess(guess);
  }
});
