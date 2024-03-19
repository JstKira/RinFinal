cmd(
  {
    pattern: "حوم",
    desc: " لعبة حجرة ورقة مقص",
    category: "العاب",
  },
  async (Void, citel, text) => {
    if (!citel.isGroup) return citel.reply(tlang().group);
    let { prefix } = require('../lib')
    let choices = ["حجرة", "ورقة", "مقص"];
    let botIndex = Math.floor(Math.random() * choices.length);
    let botChoice = choices[botIndex];
    let userChoice = text.toLowerCase();
    if (!choices.includes(userChoice)) {
      return citel.reply("اختر بين: حجرة، ورقة، مقص.");
    }
    if (botChoice === userChoice) {
      return citel.reply("تعادل!");
    }
    if (
      (botChoice === "حجرة" && userChoice === "مقص") ||
      (botChoice === "ورقة" && userChoice === "حجرة") ||
      (botChoice === "مقص" && userChoice === "ورقة")
    )  {
      return citel.reply(`أنا اخترت ${botChoice}، فزت عليك!`);
    } else {
      return citel.reply(`أنا اخترت ${botChoice}، لقد فزت!`);
    }
  }
);
