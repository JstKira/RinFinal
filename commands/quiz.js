const eco = require('discord-mongoose-economy');
const { cmd, tlang, getBuffer } = require("../lib/");
const fs = require('fs');

// Read the questions and answers from the JSON file
const qaData = JSON.parse(fs.readFileSync('./lib/quiz.json'));
const nicetitle = '❓دقيقة وينتهي السؤال❓';
const nicebody = "|| ◁ㅤ❚❚ㅤ▷||ㅤ ↻";
const nicepic = 'https://static.wikia.nocookie.net/thebreaker/images/2/2a/NW_Chapter_186.jpg';

let games = {}; // Store active games with user IDs as keys

cmd(
  {
    pattern: "سؤال",
    desc: "يلعب لعبة الأسئلة",
    category: "العاب",
  },
  async (Void, citel, text) => {
    if (!games[citel.sender]) {
      const questionData = qaData[Math.floor(Math.random() * qaData.length)];
      const question = questionData.question;
      const response = questionData.response;

      // Fetch the thumbnail buffer (replace 'nicepic' with the URL of the thumbnail image)
      const thumbnailBuffer = await getBuffer(nicepic);

      let mediaData = {
        text: `❓ ${question} ❓`,
        mimetype: 'text/plain',
        ptt: false,
        headerType: 1,
        contextInfo: {
          forwardingScore: 999,
          isForwarded: false,
          externalAdReply: {
            title: nicetitle, // Replace with your title
            body: nicebody, // Replace with your body text
            renderLargerThumbnail: true,
            thumbnail: thumbnailBuffer,
            mediaUrl: '',
            mediaType: 1,
            showAdAttribution: true
          }
        }
      };

     await Void.sendMessage(citel.chat, mediaData, { quoted: citel });

      games[citel.sender] = {
        question: question,
        response: response
      };

      // Set a timer for 60 seconds
      setTimeout(() => {
        if (games[citel.sender]) {
          delete games[citel.sender]; // Delete the game
          citel.reply("*انتهى الوقت*\n\n`الجواب:`" + $questionData.response);
        }
      }, 120000); // 120 seconds in milliseconds
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
    const game = games[citel.sender];

    // Check if the message is a reply and the original message's sender is not the bot itself
    if (citel.quoted.sender !== '966508206360@s.whatsapp.net') {
      return; // If there's no quoted message or if the sender doesn't match, do nothing
    }
    
    const guess = citel.text;
    const correctAnswer = game.response;

    if (guess === correctAnswer) {
      citel.reply(`🎉 *صححح عليك!*`);
      delete games[citel.sender];
    } else {
      citel.reply(`❌ *خطأ*! حاول مرة ثانية`);
    }
  }
);
