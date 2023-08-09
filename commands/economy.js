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

 const { sck,sck1,cmd, getBuffer, tlang, prefix } = require('../lib')
 const Config = require('../config')
 const eco = require('discord-mongoose-economy')
 const ty = eco.connect(mongodb);
// Set the cooldown time to 1 hour (in milliseconds)
const hourlyCooldownTime = 1 * 60 * 1000 // 1 hour in milliseconds
const cooldownTime = 5 * 60 * 1000 // 5 minutes in milliseconds
const cooldowns = new Map()
const hourly = {
  cooldowns: {}
}
 /*
  cmd({
         pattern: "economy",
         desc: "daily gold.",
         category: "economy",
     },
     */
     //---------------------------------------------------------------------------
 cmd({
         pattern: "يومي",
         desc: "daily gold.",
         category: "اقتصاد",
         filename: __filename,
         react: "💷"
     },
     async(Void, citel, text,{ isCreator }) => {
        let zerogroup = (await sck.findOne({
            id: citel.chat,
        })) || (await new sck({
                id: citel.chat,
            })
            .save());
        let mongoschemas = zerogroup.economy || "false";
        if (mongoschemas == "false") return citel.reply("*العاب الايكونومي* مو مفعلة بالقروب");
         if (!citel.isGroup) return citel.reply(tlang().group);
	const secktor = "secktor"
	const daily  = await eco.daily(citel.sender, secktor, 2000); //give 500 for daily, can be changed
	 if (daily.cd) { //cdL is already formatted cooldown Left
        return await  citel.reply(`🧧 استلمت الجوائز اليومية، تعال بعد ${daily.cdL}🫡`)
	 } else {
	 citel.reply(`استلمت  ${daily.amount} 🪙 اليوم🎉.`);   
	 }
 }
 )

 cmd({
         pattern: "resetwallet",
         desc: "reset wallet of quoted user.",
         category: "اقتصاد",
         filename: __filename,
         react: "💷"
     },
     async(Void, citel, text,{ isCreator }) => {
        let zerogroup = (await sck.findOne({
            id: citel.chat,
        })) || (await new sck({
                id: citel.chat,
            })
            .save());
        let mongoschemas = zerogroup.economy || "false";
        if (mongoschemas == "false") return citel.reply("*🚦Economy* is not active in current group.");
	 if(!isCreator) return citel.reply(tlang().owner)
        let users = citel.mentionedJid ? citel.mentionedJid[0] : citel.msg.contextInfo.participant || false;
	if(!users) return citel.reply('Please give me user.')
        const balance  = await eco.balance(users, "secktor")
        await eco.deduct(users, "secktor", balance.wallet);
        return await citel.reply(`⛩️ User: @${users.split('@')[0]} \n *🧧 @${users.split('@')[0]} lost all 🪙 in wallet.*\n_Now live with that poverty.🫡_`,{mentions:[users]})
 }
 )
    //---------------------------------------------------------------------------
