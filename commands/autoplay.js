const emoji = require("./../config/emojis.json");

module.exports = {
    name: 'autoplay',
    aliases: ['ap'],
    description: 'Toggles autoplay',
    cooldown: 5,
    category: 'Music',

    async execute(msg, args, cmd, client) {
        msg.delete().catch(console.log);

        const queue = client.distube.getQueue(msg.guildId);
        if (!queue || !queue.songs[0]) return msg.channel.send(`${emoji.no} There are no songs in queue.`).then(e => setTimeout(() => e.delete().catch(console.log), 4000));
        
        try {
            await queue.toggleAutoplay();
        } catch (e) { 
            console.log(e);
            return msg.channel.send(`${emoji.no} Couldn't toggle autoplay!`).then(e => setTimeout(() => e.delete().catch(console.log), 4000));
        };
        
        return msg.channel.send(`${queue.autoplay ? `${emoji.yes} Enabled` : `${emoji.no} Disabled`} autoplay!`).then(e => setTimeout(() => e.delete().catch(console.log), 5000));
    }
}