const Discord = require('discord.js');
const Message = require('./../models/msg');
const Users = require('./../models/users');
const emoji = require('./../config/emojis.json');
const colors = require('./../config/colors.json');

module.exports = client => {}

const createEmbed = (type, queue, song, msg, _amt, pages) => {
    let embed;
    switch (type) {
        case 'song-playing':
            embed = new Discord.MessageEmbed()
            .setColor('#0F9D58')
            .setTitle('Currently playing:')
            .addField('💡 Requested by:', `>>> ${song.user || 'None'}`, true)
            .addField('🕐 Duration:', `>>> \`${queue.formattedCurrentTime || '00:00'} / ${song.formattedDuration || '00:00'}\``, true)
            .addField('📜 Queue:', `>>> ${queue.songs.length} song${queue.songs.length > 0 ? 's' : ''}\n${queue.formattedDuration} minutes`, true)
            .addField('🔄 Loop:', `>>> ${queue.repeatMode ? queue.repeatMode === 2 ? `${emoji.yes} queue` : `${emoji.yes} song` : `${emoji.no}`}`, true)
            .addField('↪ Autoplay:', `>>> ${queue.autoplay ? `${emoji.yes}` : `${emoji.no}`}`, true)
            .addField(`🔈 Filters:`, `>>>  ${queue.filters && queue.filters.length > 0 ? `${emoji.yes} ${queue.filters.length} enabled` : `${emoji.no}`}`, true)
            .addField('⏬ Download song:', `>>> [\`Click here\`](${queue.songs[0].streamURL})`, true)
            .addField('🔊 Volume:', `>>> \`${queue.volume || 0}%\``, true)
            .addField('🌺 Status:', `>>> PLAYING`, true)
            .setTimestamp()
            .setThumbnail(queue.songs[0].thumbnail)
            .setAuthor(`${song.name}`, 'https://bestanimations.com/media/discs/895872755cd-animated-gif-9.gif', song.url)
            .setFooter(`🎶 Requested by ${song.user.username}`, song.user.displayAvatarURL({ dynamic: true }))
            break;
        case 'song-paused':
            embed = new Discord.MessageEmbed()
            .setColor('#F4B400')
            .addField('💡 Requested by:', `>>> ${song.user || 'None'}`, true)
            .addField('🕐 Duration:', `>>> \`${queue.formattedCurrentTime || '00:00'} / ${song.formattedDuration || '00:00'}\``, true)
            .addField('📜 Queue:', `>>> ${queue.songs.length} song${queue.songs.length > 0 ? 's' : ''}\n${queue.formattedDuration} minutes`, true)
            .addField('🔄 Loop:', `>>> ${queue.repeatMode ? queue.repeatMode === 2 ? `${emoji.yes} queue` : `${emoji.yes} song` : `${emoji.no}`}`, true)
            .addField('↪ Autoplay:', `>>> ${queue.autoplay ? `${emoji.yes}` : `${emoji.no}`}`, true)
            .addField(`🔈 Filters:`, `>>>  ${queue.filters && queue.filters.length > 0 ? `${emoji.yes} ${queue.filters.length} enabled` : `${emoji.no}`}`, true)
            .addField('⏬ Download song:', `>>> [\`Click here\`](${queue.songs[0].streamURL})`, true)
            .addField('🔊 Volume:', `>>> \`${queue.volume || 0}%\``, true)
            .addField('🌺 Status:', `>>> PAUSED`, true)
            .setTimestamp()
            .setThumbnail(queue.songs[0].thumbnail)
            .setAuthor(`${song.name}`, 'https://i.imgur.com/7KvKT3X.png', song.url)
            .setFooter(`🎶 Requested by ${song.user.username}`, song.user.displayAvatarURL({ dynamic: true }))
            break;
        case 'list-queue':
            embed = new Discord.MessageEmbed()
            .setColor('#4285F4')
            .setTitle(`[${pages}] ${msg.guild.name}'s queue:`)
            .addField('🔢 Songs amount:', `>>> ${queue.songs.length}`, true)
            .addField('🕐 Duration:', `>>> ${queue.formattedDuration}`, true)
            .addField('🎶 Currently playing:', `👉 | [**${queue.songs[0].name}**](${queue.songs[0].url}) \`[${queue.songs[0].formattedDuration}]\``)
            .addField(`\u200b`, queue.songs.length <= 1 ? '» No more songs in queue!' : `🌌 Songs in queue:`, true)
            .addFields(_amt.map((song, index) => {
                return {
                    name: `[${index+1}]`,
                    value: `📜\u200b Name: [${song.name}](${song.url})\n👉\u200b Added by: ${song.user.username}\n🕒\u200b Duration: ${song.formattedDuration}`
                }
            }))
            .setTimestamp()
            .setThumbnail(queue.songs[0].thumbnail)
            .setAuthor(`${msg.guild.me.user.username}`, 'https://bestanimations.com/media/discs/895872755cd-animated-gif-9.gif')
            .setFooter(`💖 With love, tournament team`, msg.guild.me.user.avatarURL())
            break;
    }
    return embed;
}

