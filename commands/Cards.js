const axios = require('axios');
const fs = require('fs-extra');
const { exec } = require('child_process');
const Card = require('./lib/database/Card.js');
const { tlang, getAdmin, prefix, Config, sck, fetchJson, runtime, cmd, getBuffer } = require('../lib');
let { dBinary, eBinary } = require('../lib/binary');

cmd({
  pattern: 'ارسل-بطاقة',
  desc: 'يرسل بطاقة عشوائية',
  category: 'بطاقات',
  owner: true,
  filename: __filename,
}, async (message, match, citel, text, { isCreator, Void }) => {
  // Check if the user is the owner of the bot
  if (!isCreator) {
    citel.reply(tlang().owner);
    return;
  }

  // Get a random card from the database
  const randomCard = await Card.findOne().skip(Math.floor(Math.random() * await Card.countDocuments()));

  // Check if a card is found
  if (!randomCard) {
    citel.reply('لا توجد بطاقات متاحة في الوقت الحالي');
    return;
  }

  // Download the photo
  const photoResponse = await axios.get(randomCard.photo, { responseType: 'arraybuffer' });
  const photoBuffer = Buffer.from(photoResponse.data, 'binary');

  // Save the photo locally
  const photoPath = './temp/photo.png';
  await fs.writeFile(photoPath, photoBuffer);

  // Send the photo as a reply with card details
  if (mime === 'imageMessage' || mime === 'stickerMessage') {
    let media = await Void.downloadAndSaveMediaMessage(citel.quoted);
    let name = await getRandom('.png');
    exec(`ffmpeg -i ${media} ${name}`, async (err) => {
      if (err) {
        console.error(err);
        return;
      }
      let buffer = fs.readFileSync(name);
      await Void.sendMessage(citel.chat, { image: buffer }, { quoted: citel });

      // Cleanup temporary files
      fs.unlinkSync(media);
      fs.unlinkSync(name);
    });
  } else {
    await citel.reply({ file: photoPath }, `اسم البطاقة: ${randomCard.name}\nTier: ${randomCard.tier}\nPrice: ${randomCard.price}`);
  }

  // Remove the temporary photo file
  await fs.unlink(photoPath);
});
