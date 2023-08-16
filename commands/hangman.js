const { tlnag, cmd, getBuffer, prefix, Config } = require('../lib');

class HangmanGame {
  constructor() {
    this.wordToGuess = "";
    this.maskedWord = "";
    this.guesses = [];
    this.maxAttempts = 6;
    this.attempts = 0;
  }

  setWordToGuess(word) {
    this.wordToGuess = word.toLowerCase();
    this.maskedWord = "_".repeat(this.wordToGuess.length);
  }

  getWordToGuess() {
    return this.wordToGuess;
  }

  getMaskedWord() {
    return this.maskedWord;
  }

  makeGuess(guess) {
    guess = guess.toLowerCase();

    if (this.guesses.includes(guess)) {
      return -1;
    }

    this.guesses.push(guess);

    let indices = [];
    for (let i = 0; i < this.wordToGuess.length; i++) {
      if (this.wordToGuess[i] === guess) {
        indices.push(i);
      }
    }

    if (indices.length > 0) {
      let maskedArr = this.maskedWord.split("");
      for (let index of indices) {
        maskedArr[index] = this.wordToGuess[index];
      }
      this.maskedWord = maskedArr.join("");
    } else {
      this.attempts++;
    }

    return indices.length;
  }

  isWin() {
    return this.maskedWord === this.wordToGuess;
  }

  isLose() {
    return this.attempts >= this.maxAttempts;
  }
}

cmd(
  {
    pattern: "مشنوق",
    desc: "لعبة المشنوق",
    category: "العاب",
    use: "",
  },
  async (Void, citel, text) => {
    if (!citel.isGroup) return;
    this.game = this.game ? this.game : {};

    let room = Object.values(this.game).find(
      (room) =>
        room.id &&
        room.game &&
        room.state &&
        room.id.startsWith("hangman") &&
        room.chat === citel.chat &&
        room.state === "PLAYING"
    );

    if (!room) {
      let words = [
        "مرحبا",
        "عائلة",
        "صحراء",
        "سماء",
        "غروب",
        "بحر",
        "شمس",
        "قمر",
        "نجمة",
        "جبل",
      ];
      let randomIndex = Math.floor(Math.random() * words.length);
      let word = words[randomIndex];
      room = {
        id: `hangman_${citel.chat}_${Date.now()}`,
        chat: citel.chat,
        state: "PLAYING",
        game: new HangmanGame(),
        players: [citel.sender], // Assign the player to the game
      };
      room.game.setWordToGuess(word);
      this.game[room.id] = room;
    } else if (!room.players.includes(citel.sender)) {
      room.players.push(citel.sender); 

    let maskedWord = room.game.getMaskedWord();

    if (room.chat === citel.chat && text) {
      let guess = text.trim();
      let result = room.game.makeGuess(guess);

      if (result === -1) {
        await Void.sendMessage(citel.chat, {
          text: "لقد قمت بتخمين هذا الحرف من قبل!",
        });
      } else if (result === 0) {
        await Void.sendMessage(citel.chat, {
          text: "للأسف، هذا الحرف غير موجود في الكلمة.",
        });
      } else {
        await Void.sendMessage(citel.chat, {
          text: "تم تخمين الحرف بنجاح!",
        });
      }

      maskedWord = room.game.getMaskedWord();
      await Void.sendMessage(citel.chat, {
        text: `الكلمة :\n${maskedWord}`,
      });

      if (room.game.isWin()) {
        await Void.sendMessage(citel.chat, {
          text: "أحسنت! لقد فزت باللعبة!",
        });
        delete this.game[room.id];
      } else if (room.game.isLose()) {
        await Void.sendMessage(citel.chat, {
          text: "للأسف، انتهت الفرص المتاحة. لقد خسرت اللعبة.",
        });
        delete this.game[room.id];
      }
    } else {
      await Void.sendMessage(citel.chat, {
        text: `الكلمة :\n${maskedWord}`,
      });
    }
  }
);
