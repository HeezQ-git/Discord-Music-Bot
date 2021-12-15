const { createEmbed } = require('./../handlers/embeds');
const emoji = require('./../config/emojis.json');
const Message = require('./../models/msg');

module.exports = {
    name: 'volume',
    aliases: ['vol'],
    cooldown: 5,
    category: 'Music',
    async execute(msg, args, cmd, client) {
        msg.delete().catch(console.log);

        const queue = client.distube.getQueue(msg.guildId);

        if (!args.length > 0) return msg.channel.send(`${emoji.no} Please input wanted volume as an argument!`).then(e => setTimeout(() => e.delete().catch(console.log), 4000));
        
        if (parseInt(args[0]) < 0 || parseInt(args[0]) > 150) return msg.channel.send(`${emoji.no} Volume has to be a number between 0 and 150!`).then(e => setTimeout(() => e.delete().catch(console.log), 4000));
        queue.setVolume(parseInt(args[0]));

        msg.channel.send(`${emoji.yes} Volume has been changed to \`${args[0]}%\``).then(e => setTimeout(() => e.delete().catch(console.log), 4000));
        
        newMsg = await msg.channel.messages.fetch((await Message.findOne({ _id: msg.guildId })).musicManager);
        if (newMsg) newMsg.edit({ embeds: [ createEmbed('song-playing', queue, queue.songs[0]) ] });
    }
}