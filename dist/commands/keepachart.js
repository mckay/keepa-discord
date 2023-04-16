import { SlashCommandBuilder } from 'discord.js';
import ApplicationCommand from '../templates/ApplicationCommand.js';
export default new ApplicationCommand({
    data: new SlashCommandBuilder()
        .setName('Keepa')
        .setDescription("Displays a chart of a products price history.")
        .addStringOption((option) => option
        .setName('asin')
        .setDescription('The ASIN of the product you want to display the chart for')
        .setRequired(true)),
    execute: async (interaction) => {
        // Retrieve the ASIN from the interaction
        const asin = interaction.options.getString('asin');
        // You can now use the ASIN value in your code
        await interaction.reply(`You requested the chart for ASIN: ${asin}`);
    },
});
