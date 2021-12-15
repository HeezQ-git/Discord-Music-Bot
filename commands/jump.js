const emoji = require("./../config/emojis.json");

module.exports = {
    name: 'jump',
    aliases: ['jumpto'],
    description: 'Jumps to certain song in queue.',
    cooldown: 3,
    category: 'Music',

    async execute(msg, args, cmd, client) {
        msg.delete().catch(console.log);

        const queue = client.distube.getQueue(msg.guildId);
        if (!queue || !queue.songs[0]) return msg.channel.send(`${emoji.no} There are no songs in queue.`).then(e => setTimeout(() => e.delete().catch(console.log), 4000));
        if (!args[0]) return msg.channel.send(`${emoji.no} Please add a position to jump to.`).then(e => setTimeout(() => e.delete().catch(console.log), 4000));
        if (!Number(args[0]) > queue.songs.length - 1 || Number(args[0]) < 0) return msg.channel.send(`${emoji.no} Position must be between 0 and ${queue.songs.length - 1}`).then(e => setTimeout(() => e.delete().catch(console.log), 4000));

        try {
            await queue.jump(Number(args[0]));
        } catch (e) { 
            console.log(e);
            return msg.channel.send(`${emoji.no} Couldn't jump to desired song!`).then(e => setTimeout(() => e.delete().catch(console.log), 4000));
        };

        return msg.channel.send(`${emoji.yes} Jumped to ${args[0]}th songs in queue!`).then(e => setTimeout(() => e.delete().catch(console.log), 5000));
    }
}