require("dotenv").config();

const Telegraf = require("telegraf");
const extra = require("telegraf/extra");
const markup = extra.markdown();
const bot = new Telegraf(process.env.VNFT_DEAD_BOT);

const soon = require("./soon.js");

var CronJob = require("cron").CronJob;
// check every 15 mins if someone gonna die within 30
var job = new CronJob(
  "*/30 * * * *", // "*/30 * * * *"
  async function () {
    const minTime = 2 * 60 * 62; //30mins
    const msgs = await soon(minTime);
    console.log(msgs);
    if (msgs.length > 0) {
      for (msg of msgs) {
        bot.telegram.sendMessage(
          "-1001164170495", //"438453914", //"-1001164170495"
          msg,
          markup
        );
      }
    }
  },
  null,
  true,
  "America/Los_Angeles"
);

job.start();

bot.launch();
