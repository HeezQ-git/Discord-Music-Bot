const Discord = require('discord.js');
const Message = require('./../models/msg');
const Users = require('./../models/users');
const Songs = require('./../models/songs');
const emoji = require('./../config/emojis.json');
const colors = require('./../config/colors.json');
const config = require('./../config.json');

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
            let value = song.tags.length > 0 ? song.tags.map(tag => `> ${tags[Number(tag-1)].emoji} ${tags[Number(tag-1)].name}`) : `No tags found`;
            value = value.join('\n');
            let artist = song.artist.map(artist => `> ${artist}`);
            artist = artist.join('\n');
            embed = new Discord.MessageEmbed()
            .setColor(`${song.name ? colors.green : colors.red}`)
            .addField(`📜 Name`, `> ${song.name ? song.name : `Not found`}`, true)
            .addField(`🎤 Artist${song.artist.length > 1 ? 's' : ''}`, `${artist}`, true)
            .addField(`🎮 Game`, `> ${song.game ? song.game : `Not found`}`, true)
            .addField(`💃 Dance mode`, `> ${song.dancemode ? song.dancemode : `Not found`}`, true)
            .addField(`❌ Broken lvl`, `> ${song.xboxbrokenlevel ? song.xboxbrokenlevel : `Not found`}`, true)
            .addField(`🕒 Duration`, `> ${song.duration ? song.duration : `Not found`}`, true)
            .addField(`🍂 Difficulty`, `> ${song.difficulty ? song.difficulty : `Not found`}`, true)
            .addField(`💦 Effort`, `> ${song.effort ? song.effort : `Not found`}`, true)
            .addField(`🔗 Cover URL`, `> [CLICK HERE](${song.cover})`, true)
            .addField(`🎉 Tags`, `${value}`)
            .setThumbnail(`${song.cover.startsWith('http') ? song.cover : ''}`)
            .setTimestamp()
            .setAuthor(`${interaction.guild.me.user.username}`) //  msg.guild.me.user.avatarURL()
            .setFooter(`💖 With love, tournament team`, interaction.guild.me.user.avatarURL())
            break;
        case 'find': 
            if (!song) {
                embed = new Discord.MessageEmbed()
                .setColor(colors.red)
                .addField(`${emoji.no} Something went wrong!`, `> Couldn't find given song`)
                .setTimestamp()
                .setAuthor(`${interaction.guild.me.user.username}`) //  msg.guild.me.user.avatarURL()
                .setFooter(`💖 With love, tournament team`, interaction.guild.me.user.avatarURL())
            } else {
                let value = song.tags.length > 0 ? song.tags.map(tag => `> ${tags[Number(tag-1)].emoji} ${tags[Number(tag-1)].name}`) : `No tags found`;
                value = value.join('\n');
                let artist = song.artist.map(artist => `> ${artist}`);
                artist = artist.join('\n');
                embed = new Discord.MessageEmbed()
                .setColor(`${song.name ? colors.green : colors.red}`)
                .addField(`🔢 Song ID:`, `> ${song._id ? song._id : `Not found`}`, true)
                .addField(`📜 Name:`, `> ${song.name ? song.name : `Not found`}`, true)
                .addField(`🎤 Artist${song.artist.length > 1 ? 's' : ''}:`, `${artist}`, true)
                .addField(`🎮 Game:`, `> ${song.game ? song.game : `Not found`}`, true)
                .addField(`💃 Dance mode:`, `> ${song.dancemode ? song.dancemode : `Not found`}`, true)
                .addField(`❌ Broken lvl:`, `> ${song.xboxbrokenlevel ? song.xboxbrokenlevel : `Not found`}`, true)
                .addField(`🕒 Duration`, `> ${song.duration ? song.duration : `Not found`}`, true)
                .addField(`🍂 Difficulty:`, `> ${song.difficulty ? song.difficulty : `Not found`}`, true)
                .addField(`💦 Effort:`, `> ${song.effort ? song.effort : `Not found`}`, true)
                .addField(`🔗 Cover URL:`, `> [CLICK HERE](${song.cover})`, true)
                .addField(`🎉 Tags:`, `${value}`, true)
                .setThumbnail(`${song.cover.startsWith('http') ? song.cover : ''}`)
                .setTimestamp()
                .setAuthor(`${interaction.guild.me.user.username}`) //  msg.guild.me.user.avatarURL()
                .setFooter(`💖 With love, tournament team`, interaction.guild.me.user.avatarURL())
            }
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
            .setColor(colour)
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
    });
    return user;
}

