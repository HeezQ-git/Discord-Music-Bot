const emoji = require("./../config/emojis.json");

module.exports = {
    name: 'remove',
    aliases: ['rem', 'delete'],
    description: 'Removes given amount of songs from queue',
    cooldown: 3,
    category: 'Music',

    async execute(msg, args, cmd, client) {
        msg.delete().catch(console.log);

        const queue = client.distube.getQueue(msg.guildId);
        if (!queue || !queue.songs[0]) return msg.channel.send(`${emoji.no} There are no songs in queue.`).then(e => setTimeout(() => e.delete().catch(console.log), 4000));
        
        let songIndex = 1, amount = 1;
        
        if (args[0]) songIndex = Number(args[0]);
        if (!songIndex) {
            songIndex = 1;
            return msg.channel.send(`${emoji.no} You ought to provide index of songs to remove.`).then(e => setTimeout(() => e.delete().catch(console.log), 5000));
        }
        if (songIndex <= 0) return msg.channel.send(`${emoji.no} You can't remove current song.`).then(e => setTimeout(() => e.delete().catch(console.log), 4000));
        if (songIndex > queue.songs.length - 1) return msg.channel.send(`${emoji.no} Song with this ID doesn't exist!`).then(e => setTimeout(() => e.delete().catch(console.log), 4000));

        if (args[1]) amount = Number(args[1]);
        if (!amount) {
            amount = 1;
            return msg.channel.send(`${emoji.no} You ought to provide a __number__ of songs to remove.`).then(e => setTimeout(() => e.delete().catch(console.log), 5000));
        }
        if (amount <= 0) return msg.channel.send(`${emoji.no} You need to remove at least 1 song.`).then(e => setTimeout(() => e.delete().catch(console.log), 5000));
        if (songIndex + amount > queue.songs.length - 1) return msg.channel.send(`${emoji.no} You can't remove that many songs, max: ${queue.songs.length - 1 - songIndex}`).then(e => setTimeout(() => e.delete().catch(console.log), 4000));

        queue.songs.splice(songIndex, amount);

        return msg.channel.send(`${emoji.yes} Removed selected songs from queue!`).then(e => setTimeout(() => e.delete().catch(console.log), 5000));
    }
}