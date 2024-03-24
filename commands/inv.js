const { cmd } = require('../lib');
const mongoose = require('mongoose');

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
