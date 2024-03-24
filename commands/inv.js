const { cmd } = require('../lib');
const { RandomXP } = require('../lib/database/xp');
const { sck1 } = require('../lib/database/user');

cmd(
  {
    pattern: "حقيبة",
    desc: "عرض المخزون",
    category: "RPG",
    filename: __filename,
    level: 15, // Minimum level required to use this command
  },
  async (Void, citel) => {
    const userId = citel.sender;
    try {
        // Check user's level
        const userLevelDoc = await RandomXP.findOne({ id: userId });
        const userLevel = userLevelDoc ? userLevelDoc.level : 0;
        if (userLevel < 5) {
            citel.reply("لازم توصل مستوى 15 او اعلى عشان تستخدم الامر");
            return;
        }
        
        // Fetch user's inventory
        const user = await sck1.findOne({ id: userId });
        const inventory = user ? user.inventory : [];
        if (!inventory || inventory.length === 0) {
            citel.reply("مامعك شيء\n\n*جرب تكتب .اوامر، واستخدم واحد من اوامر ال RPG لعل وعسى تحصل شيء*");
            return;
        }
        
        // Construct and send inventory message
        const itemsList = inventory.map(item => `${item.name} x${item.quantity}`).join("\n");
        citel.reply(`*الحقيبة:*\n\n${itemsList}`);
    } catch (error) {
        console.error("Error fetching inventory:", error);
        citel.reply("حدث خطأ أثناء استرداد الحقيبة من الداتابيس.");
    }
  }
);
