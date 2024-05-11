const { sck, sck1,cmd, jsonformat, botpic, TelegraPh, RandomXP, Config, tlang, warndb, sleep,getAdmin,getBuffer, prefix } = require('../lib')
const moment = require("moment-timezone");
const fs = require('fs-extra')
const Levels = require("discord-xp");

//----------------------------------
//----------------------------------

cmd({
    pattern: "انذار",
    desc: "يعطي مستخدم انذار في المجموعة.",
    category: "للمشرفين",
    filename: __filename,
    use: '<اقتباس|رد>',
},
 async(Void, citel, text,{ isCreator }) => {
             if (!citel.isGroup) return citel.reply('امر خاص بالمجموعات')
            const groupAdmins = await getAdmin(Void, citel)
            const isAdmins = citel.isGroup ? groupAdmins.includes(citel.sender) : false;
            if (!isAdmins) return citel.reply('خاص بالمشرفين.')

    const S = m;

    function Z() {
        const F = ['126402oKAcRa', 'date', 'تعدى حد الانذارات، اطرده او تعامل معه*\x0a', 'chat', '8qachoN', '580yXDZAo', 'groupParticipantsUpdate', '114528WgITIL', 'reply', 'groupMetadata', '│\x20*🔰الوقت:-*\x20', 'find', 'locale', 'log', '196311jXGmuc', 'quoted', 'save', '*\x0a╭─────────────◆\x0a│\x20*🍁\x20المجموعة:-*\x20', '759700KYdstU', 'warnedby', 'pushName', 'reason', '8dUtMfa', '2BlOCqD', '550MdvhLT', '*----انذار----*\x0aالمستخدم:\x20@', '54828ViphBF', 'subject', '1100323uEahgH', '30204512uUuJcj', '*عدد\x20انذاراته\x20', 'split', '│\x20*⚠️اللي\x20عطاه\x20الانذار:-*\x20', 'length', 'sender', 'setDefault', 'group', 'Asia/KOLKATA', '../config', '215XZLRSE', 'HH:mm:ss', 'warn'];
        Z = function () {
            return F;
        };
        return Z();
    }

    function m(Y, U) {
        const w = Z();
        return m = function (s, q) {
            s = s - 0x1dd;
            let B = w[s];
            return B;
        }, m(Y, U);
    }

    const timesam = moment().tz('Asia/KOLKATA').format('HH:mm:ss');

    try {
        const metadata = await Void.groupMetadata(citel.chat);
        await new warndb({
            'id': citel.quoted.sender.split('@')[0] + 'warn',
            'reason': text,
            'group': metadata.id,
            'warnedby': citel.sender,
            'date': timesam
        }).save();

        Void.sendMessage(citel.chat, {
            'text': S(0x1f2) + citel.quoted.sender.split('@')[0] + '\x0aالسبب:\x20' + text + '\x0aمعطي الانذار:\x20' + citel.sender,
            'mentions': [citel.quoted.sender]
        }, {
            'quoted': citel
        });

        const h = await warndb.find({ 'id': citel.quoted.sender.split('@')[0] + 'warn' });
        const Config = require('../config');
        
       if (h.length > Config.warncount) {
    let teskd = S(0x1f7) + h.length + ' انذارات.\n\n';

    for (let i = 0; i < h.length; i++) {
        teskd += '*' + (i + 1) + '⎙ المرسل: *' + h[i].warnedby + '\n';
        teskd += S(0x1f9) + 'الوقت: ' + h[i].date + '\n';
        teskd += '└ السبب: ' + h[i].reason + '\n\n';
    }
}

            
            citel.reply(teskd);
            await Void.groupRemove(citel.chat, [citel.quoted.sender]);
        }
    } catch (Y) {
        console.error(Y);
    }
});
