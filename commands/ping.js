const { CommandInteraction } = require("discord.js");

module.exports = {
    name: 'ping',
    aliases: ['latency'],
    description: 'send the latency of bot',
    cooldown: 5,
    category: 'Informations',
    /**
     * @param {CommandInteraction} interaction
     */
    execute(msg) {
        msg.delete().catch(console.log);
        msg.channel.send(`🏓 | The latency is ${msg.createdTimestamp - Date.now()}ms`).then(msg => setTimeout(() => msg.delete(), 5000));
    }
}