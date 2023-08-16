const { tlnag, cmd, getBuffer, prefix, Config } = require('../lib');

cmd(
  {
    pattern: "المشنقة",
    desc: "لعبة المشنقة",
    category: "العاب",
    use: "",
  },
  async (Void, citel, match) => {
    // Check if the game is already assigned to a player
    if (gameState && gameState.player !== citel.sender) {
      await citel.reply('عذرًا، اللعبة معينة حاليًا لشخص آخر.');
      return;
    }

    // List of Arabic words for the game
    const words = ["تفاحة", "موزة", "برتقالة", "عنب", "فراولة"];

    // Select a random word from the list
    const word = words[Math.floor(Math.random() * words.length)];

    // Initialize the game state for the current player
    gameState = {
      word: word,
      guessedLetters: new Set(),
      incorrectGuesses: 0,
      player: citel.sender,
    };

    // Send the initial game state as a reply
    const initialMessage = await citel.reply(displayGameState(gameState));

    // Function to handle user guesses
    async function handleGuess(guess) {
      // Check if the game is assigned to the current player
      if (gameState.player !== citel.sender) {
        await citel.reply('عذرًا، اللعبة معينة حاليًا لشخص آخر.');
        return;
      }

      // Ignore non-alphabetic characters
      if (!/^[ء-ي]+$/.test(guess)) {
        await citel.reply('تخمين خاطئ! 😬 أعد المحاولة');
        return;
      }

      // Convert the guess to normalized form
      guess = guess.normalize("NFKD");

      // Check if the letter has already been guessed
      if (gameState.guessedLetters.has(guess)) {
        await citel.reply('لقد خمنت هذا الحرف بالفعل، جرب حرف آخر');
        return;
      }

      // Add the guessed letter to the set of guessed letters
      gameState.guessedLetters.add(guess);

      // Check if the guess is correct
      if (gameState.word.includes(guess)) {
        // Check if the game has been won
        if (isGameWon(gameState)) {
          await citel.reply(`لقد فزت! 👌🏻 الكلمة هي: "${gameState.word}".`);
          // Reset the game state
          gameState = null;
        } else {
          // Continue the game
          await citel.reply(displayGameState(gameState));
        }
      } else {
        // Incorrect guess
        gameState.incorrectGuesses++;

        // Check if the game has been lost
        if (gameState.incorrectGuesses === 6) {
          await citel.reply(`انتهت اللعبة! لقد خسرت 🥲 الكلمة هي: "${gameState.word}".`);
          // Reset the game state
          gameState = null;
        } else {
          // Continue the game
          await citel.reply(displayGameState(gameState));
        }
      }
    }

    // Listen for user guesses
    const followMessage = await citel.follow(initialMessage, async (message) => {
      const guess = message.body;
      await handleGuess(guess);
    });

    // Handle follow message errors
    followMessage.on('error', (error) => {
      console.error('Follow message error:', error);
    });

    // Function to display the game state
    function displayGameState(gameState) {
      const word = gameState.word;
      const guessedLetters = Array.from(gameState.guessedLetters);
      let display = "كلمة: ";

      for (const letter of word) {
        if (guessedLetters.includes(letter)) {
          display += `${letter} `;
        } else {
          display += "_ ";
        }
      }

      display += `\n\nعدد المحاولات الخاطئة: ${gameState.incorrectGuesses}/6`;

      return display;
    }
  }
);
