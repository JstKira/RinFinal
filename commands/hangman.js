const { cmd, parseJid, getAdmin, tlang } = require("../lib/");
const eco = require('discord-mongoose-economy')
const ty = eco.connect(mongodb);
const fs = require('fs');

// Read the hangman words from the JSON file
const hangmanWords = JSON.parse(fs.readFileSync('./lib/hangman.json'));

let games = {}; // Store active games with user IDs as keys

cmd(
  {
    pattern: "hangman",
    desc: "يلعب لعبة المشنقة",
    filename: __filename,
    category: "العاب",
  },
  async (Void, citel, text) => {
    if (!citel.isGroup) return citel.reply(tlang().group);
    if (games[citel.sender]) return citel.reply("لديك لعبة نشطة بالفعل!");

    const hangmanWord = hangmanWords[Math.floor(Math.random() * hangmanWords.length)];
    const hangmanState = Array(hangmanWord.length).fill("_");
    games[citel.sender] = {
      word: hangmanWord,
      state: hangmanState,
      incorrectGuesses: 0
    };

    const hangmanString = hangmanState.join(" ");
    const hangmanStatus = `حالة المشنقة: ${hangmanString}\n${"❌".repeat(games[citel.sender].incorrectGuesses)}${"⬛".repeat(10 - games[citel.sender].incorrectGuesses)}`;
    
    return citel.reply(hangmanStatus);
  }
);

cmd(
  {
    on: "text"
  },
  async (Void, citel, text) => {
    if (!citel.isGroup) return;
    if (!games[citel.sender]) return; // No active game for the user
    if (!/^([a-z]|[أ-ي])$/i.test(citel.text)) return;

    const guess = citel.text.toLowerCase();
    const game = games[citel.sender];

    if (game.word.includes(guess)) {
      // Update hangman state with correct guess
      for (let i = 0; i < game.word.length; i++) {
        if (game.word[i] === guess) {
          game.state[i] = guess;
        }
      }
    } else {
      // Increment incorrect guesses count
      game.incorrectGuesses++;
    }

    const hangmanString = game.state.join(" ");
    const hangmanStatus = `حالة المشنقة: ${hangmanString}\n${"❌".repeat(game.incorrectGuesses)}${"⬛".repeat(10 - game.incorrectGuesses)}`;

    await Void.sendMessage(citel.chat, {
      text: hangmanStatus,
    });

    // Check if the word has been guessed completely
    if (!game.state.includes("_")) {
      await eco.give(citel.sender, "secktor", 2000); // Reward the player
      await Void.sendMessage(citel.chat, {
        text: `تهانينا! لقد حزرت الكلمة بشكل صحيح وفزت بمكافأة قيمتها 2000💎.`,
      });
      delete games[citel.sender]; // Delete the game
      return;
    }

    // Check if the maximum number of incorrect guesses has been reached
    if (game.incorrectGuesses >= 10) {
      await Void.sendMessage(citel.chat, {
        text: `لقد انتهت محاولات اللعب، الكلمة الصحيحة كانت: ${game.word}`,
      });
      delete games[citel.sender]; // Delete the game
      return;
    }
  }
);
