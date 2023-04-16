import { EmbedBuilder, SlashCommandBuilder} from 'discord.js';
import ApplicationCommand from '../templates/ApplicationCommand.js';
import 'dotenv/config'
const { KEEPA_API_KEY } = process.env
import fetch from 'node-fetch';

function msToReadableText(ms: number): string {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
  
    let readableText = '';
  
    if (hours > 0) {
      readableText += hours === 1 ? `${hours} hour ` : `${hours} hours `;
    }
    if (minutes > 0) {
      readableText += minutes === 1 ? `${minutes} minute ` : `${minutes} minutes `;
    }
    if (seconds > 0) {
      readableText += seconds === 1 ? `${seconds} second` : `${seconds} seconds`;
    }
  
    return readableText.trim() || '0 seconds';
}

export default new ApplicationCommand({
  data: new SlashCommandBuilder()
    .setName('keepatokens')
    .setDescription("View your Keepa API Token Status"),
  execute: async (interaction) => {
    const ASIN = interaction.options.getString('asin');
    const response = await fetch(`https://api.keepa.com/product?key=${KEEPA_API_KEY}&domain=1&asin=${ASIN}&buybox=1&amazon=1&used=0&salesrank=1&bb=1&history=1&stats=1&fba=1&fbafee=1&condition=1&rating=1&update=1&only-live-offers=1`);
    const JSONresponse = await response.json();
    const refillRate = JSONresponse.refillRate;
    const refillIn = JSONresponse.refillIn;
    const tokensLeft = JSONresponse.tokensLeft;


    const embed = new EmbedBuilder()
    .setColor(12370112)
    .setTitle(`Keepa API Token Status`)
    .setURL(`https://keepa.com/#!api`)
    .setThumbnail(`https://discuss.keepa.com/user_avatar/discuss.keepa.com/keepa/45/14_2.png`)
    .addFields(
        { name: 'Tokens Left', value: `${tokensLeft || "None Available"}`, inline: true },
        { name: 'Refill Rate :dollar: ', value: `${refillRate} tokens per Minute`, inline: false },
        { name: 'Refill In :alarm_clock: ', value: `${msToReadableText(refillIn)}`, inline: false },

    )
    .setTimestamp()
    .setFooter({ text: 'Keepa - Token Info', iconURL: 'https://discuss.keepa.com/user_avatar/discuss.keepa.com/keepa/45/14_2.png' });
    await interaction.reply({ embeds: [embed] });
  },

});

