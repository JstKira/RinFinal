const { cmd, parseJid, getAdmin, tlang } = require("../lib/");
const eco = require('discord-mongoose-economy')
const ty = eco.connect(mongodb);
cmd(
  {
    pattern: "المشنقة",
    desc: "يبدأ لعبة المشنقة.",
    category: "الألعاب",
  },
  async (Void, citel, text) => {
    if (!citel.isGroup) return citel.reply(tlang().group);
    
    // تهيئة حالة لعبة المشنقة
    const hangmanWord = "المشنقة"; // كلمة مثالية للعبة
    let hangmanState = Array(hangmanWord.length).fill("❓");
    let hangmanIncorrectGuesses = 0;
    const maxIncorrectGuesses = 6; // الحد الأقصى للتخمينات الخاطئة المسموح بها
    
    // إرسال تصور المشنقة الأولي
    const initialHangmanMessage = `كلمة المشنقة: ${hangmanState.join(" ")}\nالتخمينات الخاطئة: ${hangmanIncorrectGuesses}/${maxIncorrectGuesses}`;
    citel.reply(initialHangmanMessage);
  }
);

cmd(
  {
    on: "text",
  },
  async (Void, citel, text) => {
    // التحقق مما إذا كان الرسالة من مجموعة
    if (!citel.isGroup) return;
    
    // الحصول على كلمة المشنقة وحالة اللعبة من الرسالة
    const hangmanWord = "المشنقة"; // كلمة مثالية للعبة
    let hangmanState = Array(hangmanWord.length).fill("❓");
    let hangmanIncorrectGuesses = 0;
    const maxIncorrectGuesses = 6; // الحد الأقصى للتخمينات الخاطئة المسموح بها
    
    // معالجة إدخال المستخدم أثناء اللعبة
    const guess = text.toLowerCase();
    
    // التحقق مما إذا كان التخمين حرفًا واحدًا
    if (guess.length !== 1 || !guess.match(/[أ-ي]/)) {
      return citel.reply("يرجى إدخال حرف واحد كتخمين.");
    }
    
    // التحقق مما إذا كان الحرف المخمن موجودًا في كلمة المشنقة
    let correctGuess = false;
    for (let i = 0; i < hangmanWord.length; i++) {
      if (hangmanWord[i] === guess) {
        hangmanState[i] = guess;
        correctGuess = true;
      }
    }
    
    // تحديث حالة المشنقة بناءً على التخمين
    if (!correctGuess) {
      hangmanIncorrectGuesses++;
    }
    
    // التحقق من شروط الفوز / الخسارة
    const hangmanComplete = !hangmanState.includes("❓");
    const gameOver = hangmanIncorrectGuesses >= maxIncorrectGuesses || hangmanComplete;
    
    // إرسال تصور المشنقة المحدث
    const hangmanMessage = `كلمة المشنقة: ${hangmanState.join(" ")}\nالتخمينات الخاطئة: ${hangmanIncorrectGuesses}/${maxIncorrectGuesses}`;
    citel.reply(hangmanMessage);
    
    // معالجة شروط الفوز / الخسارة
    if (gameOver) {
      const gameOverMessage = hangmanComplete ? "تهانينا، لقد حزرت الكلمة!" : "انتهت اللعبة! لقد نفدت التخمينات.";
      citel.reply(gameOverMessage);
    }
  }
);
