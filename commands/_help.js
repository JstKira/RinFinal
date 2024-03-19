
const os = require('os')
const moment = require("moment-timezone")
const fs = require("fs")
const Config = require('../config')
let { fancytext, tlang, tiny, runtime, formatp, botpic, prefix, sck1 } = require("../lib");
const long = String.fromCharCode(8206)
const readmore = long.repeat(4001)
const Secktor = require('../lib/commands')

    //---------------------------------------------------------------------------
Secktor.cmd({
    pattern: "اوامر",
    alias: ["menu"],
    desc: "قائمة المساعدة",
    category: "عام",
    react: "✨",
    filename: __filename
},
async(Void, citel, text) => {
    const { commands } = require('../lib');
    if (text.split(" ")[0]) {
        let arr = [];
        const cmd = commands.find((cmd) => cmd.pattern === (text.split(" ")[0].toLowerCase()))
        if (!cmd) return await citel.reply("*❌مافيه امر كذا*");
        else arr.push(`*🍁الامر:* ${cmd.pattern}`);
        if (cmd.category) arr.push(`*🧩التصنيف:* ${cmd.category}`);
        if (cmd.alias) arr.push(`*🧩يسمى ايضا:* ${cmd.alias}`);
        if (cmd.desc) arr.push(`*🧩الوصف:* ${cmd.desc}`);
        if (cmd.use) arr.push(`*〽️الاستخدام:*\n \`\`\`${prefix}${cmd.pattern} ${cmd.use}\`\`\``);
        return await citel.reply(arr.join('\n'));
    } else {
        const cmds = {}
        commands.map(async(command, index) => {
            if (command.dontAddCommandList === false && command.pattern !== undefined) {
                if (!cmds[command.category]) cmds[command.category] = []
                cmds[command.category].push(command.pattern)
            }
        })
        const time = moment(moment())
            .format('HH:mm:ss')
        moment.tz.setDefault('Asia/Riyadh')
            .locale('id')
        const date = moment.tz('Asia/Riyadh').format('DD/MM/YYYY')
        let total = await sck1.countDocuments()
        let str = `───〔 ` + fancytext(Config.ownername.split(' ')[0], 58) + ` 〕───\n`
        str += '' + `\n` + ''
        for (const category in cmds) {
            str += `*╮*────♢ ${tiny(category)} ♢────*╭* \n`;
            if (text.toLowerCase() == category.toLowerCase()){
                str = `*╮*────♢ ${tiny(category)} ♢────*╭*  \n`;
                for (const plugins of cmds[category]) {
                    str += `│ ${fancytext(plugins,1)} │\n`;
                }
                str += `═══════════════⊷\n`;
                break;
            }
            else {
                for (const plugins of cmds[category]) {
                    str += `│ ${fancytext(plugins,1)} │\n`;
                }
                str += `═══════════════⊷\n`;
            }
        }
        str += `*⭐️:* _${prefix} ${prefix}\n*صنع بحب ❤️ من قبل غومونريونغ* `;
        const buttonMessage = {
            image: {
                url: await botpic()
            },
            caption: str
        };
        return await Void.sendMessage(citel.chat, buttonMessage);
    }
})
