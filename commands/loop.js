const emoji = require("./../config/emojis.json");

module.exports = {
    name: 'loop',
    aliases: ['repeat'],
    description: 'Enable loop of a certain song, whole queue or turn it off.',
    cooldown: 5,
    category: 'Music',

    async execute(msg, args, cmd, client) {
        msg.delete().catch(console.log);

        const queue = client.distube.getQueue(msg.guildId);
        if (!queue || !queue.songs[0]) return msg.channel.send(`${emoji.no} There are no songs in queue.`).then(e => setTimeout(() => e.delete().catch(console.log), 4000));
        if (!args[0] || !['off', 'song', 'queue'].includes(args[0].toLowerCase())) return msg.channel.send(`${emoji.no} Please input valid option: \`song / queue / off\``).then(e => setTimeout(() => e.delete().catch(console.log), 6000));

        try {
            switch (args[0]) {
                case 'off':
                    await queue.setRepeatMode(0);
                    return msg.channel.send(`${emoji.yes} Turned off loop mode!`).then(e => setTimeout(() => e.delete().catch(console.log), 5000));
                case 'song':
                    await queue.setRepeatMode(1);
                    return msg.channel.send(`${emoji.yes} Toggled the song loop!`).then(e => setTimeout(() => e.delete().catch(console.log), 5000));
                case 'queue':
                    await queue.setRepeatMode(2);
                    return msg.channel.send(`${emoji.yes} Toggled the queue loop!`).then(e => setTimeout(() => e.delete().catch(console.log), 5000));
            }
        } catch (e) { 
            console.log(e);
            return msg.channel.send(`${emoji.no} Couldn't change the loop type!`).then(e => setTimeout(() => e.delete().catch(console.log), 4000));
        };
    }
}