const tags = [{emoji:"💃", name:"Sassy", id:"1"},
            {emoji:"👒", name:"Latin", id:"2"},
            {emoji:"💋", name:"K-Pop", id:"3"},
            {emoji:"🌺", name:"BOP", id:"4"},
            {emoji:"🎉", name:"Party", id:"5"},
            {emoji:"🧪", name:"Not released", id:"6"},
            {emoji:"🤡", name:"Troll", id:"7"},
            {emoji:"❌", name:"Excluded", id:"8"},
            {emoji:"🎤", name:"Cover", id:"9"},
            {emoji:"💦", name:"Sweat", id:"10"},
            {emoji:"🐼", name:"Panda", id:"11"},
            {emoji:"📺", name:"Cartoon", id:"12"},
            {emoji:"🌹", name:"Romantic", id:"13"},
            {emoji:"🐢", name:"Animal", id:"14"},
            {emoji:"⚔", name:"Battle", id:"15"},
            {emoji:"🤖", name:"Robot", id:"16"},
            {emoji:"🦇", name:"Halloween", id:"17"},
            {emoji:"🎄", name:"Christmas", id:"18"},
            {emoji:"😱", name:"Drama", id:"19"},
            {emoji:"👪", name:"Family", id:"20"},
            {emoji:"🥴", name:"Wacky", id:"21"},
            {emoji:"🌞", name:"Summer", id:"22"},
            {emoji:"⚽", name:"Brasilian", id:"23"},
            {emoji:"🤠", name:"Western", id:"24"}];

const stepsDetails = [
    { "name": "name",
      "add": false,
      "set": true,
      "required": true },

    { "name": "artist",
      "add": true,
      "set": true,
      "required": true },

    { "name": "version",
      "add": false,
      "set": true,
      "required": false },

    { "name": "game",
      "add": false,
      "set": true,
      "required": true },

    { "name": "dancemode",
      "add": false,
      "set": true,
      "required": true },

    { "name": "xboxbrokenlevel",
      "add": false,
      "set": true,
      "required": true },

    { "name": "difficulty",
      "add": false,
      "set": true,
      "required": true },

    { "name": "effort",
      "add": false,
      "set": true,
      "required": true },

    { "name": "times",
      "add": false,
      "set": true,
      "required": false },

    { "name": "genre",
      "add": true,
      "set": true,
      "required": false },

    { "name": "tags",
      "add": false,
      "set": false,
      "required": false },

    { "name": "duration",
      "add": false,
      "set": true,
      "required": false },

    { "name": "cover",
      "add": false,
      "set": true,
      "required": true }
];

const steps = stepsDetails.map(el => el.name);

const findSong = async (name) => {
    let song = [];
    const songs = await Songs.find();
    songs.map(s => {
        if (s.name.includes(name)) song.push(s);
    })
    if (song.length <= 0) {
        const find = await Songs.find({ _id: name });
        if (find) song.push(find);
    }
    return song;
}

module.exports.findSong = findSong;

