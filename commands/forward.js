const emoji = require("./../config/emojis.json");

module.exports = {
    name: 'forward',
    aliases: ['fwd'],
    description: 'Forwards current song by certain amount of seconds.',
    cooldown: 10,
    category: 'Music',

    async execute(msg, args, cmd, client) {
        msg.delete().catch(console.log);

        const queue = client.distube.getQueue(msg.guildId);
        if (!queue || !queue.songs[0]) return msg.channel.send(`${emoji.no} There are no songs in queue.`).then(e => setTimeout(() => e.delete().catch(console.log), 4000));
        let seekAmt = Number(args[0]);
        let seekTime = queue.currentTime + seekAmt;
        if (seekTime >= queue.songs[0].duration) seekTime = queue.songs[0].duration - 1;
        
        try {
            await queue.seek(seekTime);
        } catch (e) { 
            console.log(e);
            return msg.channel.send(`${emoji.no} Couldn't forward current song.`).then(e => setTimeout(() => e.delete().catch(console.log), 4000));
        };
        
        return msg.channel.send(`${emoji.yes} Forwarded current song by ${seekAmt} seconds.`).then(e => setTimeout(() => e.delete().catch(console.log), 5000));
    }
}