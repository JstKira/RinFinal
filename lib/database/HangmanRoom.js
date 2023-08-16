const mongoose = require('mongoose');

const hangmanRoomSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'sck1',
    required: true
  },
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
