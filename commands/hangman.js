const { cmd, parseJid, getAdmin, tlang } = require("../lib/");


//----------------------
cmd(
  {
    pattern: "hangman",
    desc: "Play Hangman game",
    filename: __filename,
    category: "Games",
  },
  async (Void, citel, text) => {
    if (!citel.isGroup) return citel.reply("This game can only be played in groups.");
    let { prefix } = require('../lib');
    
    // Create Hangman game room
    this.hangmanGame = this.hangmanGame ? this.hangmanGame : {};
    let room = {
      id: "hangman-" + +new Date(),
      players: [citel.sender],
      word: "apple", // You can replace this with a random word generator
      currentTurn: citel.sender,
      guessedLetters: [],
    };
    
    citel.reply("A new Hangman game has started. Type '.guess <letter>' to play!");
    
    this.hangmanGame[room.id] = room;
  }
);

cmd(
  {
    on: "text"
  },
  async (Void, citel, text) => {
    if (!citel.isGroup || typeof text !== 'string') return;
    let { prefix } = require('../lib');
    
    this.hangmanGame = this.hangmanGame ? this.hangmanGame : {};
    let room = Object.values(this.hangmanGame).find(
      (room) =>
        room.id &&
        room.players.includes(citel.sender) &&
        room.word &&
        room.currentTurn === citel.sender
    );
    
    if (!room) return;
    
    let guessCommand = text.toLowerCase().split(" ");
    if (guessCommand[0] === ".guess" && guessCommand.length === 2) {
      let guessedLetter = guessCommand[1];
      if (guessedLetter.length !== 1 || !/[a-z]/.test(guessedLetter)) return;
      
      room.guessedLetters.push(guessedLetter);
      let formattedWord = room.word
        .split('')
        .map(letter => (room.guessedLetters.includes(letter) ? letter : '_'))
        .join(' ');
      
      // Check if the guessed letter is correct
      if (room.word.includes(guessedLetter)) {
        await Void.sendMessage(citel.chat, `Good guess! ${guessedLetter} is in the word.`);
      } else {
        await Void.sendMessage(citel.chat, `${guessedLetter} is not in the word. Keep trying!`);
      }
      
      // Update the current turn (you might want to implement a way to alternate turns)
      room.currentTurn = room.players.find(player => player !== room.currentTurn);
      
      // Send updated game state to the group
      let gameStateMessage = `Current word: ${formattedWord}\nGuessed letters: ${room.guessedLetters.join(', ')}`;
      await Void.sendMessage(citel.chat, gameStateMessage);
      
      // Check for game over conditions
      if (!formattedWord.includes('_')) {
        await Void.sendMessage(citel.chat, `Congratulations! You've guessed the word: ${room.word}`);
        delete this.hangmanGame[room.id];
      } else if (room.guessedLetters.length === 6) {
        await Void.sendMessage(citel.chat, `Sorry, you've run out of guesses. The word was: ${room.word}`);
        delete this.hangmanGame[room.id];
      }
    }
  }
);

