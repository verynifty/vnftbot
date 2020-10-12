require('dotenv').config()
const Telegraf = require("telegraf");
const bot = new Telegraf(process.env.TELEGRAM_KEY);
const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)
const { ethers } = require("ethers");
const BigNumber = require('bignumber.js');

const VNFTAbi = require("./VNFT.abi")
const VNFTAddress = require("./VNFT.address")


var provider = new ethers.providers.JsonRpcProvider(`https://mainnet.infura.io/v3/${process.env.INFURA}`);
const vnftContract = new ethers.Contract(VNFTAddress, VNFTAbi, provider);


bot.command("vnft", async ctx => {
    try {

        let msg = ctx.update.message.text;

        const vnftId = parseInt(msg.replace("/vnft", ""));


        const vnftDetails = await vnftContract.getVnftInfo(vnftId)

        const nftId = vnftDetails[0].toNumber()
        const isAlive = vnftDetails[1]
        const score = vnftDetails[2].toNumber()
        const level = vnftDetails[3].toNumber()
        let expectedReward = BigNumber(vnftDetails[4]._hex);
        expectedReward = expectedReward.shiftedBy(-18).toFixed(2);
        const timeUntilStarving = vnftDetails[5].toNumber()
        const lastTimeMined = vnftDetails[6].toNumber()
        const timeVnftBorn = vnftDetails[7].toNumber()
        const owner = vnftDetails[8]
        const originAddress = vnftDetails[9]
        const originTokenId = vnftDetails[10].toNumber();


        const starvingAt = dayjs(timeUntilStarving * 1000);
        const todHrsLeft = starvingAt.diff(dayjs(), "hours");
        
        const tod = isAlive ? `TOD: ${todHrsLeft} hrs` : `TOD: dead`;

        
        await ctx.reply(`ID: #${nftId} \n` +
                        `${tod} \n` +
                        `level: ${level} \n` +
                        `Last Mined: ${dayjs(lastTimeMined * 1000).format("D-M HH:mm")} \n`+ 
                        `Score: ${score} \n` +
                        `Current reward: ${expectedReward}muse \n`
        )

    } catch(e) {
        console.log(e)
        ctx.reply("Wrong command")
    }

});



bot.launch();