const { cmd, tlang, getBuffer } = require("../lib/");
const fs = require('fs');

// Read the character sounds from the JSON file
const characterSounds = JSON.parse(fs.readFileSync('./lib/charsound.json'));
const nicetitle = 'توقع الشخصية';
const nicebody = "|| ◁ㅤ❚❚ㅤ▷||ㅤ ↻";
const nicepic = 'https://static.wikia.nocookie.net/topstrongest/images/9/92/0035-022.jpg';

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
      const thumbnailBuffer = await getBuffer('nicepic');

      let mediaData = {
        audio: { url: soundUrl },
        mimetype: 'audio/mpeg',
        ptt: true,
        waveform: [99, 75, 25, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 25, 50, 75, 99, 75, 50, 25, 0],
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
            sourceUrl: 'niceurl', // Replace with your URL
            showAdAttribution: true
          }
        }
      };

      const questionMessage = await citel.reply(`🔊 *صوت الشخصية* 🔊\n\n*الشخصية:* ${characterName}\n\n*استمع إلى الصوت وحاول تخمين الشخصية!*\n *60 ثانية وينتهي السؤال*`);

      games[citel.sender] = {
        characterName: characterName,
        soundUrl: soundUrl,
        questionMessageId: questionMessage.id // Store the ID of the question message
      };

      // Set a timer for 60 seconds
      setTimeout(() => {
        if (games[citel.sender]) {
          delete games[citel.sender]; // Delete the game
          questionMessage.delete(); // Delete the question message
          citel.reply("*انتهى الوقت*");
        }
      }, 60000); // 60 seconds in milliseconds
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
    } else {
      citel.reply(`❌ *خطأ*! الشخصية الصحيحة هي: ${game.characterName}`);
    }

    delete games[citel.sender]; // Delete the game
  }
);