module.exports.songsHandler = async (type, song, interaction) => {
    let embed;
    switch(type) {
        case 'info':
            embed = new Discord.MessageEmbed()
            .setColor(`${song.name ? `#DB4437` : `#0F9D58`}`)
            .addField(`📜 Name:`, `${song.name ? song.name : `Not found`}`, true)
            .addField(`🎤 Artist(s):`, `${song.artist[0] ? song.artist.join('\n') : `Not found`}`, true)
            .addField(`🕹 Game:`, `${song.game ? song.game : `Not found`}`, true)
            .addField(`💃 Dance mode:`, `${song.dancemode ? song.dancemode : `Not found`}`, true)
            .addField(`❌ Broken lvl:`, `${song.xboxbrokenlevel ? song.xboxbrokenlevel : `Not found`}`, true)
            .addField(`⚖ Difficulty:`, `${song.difficulty ? song.difficulty : `Not found`}`, true)
            .addField(`💦 Effort:`, `${song.effort ? song.effort : `Not found`}`, true)
            .addField(`🎉 Tags:`, `${song.tags[0] ? song.tags.map(tag => ` ${tag}`) : `No tags found`}`, true)
            .addField(`🔗 Cover URL:`, `[CLICK HERE](${song.cover})`)
            .setThumbnail(`${song.cover.startsWith('http') ? song.cover : ''}`)
            .setTimestamp()
            .setAuthor(`${interaction.guild.me.user.username}`) //  msg.guild.me.user.avatarURL()
            .setFooter(`💖 With love, tournament team`, interaction.guild.me.user.avatarURL())
            break;
    }
    return embed;
}

module.exports.basicEmbed = async (interaction, content, type, colour) => {
    let emojis = '';
    let embed = new Discord.MessageEmbed();
    switch (colour) {
        case 'green':
            colour = colors.green;
            break;
        case 'blue':
            colour = colors.blue;
            break;
        case 'yellow':
            colour = colors.yellow;
            break;   
    }
    if (!colour) colour = colors.red;
    switch (type) {
        case 'no':
            embed
            .addField(`${emoji.no} Oopsie...!`, `> ${content}`)
            .setFooter(`💖 With love, tournament team`, interaction.guild.me.user.avatarURL())
            .setTimestamp()
            return embed;
        case 'yes':
            emojis = `${emoji.yes}`;
            break;
        case 'warning':
            emojis = `${emoji.warning}`;
            break;
        case 'loading':
            emojis = `${emoji.loading}`;
            break;
    }
    embed
    .setColor(colour)
    .setTitle(`${emojis} ${content}`)
    .setFooter(`💖 With love, tournament team`, interaction.guild.me.user.avatarURL())
    .setTimestamp()
    return embed;
}

const checkUser = async (userId) => {
    let user;
    user = await Users.findOne({ userId: `${userId}` });
    if (!user) user = Users.create({ 
        userId: `${userId}`,
        song_page: 1,
    });
    return user;
}

const steps = [
    'name',
    'artist',
    'game',
    'dancemode',
    'xboxbrokenlevel',
    'difficulty',
    'effort',
    'times',
    'genre',
    'tags',
    'duration',
    'cover'
]

module.exports.songManager = async (type, interaction) => {
    let embed;
    switch (type) {
        case 'new':
            const user = await checkUser(interaction.user.id);
            console.log(user);
            if (!user.song_page || user.song_page <= 0) await Users.updateOne({ userId: interaction.user.id }, { $set: { song_page: 1 } });
            const page = user.song_page - 1;
            embed = new Discord.MessageEmbed()
            .setColor(user.song_temp[steps[page]] ? colors.green : colors.red)
            .setTitle(`${steps[page].toUpperCase()} [${user.song_page}/${steps.length}]`)
            .addField(`🌺 Current song`, `> ${page > 0 ? user.song_temp[steps[page]] : `Please provide song's name`}`)
            .addField(`${user.song_temp[steps[page]] ? emoji.yes : emoji.no} Current value`, `> ${user.song_temp[steps[page]] ? user.song_temp[steps[page]] : `None`}`)
            .setAuthor(`TournamentBot`, interaction.guild.me.user.avatarURL())
            .setFooter(`💖 With love, tournament team`, interaction.guild.me.user.avatarURL())
            .setTimestamp()
            return embed;
        case 'menu':
            embed = new Discord.MessageEmbed()
            .setColor(colors.blue)
            .setTitle(`${emoji.yes} Select an action to execute`)
            .setFooter(`💖 With love, tournament team`, interaction.guild.me.user.avatarURL())
            .setTimestamp()
            return embed;
    }
};

module.exports.checkMessage = async (queue, song, client) => {
    const base = await Message.findOne({ _id: queue.textChannel.guild.id });
    const newQueue = client.distube.getQueue(queue.id);
    if (!queue || !queue.songs.length === 0) return;
    try {
        const msg = await queue.textChannel.messages.fetch(base.musicManager);
        if (msg) {
            try {
                let embed;
                embed = !base.isPaused ? createEmbed('song-playing', newQueue, song) : createEmbed('song-paused', newQueue, song);
                if (embed) msg.edit({embeds: [embed]});
            } catch (e) { 
                console.log('ERROR EDITING');
                return 'failed';
            }
        }
    } catch (e) { 
        const saved = await queue.textChannel.send({ embeds: [createEmbed('song-playing', newQueue, song)] });
        await Message.updateOne({ _id: queue.textChannel.guild.id }, { $set: { musicManager: saved.id.toString() } });
    }
}

module.exports.resendMessage = async (queue) => {
    if (!queue.songs[1] || !queue.songs[0] || queue.songs.length === 0) return;
    const base = await Message.findOne({ _id: queue.textChannel.guild.id });
    try {
        const msg = await queue.textChannel.messages.fetch(base.musicManager);
        if (msg) {
            try { 
                await msg.delete().catch(console.log); 
                await Message.updateOne({ _id: queue.textChannel.guild.id }, { $set: { musicManager: '' } });
            } catch (e) { console.log('An error occured (delete)') }
        }
        const saved = await queue.textChannel.send({embeds: [createEmbed('song-playing', newQueue, song)]});
        await Message.updateOne({ _id: queue.textChannel.guild.id }, { $set: { musicManager: saved.id.toString() } });
    } catch (e) {}
}

module.exports.clearMessages = async (queue) => {
    try { 
        const base = await Message.findOne({ _id: queue.textChannel.guild.id });
        const musicPlayer = await queue.textChannel.messages.fetch(base.musicManager);
        musicPlayer.delete().catch(console.log(`Couldn't delete music player message!`));
        const queueMsg = await queue.textChannel.messages.fetch(base.queueManager);
        queueMsg.delete().catch(console.log(`Couldn't delete queue message!`));
    } catch (e) {
        console.log(`An error occured - couldn't clear messages:\n${e}`);
    }
}

module.exports.steps = steps;
module.exports.checkUser = checkUser;
module.exports.createEmbed = createEmbed;