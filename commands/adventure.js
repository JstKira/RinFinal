/*const mongoose = require('mongoose');
const { cmd } = require('../lib');
const { RandomXP } = require('../lib/database/xp');
const { sck1 } = require('../lib/database/user');
const fs = require('fs');


// Connect to MongoDB database using environment variable
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB database');
});

// Import the user schema

const COOLDOWN_DURATION = 5 * 60 * 1000;
const MAX_REWARDS = 7; // Maximum number of rewards

cmd(
  {
    pattern: "مغامرة",
    desc: "المغامرة في الأماكن المختلفة",
    category: "RPG",
    filename: __filename,
    level: 20, // Minimum level required to use this command
  },
  async (Void, citel) => {
    const userId = citel.sender;
    const currentTime = Date.now();

    try {
      // Fetch user from the database or create if not found
      let user = await sck1.findOneAndUpdate(
        { id: userId },
        { $setOnInsert: { id: userId, inventory: [], health: 100, lastAdventure: 0 } },
        { upsert: true, new: true }
      );

      // Check cooldown
      if (currentTime - user.lastAdventure < COOLDOWN_DURATION) {
        const timeRemaining = COOLDOWN_DURATION - (currentTime - user.lastAdventure);
        citel.reply(`يجب عليك الانتظار لمدة ${formatTime(timeRemaining)} قبل القيام بمغامرة جديدة.`);
        return;
      }

      // Load rewards from items.json file
      const rewards = loadRewards(MAX_REWARDS);

      // Simulate adventure
      const damage = getRandomInt(10, 30); // Random damage between 10 and 30
      user.health -= damage;
      user.lastAdventure = currentTime;

      if (user.health < 0) {
        user.health = 0;
      }

      // Add rewards to user's inventory
      for (const reward of rewards.inventory) {
        user.inventory.push(reward);
      }

      // Limit inventory size
      if (user.inventory.length > 50) {
        user.inventory = user.inventory.slice(0, 50);
      }

      // Update user's health and inventory in the database
      await user.save();

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

// Function to load rewards from items.json file and limit the number of rewards
function loadRewards(maxRewards) {
  const itemsData = fs.readFileSync('./lib/items.json');
  const items = JSON.parse(itemsData);
  const rarityKeys = Object.keys(items);
  const inventory = [];

  // Limit the number of rewards
  let remainingRewards = maxRewards;
  rarityKeys.forEach(rarity => {
    items[rarity].forEach(item => {
      if (remainingRewards > 0) {
        inventory.push({
          name: item.name,
          quantity: getRandomInt(1, 5), // Random quantity between 1 and 5
        });
        remainingRewards--;
      }
    });
  });

  return { inventory };
}

// Function to format time in HH:MM:SS format
function formatTime(milliseconds) {
  const seconds = Math.floor((milliseconds / 1000) % 60);
  const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
  const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);

  return `${hours} ساعة و ${minutes} دقيقة و ${seconds} ثانية`;
}
*/
