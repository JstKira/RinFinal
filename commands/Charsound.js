const { cmd, tlang, getBuffer } = require("../lib/");
const fs = require('fs');

// Read the character sounds from the JSON file
const characterSounds = JSON.parse(fs.readFileSync('./lib/charsound.json'));
const nicetitle = '🔊 من هي الشخصية؟ 🔊\nدقيقتين وينتهي السؤال';
const nicebody = "غومونريونغ |ㅤ ↻";
const nicepic = 'https://static.wikia.nocookie.net/thebreaker/images/2/2a/NW_Chapter_186.jpg';

let games = {}; // Store active games with user IDs as keys

cmd(
  {
    pattern: "صوت",
    desc: "يلعب لعبة الأصوات",
    category: "العاب",
  },
  async (Void, citel, text) => {
    if (!games[citel.sender]) {
      const characterSound = characterSounds[Math.floor(Math.random() * characterSounds.length)];
      const soundUrl = characterSound.sound;
      const characterName = characterSound.character;

      // Fetch the thumbnail buffer (replace 'nicepic' with the URL of the thumbnail image)
      const thumbnailBuffer = await getBuffer(nicepic);

      let mediaData = {
        audio: { url: soundUrl },
        mimetype: 'audio/mpeg',
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
        soundUrl: soundUrl,
        answeredCorrectly: false // Flag to check if the user has answered correctly
      };

      // Set a timer for 60 seconds
      setTimeout(() => {
        if (games[citel.sender] && !games[citel.sender].answeredCorrectly) {
          delete games[citel.sender]; // Delete the game
          citel.reply(`*انتهى الوقت*\n\nالجواب: ${characterName}`);
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
    const correctAnswer = game.characterName;

    if (guess === correctAnswer) {
      citel.reply(`🎉 *تهانينا!* لقد حزرت الشخصية بشكل صحيح.`);
      games[citel.sender].answeredCorrectly = true; // Set the flag to true
      delete games[citel.sender];
    } else {
      citel.reply(`❌ *خطأ*! حاول مرة ثانيه`);
    }
 // Delete the game
  }
);
