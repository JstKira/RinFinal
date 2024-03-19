const { cmd } = require("../lib/");
const eco = require('discord-mongoose-economy');
const { Aki } = require('aki-api');
let gis = require("async-g-i-s");
const axios = require('axios')
const fetch = require('node-fetch')
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

      citel.reply(`🧞 *لعبة المارد* 🧞\n\n${questionText}${optionsText}`);
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
      if (!/^[1-5]$/i.test(citel.text)) {
        citel.reply("الرجاء اختيار رقم صحيح بين 1 و 5 للإجابة على السؤال.");
        return;
      }

      const guess = citel.text;
      const game = games[citel.sender];
      const aki = game.aki;

      // Convert the number to an index
      const index = parseInt(guess) - 1;

      await aki.step(index); // Pass the index to the Akinator API

     if (aki.progress >= 90) {
        const guessedCharacter = await aki.win();
        console.log("Guessed character:", guessedCharacter); // Log the guessed character object
        const guessedName = guessedCharacter.name; // Access the name property
        console.log("Guessed name:", guessedName); // Log the guessed name
        if (guessedName) {
            // Styled caption
            const caption = `
 *اييييزي!* 
الشخصية اللي تفكر فيها هي:
*${guessedName}*
`;
            citel.reply("", {
              image: {
                url: guessedCharacter.absolute_picture_path,
              },
              caption: caption,
              quoted: citel,
            });
        } else {
            citel.reply("عذرا، لم أتمكن من التعرف على الشخصية.");
        }
        delete games[citel.sender]; // Delete the game
        return;
    } else {
        const question = aki.question;
        const answers = aki.answers;

        const questionText = `*سؤال:* ${question}\n\n*خيارات:*\n\n`;
        const optionsText = answers.map((answer, index) => `${index + 1}. ${answer}`).join("\n");

        citel.reply(`${questionText}${optionsText}`);
    }
  }
  }
);