cmd({
  pattern: "capacity",
  desc: "update capacity.",
  category: "اقتصاد",
  filename: __filename,
  react: "💷"
},
async (Void, citel, text, { isCreator }) => {
  let zerogroup = (await sck.findOne({
    id: citel.chat,
  })) || (await new sck({
    id: citel.chat,
  }).save());
  let mongoschemas = zerogroup.economy || "false";
  if (mongoschemas == "false") return citel.reply("*🚦Economy* is not active in current group.");
  if (!citel.isGroup) return citel.reply(tlang().group);
  if (!text) return citel.reply(`💴 *Bank-capacity* 💳\n\n1 | *1000 sp* = 🪙100\n\n2 | *100000 sp* = 🪙1000\n\n3 | *10000000 sp* = 🪙10000000\n\nExample- ${prefix}capacity 1 OR ${prefix}bankupgrade 1000`)
  let user = citel.mentionedJid ? citel.mentionedJid[0] : citel.msg.contextInfo.participant || false;
  const secktor = "secktor";
  let value = text.trim();
  let k = parseInt(value);
  const balance = await eco.balance(user, secktor);
  switch (value) {
    case '1000':
    case '1':
      if (k < balance.wallet) {
        const deduct1 = await eco.deduct(user, secktor, 100);
        const add1 = await eco.giveCapacity(user, secktor, 1000);
        return await citel.reply(`*1000 🪙diamond storage has been added in ${citel.pushName} bank*`);
      } else {
        return citel.reply(`*_You need to pay 🪙100 to increase bank capacity ~ 1000 sp_*`);
      }
    case '100000':
    case '2':
      if (k < balance.wallet) {
        const deduct2 = await eco.deduct(user, secktor, 1000);
        const add2 = await eco.giveCapacity(user, secktor, 100000);
        return await citel.reply(`*100000 🪙diamond storage has been added in ${citel.pushName} bank*`);
      } else {
        return citel.reply(`*You need to pay 🪙1000 to increase bank capacity ~ 100000 sp*`);
      }
    case '10000000':
    case '3':
      if (k < balance.wallet) {
        const deduct3 = await eco.deduct(user, secktor, 10000);
        const add3 = await eco.giveCapacity(user, secktor, 10000000);
        return await citel.reply(`*10000000 🪙diamond storage has been added in ${citel.pushName}\'s bank*`);
      } else {
        return citel.reply(`You need to pay 🪙10000 to increase bank capacity ~ 1000 sp`);
      }
    default:
      return await citel.reply('*What are you trying to do📉*.');
  }
});


     //---------------------------------------------------------------------------
     cmd({
        pattern: "ايداع",
        desc: "deposit gold.",
        category: "اقتصاد",
        filename: __filename,
        react: "💷"
    },
    async(Void, citel, text,{ isCreator }) => {
        let zerogroup = (await sck.findOne({
            id: citel.chat,
        })) || (await new sck({
                id: citel.chat,
            })
            .save());
        let mongoschemas = zerogroup.economy || "false";
        if (mongoschemas == "false") return citel.reply("*🚦Economy* is not active in current group.");
      //  let users = citel.mentionedJid ? citel.mentionedJid[0] : citel.msg.contextInfo.participant || false;
        if (!text) return citel.reply("! 💰اضف المبلغ الذي تريد ايداعة");
        let d = parseInt(text)
        const deposit = await eco.deposit(citel.sender, "secktor", d);
        const balance = await eco.balance(citel.sender, "secktor")
        if(deposit.noten) return citel.reply('ماعندك المبلغ اللي بتسوي له ايداع، ياطفران.'); //if user states more than whats in his wallet
return await citel.reply(`⛩️ المرسل: ${citel.pushName}\n🍀تم 💰ايداع 🪙${deposit.amount} الى بنكك، طور سعة البنك عشان تودع اكثر📈.`)
    }
)
     cmd({
        pattern: "اغنياء",
        desc: "check leaderboard.",
        category: "اقتصاد",
        filename: __filename,
        react: "💷"
    },
    async(Void, citel, text,{ isCreator }) => {
	let h = await eco.lb('secktor',20);
	let str = `*توب ${h.length} اغنياء بالبوت، اذا ناقصك شيء كلمهم😏*\n`
	const { sck1 } = require('../lib');
	let arr = []
	 for(let i=0;i<h.length;i++){
            let username = await sck1.findOne({ id: h[i].userID })
            var tname;
            if (username.name && username.name !== undefined) {
                tname = username.name
            } else {
                tname = Void.getName(h[i].userID)
            }
str+= `*${i+1}*\n╭─────────────◆\n│ *الاسم:-* _${tname}_\n│ *اليوزر:-* _@${h[i].userID.split('@')[0]}_\n│ *المحفظة:-* _${h[i].wallet}_\n│ *البنك:-* _${h[i].bank}_\n│ *سعة البنك:-* _${h[i].bankCapacity}_\n╰─────────────◆\n\n`  	 
	 arr.push(h[i].userID)
	 }
	     citel.reply(str,{mentions:arr})
	     
     })

