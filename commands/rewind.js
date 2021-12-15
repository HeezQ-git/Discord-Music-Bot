const emoji = require("./../config/emojis.json");

module.exports = {
    name: 'rewind',
    aliases: ['rwd'],
    description: 'Rewinds current song by a certain amount of seconds.',
    cooldown: 10,
    category: 'Music',

    async execute(msg, args, cmd, client) {
        msg.delete().catch(console.log);

        const queue = client.distube.getQueue(msg.guildId);
        if (!queue || !queue.songs[0]) return msg.channel.send(`${emoji.no} There are no songs in queue.`).then(e => setTimeout(() => e.delete().catch(console.log), 4000));
        if (!args[0]) return msg.channel.send(`${emoji.no} Please input a rewind time in seconds.`).then(e => setTimeout(() => e.delete().catch(console.log), 5000));
        
        let seekNum = Number(args[0]);
        let seekTime = queue.currentTime - seekNum;
        if (seekTime < 0 || seekTime > queue.songs[0].duration - queue.currentTime) seekTime = 0;

        try {
            await queue.seek(seekTime);
        } catch (e) { 
            console.log(e);
            return msg.channel.send(`${emoji.no} Couldn't rewind by desired time.`).then(e => setTimeout(() => e.delete().catch(console.log), 4000));
        };
        
        return msg.channel.send(`${emoji.yes} Rewinded current song by ${seekNum} seconds.`).then(e => setTimeout(() => e.delete().catch(console.log), 5000));
    }
}