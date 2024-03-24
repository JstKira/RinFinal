import { cmd } from '../lib';
import { sck1 } from '../lib/database/user';
import { RandomXP } from '../lib/database/xp';

// Define the cooldown time for hunting and the time before sending the results
const cooldown = 259200000; // 3 days
const cooldownn = 180000; // 3 minutes

cmd(
  {
    pattern: "صيد",
    desc: "صيد الحيوانات للحصول على مكافآت.",
    category: "الصيد",
  },
  async (Void, citel, text) => {
    try {
      let user = await sck1.findOne({ id: citel.sender });
      if (!user) {
        user = new sck1({ id: citel.sender });
        await user.save();
      }

      // Check if the user is on cooldown for hunting
      if (new Date() - user.lasthunt <= cooldown) {
        const remainingTime = cooldown - (new Date() - user.lasthunt);
        return citel.reply(`لقد قمت بالصيد مؤخرا، الرجاء الانتظار\n*🕐${(remainingTime / 86400000).toFixed(0)} يوم*`);
      }

      // Check if the user has required items for hunting
      if (user.armor === 0 || user.sword === 0 || user.bow === 0) {
        return citel.reply(`يجب صنع الدروع، السيوف، والأقواس أولاً.\n\nلديك:\n━ 🥼 ${user.armor} درع\n━ ⚔️ ${user.sword} سيف\n━ 🏹 ${user.bow} قوس`);
      }

      // Array of animals to be hunted
      let animals = [
        {"animal": 0}, {"animal": 0}, {"animal": 0}, {"animal": 0}, {"animal": 0}, {"animal": 0},
        {"animal": 0}, {"animal": 0}, {"animal": 0}, {"animal": 0}, {"animal": 0}, {"animal": 0}
      ];

      // Randomly generate number of each animal
      for (let x of animals) {
        let random = Math.floor(Math.random() * 7);
        x.animal += random;
      }

      // Constructing the hunting results message
      let resultMsg = `[ *انتهى الصيد* ]\nنتائج صيد اليوم :\n\n`;
      resultMsg += ` *🐂 = [ ${animals[0].animal} ]*             *🐃 = [ ${animals[6].animal} ]*\n`;
      resultMsg += ` *🐅 = [ ${animals[1].animal} ]*             *🐮 = [ ${animals[7].animal} ]*\n`;
      resultMsg += ` *🐘 = [ ${animals[2].animal} ]*             *🐒 = [ ${animals[8].animal} ]*\n`;
      resultMsg += ` *🐐 = [ ${animals[3].animal} ]*             *🐗 = [ ${animals[9].animal} ]*\n`;
      resultMsg += ` *🐼 = [ ${animals[4].animal} ]*             *🐖 = [ ${animals[10].animal} ]*\n`;
      resultMsg += ` *🐊 = [ ${animals[5].animal} ]*             *🐓 = [ ${animals[11].animal} ]*`;

      // Decrease durability of armor, sword, and bow
      user.armordurability -= Math.floor(Math.random() * (120 - 80 + 1) + 80);
      user.sworddurability -= Math.floor(Math.random() * (120 - 80 + 1) + 80);
      user.bowdurability -= Math.floor(Math.random() * (120 - 80 + 1) + 80);

      // If durability drops below zero, set it to zero and reset the item count
      if (user.armordurability <= 0) {
        user.armordurability = 0;
        user.armor = 0;
      }
      if (user.sworddurability <= 0) {
        user.sworddurability = 0;
        user.sword = 0;
      }
      if (user.bowdurability <= 0) {
        user.bowdurability = 0;
        user.bow = 0;
      }

      // Send the hunting results message after a delay
      setTimeout(() => {
        // Add hunted animals to user's inventory
        user.الثور += animals[0].animal;
        user.النمر += animals[1].animal;
        user.الفيل += animals[2].animal;
        user.الماعز += animals[3].animal;
        user.الباندا += animals[4].animal;
        user.التمساح += animals[5].animal;
        user.الجاموس += animals[6].animal;
        user.البقرة += animals[7].animal;
        user.القرد += animals[8].animal;
        user.الخنزيرالبري += animals[9].animal;
        user.الدبالبري += animals[10].animal;
        user.الدجاج += animals[11].animal;

        // Send hunting results message with the image
        conn.sendFile(citel.chat, 'https://telegra.ph/file/295a6d5105771875e1797.jpg', '', resultMsg, citel);
      }, cooldownn);

      // Send a message indicating the start of hunting
      setTimeout(() => {
        citel.reply('_الصيد بدأ..._');
      }, 0);

      // Update the last hunt time
      user.lasthunt = new Date() * 1;
    } catch (err) {
      console.error(err);
      citel.reply("حدث خطأ أثناء تنفيذ الأمر.");
    }
  }
);
