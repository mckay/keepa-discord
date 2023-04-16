import Event from '../templates/Event.js';
import { Events } from 'discord.js';
const { prefix } = await import('../config.json', {
    assert: { type: 'json' },
});
export default new Event({
    name: Events.MessageCreate,
    async execute(message) {
        // ! Message content is a priviliged intent now!
        // Handles non-slash commands, only recommended for deploy commands
        // filters out bots and non-prefixed messages
        if (!message.content.startsWith(prefix) || message.author.bot)
            return;
        // fetches the application owner for the bot
        if (!client.application?.owner)
            await client.application?.fetch();
        // get the arguments and the actual command name for the inputted command
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = client.msgCommands.get(commandName) ||
            client.msgCommands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
        // dynamic command handling
        if (!command)
            return;
        try {
            await command.execute(message, args);
        }
        catch (error) {
            console.error(error);
        }
    },
});
