/**
 Copyright (C) 2022.
 Licensed under the  GPL-3.0 License;
 You may not use this file except in compliance with the License.
 It is supplied in the hope that it may be useful.
 * @project_name : Secktor-Md
 * @author : @samapndey001 <https://github.com/SamPandey001>
 * @description : Secktor,A Multi-functional whatsapp bot.
 * @version 0.0.6
 **/
const { cmd, parseJid, getAdmin, tlang } = require("../lib/");
const eco = require('discord-mongoose-economy')
const ty = eco.connect(mongodb);

cmd(
  {
    pattern: "delxo",
    desc: "يحذف جلسة اللعب الحالية في لعبة TicTacToe.",
    filename: __filename,
    category: "العاب",
  },
  async (Void, citel, text, { isCreator }) => {
    if (!citel.isGroup) return citel.reply(tlang().group);
    const groupMetadata = citel.isGroup ? await Void.groupMetadata(citel.chat).catch((e) => {}) : "";
    const participants = citel.isGroup ? await groupMetadata.participants : "";
    const groupAdmins = await getAdmin(Void, citel)
    const isAdmins = citel.isGroup ? groupAdmins.includes(citel.sender) : false;
    if (!isAdmins && !isCreator) return citel.reply('هذا الأمر خاص بمشرفي المجموعة والمالك.')
    this.game = this.game ? this.game : false
    if (
      Object.values(this.game).find(
        (room) =>
          room.id.startsWith("tictactoe")
      )
    ) {
      delete this.game
      return citel.reply(`_تم حذف اللعبة الحالية بنجاح._`);
    } else {
      return citel.reply(`مافيه لعبة جارية حاليا.`)
    }
  })

cmd(
  {
    pattern: "xo",
    desc: "يلعب TicTacToe",
    filename: __filename,
    category: "العاب",
  },
  async (Void, citel, text) => {
    if (!citel.isGroup) return citel.reply(tlang().group);
    let { prefix } = require('../lib')
    {
      let TicTacToe = require("../lib/ttt");
      this.game = this.game ? this.game : {};
      if (
        Object.values(this.game).find(
          (room) =>
            room.id.startsWith("tictactoe") &&
            [room.game.playerX, room.game.playerO].includes(citel.sender)
        )
      )
        return citel.reply("_هناك لعبة جارية حاليًا_");
      let room = Object.values(this.game).find(
        (room) =>
          room.state === "WAITING" && (text ? room.name === text : true)
      );
      if (room) {
        room.o = citel.chat;
        room.game.playerO = citel.sender || citel.mentionedJid[0] 
        room.state = "PLAYING";
        let arr = room.game.render().map((v) => {
          return {
            X: "❌",
            O: "⭕",
            1: "1️⃣",
            2: "2️⃣",
            3: "3️⃣",
            4: "4️⃣",
            5: "5️⃣",
            6: "6️⃣",
            7: "7️⃣",
            8: "8️⃣",
            9: "9️⃣", 
          }[v];
        });
        let str = `
الدور الحالي: @${room.game.currentTurn.split("@")[0]}
معرف الغرفة: ${room.id}
${arr.slice(0, 3).join("  ")}
${arr.slice(3, 6).join("  ")}
${arr.slice(6).join("  ")}
`;

        return await Void.sendMessage(citel.chat, {
          text: str,
          mentions: [room.game.currentTurn],
        });
      } else {
        room = {
          id: "tictactoe-" + +new Date(),
          x: citel.chat,
          o: "",
          game: new TicTacToe(citel.sender, "o"),
          state: "WAITING",
        };
        if (text) room.name = text;
        citel.reply("_انتظر لاعب آخر، استخدم .xo للانضمام إلى اللعبة._ ");
        this.game[room.id] = room;
      }
    }
  }
);
cmd(
  {
    on: "text"
  },
  async (Void,citel,text) => {
    if(!citel.isGroup) return
    let {prefix} = require('../lib')
    this.game = this.game ? this.game : {};
    let room = Object.values(this.game).find(
      (room) =>
        room.id &&
        room.game &&
        room.state &&
        room.id.startsWith("tictactoe") &&
        [room.game.playerX, room.game.playerO].includes(citel.sender) &&
        room.state == "PLAYING"
    );

    if (room) {
      let ok;
      let isWin = !1;
      let isTie = !1;
      let isSurrender = !1;
      if (!/^([1-9]|(me)?give_up|surr?ender|off)$/i.test(citel.text)) return;
      isSurrender = !/^[1-9]$/.test(citel.text);
      if (citel.sender !== room.game.currentTurn) {
        if (!isSurrender) return !0;
      }
      if (
        !isSurrender &&
        1 >
          (ok = room.game.turn(
            citel.sender === room.game.playerO,
            parseInt(citel.text) - 1
          ))
      ) {
        citel.reply(
          {
            "-3": "انتهت اللعبة",
            "-2": "خطأ!",
            "-1": "المكان خاطئ!",
            0: "المكان خاطئ",
          }[ok]
        );
        return !0;
      }
      if (citel.sender === room.game.winner) isWin = true;
      else if (room.game.board === 511) isTie = true;
      let arr = room.game.render().map((v) => {
        return {
          X: "❌",
          O: "⭕",
          1: "1️⃣",
          2: "2️⃣",
          3: "3️⃣",
          4: "4️⃣",
          5: "5️⃣",
          6: "6️⃣",
          7: "7️⃣",
          8: "8️⃣",
          9: "9️⃣",
        }[v];
      });
      if (isSurrender) {
        room.game._currentTurn = citel.sender === room.game.playerX;
        isWin = true;
      }
      let winner = isSurrender ? room.game.currentTurn : room.game.winner;
      let str = `رمز الغرفة: ${room.id}
      
${arr.slice(0, 3).join("  ")}
${arr.slice(3, 6).join("  ")}
${arr.slice(6).join("  ")}
${
  isWin
    ? `@${winner.split("@")[0]} فاز وحصل على 2000💎 في المحفظة🤑`
    : isTie
    ? `تعادل,ابدعتوا كلكم👌🏻 .`
    : `Current Turn ${["❌", "⭕"][1 * room.game._currentTurn]} @${
        room.game.currentTurn.split("@")[0]
      }`
}
⭕:- @${room.game.playerO.split("@")[0]}
❌:- @${room.game.playerX.split("@")[0]}`;

      if ((room.game._currentTurn ^ isSurrender ? room.x : room.o) !== citel.chat)
        room[room.game._currentTurn ^ isSurrender ? "x" : "o"] = citel.chat;
        if(isWin){
        await eco.give(citel.sender, "secktor", 2000);
        }
      if (isWin || isTie) {
        await Void.sendMessage(citel.chat, {
          text: str,
          mentions: [room.game.playerO,room.game.playerX],
        });
      } else {
        await Void.sendMessage(citel.chat, {
          text: str,
          mentions: [room.game.playerO,room.game.playerX],
        });
      }
      if (isTie || isWin) {
        delete this.game[room.id];
      }
    }
  }
);

