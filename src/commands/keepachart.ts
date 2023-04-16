import { EmbedBuilder, SlashCommandBuilder, AttachmentBuilder } from 'discord.js';
import ApplicationCommand from '../templates/ApplicationCommand.js';
import 'dotenv/config'
import fs from 'fs';
import fetch from 'node-fetch';
const { KEEPA_API_KEY } = process.env

export default new ApplicationCommand({
  data: new SlashCommandBuilder()
    .setName('keepachart')
    .setDescription("Product price chart via Keepa.")
    .addStringOption((option) =>
      option
        .setName('asin')
        .setDescription('The ASIN of the product you want to display the chart for')
        .setRequired(true)
    )
    .addStringOption(option =>
        option.setName('timeframe')
            .setDescription('The timeframe you want to display the chart for.')
            .setRequired(true)
            .addChoices(
                { name: '1 Week', value: '7' },
                { name: '1 Month', value: '30' },
                { name: '3 Months', value: '90' },
                { name: '6 Months', value: '180' },
                { name: '1 Year', value: '365' },
            )),
  execute: async (interaction) => {
    const ASIN = interaction.options.getString('asin');
    const range = interaction.options.getString('timeframe');
    const response = await fetch(`https://api.keepa.com/graphimage?key=${KEEPA_API_KEY}&domain=1&asin=${ASIN}&salesrank=1&bb=1&fba=1&fbm=1&range=${range}`);

    const imagePath = `./images/${ASIN}.png`;
    const fileStream = fs.createWriteStream(imagePath);
    response.body.pipe(fileStream);

    await new Promise((resolve) => fileStream.on('finish', resolve));
    const attachment = new AttachmentBuilder(imagePath, { name: "graph.png" });
    const embed = new EmbedBuilder()
      .setTitle(`Price Chart for ${ASIN} over ${range} days`)
      .setURL(`https://keepa.com/#!product/1-${ASIN}`)
      .setColor(16777215)
      .setDescription('Product price chart via Keepa.')
      .setImage('attachment://graph.png') // Display image as attachment in embed
      .setTimestamp()
      .setFooter({ text: 'Powered by Keepa', iconURL: 'https://keepa.com/favicon.png' });

    await interaction.reply({ embeds: [embed], files: [attachment] });

    fs.unlink(imagePath, (err) => {
      if (err) console.error(err);
    });
  },
});
