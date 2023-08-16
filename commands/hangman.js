const { cmd } = require("../lib/");
const mongoose = require("mongoose"); // Require the 'mongoose' package
const { HangmanRoom } = require("../lib/database/HangmanRoom.js"); // Update with the correct path to the HangmanRoom schema file
const words = require('../lib/words.js'); // array of words to pick from

mongoose.connect('mongodb+srv://thamerrin:Thamer12@rin.kikwxum.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB:', err);
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

cmd({
  pattern: 'hangman',
  desc: 'Start a game of hangman',
  category: 'Games'
}, async (Void, citel) => {

  const roomId = 'hangman-' + Date.now();
  const word = randomWord(words); 
  const maskedWord = maskWord(word);
  const remainingGuesses = 6;

  console.log(`Starting hangman in room ${roomId}`);
  console.log(`Word: ${word}`);
  console.log(`Masked Word: ${maskedWord}`);

  citel.reply(`Starting hangman in room ${roomId}`);
  citel.reply(maskedWord);

  const room = new HangmanRoom({
    roomId,
    word,
    maskedWord,
    remainingGuesses
  });

  await room.save(); // Save the game room data to MongoDB

});

cmd({
  on: 'text',
  priority: 1
}, async (Void, citel, text) => {

  console.log(`Received text message: ${text}`);

  const room = await HangmanRoom.findOne({
    roomId: { $regex: /^hangman-/ }
  });

  if (!room || typeof text !== 'string' || text.length === 0) return;

  const guess = text.toLowerCase()[0];

  console.log(`Guess: ${guess}`);

  if (room.word.includes(guess)) {
    room.maskedWord = fillInLetter(room.maskedWord, room.word, guess);
    if (!room.maskedWord.includes('_')) {
      citel.reply(`You guessed the word: ${room.word}`);
      await room.remove(); // Remove the game room data from MongoDB
      return;
    }
  } else {
    room.remainingGuesses--;
  }

  if (room.remainingGuesses === 0) {
    citel.reply(`You lost! The word was ${room.word}`);
    await room.remove(); // Remove the game room data from MongoDB
    return;
  }

  console.log(`Remaining Guesses: ${room.remainingGuesses}`);
  console.log(`Masked Word: ${room.maskedWord}`);

  citel.reply(`Guess: ${guess}, Remaining Guesses: ${room.remainingGuesses}`);
  citel.reply(room.maskedWord);

});

// Helper functions

function randomWord(words) {
  return words[Math.floor(Math.random() * words.length)];
}

function maskWord(word) {
  return word.replace(/./g, '_');
} 

function fillInLetter(masked, word, letter) {
  let idx = word.indexOf(letter);
  while (idx !== -1) {
    masked = masked.substring(0, idx) + letter + masked.substring(idx + 1);
    idx = word.indexOf(letter, idx + 1);
  }
  return masked;
}
