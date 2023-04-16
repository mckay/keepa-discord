/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { readdirSync } from 'fs';
import MessageCommand from '../templates/MessageCommand.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord.js';
const { TOKEN, CLIENT_ID } = process.env;
const { prefix } = await import('../config.json', {
    assert: { type: 'json' },
});
export default new MessageCommand({
    name: 'deploy',
    description: 'Deploys the slash commands',
    async execute(message, args) {
        if (message.author.id !== client.application?.owner?.id)
            return;
        if (!args[0]) {
            await message.reply(`Incorrect number of arguments! The correct format is \`${prefix}deploy <guild/global>\``);
            return;
        }
        if (args[0].toLowerCase() === 'global') {
            // global deployment
            const commands = [];
            const commandFiles = readdirSync('./commands').filter((file) => file.endsWith('.js') || file.endsWith('.ts'));
            for (const file of commandFiles) {
                const command = (await import(`./commands/${file}`)).default;
                const commandData = command.data.toJSON();
                commands.push(commandData);
            }
            const rest = new REST({ version: '10' }).setToken(TOKEN);
            try {
                console.log('Started refreshing application (/) commands.');
                await rest.put(Routes.applicationCommands(CLIENT_ID), {
                    body: commands,
                });
                console.log('Successfully reloaded application (/) commands.');
            }
            catch (error) {
                console.error(error);
            }
            await message.reply('Deploying!');
        }
        else if (args[0].toLowerCase() === 'guild') {
            // guild deployment
            const commands = [];
            const commandFiles = readdirSync('./commands').filter((file) => file.endsWith('.js') || file.endsWith('.ts'));
            for (const file of commandFiles) {
                const command = (await import(`./commands/${file}`)).default;
                const commandData = command.data.toJSON();
                commands.push(commandData);
            }
            const rest = new REST({ version: '10' }).setToken(TOKEN);
            try {
                console.log('Started refreshing application (/) commands.');
                await rest.put(Routes.applicationGuildCommands(CLIENT_ID, message.guild?.id), {
                    body: commands,
                });
                console.log('Successfully reloaded application (/) commands.');
            }
            catch (error) {
                console.error(error);
            }
            await message.reply('Deploying!');
        }
    },
});
