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
    if (!citel.isGroup) return;
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
      // Implement logic to check if the guessed letter is correct and update the game state
      
      // Send updated game state to the group
      let gameStateMessage = `Current word: ${formattedWord}\nGuessed letters: ${formattedGuessedLetters}`;
      await Void.sendMessage(citel.chat, gameStateMessage);
      
      // Check for game over conditions and update game state accordingly
      
      // If the game is over, remove the room from the hangmanGame object
      if (gameIsOver) {
        delete this.hangmanGame[room.id];
      }
    }
  }
);

