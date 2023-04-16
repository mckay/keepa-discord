import { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import ApplicationCommand from '../templates/ApplicationCommand.js';
import 'dotenv/config'
const { KEEPA_API_KEY } = process.env
import fetch from 'node-fetch';

interface BrandStat {
    brand: string;
    productCount: number;
    avg30SalesRank: number;
    productCountWithAmazonOffer: number;
}

function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
  
function getBrandStats(brandStatsArray: BrandStat[]): string {
    let output = '';
    brandStatsArray.forEach((brandStat) => {
        const brandNameWithHyphens = brandStat.brand.replace(/ /g, '-');
        const capitalizedBrandName = capitalizeFirstLetter(brandStat.brand);
        output += `[${capitalizedBrandName}](https://www.amazon.com/${brandNameWithHyphens}) | ${brandStat.productCount} ASIN(s) \n`;
    });

    return output.trim();
}

function parseASINList(asinArray: string[]): string {
    const maxAsins = 25;
    const formattedAsins = asinArray.slice(0, maxAsins).map((asin, index) => `ASIN ${index + 1}: ${asin}`).join('\n');
    return '```json\n' + formattedAsins + '\n```';
}
  

export default new ApplicationCommand({
  data: new SlashCommandBuilder()
    .setName('sellerinfo')
    .setDescription("View Performance and Information for a given seller.")
    .addStringOption((option) =>
      option
        .setName('sellerid')
        .setDescription('The Seller ID of the seller you want to view information for')
        .setRequired(true)
    ),
  execute: async (interaction) => {
    const defaultSellerID = "NONE";
    const sellerID = interaction.options.getString('sellerid') ?? defaultSellerID;
    const response = await fetch(`https://api.keepa.com/seller?key=${KEEPA_API_KEY}&domain=1&seller=${sellerID}&storefront=1`);
    const JSONresponse = await response.json();
    console.log("[Seller Info] Response Status - " + response.status)
    const sellerDetails = JSONresponse.sellers?.[sellerID];
    const sellerName = sellerDetails.sellerName;
    const currentRating = sellerDetails.currentRating;
    const currentRatingCount = sellerDetails.currentRatingCount;
    const ratingInLast30Days = sellerDetails.ratingsLast30Days;
    const hasFBAListings = sellerDetails.hasFBA ? "Yes" : "No";
    const isScammer = sellerDetails.isScammer ? "Keepa believes that this storefront is __not safe__ for buyers." : "Keepa believes that this storefront is __safe__ for buyers.";
    const businessAddress = sellerDetails.address;
    const totalASINS = sellerDetails.asinList.length;
    const brandData = sellerDetails.sellerBrandStatistics;

    const embed = new EmbedBuilder()
    .setColor(12370112)
    .setTitle(`Storefront Info :trophy: ${sellerName}`)
    .setURL(`https://www.amazon.com/gp/aag/main?ie=UTF8&seller=${sellerID}`)
    .setDescription(`${isScammer}`)
    .setThumbnail(`https://play-lh.googleusercontent.com/ZfiJshhzZNH796dxKeiZcNHyBoYEfxXwbPhGuo8Y0v7PEaRC_z5ftyLTW67bjZfQfA`)
    .addFields(
        { name: 'Current Rating :printer: ', value: `${currentRating}%`, inline: true },
        { name: 'Review Count :star: ', value: `${currentRatingCount} (${ratingInLast30Days} reviews in the last 30 days)`, inline: true },
        { name: 'Seller Address :office: ', value: "``"+businessAddress+"``", inline: true },
        { name: 'Total ASINs :bookmark: ', value: `${totalASINS}`, inline: true },
        { name: 'Does Seller use FBA? :truck: ', value: `${hasFBAListings}`, inline: true},
        { name: 'Brand Stats :bookmark: ', value: `${getBrandStats(brandData)}`, inline: true },
        { name: 'ASIN List (Limit 25) :notepad_spiral: ', value: `${parseASINList(sellerDetails.asinList)}`, inline: true },
    )
    .setTimestamp()
    .setFooter({ text: 'Keepa - Storefront Info', iconURL: 'https://discuss.keepa.com/user_avatar/discuss.keepa.com/keepa/45/14_2.png' });
    
    const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel('View Seller on Amazon')
            .setURL(`https://www.amazon.com/gp/aag/main?ie=UTF8&seller=${sellerID}`),

            new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel('View Seller on Keepa')
            .setURL(`https://keepa.com/#!seller/1-${sellerID}`),

        );
    await interaction.reply({ embeds: [embed], components: [row] });


  },

});

