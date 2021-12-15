const { checkMessage, resendMessage } = require('./../handlers/embeds');
const { formatTime, unformatTime } = require('./../handlers/functions');
const emoji = require('./../config/emojis.json');
const Message = require('./../models/msg');

module.exports = {
    name: 'play',
    aliases: ['addsong'],
    cooldown: 1,
    category: 'Music',
    async execute(msg, args, cmd, client) {

        const distube = client.distube;
        msg.delete().catch(console.log);

        try {
            if (!args[0]) return msg.channel.send(`${emoji.no} You need to input song's name.`);

            let newMsg;
            if (!args.join(' ').includes('spotify') && args.join(' ').includes('http')) newMsg = await msg.channel.send(`${emoji.loading} Searching for: \`${args.join(' ')}\``);
            else newMsg = await msg.channel.send(`${emoji.loading} Searching for given spotify song...`);
            const queue1 = distube.getQueue(msg);

            let options = { member: msg.member }
            if (!queue1) options.textChannel = msg.member.guild.channels.cache.get(msg.channelId);
            
            await distube.playVoiceChannel(msg.member.voice.channel, args.join(' '), options);
            newMsg.delete().catch(console.log);

            const queue = client.distube.getQueue(msg.guildId);
            if (!queue.songs[1]) {
                let _msg;
                const base = await Message.findOne({ _id: msg.guildId });
                if (base.musicManager) _msg = await msg.channel.messages.fetch(base.musicManager);
                if (_msg) await _msg.delete().catch(console.log); 
                if (_msg) await Message.updateOne({ _id: msg.guildId }, { $set: { musicManager: '' } });

                checkMessage(queue, queue.songs[0], client);
            }
            if (queue.songs.length <= 0) return msg.channel.send(`${emoji.no} Couldn't add song to the queue, please try again!`);

            if (queue.songs[1]) {
                const song = queue.songs[queue.songs.length -1];
                const currentSong = unformatTime(queue.formattedCurrentTime);
                const timeApprox = eval((parseInt(queue.duration) - parseInt(song.duration)) - currentSong);
                const approx = formatTime(timeApprox);
                msg.channel.send(`${emoji.yes} <@${msg.member.id}> **ADDED TO QUEUE!**\n\n> ${song.name} \`[${song.formattedDuration}]\`\n👉 Approx wait time: **${approx} minutes**`).then(e => setTimeout(() => e.delete().catch(console.log), 8000));
            }
        } catch (e) {
            console.log(`There was a problem with .${cmd} command!\n${e}`);
        }
    }
}