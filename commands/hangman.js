const { cmd, parseJid, getAdmin, tlang } = require("../lib/");
const { MongoClient } = require("mongodb");
const { sck1 } = require("../lib/database/user.js"); // Update with the correct path to the UserSchema file

const mongoURI = "mongodb+srv://thamerrin:Thamer12@rin.kikwxum.mongodb.net/?retryWrites=true&w=majority"; // Update with your MongoDB connection URI

let db; // MongoDB database connection

MongoClient.connect(mongoURI, (err, client) => {
  if (err) {
    console.error("Error connecting to MongoDB:", err);
    return;
  }
  db = client.db("hangmanGame"); // Update with your preferred database name
  console.log("Connected to MongoDB!");
});

//----------------------
const words = require('../lib/words.js'); // array of words to pick from

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

  const user = await sck1.findOne({ id: citel.sender }); // Find the user based on the sender ID

  const room = {
    id: roomId, 
    word,
    maskedWord,
    remaining: remainingGuesses,
    player: user // Store the reference to the user
  };

  // Store the game room in MongoDB
  db.collection("hangmanRooms").insertOne(room);

});

cmd({
  on: 'text',
  priority: 1
}, async (Void, citel, text) => {

  console.log(`Received text message: ${text}`);

  // Find the user based on the sender ID
  const user = await sck1.findOne({ id: citel.sender });

  // Find the game room in MongoDB based on the user and room ID
  const room = await db.collection("hangmanRooms").findOne({
    'player.id': user.id,
    id: { $regex: /^hangman-/ }
  });

  if (!room || typeof text !== 'string' || text.length === 0) return;

  const guess = text.toLowerCase()[0];

  console.log(`Guess: ${guess}`);

  if (room.word.includes(guess)) {
    room.maskedWord = fillInLetter(room.maskedWord, room.word, guess); 
    if (!room.maskedWord.includes('_')) {
      citel.reply(`You guessed the word: ${room.word}`);
      // Delete the game room from MongoDB
      db.collection("hangmanRooms").deleteOne({ id: room.id });
      return; 
    }
  } else {
    room.remaining--;
  }

  if (room.remaining === 0) {
    citel.reply(`You lost! The word was ${room.word}`);
    // Delete the game room from MongoDB
    db.collection("hangmanRooms").deleteOne({ id: room.id });
    return;
  }

  console.log(`Remaining: ${room.remaining}`);
  console.log(`Masked Word: ${room.maskedWord}`);

  citel.reply(`Guess: ${guess}, Remaining: ${room.remaining}`);
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
