const mongoose = require('mongoose');
const axios = require('axios');
const { cmd, tlang } = require("../lib/");
const AnimeName = require('../lib/database/AnimeName.js');

// Replace the connection string with your own MongoDB URI
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Failed to connect to MongoDB:', err);
});

cmd({
  pattern: "اضافة-كت",
  desc: "Add a new anime name to the database",
  category: "للمالك",
  filename: __filename,
}, async (match, citel, text, { isCreator }) => {
  // Check if the user is the owner of the bot
  if (!isCreator) {
    citel.reply(tlang().owner);
    return;
  }

  // Extract the new anime name from the command message
  const newAnimeName = text.trim();

  // Check if the new anime name is provided
  if (!newAnimeName) {
    citel.reply('الرجاء تحديد اسم الشخصية.');
    return;
  }

  // Create a new AnimeName document and save it to the database
  const animeName = new AnimeName({
    name: newAnimeName,
  });
  try {
    await animeName.save();
    citel.reply(`تمت إضافة ${newAnimeName} إلى قاعدة البيانات.`);
  } catch (err) {
    console.error(err);
    citel.reply('حدث خطأ أثناء إضافة اسم الشخصية إلى قاعدة البيانات. يرجى المحاولة مرة أخرى.');
  }
});


//-----------------------------------------------
//-----------------------------------------------
cmd(
  {
    on: "text"
  },
  async (Void, citel, text) => {
    // Fetch a random anime name from the database
    const randomAnimeName = await AnimeName.aggregate([{ $sample: { size: 1 } }]);
    
    // Send the random anime name
    citel.reply(`اسم الشخصية العشوائي: ${randomAnimeName[0].name}`);
  }
);
