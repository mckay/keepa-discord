import { Events } from 'discord.js';
import Event from '../templates/Event.js';
export default new Event({
    name: Events.ClientReady,
    once: true,
    execute() {
        // Runs when the bot logs in
        console.log(`Logged in as ${client.user?.tag}!`);
    },
});
