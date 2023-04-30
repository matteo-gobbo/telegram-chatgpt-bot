import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";

// load env keys
dotenv.config();

// OPEN AI configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// TELEGRAM BOT configuration
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
bot.start((ctx) => {
  console.log(ctx);
  ctx.reply("Welcome");
});

bot.on(message(), async (ctx) => {
  ctx.reply("I'm working for you :)");

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${ctx.message.text}`,
    max_tokens: 300,
    temperature: 0,
    top_p: 1,
    frequency_penalty: 0.5,
    presence_penalty: 0,
  });

  ctx.reply(completion.data.choices[0].text || "something went wrong :(");
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
