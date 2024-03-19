const { cmd, parseJid, getAdmin, tlang } = require("../lib/");
const eco = require('discord-mongoose-economy')
const ty = eco.connect(mongodb);
const fs = require('fs');

// Read the hangman words from the JSON file
const hangmanWords = JSON.parse(fs.readFileSync('./lib/hangman.json'));

let hangmanWord;
let hangmanState;
let hangmanIncorrectGuesses;
let maxIncorrectGuesses = 6;

function startNewGame() {
  // Select a random word from the hangmanWords array
  hangmanWord = hangmanWords[Math.floor(Math.random() * hangmanWords.length)];
  hangmanState = Array(hangmanWord.length).fill("_");
  hangmanIncorrectGuesses = 0;
}

function deleteGame() {
  hangmanWord = null;
  hangmanState = null;
  hangmanIncorrectGuesses = null;
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
    
    startNewGame();
    
    const hangmanString = hangmanState.join(" ");
    const hangmanStatus = `حالة المشنقة: ${hangmanString}\n${"❌".repeat(hangmanIncorrectGuesses)}${"⬛".repeat(maxIncorrectGuesses - hangmanIncorrectGuesses)}`;
    
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

    if (!hangmanWord) return citel.reply("لا يوجد لعبة مشنقة جارية حاليًا. استخدم .hangman لبدء لعبة جديدة.");

    const guess = citel.text.toLowerCase();
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
    const hangmanStatus = `حالة المشنقة: ${hangmanString}\n${"❌".repeat(hangmanIncorrectGuesses)}${"⬛".repeat(maxIncorrectGuesses - hangmanIncorrectGuesses)}`;

    // Check if the word has been guessed completely
    if (!hangmanState.includes("_")) {
      await eco.give(citel.sender, "secktor", 2000); // Reward the player
      await Void.sendMessage(citel.chat, {
        text: `تهانينا! لقد حزرت الكلمة بشكل صحيح وفزت بمكافأة قيمتها 2000💎.`,
      });
      deleteGame(); // Reset game data
      return;
    }

    // Check if the maximum number of incorrect guesses has been reached
    if (hangmanIncorrectGuesses >= maxIncorrectGuesses) {
      await Void.sendMessage(citel.chat, {
        text: `لقد انتهت محاولات اللعب، الكلمة الصحيحة كانت: ${hangmanWord}`,
      });
      deleteGame(); // Reset game data
      return;
    }

    await Void.sendMessage(citel.chat, {
      text: hangmanStatus,
    });
  }
);
