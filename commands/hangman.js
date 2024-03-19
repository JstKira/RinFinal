const { cmd } = require("../lib/");
cmd(
  {
    pattern: "hangman",
    desc: "يلعب لعبة الرجل المشنوق",
    category: "العاب",
  },
  async (Void, citel, text) => {
    if (!citel.isGroup) return citel.reply(tlang().group);
    let { prefix } = require('../lib')
    let words = ["programming", "javascript", "python", "nodejs", "typescript"];
    let randomIndex = Math.floor(Math.random() * words.length);
    let word = words[randomIndex];
    let guessedLetters = [];
    let attempts = 7;
    let hiddenWord = word.replace(/\w/g, "*");
    let message = `الكلمة: ${hiddenWord}\nتخمين الحروف: ${guessedLetters.join(", ")}\nالمحاولات المتبقية: ${attempts}`;
    citel.reply(message);
    while (attempts > 0 && hiddenWord.includes("*")) {
      const response = await Void.waitForMessage(citel.chat, { quoted: citel });
      let guess = response.text.toLowerCase();
      if (guess.length !== 1 || !/[a-z]/.test(guess)) {
        citel.reply("اختر حرفًا واحدًا فقط.");
        continue;
      }
      if (guessedLetters.includes(guess)) {
        citel.reply("لقد تم تخمين هذا الحرف بالفعل.");
        continue;
      }
      guessedLetters.push(guess);
      if (word.includes(guess)) {
        hiddenWord = word.split('').map(letter => guessedLetters.includes(letter) ? letter : "*").join('');
      } else {
        attempts--;
      }
      message = `الكلمة: ${hiddenWord}\nتخمين الحروف: ${guessedLetters.join(", ")}\nالمحاولات المتبقية: ${attempts}`;
      citel.reply(message);
    }
    if (!hiddenWord.includes("*")) {
      return citel.reply("أحسنت! لقد حززت.");
    } else {
      return citel.reply(`لقد خسرت. الكلمة الصحيحة كانت ${word}.`);
    }
  }
);
