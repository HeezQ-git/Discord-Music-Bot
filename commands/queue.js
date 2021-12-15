const { createEmbed } = require('./../handlers/embeds');
const emoji = require('./../config/emojis.json');
const Message = require('./../models/msg');

module.exports = {
    name: 'queue',
    aliases: ['list'],
    description: 'Sends current server\'s queue',
    cooldown: 5,
    category: 'Music',
    async execute(msg, args, cmd, client) {
        msg.delete().catch(console.log);

        const queue = client.distube.getQueue(msg);
        if (!queue || queue.songs.length <= 0) return msg.channel.send(`${emoji.no} The queue is empty!`).then(e => setTimeout(() => e.delete().catch(console.log), 4000));
        
        let page = 0, maxpages;
        queuePages = [];
        _amt = [1, 2, 3];
        maxpages = Math.ceil(queue.songs.length - 1 / _amt.length);

        if (args[0]) page = Number(args[0])-1;
        if (page > maxpages) return msg.channel.send(`${emoji.no} Please input a number between \`1\` and \`${maxpages}\``)
        _amt = _amt.map(e => {
            return eval(e + eval(_amt.length * page));
        });
        
        _amt.map((song, index) => {
            if (queue.songs[song]) queuePages.push(queue.songs[song]);
        });

        let queueMsg;
        try {
            const queueId = (await Message.findOne({ _id: msg.guildId })).queueManager;
            console.log(queueId);
            if (queueId) queueMsg = await msg.channel.messages.fetch(queueId);
            if (queueMsg) queueMsg.delete().catch(console.log);
        } catch (e) { console.log(`Couldn't retreive queue message.`) }

        const embed = await msg.channel.send({ embeds: [ createEmbed('list-queue', queue, queue.songs[0], msg, queuePages, `${page+1}/${maxpages}`) ] });
        await Message.updateOne({ _id: msg.guildId }, { $set: { queueManager: embed.id.toString() } });
    }
}