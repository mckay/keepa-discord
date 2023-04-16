/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { REST } from '@discordjs/rest';
import { Routes } from 'discord.js';
import { readdirSync } from 'fs';
const { TOKEN, CLIENT_ID } = process.env;
export default async function deployGlobalCommands() {
    const commands = [];
    const commandFiles = readdirSync('./commands').filter((file) => file.endsWith('.js') || file.endsWith('.ts'));
    for (const file of commandFiles) {
        const command = (await import(`./commands/${file}`))
            .default;
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
}
