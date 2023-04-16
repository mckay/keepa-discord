import { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import ApplicationCommand from '../templates/ApplicationCommand.js';
import 'dotenv/config'
const { KEEPA_API_KEY } = process.env
import fetch from 'node-fetch';

function formatNumberWithDecimal(interval: number): number {
    const formattedNumber = interval / 100;
    return formattedNumber;
}

function formatWeightWithDecimal(weight: number): number {
    const formattedWeight = weight / 1000;
    return formattedWeight;
}

function formatPriceWithDecimal(price: number): string {
    const formattedPrice = (price / 100).toFixed(2);
    return formattedPrice;
}

function convertTime(trackingSince: number): string {
    const date = new Date(trackingSince);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    };
    const readableDate = new Intl.DateTimeFormat('en-US', options).format(date);
    return readableDate;
}

function getFirstImage(imagesCSV: string): string {
    const firstImage = imagesCSV.split(',')[0];
    return `https://images-na.ssl-images-amazon.com/images/I/${firstImage}`;
}

export default new ApplicationCommand({
  data: new SlashCommandBuilder()
    .setName('keepa')
    .setDescription("Product details and performance insights via Keepa.")
    .addStringOption((option) =>
      option
        .setName('asin')
        .setDescription('The ASIN of the product you want to display the chart for')
        .setRequired(true)
    ),
  execute: async (interaction) => {
    const ASIN = interaction.options.getString('asin');
    const response = await fetch(`https://api.keepa.com/product?key=${KEEPA_API_KEY}&domain=1&asin=${ASIN}&buybox=1&amazon=1&used=0&salesrank=1&bb=1&history=1&stats=1&fba=1&fbafee=1&condition=1&rating=1&update=1&only-live-offers=1`);
    const JSONresponse = await response.json();
    const productDetails = JSONresponse.products[0];

    const UPC = productDetails.upcList[0];
    const FBAFee = formatNumberWithDecimal(productDetails.fbaFees.pickAndPackFee);
    const packageDimentions = formatNumberWithDecimal(productDetails.packageWidth) + " X " + formatNumberWithDecimal(productDetails.packageLength) + " X " + formatNumberWithDecimal(productDetails.packageHeight);
    const packageWeight = formatWeightWithDecimal(productDetails.packageWeight);

    const pricingStats = productDetails.stats;
    const BBPrice = formatPriceWithDecimal(pricingStats.buyBoxPrice);
    const isBBFba = pricingStats.buyBoxIsFBA;
    const BBFBA = isBBFba ? 'Yes' : 'No';
    const imagesCSV = productDetails.imagesCSV;
    const hasParentASIN = productDetails.parentASIN;
    const parentASIN = hasParentASIN ? `${productDetails.parentASIN}` : 'No Parent ASIN';
    const variations = productDetails.variations || 'No Variations'; 

    const embed = new EmbedBuilder()
    .setColor(16777215)
    .setTitle(`${productDetails.title}`)
    .setURL(`https://amazon.com/dp/${ASIN}`)
    .setDescription(`Product Details :point_right: ${productDetails.description}. \n\n Keepa has been tracking this product since ${convertTime(productDetails.trackingSince)}`)
    .setThumbnail(`${getFirstImage(imagesCSV)}`)
    .addFields(
        { name: 'UPC :bookmark: ', value: `${UPC || "None Available"}`, inline: true },
        { name: 'FBA Fee :dollar: ', value: `$${FBAFee}`, inline: true },
        { name: 'Buy Box Price (USD) :dollar: ', value: `$${BBPrice}`, inline: true },
        { name: 'Is Buy Box FBA? ', value: `${BBFBA}`, inline: true},
        { name: 'Package Size :package: ', value: `${packageDimentions}`, inline: true },
        { name: 'Package Weight :package: ', value: `${packageWeight}`, inline: true},
        { name: 'Product Variations :bookmark:', value: `${variations}`, inline: true},
        { name: 'Parent ASIN :bookmark: ', value: `${parentASIN}`, inline: true }

    )
    .setTimestamp()
    .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
    
    const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel('Keepa')
            .setURL(`https://keepa.com/#!product/1-${ASIN}`),

            new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel('Amazon')
            .setURL(`https://amazon.com/dp/${ASIN}`),

            new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel('Scan Barcode')
            .setURL(`https://www.upcitemdb.com/upc/${UPC}`),

            new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel('Seller Amp')
            .setURL(`https://sas.selleramp.com/sas/lookup?SasLookup%5Bsearch_term%5D=${ASIN}`),
        );
    await interaction.reply({ embeds: [embed], components: [row] });

  },

});

