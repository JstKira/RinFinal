const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String },
  bot: { type: Boolean },
  announcement: { type: String },
  permit: { type: String, default: "false" },
  afk: { type: String, default: "false" },
  afktime: { type: Number, default: 0 },
  times: { type: Number, default: 0 },
  ban: { type: String, default: "false" },
  haig: { type: String, default: "false" },
  inventory: { type: Array, default: [] },
  health: { type: Number, default: 100 },
  trash: { type: Number, default: 0 },
  rock: { type: Number, default: 0 },
  wood: { type: Number, default: 0 },
  string: { type: Number, default: 0 },
  common: { type: Number, default: 0 },
  gold: { type: Number, default: 0 },
  emerald: { type: Number, default: 0 },
  diamond: { type: Number, default: 0 },
  lastAdventure: { type: Date, default: 0 },
  adventureCount: { type: Number, default: 0 },
  buffalo: { type: Number, default: 0 }, // بانتينج (Banteng)
  tiger: { type: Number, default: 0 }, // هاريماو (Harimau)
  elephant: { type: Number, default: 0 }, // جاجاه (Gajah)
  goat: { type: Number, default: 0 }, // كامبينغ (Kambing)
  panda: { type: Number, default: 0 }, // باندا (Panda)
  crocodile: { type: Number, default: 0 }, // بوايا (Buaya)
  buffalo: { type: Number, default: 0 }, // كيرباو (Kerbau)
  cow: { type: Number, default: 0 }, // سابي (Sapi)
  monkey: { type: Number, default: 0 }, // مونيت (Monyet)
  chicken: { type: Number, default: 0 }, // أيام (Ayam)
});

const sck1 = mongoose.model("Sck1", UserSchema);

module.exports = { sck1 };
