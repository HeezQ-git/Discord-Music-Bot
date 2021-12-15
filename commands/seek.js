const emoji = require("./../config/emojis.json");

module.exports = {
    name: 'seek',
    aliases: [],
    description: 'Jumps to a specific position (time) in current song.',
    cooldown: 10,
    category: 'Music',

    async execute(msg, args, cmd, client) {
        msg.delete().catch(console.log);

        const queue = client.distube.getQueue(msg.guildId);
        if (!queue || !queue.songs[0]) return msg.channel.send(`${emoji.no} There are no songs in queue.`).then(e => setTimeout(() => e.delete().catch(console.log), 4000));
        if (!args[0]) return msg.channel.send(`${emoji.no} Please input a seek number (in seconds) to jump to.`).then(e => setTimeout(() => e.delete().catch(console.log), 5000));
        
        let seekNum = Number(args[0]);
        if (seekNum > queue.songs[0].duration || seekNum < 0) return msg.channel.send(`${emoji.no} Please input a number between 0 and ${queue.songs[0].duration}`).then(e => setTimeout(() => e.delete().catch(console.log), 5000));

        try {
            await queue.seek(seekNum);
        } catch (e) { 
            console.log(e);
            return msg.channel.send(`${emoji.no} Couldn't seek to desired time.`).then(e => setTimeout(() => e.delete().catch(console.log), 4000));
        };
        
        return msg.channel.send(`${emoji.yes} Sought to ${seekNum} seconds in current song.`).then(e => setTimeout(() => e.delete().catch(console.log), 5000));
    }
}