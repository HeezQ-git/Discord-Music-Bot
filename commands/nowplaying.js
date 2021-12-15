const { resendMessage } = require('./../handlers/embeds');
const emoji = require('./../config/emojis.json');

module.exports = {
    name: 'nowplaying',
    aliases: ['songinfo', 'playingnow', 'infosong', 'currentsong', 'currentlyplaying'],
    cooldown: 10,
    category: 'Music',
    async execute(msg, args, cmd, client) {
        msg.delete().catch(console.log);

        const queue = client.distube.getQueue(msg.guildId);
        if (!queue || queue.songs.length <= 0) return msg.channel.send(`${emoji.no} Nothing is playing right now!`).then(e => setTimeout(() => e.delete().catch(console.log), 4000));
        
        resendMessage(queue);
    }
}