cmd({
    pattern: "تحويل",
    desc: "transfer gold.",
    category: "اقتصاد",
    filename: __filename,
    react: "💷"
},
async(Void, citel, text,{ isCreator }) => {
    let zerogroup = (await sck.findOne({
        id: citel.chat,
    })) || (await new sck({
            id: citel.chat,
        })
        .save());
    let mongoschemas = zerogroup.economy || "false";
    if (mongoschemas == "false") return citel.reply("*🚦Economy* مو مفعل بالقروب، كلم غومونريونغ يفعله");
    let value = text.trim().split(" ");
    if (value[0] === "") return citel.reply(`Use ${prefix}transfer 100 @user`);
    let user = citel.mentionedJid ? citel.mentionedJid[0] : citel.msg.contextInfo.participant || false;
    if(!user) return citel.reply('عطني يوزر احول له🤦‍♂️.');
    const secktor = "secktor"
        const user1 = citel.sender
        const user2 = user
        const word = value[0];
		const code = value[1];
        let d = parseInt(word)
		if (!d) return citel.reply("تاكد انك كاتب الامر صح👀");
        const balance = await eco.balance(user1, secktor);
        let a = (balance.wallet) < parseInt(word)
        //Returns wallet, bank, and bankCapacity. Also creates a USer if it doesn't exist.
        if(a == true) return citel.reply("ماعندك فلوس كافية تحولها👎");

        const deduct = await eco.deduct(user1, secktor, value[0]);
        const give = await eco.give(user2, secktor, value[0]);

return await citel.reply( `*📠 تم تحويل ${value[0]}  بنجاح💰*`)

}
)

     //---------------------------------------------------------------------------
     cmd({
        pattern: "محفظة",
        desc: "shows wallet.",
        category: "اقتصاد",
        filename: __filename,
        react: "💷"
    },
    async(Void, citel, text,{ isCreator }) => {
        let zerogroup = (await sck.findOne({
            id: citel.chat,
        })) || (await new sck({
                id: citel.chat,
            })
            .save());
        let mongoschemas = zerogroup.economy || "false";
        if (mongoschemas == "false") return citel.reply("*🚦Economy* مو مفعل بالقروب، كلم غومونريونغ يفعله");
         const secktor = "secktor"
         const balance = await eco.balance(citel.sender, secktor); //Returns wallet, bank, and bankCapacity. Also creates a USer if it doesn't exist.
return await citel.reply(`*💳 محفظة ${citel.pushName}:*\n\n_🪙${balance.wallet}_`)
    }
)
//---------------------------------------------------------------------------
cmd({
  pattern: "مغامرة",
  desc: "ابدأ مغامرة جديدة.",
  category: "ترفيه",
  filename: __filename,
  react: "🗺️"
},
async (Void, citel, text) => {
  let zerogroup = (await sck.findOne({
    id: citel.chat,
  })) || (await new sck({
    id: citel.chat,
  }).save());
  let mongoschemas = zerogroup.economy || "false";
  if (mongoschemas == "false") return citel.reply("الألعاب الاقتصادية غير مفعلة في هذه المجموعة.");
  if (!citel.isGroup) return citel.reply("خاص بالقروبات");
  const sector = "Rin";
  const adventure = await eco.startAdventure(citel.sender, sector, 2000);
  if (adventure.error) {
    return citel.reply(`فيه خطأ: ${adventure.error}`);
  } else {
    const coinsReward = 1000; // المبلغ من العملات الذي سيحصل عليه اللاعب عند إكمال المغامرة
    const completed = await eco.completeAdventure(citel.sender, sector, adventure.adventureID, coinsReward);
    if (completed.error) {
      return citel.reply(`فيه خطأ: ${completed.error}`);
    } else {
      return citel.reply(`مبروك! لقد أكملت المغامرة وحصلت على ${coinsReward} عملة!`);
    }
  }
});
     //---------------------------------------------------------------------------
     cmd({
        pattern: "منح",
        desc: "Add money in wallet.",
        category: "اقتصاد",
        filename: __filename,
        react: "💷"
    },
    async(Void, citel, text,{ isCreator }) => {
        if(!isCreator) return

         const secktor = "secktor"
         let users = citel.mentionedJid ? citel.mentionedJid[0] : citel.msg.contextInfo.participant || false;
         if(!users) return citel.reply('منشن اللي بتعطيه فلوس')
         await eco.give(users, secktor, parseInt(text.split(' ')[0]));
        return await Void.sendMessage(citel.chat,{text: `تمت اضافة 📈 ${parseInt(text.split(' ')[0])} الى محفظة @${users.split('@')[0]} 🛸.`,mentions:[users]},{quoted:citel})

    }
)

     //---------------------------------------------------------------------------
     cmd({
        pattern: "بنك",
        desc: "shows bank amount.",
        category: "اقتصاد",
        filename: __filename,
        react: "💷"
    },
    async(Void, citel, text,{ isCreator }) => {
        let zerogroup = (await sck.findOne({
            id: citel.chat,
        })) || (await new sck({
                id: citel.chat,
            })
            .save());
        let mongoschemas = zerogroup.economy || "false";
        if (mongoschemas == "false") return citel.reply("*🚦Economy* مو مفعل بالقروب، كلم غومونريونغ يفعله");
        const balance = await eco.balance(citel.sender, "secktor"); //Returns wallet, bank, and bankCapacity. Also creates a USer if it doesn't exist.
return await citel.reply(`🍀اليوزر: ${citel.pushName}\n\n_🪙${balance.bank}/${balance.bankCapacity}_`)
    }
)

     //---------------------------------------------------------------------------


function cdl(duration) {
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `${days} يوم${days > 1 ? '' : ''}`;
    } else if (hours > 0) {
        return `${hours} ساعة${hours > 1 ? '' : ''}`;
    } else if (minutes > 0) {
        return `${minutes} دقيقة${minutes > 1 ? '' : ''}`;
    } else {
        return `${seconds} ثانية${seconds > 1 ? '' : ''}`;
    }
}

