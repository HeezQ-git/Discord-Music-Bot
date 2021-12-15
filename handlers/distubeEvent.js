const { checkMessage } = require('./../handlers/embeds');

const emoji = require('./../config/emojis.json');
const Message = require('./../models/msg');

const songEditInterval = [];

module.exports = client => {
    client.distube.on('playSong', async (queue, song) => {

        try {
            clearInterval(songEditInterval[queue.guildId])
        } catch(e) { }
        
        songEditInterval[queue.guildId] = setInterval(async () => {
            try {
                const resp = await checkMessage(queue, song, client);
                if (resp === 'failed' && (!queue || queue.songs.length === 0)) {
                    clearInterval(songEditInterval[queue.guildId]);
                    try {
                        const toDel = await Message.findOne({ _id: queue.guildId });
                        toDel.delete().catch(console.log);
                    } catch (e) {}
                }
            } catch (e) {
                clearInterval(songEditInterval[queue.guildId]);
            }
        }, 5000);
    })
    .on('disconnect', async (queue) => {
        try {
            const base = await Message.findOne({ _id: queue.guildId });
            queue.textChannel.send(`${emoji.loading} Disconnecting...`).then(e => setTimeout(() => e.delete().catch(console.log), 1500));
            const msg = queue.textChannel.fetch(base.musicManager);
            try {
                msg.delete().catch(console.log);
            } catch (e) {
                console.log('An error occured (delete)');
            }
            await Message.updateOne({ _id: queue.guildId }, { $set: { musicManager: ''} });
        } catch (e) {}
    })
    .on('initQueue', async (queue) => {
        queue.volume = 50;
        await Message.updateOne({ _id: queue.guildId }, { $set: { isPaused: false } });
    })
}