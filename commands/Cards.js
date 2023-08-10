const axios = require('axios');
const fs = require('fs-extra');
const { exec } = require('child_process');
const Card = require('../lib/database/Card.js');
const { tlang, getAdmin, prefix, Config, sck, fetchJson, runtime, cmd, getBuffer } = require('../lib');
let { dBinary, eBinary } = require('../lib/binary');

const path = require('path');

cmd({
  pattern: 'ارسل-بطاقة',
  desc: 'يرسل بطاقة عشوائية',
  category: 'بطاقات',
  filename: __filename,
}, async (match, citel) => {
  try {
    // Get a random card from the database
    const randomCard = await Card.aggregate([{ $sample: { size: 1 } }]);

    // If no card is found, handle the error
    if (!randomCard || randomCard.length === 0) {
      citel.reply('لا توجد بطاقات متاحة في الوقت الحالي.');
      return;
    }

    const card = randomCard[0];

    // Build the caption for the photo
    const caption = `اسم البطاقة: ${card.name}\nتصنيف: ${card.tier}`;

    // Send the photo as an attachment with a caption
    await citel.reply({ photo: card.photo.buffer, caption });
  } catch (error) {
    console.error(error);
    citel.reply('حدث خطأ أثناء استرجاع البطاقة العشوائية.');
  }
});
//---------------------------------------------------------------------------------


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
  const [cardName, tier, photoLink] = text.split(' ');

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
