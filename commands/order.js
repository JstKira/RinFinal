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
    if (!citel.isGroup) return citel.reply(tlang().group);
    if (games[citel.sender]) return citel.reply("لديك لعبة نشطة بالفعل!");

    const word = wordList[Math.floor(Math.random() * wordList.length)];
    const scrambledWord = scrambleWord(word);
    games[citel.sender] = {
      word: word,
      scrambledWord: scrambledWord
    };

    return citel.reply(`الكلمة المختارة: ${scrambledWord}`);
  }
);

cmd(
  {
    on: "text"
  },
  async (Void, citel, text) => {
    if (!citel.isGroup) return;
    if (!games[citel.sender]) return; // No active game for the user

    const guess = citel.text.toLowerCase();
    const game = games[citel.sender];

    if (guess === game.word.toLowerCase()) {
      await eco.give(citel.sender, "secktor", 2000); // Reward the player
      await Void.sendMessage(citel.chat, {
        text: `تهانينا! لقد حزرت الشخصية بشكل صحيح وفزت ب 2000💎.`,
      });
      delete games[citel.sender]; // Delete the game
    } else {
      await Void.sendMessage(citel.chat, {
        text: `خطا , جرب مرة أخرى!`,
      });
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
