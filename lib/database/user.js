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
  inventory: { type: Array, default: [] }, // Store user's inventory
  health: { type: Number, default: 100 }, // Store user's health
  trash: { type: Number, default: 0 }, // Store user's trash
  rock: { type: Number, default: 0 }, // Store user's rocks
  wood: { type: Number, default: 0 }, // Store user's wood
  string: { type: Number, default: 0 }, // Store user's string
  common: { type: Number, default: 0 }, // Store user's common items
  gold: { type: Number, default: 0 }, // Store user's gold
  emerald: { type: Number, default: 0 }, // Store user's emeralds
  diamond: { type: Number, default: 0 }, // Store user's diamonds
  lastAdventure: { type: Date, default: 0 }, // Store user's last adventure time
  lasthunt: { type: Date, default: 0 },
  adventureCount: { type: Number, default: 0 }, // Store user's adventure count
  ثور: { type: Number, default: 0 }, // Store user's hunted banteng
  نمر: { type: Number, default: 0 }, // Store user's hunted tiger
  فيل: { type: Number, default: 0 }, // Store user's hunted elephant
  ماعز: { type: Number, default: 0 }, // Store user's hunted goat
  باندا: { type: Number, default: 0 }, // Store user's hunted panda
  تمساح: { type: Number, default: 0 }, // Store user's hunted crocodile
  جاموس: { type: Number, default: 0 }, // Store user's hunted buffalo
  بقرة: { type: Number, default: 0 }, // Store user's hunted cow
  قرد: { type: Number, default: 0 }, // Store user's hunted monkey
  دجاجة: { type: Number, default: 0 }, // Store user's hunted chicken
});

const sck1 = mongoose.model("Sck1", UserSchema);

module.exports = { sck1 };
