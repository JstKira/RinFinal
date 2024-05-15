const { cmd, tlang, getBuffer } = require("../lib/");
const fs = require('fs');

// Read the character eyes from the JSON file
const characterEyes = JSON.parse(fs.readFileSync('./lib/eye.json'));
const nicetitle = 'احزر الشخصية، دقيقة فقط وينتهي السؤال';
const nicebody = "غومونريونغ |ㅤ ↻";
const nicepic = 'https://static.wikia.nocookie.net/thebreaker/images/2/2a/NW_Chapter_186.jpg';

let games = {}; // Store active games with user IDs as keys

cmd(
  {
    pattern: "عين",
    desc: "يلعب خمن العين ",
    category: "العاب",
  },
  async (Void, citel, text) => {
    if (!games[citel.sender]) {
      const characterEye = characterEyes[Math.floor(Math.random() * characterEyes.length)];
      const imageUrl = characterEye.img;
      const characterName = characterEye.name;

      // Fetch the thumbnail buffer (replace 'nicepic' with the URL of the thumbnail image)
      const thumbnailBuffer = await getBuffer(nicepic);

      let mediaData = {
        image: { url: imageUrl },
        mimetype: 'image/jpeg',
        ptt: true,
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
        characterName: characterName,
        imageUrl: imageUrl,
        answeredCorrectly: false // Flag to check if the user has answered correctly
      };

      // Set a timer for 120 seconds (2 minutes)
     
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
    const botNumber = await Void.decodeJid(Void.user.jid)

    // Check if the message is a reply and the original message's sender is not the bot itself
    if (citel.quoted.sender !== botNumber) {
      return; // If there's no quoted message or if the message is not from the bot itself, do nothing
    }
    
    const guess = citel.text;
    const correctAnswer = game.characterName;

    if (guess === correctAnswer) {
      citel.reply(`🎉 *تهانينا!* لقد حزرت الشخصية بشكل صحيح.`);
      games[citel.sender].answeredCorrectly = true; // Set the flag to true
      delete games[citel.sender];
    } else {
      citel.reply(`❌ *خطأ*! حاول مرة ثانيه`);
    }
    
    // Set a timer for 60 seconds (1 minute)
    setTimeout(() => {
      if (games[citel.sender] && !games[citel.sender].answeredCorrectly) {
        delete games[citel.sender]; // Delete the game
        citel.reply(`*انتهى الوقت*\nالجواب: ${game.characterName}`);
      }
    }, 60000); // 60 seconds in milliseconds
  }
);
