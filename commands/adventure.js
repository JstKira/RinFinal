const mongoose = require('mongoose');
const { cmd } = require('../lib');
const fs = require('fs');
const eco = require('discord-mongoose-economy');
// Connect to MongoDB using eco
const ty = eco.connect(mongodb);

// Define cooldown duration (5 minutes)
const COOLDOWN_DURATION = 5 * 60 * 1000;

cmd(
  {
    pattern: "مغامرة",
    desc: "المغامرة في الأماكن المختلفة",
    category: "RPG",
    filename: __filename,
    level: 20, // Minimum level required to use this command
  },
  async (Void, citel, userId) => { // Assuming userId is passed as an argument
    const currentTime = Date.now();

    // Function to format time in HH:MM:SS format
    function formatTime(milliseconds) {
      const seconds = Math.floor((milliseconds / 1000) % 60);
      const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
      const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);

      return `${hours} ساعة و ${minutes} دقيقة و ${seconds} ثانية`;
    }

    try {
      // Fetch user from the database
      let user = await ty.sck1.findOne({ id: userId });

      // Check if user exists
      if (!user) {
        citel.reply("User not found");
        return;
      }

      // Check user's level
      if (user.level < 20) {
        citel.reply("يجب أن تكون على مستوى 20 أو أعلى لاستخدام هذا الأمر.");
        return;
      }

      // Check user's health
      if (user.health < 20) {
        const timeUntilReset = COOLDOWN_DURATION - (currentTime - user.lastAdventure);
        citel.reply(`صحتك أقل من 20، يرجى استخدام الجرعات العلاجية أو الانتظار حتى تعود الصحة إلى الحالة الكاملة. الوقت المتبقي: ${formatTime(timeUntilReset)}.`);
        return;
      }

      // Check cooldown
      if (currentTime - user.lastAdventure < COOLDOWN_DURATION) {
        const timeRemaining = COOLDOWN_DURATION - (currentTime - user.lastAdventure);
        citel.reply(`يجب عليك الانتظار لمدة ${formatTime(timeRemaining)} قبل القيام بمغامرة جديدة.`);
        return;
      }

      // Load rewards from items.json file
      const rewards = loadRewards();

      // Simulate adventure
      const damage = getRandomInt(10, 30); // Random damage between 10 and 30
      user.health -= damage;
      user.lastAdventure = currentTime;

      if (user.health < 0) {
        user.health = 0;
      }

      // Update user's health and inventory in the database
      const result = await user.updateOne({ $addToSet: { inventory: { $each: rewards.inventory } } });

      // Check if update was successful
      if (result.nModified > 0) {
        console.log('Inventory updated successfully');
      } else {
        console.log('No changes made to inventory');
      }

      citel.reply(`لقد مغامرت وتلقيت ضربة! صحتك الآن: ${user.health}`);

      // Send a separate message for rewards
      if (rewards.inventory.length > 0) {
        const itemsList = rewards.inventory.map(item => `${item.name} x${item.quantity}`).join("\n");
        citel.reply(`*تم اكتساب المكافآت التالية:*\n\n${itemsList}`);
      }

      // Check if user's health reached zero
      if (user.health === 0) {
        citel.reply("لقد فقدت جميع صحتك! تحتاج إلى الراحة والشفاء.");
        return;
      }
    } catch (error) {
      console.error('Error in adventure command:', error);
      citel.reply("حدث خطأ أثناء محاولة تنفيذ الأمر.");
    }
  }
);

// Function to generate a random integer between min and max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to load rewards from items.json file
function loadRewards() {
  const itemsData = fs.readFileSync('./lib/items.json');
  const items = JSON.parse(itemsData);
  const rarityKeys = Object.keys(items);
  const inventory = [];

  rarityKeys.forEach(rarity => {
    items[rarity].forEach(item => {
      inventory.push({
        name: item.name,
        quantity: getRandomInt(1, 5), // Random quantity between 1 and 5
      });
    });
  });

  return { inventory };
}
