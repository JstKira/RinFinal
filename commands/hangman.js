const { cmd, parseJid, getAdmin, tlang } = require("../lib/");
const eco = require('discord-mongoose-economy')
const ty = eco.connect(mongodb);
const fs = require('fs');

// Read the hangman words from the JSON file
const hangmanWords = JSON.parse(fs.readFileSync('./lib/hangman.json'));

let hangmanData = null; // Variable to store hangman game data
const maxIncorrectGuesses = 6; // Maximum allowed incorrect guesses

cmd(
  {
    pattern: "hangman",
    desc: "يلعب لعبة المشنقة",
    filename: __filename,
    category: "العاب",
  },
  async (Void, citel, text) => {
    if (!citel.isGroup) return citel.reply(tlang().group);
  

    // Select a random word from the hangmanWords array
    const hangmanWord = hangmanWords[Math.floor(Math.random() * hangmanWords.length)];
    const hangmanState = Array(hangmanWord.length).fill("_");

    hangmanData = {
      word: hangmanWord,
      state: hangmanState,
      incorrectGuesses: 0,
      maxIncorrectGuesses: maxIncorrectGuesses,
      chat: citel.chat
    };
    
    const hangmanString = hangmanState.join(" ");
    const hangmanStatus = `حالة المشنقة: ${hangmanString}\n${"❌".repeat(hangmanData.incorrectGuesses)}${"⬛".repeat(maxIncorrectGuesses - hangmanData.incorrectGuesses)}`;
    
    return citel.reply(hangmanStatus);
  }
);

cmd(
  {
    on: "text"
  },
  async (Void, citel, text) => {
    if (!citel.isGroup) return;

    if (!hangmanData) return citel.reply("لا يوجد لعبة مشنقة جارية حاليًا. استخدم .hangman لبدء لعبة جديدة.");

    if (!/^([a-z]|[أ-ي])$/i.test(citel.text)) return;

    const guess = citel.text.toLowerCase();
    if (hangmanData.word.includes(guess)) {
      // Update hangman state with correct guess
      for (let i = 0; i < hangmanData.word.length; i++) {
        if (hangmanData.word[i] === guess) {
          hangmanData.state[i] = guess;
        }
      }
    } else {
      // Update hangman state and increment incorrect guesses count
      hangmanData.incorrectGuesses++;
    }

    const hangmanString = hangmanData.state.join(" ");
    const hangmanStatus = `حالة المشنقة: ${hangmanString}\n${"❌".repeat(hangmanData.incorrectGuesses)}${"⬛".repeat(hangmanData.maxIncorrectGuesses - hangmanData.incorrectGuesses)}`;

    // Check if the word has been guessed completely or if the user ran out of attempts
    if (!hangmanData.state.includes("_") || hangmanData.incorrectGuesses >= hangmanData.maxIncorrectGuesses) {
      if (!hangmanData.state.includes("_")) {
        await eco.give(citel.sender, "secktor", 2000); // Reward the player for winning
        await Void.sendMessage(citel.chat, {
          text: `تهانينا! لقد حزرت الكلمة بشكل صحيح وفزت بمكافأة قيمتها 2000💎.`,
        });
      } else {
        await Void.sendMessage(citel.chat, {
          text: `لقد انتهت محاولاتك للتخمين. الكلمة الصحيحة هي: ${hangmanData.word}`,
        });
      }
      // Reset hangman game data
      hangmanData = null;
      return;
    }

    await Void.sendMessage(citel.chat, {
      text: hangmanStatus,
    });
  }
);
