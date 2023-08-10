const axios = require('axios')
const fs = require('fs-extra');
const { exec } = require('child_process')
const Card = require('./lib/database/Card.js');
 const { tlang, getAdmin, prefix, Config, sck, fetchJson, runtime,cmd,getBuffer } = require('../lib')
 let { dBinary, eBinary } = require("../lib/binary");
cmd({
  pattern: 'ارسل-بطاقة',
  desc: 'يرسل بطاقة عشوائية',
  category: 'بطاقات',
  owner: true,
  filename: __filename,
}, async (message, match, citel, text, { isCreator }) => {
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

  // Send the card details as a reply
  await message.replyWithPhoto({ source: randomCard.photo }, {
    caption: `اسم البطاقة: ${randomCard.name}\nTier: ${randomCard.tier}\nPrice: ${randomCard.price}`,
  });
});

