const { sck, sck1, cmd, jsonformat, botpic, TelegraPh, RandomXP, Config, tlang, warndb, sleep, getAdmin, getBuffer, prefix } = require('../lib')
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
    async (Void, citel, text, { isCreator }) => {
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
                'warnedby': citel.pushName,
                'date': timesam
            }).save();

            Void.sendMessage(citel.chat, {
                'text': '╭───────────────╮\n' +
                    '│----⚠️ انذار ⚠️----│\n' +
                    '│\n' +
                    '│👤 المستخدم: ' + citel.quoted.sender.split('@')[0] + '│\n' +
                    '│❌ السبب: ' + text + '│\n' +
                    '│👮‍♂️ معطي الانذار: ' + citel.pushName + '│\n' +
                    '╰───────────────╯',
                'mentions': [citel.quoted.sender]
            }, {
                'quoted': citel
            });

            const h = await warndb.find({ 'id': citel.quoted.sender.split('@')[0] + 'warn' });
            const Config = require('../config');

            if (h.length > Config.warncount) {
               let teskd = h.length + ' *انذارات*\n\n';

for (let i = 0; i < h.length; i++) {
    teskd += '╭───────────────╮\n';
    teskd += '*⎙ المرسل:* ' + h[i].warnedby + '\n';
    teskd += '*الوقت:* ' + h[i].date + '\n';
    teskd += '*السبب:* ' + h[i].reason + '\n';
    teskd += '╰───────────────╯\n\n';
}

                citel.reply(teskd);
            }
        } catch (Y) {
            console.error(Y);
        }
    });

//----------------------------------
//----------------------------------

cmd({
            pattern: "انذارات",
            desc: "Check warns",
            category: "للمشرفين",
            filename: __filename,
            use: '<quoted/reply user.>',
        },
        async(Void, citel, text) => {
            if (!citel.isGroup) return citel.reply('خاص بالمجموعات.')
            if (!citel.quoted) return citel.reply('منشن اللي بتشوف انذاراته')
            teskd = `*جميع الانذارات*\n\n`
            let h = await warndb.find({ id: citel.quoted.sender.split('@')[0] + 'warn' })
            console.log(h)
            teskd += `*عنده ${h.length}  انذار/ات.*\n`
            for (let i = 0; i < h.length; i++) {
                teskd += `*${i+1}*\n╭─────────────◆\n│ *🍁المجموعة:-* ${h[i].group}\n`
                teskd += `│ *🔰الوقت:-* ${h[i].date}\n`
                teskd += `│ *⚠️تم اصدار الانذار من قبل:-* ${h[i].warnedby}\n`
                teskd += `│ _📍السبب: ${h[i].reason}_\n╰─────────────◆\n\n`
            }
            citel.reply(teskd)
        }

    )


