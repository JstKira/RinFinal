const { tlnag, cmd, getBuffer, Config } = require('../lib');
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
        maskedArr[index] = guess;
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
    desc: "لعبة المشنوقة",
    category: "العاب",
    use: "",
  },
  async (Void, citel, text) => {
    if (!citel.isGroup) return;
    let { prefix } = require('../lib');
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
      ]; // List of Arabic words for guessing
      let randomIndex = Math.floor(Math.random() * words.length);
      let word = words[randomIndex];
      room = {
        id: `hangman_${citel.chat}_${Date.now()}`,
        chat: citel.chat,
        state: "PLAYING",
        game: new HangmanGame(),
      };
      room.game.setWordToGuess(word);
      this.game[room.id] = room;
    }

    let maskedWord = room.game.getMaskedWord();

    return await Void.sendMessage(citel.chat, {
      text: `كلمة المشنقة:\n${maskedWord}`,
    });
  }
);