cmd({ pattern: "صداقة" , category: "ترفيه" }, async(Void, citel, text) => {
    const { tlang } = require('../lib')
   if (!citel.isGroup) return citel.reply(tlang().group);
   const groupMetadata = citel.isGroup ? await Void.groupMetadata(citel.chat).catch((e) => {}) : "";
	 const participants = citel.isGroup ? await groupMetadata.participants : "";
   let members = participants.map(u => u.id)
   const percentage = Math.floor(Math.random() * 100)
    async function couple(percent) {
         var text;
        if (percent < 25) {
            text = `\t\t\t\t\t*ShipCent : ${percentage}%* \n\t\tمب مرة، لكن لا زال فيه امل !`
        } else if (percent < 50) {
            text = `\t\t\t\t\t*ShipCent : ${percentage}%* \n\t\t علاقتكم كويسه، اتوقع؟ 💫`
        } else if (percent < 75) {
            text = `\t\t\t\t\t*ShipCent : ${percentage}%* \n\t\t\tاستمروا يوما ما بتصيرون اعز الاصحاب ⭐️`
        } else if (percent < 90) {
            text = `\t\t\t\t\t*ShipCent : ${percentage}%* \n\tاوبا!، خوتكم تنحسدون عليها💖 `
        } else {
            text = `\t\t\t\t\t*ShipCent : ${percentage}%* \n\tانت الرفيق اللي على الطيب ممشاك، وانت الخوي اللي يساوي قبيلة 💙`
        }
        return text
        }
       var user = citel.mentionedJid ? citel.mentionedJid[0] : citel.msg.contextInfo.participant || false;
       var shiper;
       if (user) {
       shiper = user
       } else {
       shiper = members[Math.floor(Math.random() * members.length)]
       }
       let caption = `\t❣️ *ندور لك على صديق...* ❣️ \n`
        caption += `\t\t✯────────────────────✯\n`
        caption += `@${citel.sender.split('@')[0]}  x  @${shiper.split('@')[0]}\n`
        caption += `\t\t✯────────────────────✯\n`
        caption += await couple(percentage)
        if(citel.sender.split('@')[0]===shiper.split('@')[0]) return citel.reply('```'+' ؟'+'```')
        await Void.sendMessage(citel.chat,{text: caption,mentions: [citel.sender,shiper]},{quoted:citel})
   }
)
// IDEA of Shipcent from => https://github.com/iamherok/WhatsApp-Botto-Ruka/blob/master/handler/message.js#L842
