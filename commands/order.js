const { cmd, tlang } = require("../lib/");
const eco = require('discord-mongoose-economy');
const fs = require('fs');

// Read the word list from the JSON file
const wordList = JSON.parse(fs.readFileSync('./lib/names.json'));

let games = {}; // Store active games with user IDs as keys

cmd(
  {
    pattern: "رتب",
    desc: " لعبة ترتيب اسامي",
    category: "العاب",
  },
  async (Void, citel, text) => {
    if (!games[citel.sender]) {
      const word = wordList[Math.floor(Math.random() * wordList.length)];
      const scrambledWord = scrambleWord(word);
      games[citel.sender] = {
        word: word,
        scrambledWord: scrambledWord
      };
      const formattedWord = word.split('').join(' ');
      const formattedScrambledWord = scrambledWord.split('').join(' ');
      citel.reply(`🧩 *رتب الحروف* 🧩\n\n*الحروف :*\n\n\`${formattedScrambledWord}\``);
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

    const guess = citel.quoted.text.toLowerCase();
    const game = games[citel.sender];

    if (guess === game.word.toLowerCase()) {
      await eco.give(citel.sender, "secktor", 500); // Reward the player
      citel.reply(`🎉 *تهانينا!* لقد حزرت الاسم بشكل صحيح وفزت بمكافأة قيمتها 500💰.`);
      delete games[citel.sender]; // Delete the game
    } else {
      citel.reply(`❌ *خطأ*`);
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
