const { cmd, parseJid, getAdmin, tlang } = require("../lib/");
const eco = require('discord-mongoose-economy')
const ty = eco.connect(mongodb);

const hangmanWord = "المشنقة"; // كلمة مثالية للعبة
let hangmanState = Array(hangmanWord.length).fill("_");
let hangmanIncorrectGuesses = 0;
const maxIncorrectGuesses = 6; // الحد الأقصى للتخمينات الخاطئة المسموح بها

cmd(
  {
    pattern: "hangman",
    desc: "يلعب لعبة المشنقة",
    filename: __filename,
    category: "العاب",
  },
  async (Void, citel, text) => {
    if (!citel.isGroup) return citel.reply(tlang().group);
    
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

    await Void.sendMessage(citel.chat, {
      text: hangmanStatus,
    });
  }
);
