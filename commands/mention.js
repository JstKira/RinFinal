const { sck, sck1,cmd, jsonformat, botpic, TelegraPh, RandomXP, Config, tlang, warndb, sleep,getAdmin,getBuffer, prefix } = require('../lib')

//-----------------------------------
//-----------------------------------

cmd({
        pattern: "منشن",
        desc: "Tags every person of group.",
        category: "group",
        filename: __filename,
    },
    async(Void, citel, text,{ isCreator }) => {
        if (!citel.isGroup) return citel.reply(tlang().group);
        const groupMetadata = citel.isGroup ? await Void.groupMetadata(citel.chat).catch((e) => {}) : "";
        const participants = citel.isGroup ? await groupMetadata.participants : "";
        const groupAdmins = await getAdmin(Void, citel)
        const isAdmins = citel.isGroup ? groupAdmins.includes(citel.sender) : false;
        if (!isAdmins) return citel.reply(tlang().admin);

        let textt = `────────── ✦ ──────────
    🔔 *منشن جماعي* 🔔

➤ *الرسالة:* ${text ? text : "blank"}\n\n
➤ *المرسل:* ${citel.pushName} 🏷️
────────── ✦ ──────────
`
        for (let mem of participants) {
            textt += `📍 @${mem.id.split("@")[0]}\n`;
        }
        Void.sendMessage(citel.chat, {
            text: textt,
            mentions: participants.map((a) => a.id),
        }, {
            quoted: citel,
        });
    }
)