module.exports.songManager = async (type, option, err) => {
    let embed;
    switch (type) {
        case 'save':
            let msg = [];
            if (option[0] === false) {
                msg.push(`${emoji.loading} Establishing connection with database...`);
            } else if (option[0] === true) {
                msg.push(`${emoji.yes} Established connection with database!`);
            } else if (option[0] === 'error') {
                msg.push(`${emoji.no} **Couldn't establish connection with database!**`);
            }

            if (option[1] === false) {
                msg.push(`${emoji.loading} Checking if all parameters match...`);
            } else if (option[1] === true) {
                msg.push(`${emoji.yes} All parameters match!`);
            } else if (option[1] === 'error') {
                msg.push(`${emoji.no} **Empty values:** ${err ? err.map(el=>` ${el}`) : 'Null'}`);
            }

            if (option[2] === false) {
                msg.push(`${emoji.loading} Saving current changes...`);
            } else if (option[2] === true) {
                msg.push(`${emoji.yes} Successfully saved current changes!`);
            } else if (option[2] === 'error') {
                msg.push(`${emoji.no} **Couldn't save current changes!**\n${err[0]}`);
            }

            embed = new Discord.MessageEmbed()
            .setColor(option[2] != 'error' && option[1] != 'error' && option[0] != 'error' ? option[2] === true ? colors.green : colors.yellow : colors.red)
            .setTitle(`${option[2] != 'error' && option[1] != 'error' && option[0] != 'error' ? option[2] === true ? `${emoji.yes} You can now delete this message` : `${emoji.warning} DO NOT DELETE THIS MESSAGE` : `${emoji.no} Something went wrong!` }`)
            .addField(`\u200b`, `${msg[0]}\n${msg[1]}\n${msg[2]}`)
            .setAuthor(`TournamentBot`, config.avatar)
            .setFooter(`💖 With love, tournament team`, config.avatar)
            .setTimestamp()
            return embed;
        case 'new':
            let userid, avatar;
            if (option.user) userid = option.user.id
            else if (option.author) userid = option.author.id;
            if (option.guild) avatar = option.guild.me.user.avatarURL()
            else avatar = config.avatar;
            const user = await checkUser(userid);
            if (!user.song_page || user.song_page <= 0) await Users.updateOne({ userId: userid }, { $set: { song_page: 1 } });
            const page = user.song_page - 1;
            let value;
            if (user.song_temp[steps[page]].length > 0) {
                if (steps[page] != 'tags') {
                    if (user.song_temp[steps[page]].length === 1) {
                        value = `> ${user.song_temp[steps[page]][0]}`;
                    } else {
                        value = user.song_temp[steps[page]].map((el, index) => `> ${index+1}. ${el}`);
                        value = value.join('\n');
                    }
                } else {
                    value = user.song_temp[steps[page]].map(el => `> ${tags[Number(el-1)].emoji} ${tags[Number(el-1)].name}`);
                    value = value.join('\n');
                }
            } else {
                value = `> None`;
            }
            embed = new Discord.MessageEmbed()
            .setColor(user.song_temp[steps[page]].length > 0 ? colors.green : colors.red)
            .setTitle(`${steps[page].toUpperCase()} [${user.song_page}/${steps.length}]`)
            .addField(`🌺 Current song`, `> ${user.song_temp[steps[0]][0] ? user.song_temp[steps[0]][0] : `Please provide song's name`}`)
            .addField(`${user.song_temp[steps[page]].length > 0 ? emoji.yes : emoji.no} Current value${user.song_temp[steps[page]].length > 0 ? 's' : ''}`, `${value}`)
            .setAuthor(`TournamentBot`, avatar)
            .setFooter(`💖 With love, tournament team`, avatar)
            .setTimestamp()
            return embed;
        case 'menu':
            embed = new Discord.MessageEmbed()
            .setColor(colors.blue)
            .setTitle(`${emoji.yes} Select an action to execute`)
            .setFooter(`💖 With love, tournament team`, option.guild.me.user.avatarURL())
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
module.exports.stepsDetails = stepsDetails;
module.exports.checkUser = checkUser;
module.exports.createEmbed = createEmbed;
module.exports.tags = tags;