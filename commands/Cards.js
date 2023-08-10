const axios = require('axios');
const fs = require('fs-extra');
const { exec } = require('child_process');
const Card = require('../lib/database/Card.js');
const { tlang, getAdmin, prefix, Config, sck, fetchJson, runtime, cmd, getBuffer } = require('../lib');
let { dBinary, eBinary } = require('../lib/binary');

cmd({
  pattern: 'ارسل-بطاقة',
  desc: 'يرسل بطاقة عشوائية',
  category: 'بطاقات',
  owner: true,
  filename: __filename,
}, async (match, citel, text, { isCreator }) => {
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




cmd({
  pattern: 'أضف-بطاقة',
  desc: 'يضيف بطاقة جديدة إلى قاعدة البيانات',
  category: 'بطاقات',
  owner: true,
  filename: __filename,
  usage: 'أضف-بطاقة <اسم البطاقة> <تصنيف> <رابط الصورة>',
}, async (match, citel, text, options) => {
  const { isCreator } = options;

  // Check if the user is the owner of the bot
  if (!isCreator) {
    citel.reply(tlang().owner);
    return;
  }

  // Parse the command arguments
  const [command, cardName, tier, photoLink] = text.split(' ');

  // Validate the arguments
  if (!cardName || !tier || !photoLink) {
    citel.reply('يرجى توفير جميع البيانات المطلوبة.');
    return;
  }

  try {
    // Download the image and store it as a buffer
    const response = await axios.get(photoLink, {
      responseType: 'arraybuffer',
    });
    const photoBuffer = Buffer.from(response.data, 'binary');

    // Create a new card object
    const newCard = new Card({
      name: cardName,
      tier,
      photo: photoBuffer,
    });

    // Save the new card to the database
    await newCard.save();

    citel.reply('تمت إضافة البطاقة بنجاح إلى قاعدة البيانات.');
  } catch (error) {
    console.error(error);
    citel.reply('حدث خطأ أثناء إضافة البطاقة إلى قاعدة البيانات.');
  }
});
