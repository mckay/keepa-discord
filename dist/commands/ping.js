import { SlashCommandBuilder } from 'discord.js';
import ApplicationCommand from '../templates/ApplicationCommand.js';
export default new ApplicationCommand({
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies pong!'),
    async execute(interaction) {
        await interaction.reply('Pong!');
    },
});