cmd({
  pattern: "سرقة",
  desc: "rob bank amount.",
  category: "اقتصاد",
  filename: __filename,
}, async (Void, citel, text, { isCreator }) => {
  // Get the user ID of the person running the command
  const userId = citel.sender

  // Check if there's an hourly cooldown for this user
  if (hourly.cooldowns[userId] && hourly.cooldowns[userId] > Date.now()) {
    // Get the remaining time on the cooldown
    const remainingTime = hourly.cooldowns[userId] - Date.now()

    // Send a message indicating how long the user needs to wait
    return citel.reply(`🫡 تعال بعد ${cdl(remainingTime)} لتسرق مرة أخرى.`)
  }

  // Set the hourly cooldown for this user
  hourly.cooldowns[userId] = Date.now() + hourlyCooldownTime

  // Check if there's a regular cooldown for this user
  if (cooldowns.has(userId)) {
    // Get the remaining time on the cooldown
    const remainingTime = cooldowns.get(userId) - Date.now()

    // If the cooldown hasn't expired yet, send a message indicating how long the user needs to wait
    if (remainingTime > 0) {
      return citel.reply(`🫡 تعال بعد ${cdl(remainingTime)} لتسرق مرة أخرى.`)
    }
  }

  // Set the regular cooldown for this user
  cooldowns.set(userId, Date.now() + cooldownTime)

    // The rest of the command code goes here...
    let zerogroup = (await sck.findOne({
        id: citel.chat,
    })) || (await new sck({
        id: citel.chat,
    }).save());
    let mongoschemas = zerogroup.economy || "false";
    if (mongoschemas == "false") return citel.reply("🚦Economy is not active in current group.");
    let users = citel.mentionedJid ? citel.mentionedJid[0] : citel.msg.contextInfo.participant || false;
    if(!users) return citel.reply('منشن شخص تسرقه.')
    const user1 = citel.sender
    const user2 = users
    const secktor = "secktor"
    const k = 1000
    const balance1 = await eco.balance(user1, secktor)
    const balance2 = await eco.balance(user2, secktor)
    const typ = ['ran','rob','caught'];
    const random = typ[Math.floor(Math.random() * typ.length)];
    if (k > balance1.wallet) return citel.reply('*☹️ ماعندك فلوس تدفع الغرامة اذا انمسكت، اترك السرقة لاهلها*');
    if (k > balance2.wallet) return citel.reply('*ضحيتك طفرانة، اختر شخص معه فلوس وش تبي بالطفارى🫤*');
    let tpy = random
    switch (random) {
        case 'ran':
            await citel.reply('*ضحيتك هرب، واضح انك مب يم السرقة حاول تغير مهنتك🫰.*')
            ////citel.react('🥹')
            break
        case 'rob':
            const deduff = Math.floor(Math.random() * 1000)	    
            await eco.deduct(user2, secktor, deduff);
            await eco.give(citel.sender, secktor, deduff);
            await citel.reply(`*🤑 تم الزرف.🗡️*\nهربت ومعك ${deduff} في مخباك.`)
            ////citel.react('💀')
            break
        case 'caught':
            const rmoney = Math.floor(Math.random() * 1000)
            await eco.deduct(user1, secktor, rmoney);
            await citel.reply(`*مسكوك👮 الشرطة , وغرموك ${rmoney} 🪙 , معوض خير🥹.*`)
            ////citel.react('😦')
            break
        default:
            await citel.reply('*وش قاعد تسوي؟👀*.')
            //citel.react('🤔')
    }

});
     //---------------------------------------------------------------------------
     cmd({
        pattern: "سحب",
        desc: "withdraw money from bank account.",
        category: "اقتصاد",
        filename: __filename,
        react: "💷"
    },
    async(Void, citel, text,{ isCreator }) => {
        let zerogroup = (await sck.findOne({
            id: citel.chat,
        })) || (await new sck({
                id: citel.chat,
            })
            .save());
        let mongoschemas = zerogroup.economy || "false";
        if (mongoschemas == "false") return citel.reply("*🚦Economy* is not active in current group.");
        const user = citel.sender
		if (!text) return citel.reply("*اكتب المبلغ💰 اللي تبي تسحبه💳!*");
		const query = text.trim();
        const secktor = "secktor"
        const withdraw = await eco.withdraw(user, secktor, query);
        if(withdraw.noten) return citel.reply('*🏧 ماعندك فلوس بالبنك عشان تسحبها🫤*'); //if user states more than whats in his wallet
        const add = eco.give(user, secktor, query);
          citel.reply(`*🏧 تنبية* \n _🪙${withdraw.amount} تم سحب المبلغ من البنك💰._`)
    }
)

     //---------------------------------------------------------------------------
    

 
