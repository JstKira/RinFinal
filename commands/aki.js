const { cmd } = require("../lib/");
const eco = require('discord-mongoose-economy');
const { Aki } = require('aki-api');

let games = {}; // Store active Akinator games with user IDs as keys

cmd(
  {
    pattern: "المارد",
    desc: " لعبة المارد",
    category: "العاب",
  },
  async (Void, citel, text) => {
    if (!games[citel.sender]) {
      const region = 'ar'; // You can change the region if needed
      const aki = new Aki({ region });
      
      await aki.start();

      const question = aki.question;
      const answers = aki.answers;

      games[citel.sender] = {
        aki: aki
      };

      const questionText = `*سؤال:* ${question}\n\n*خيارات:*\n\n`;
      const optionsText = answers.map((answer, index) => `${index + 1}. ${answer}`).join("\n");

      citel.reply(`${questionText}${optionsText}`);
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
      // Check if the input is a valid number between 1 and 5
      const guess = citel.text; // Remove leading and trailing whitespace
      if (!/^[1-5]$/i.test(guess)) {
        citel.reply("الرجاء اختيار رقم صحيح بين 1 و 5 للإجابة على السؤال.");
        return;
      }

      const game = games[citel.sender];
      const aki = game.aki;

      // Convert the number to an index
      const index = parseInt(guess) - 1;

      await aki.step(index); // Pass the index to the Akinator API

      if (aki.progress >= 90) {
        const guessedName = await aki.win();
        citel.reply(`عرفتت! أعتقد أن الشخصية التي كنت تفكر فيها هي: *${guessedName}*`);
        delete games[citel.sender]; // Delete the game
        return;
      }

      const question = aki.question;
      const answers = aki.answers;

      const questionText = `*سؤال:* ${question}\n\n*خيارات:*\n\n`;
      const optionsText = answers.map((answer, index) => `${index + 1}. ${answer}`).join("\n");

      citel.reply(`${questionText}${optionsText}`);
    }
  }
);
