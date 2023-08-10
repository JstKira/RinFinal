const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photo: { type: String, required: true },
  tier: { type: String, required: true },
});

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;
