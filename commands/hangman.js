const { cmd, parseJid, getAdmin, tlang } = require("../lib/");
const eco = require('discord-mongoose-economy')
const ty = eco.connect(mongodb);
const fs = require('fs');

// Read the hangman words from the JSON file
const hangmanWords = JSON.parse(fs.readFileSync('./lib/hangman.json'));

// Object to store game data for each user
const hangmanGames = {};

function startNewGame(userId) {
  // Select a random word from the hangmanWords array
  const hangmanWord = hangmanWords[Math.floor(Math.random() * hangmanWords.length)];
  const hangmanState = Array(hangmanWord.length).fill("_");
  const hangmanGame = {
    word: hangmanWord,
    state: hangmanState,
    incorrectGuesses: 0
  };
  hangmanGames[userId] = hangmanGame;
}

function deleteGame(userId) {
  delete hangmanGames[userId];
}

cmd(
  {
    pattern: "hangman",
    desc: "يلعب لعبة المشنقة",
    filename: __filename,
    category: "العاب",
  },
  async (Void, citel, text) => {
    if (!citel.isGroup) return citel.reply(tlang().group);
    
    const userId = parseJid(citel.sender).id;

    // Check if the user already has an ongoing game
    if (hangmanGames[userId]) {
      return citel.reply("لديك لعبة مستمرة بالفعل.");
    }

    startNewGame(userId);
    
    const hangmanString = hangmanGames[userId].state.join(" ");
    const hangmanStatus = `حالة المشنقة: ${hangmanString}\n${"❌".repeat(hangmanGames[userId].incorrectGuesses)}${"⬛".repeat(10 - hangmanGames[userId].incorrectGuesses)}`;
    
    return citel.reply(hangmanStatus);
  }
);

cmd(
  {
    on: "text"
  },
  async (Void, citel, text) => {
    if (!citel.isGroup) return;

    if (!/^([a-z]|[أ-ي])$/i.test(citel.text)) return;

    const userId = parseJid(citel.sender).id;

    // Check if the user has an ongoing game
    if (!hangmanGames[userId]) return;

    const guess = citel.text.toLowerCase();
    const hangmanWord = hangmanGames[userId].word;
    const hangmanState = hangmanGames[userId].state;
    let hangmanIncorrectGuesses = hangmanGames[userId].incorrectGuesses;

    if (hangmanWord.includes(guess)) {
      // Update hangman state with correct guess
      for (let i = 0; i < hangmanWord.length; i++) {
        if (hangmanWord[i] === guess) {
          hangmanState[i] = guess;
        }
      }
    } else {
      // Update hangman state and increment incorrect guesses count
      hangmanIncorrectGuesses++;
    }

    const hangmanString = hangmanState.join(" ");
    const hangmanStatus = `حالة المشنقة: ${hangmanString}\n${"❌".repeat(hangmanIncorrectGuesses)}${"⬛".repeat(10 - hangmanIncorrectGuesses)}`;

    await Void.sendMessage(citel.chat, {
      text: hangmanStatus,
    });

    // Check if the word has been guessed completely
    if (!hangmanState.includes("_")) {
      await eco.give(citel.sender, "secktor", 2000); // Reward the player
      await Void.sendMessage(citel.chat, {
        text: `تهانينا! لقد حزرت الكلمة بشكل صحيح وفزت بمكافأة قيمتها 2000💎.`,
      });
      deleteGame(userId); // Delete the game data
      return;
    }

    // Check if the maximum number of incorrect guesses has been reached
    if (hangmanIncorrectGuesses >= 10) {
      await Void.sendMessage(citel.chat, {
        text: `لقد انتهت محاولات اللعب، الكلمة الصحيحة كانت: ${hangmanWord}`,
      });
      deleteGame(userId); // Delete the game data
      return;
    }
  }
);
