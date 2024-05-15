const { cmd } = require("../lib/");
const eco = require('discord-mongoose-economy');
const fs = require('fs');
const AnimeName = require('../lib/database/animeName.js');


let games = {}; // Store active games with user IDs as keys

cmd(
  {
    pattern: "رتب",
    desc: "لعبة ترتيب اسماء الأنمي",
    category: "العاب",
  },
  async (Void, citel, text) => {
    if (!games[citel.sender]) {
      const randomAnimeName = await AnimeName.aggregate([{ $sample: { size: 1 } }]);
      const word = randomAnimeName[0].name;
      const scrambledWord = scrambleWord(word);
      const formattedScrambledWord = scrambledWord.split('').join(' ');
      
      const questionMessage = await citel.reply(`🧩 *رتب الحروف* 🧩\n\n*الحروف :*\n\n\`${formattedScrambledWord}\`\n\n*سيتم حذف اللعبة خلال 60 ثانية إذا ما جاوبت*`);
      
      games[citel.sender] = {
        word: word,
        scrambledWord: scrambledWord,
        questionMessageId: questionMessage.id // Store the ID of the question message
      };
      
      // Set a timer for 60 seconds
      setTimeout(() => {
        // Check if the game is still active
        if (games[citel.sender]) {
          delete games[citel.sender]; // Delete the game
          citel.reply(`*انتهى الوقت* \n> الجواب: *${word}*`);
        }
      }, 60000);
    } else {
      citel.reply("لديك لعبة نشطة بالفعل!");
    }
  }
);

cmd(
  {
    on: "text"
  },
  async (Void, citel, text) => {
    if (!games[citel.sender]) return; // No active game for the user
    const botNumber = await Void.decodeJid(Void.user.id)

    // Check if the message is a reply and the original message's sender is not the bot itself
    if (citel.quoted.sender !== botNumber) {
      return;
    } else {
      const guess = citel.text;
      const game = games[citel.sender];

      if (guess === game.word.toLowerCase()) {
        await eco.give(citel.sender, "secktor", 500); // Reward the player
        citel.reply(`😉 *صح عليك!* اضفت لك 500 بالمحفظة💰.`);
        delete games[citel.sender]; // Delete the game
      } else {
        citel.reply(`❌ *خطأ*`);
      }
    }
  }
);

function scrambleWord(word) {
  const characters = word.split('');
  for (let i = characters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [characters[i], characters[j]] = [characters[j], characters[i]];
  }
  return characters.join('');
}
