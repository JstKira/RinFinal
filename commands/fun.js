/**
 Copyright (C) 2022.
 Licensed under the  GPL-3.0 License;
 You may not use this file except in compliance with the License.
 It is supplied in the hope that it may be useful.
 * @project_name : Secktor-Md
 * @author : SamPandey001 <https://github.com/SamPandey001>
 * @description : Secktor,A Multi-functional whatsapp bot.
 * @version 0.0.6
 **/
const { dare, truth, random_question } = require('../lib/truth-dare.js');
const axios = require('axios');
const { cmd } = require('../lib');
const { getRandomPoem } = require('../lib/poetry.js');
const fs = require('fs');
const path = require('path');
const quotesPath = path.join(__dirname, '..', 'lib', 'Quotes.json');
const speed = require('performance-now')
const fetch = require('node-fetch');

//......................................................

cmd({
    pattern: "ارسم",
    alias : ['تخيل','dall-e'],
    desc: "Create Image by AI",
    category: "ترفيه",
    use: '<an astronaut in mud.>',
    filename: __filename,
},
async(Void, citel,text,{isCreator}) => 
{
//if (!isCreator) return citel.reply(tlang().owner)
if (Config.OPENAI_API_KEY=='') return citel.reply('مشكلة بال API، كلم غومونريونغ يجدده');
if (!text) return citel.reply(`*وش تبيني ارسم لك؟*`); 
const imageSize = '256x256'
const apiUrl = 'https://api.openai.com/v1/images/generations';
const response = await fetch(apiUrl, {
method: 'POST',
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${Config.OPENAI_API_KEY}`
},
body: JSON.stringify({
  model: 'image-alpha-001',
  prompt: text,
  size: imageSize ,
  response_format: 'url'
})
});

const data = await response.json();
let buttonMessage = {
    image:{url:data.data[0].url},
    caption : '*---تفضل النتيجة---*'

}

Void.sendMessage(citel.chat,{image:{url:data.data[0].url}})
}
)
//......................................................
const Poetry = require('../lib/database/Poetry.js');


cmd({
  pattern: "قصيدة",
  desc: "يرسل قصيدة عشوائية",
  category: "ترفيه",
  filename: __filename,
}, async(Void, citel, text) => {



  const count = await Poetry.countDocuments();
  const randomIndex = Math.floor(Math.random() * count);
  const poem = await Poetry.findOne().skip(randomIndex);


  citel.reply(`${poem.content}\n\n- ${poem.poet}`);
})




function tlang() {
  return {
    owner: "خاص بغومونريونغ",
    addPoemSuccess: "تم إضافة القصيدة بنجاح!",
    addPoemError: "حدث خطأ أثناء إضافة القصيدة. يرجى المحاولة مرة أخرى.",
    addPoemMissingFields: "الرجاء تحديد محتوى القصيدة واسم الشاعر",
    addPoemReplyToMsg: "الرجاء الرد على رسالة لإضافة قصيدة جديدة",
  };
}

cmd({
  pattern: "أضف_قصيدة",
  desc: "يضيف قصيدة جديدة إلى قاعدة البيانات",
  category: "للمالك",
  filename: __filename,
},
async (match, citel, text, { isCreator }) => {
  // Check if the user is the owner of the bot
  if (!isCreator) {
    citel.reply(tlang().owner);
    return;
  }



  // Split text by hyphen and extract content and poet fields
  const [content, poet] = text.split("-").map((field) => field.trim());

  // Check if both content and poet are provided
  if (!content || !poet) {
    citel.reply(tlang().addPoemMissingFields);
    return;
  }

  // Create a new Poetry document and save it to the database
  const poem = new Poetry({
    content,
    poet,
  });
  try {
    await poem.save();
    citel.reply(tlang().addPoemSuccess);
  } catch (err) {
    console.error(err);
    citel.reply(tlang().addPoemError);
  }
});
//..........................................................


cmd({
  pattern: "مقولات",
  desc: "يرسل مقولة",
  category: "ترفيه",
  filename: __filename,
}, async (Void, citel, text) => {
  const quotes = JSON.parse(fs.readFileSync(quotesPath, 'utf8'));
  console.log('Parsed quotes:', quotes);
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  console.log('Random quote:', randomQuote);
  return citel.reply(`** ${JSON.stringify(randomQuote)}\n\n*Powered by غومونريونغ*`);
});
    //---------------------------------------------------------------------------
    cmd({
        pattern: "حقيقة",
        desc: "Sends quotes in chat.",
        category: "ترفيه",
        filename: __filename,
    },
    async(Void, citel, text) => {
        var quoo = await axios.get(`https://waqi3arabiya.com/api/quotes/random`)
        const replyf = `
╔════◇
║ *🎗️الحقيقة:* ${quoo.data.quote.body}
║ *:* ${quoo.data.quote.author}
║    
╚════════════╝ `
return citel.reply(replyf)
    }

)

  /* cmd({
        pattern: "عرف",
        desc: "urban dictionary.",
        category: "بحث",
        filename: __filename,
    },
    async(Void, citel, text) => {
        try{
            let { data } = await axios.get(`https://www.ionomy.com/api/v1/bilingual?format=json&term=${text}`)
            var textt = `
            Word: ${text}
            Definition: ${data.list[0].definition.replace(/\[/g, "").replace(/\]/g, "")}
            Example: ${data.list[0].example.replace(/\[/g, "").replace(/\]/g, "")}`
            return citel.reply(textt)
                    } catch {
                        return citel.reply(`ماحصلت نتائج ل ${text}`)
                    }
    }
)*/
