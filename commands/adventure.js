const mongoose = require('mongoose');
const { cmd } = require('../lib');
const { RandomXP } = require('../lib/database/xp');
const { sck1 } = require('../lib/database/user');
const fs = require('fs');

// Define the cooldown time for the adventure
const cooldown = 900000; // 15 minutes
// Define a function to generate a random number between min and max (inclusive)
function ranNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Retrieve MongoDB connection URI from environment variable
const mongoURI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Event handlers for MongoDB connection
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Disconnected from MongoDB');
});

// Include the command code here



cmd(
  {
    pattern: "مغامرة",
    desc: "زيارة مغامرة للبحث عن الثروات.",
    category: "مغامرة",
  },
  async (Void, citel, text) => {
    try {
      let user = await sck1.findOne({ id: citel.sender });
      if (!user) {
        user = new sck1({ id: citel.sender });
        await user.save();
      }

      // Check if the user is healthy enough for adventure
      if (user.health < 80) {
        return citel.reply(`يتطلب حد أدنى *❤️ 80 صحة* لـ ${text}!!\n\nاكتب *${usedPrefix}استعادة* لزيادة الصحة.\nأو *${usedPrefix}استخدم مشروب* لاستخدام المشروب.`);
      }

      // Check if the user is on cooldown
      if (new Date() - user.lastAdventure <= cooldown) {
        const remainingTime = cooldown - (new Date() - user.lastAdventure);
        return citel.reply(`لقد مغامرت بالفعل، الرجاء الانتظار\n*🕐${(remainingTime / 60000).toFixed(0)} دقيقة*`);
      }

      user.adventureCount += 1;

      const health = ranNumb(3, 6);
      const money = ranNumb(1000, 3000);
      const trash = ranNumb(10, 50);
      const rock = ranNumb(1, 4);
      const wood = ranNumb(1, 4);
      const string = ranNumb(1, 3);
      const common = ranNumb(1, 2);
      const gold = user.adventureCount % 50 === 0 ? 1 : 0; // Give 1 gold every 50 adventures
      const emerald = user.adventureCount % 150 === 0 ? 1 : 0; // Give 1 emerald every 150 adventures
      const diamond = user.adventureCount % 400 === 0 ? 1 : 0; // Give 1 diamond every 400 adventures

      user.health -= health;
      user.money += money;
      user.trash += trash;
      user.rock += rock;
      user.wood += wood;
      user.string += string;
      user.common += common;
      user.gold += gold;
      user.emerald += emerald;
      user.diamond += diamond;

      let txt = `[ *انتهت ${text}* ]\n\n`;
      txt += `*❤️ صحة : -${health}*\nلقد حصلت على :\n`;
      txt += `*💵 مال :* ${money}\n`;
      txt += `*🗑 قمامة :* ${trash}\n`;
      txt += `*🪨 صخور :* ${rock}\n`;
      txt += `*🪵 خشب :* ${wood}\n`;
      txt += `*🕸️ خيوط :* ${string}`;
      if (user.adventureCount % 25 === 0) txt += `\n\nمكافأة مغامرة ${user.adventureCount} مرة\n*📦 عادية :* ${common}`;
      if (user.adventureCount % 50 === 0) txt += `\n\nمكافأة مغامرة ${user.adventureCount} مرة\n*👑 ذهب :* ${gold}`;
      if (user.adventureCount % 150 === 0) txt += `\n\nمكافأة مغامرة ${user.adventureCount} مرة\n*💚 زمرد :* ${emerald}`;
      if (user.adventureCount % 400 === 0) txt += `\n\nمكافأة مغامرة ${user.adventureCount} مرة\n*💎 الماس :* ${diamond}`;
      citel.reply(txt);
      user.lastAdventure = new Date() * 1;
    } catch (err) {
      console.error(err);
      citel.reply("حدث خطأ أثناء تنفيذ الأمر.");
    }
  }
);
