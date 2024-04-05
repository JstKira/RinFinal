const { cmd } = require("../lib/");
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
      const formattedScrambledWord = scrambledWord.split('').join(' ');
      
      const questionMessage = await citel.reply(`🧩 *رتب الحروف* 🧩\n\n*الحروف :*\n\n\`${formattedScrambledWord}\`\n\n*سيتم حذف اللعبة خلال 60 ثانية اذا ما جاوبت*`);
      
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
          questionMessage.delete(); // Delete the question message
          citel.reply("*انتهى الوقت*");
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
if (citel.quoted.sender !== '966508206360@s.whatsapp.net') {
    return;
} else {
    const guess = citel.text;
    const game = games[citel.sender];

    if (guess === game.word.toLowerCase()) {
        await eco.give(citel.sender, "secktor", 500); // Reward the player
        citel.reply(`🎉 *تهانينا!* لقد حزرت الاسم بشكل صحيح وفزت بمكافأة قيمتها 500💰.`);
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
