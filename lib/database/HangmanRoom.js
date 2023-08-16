const mongoose = require('mongoose');

const hangmanRoomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true
  },
  word: {
    type: String,
    required: true
  },
  maskedWord: {
    type: String,
    required: true
  },
  remainingGuesses: {
    type: Number,
    required: true
  }
});

const HangmanRoom = mongoose.model('HangmanRoom', hangmanRoomSchema);

module.exports = HangmanRoom;
