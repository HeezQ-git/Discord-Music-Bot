const Discord = require('discord.js');
const Songs   = require('../models/songs');
const color   = require('../config/colors.json');
const config  = require('../config.json');
const { getUnique } = require('../handlers/functions');

randomPages = [ 
    { name: "Version", emoji: "🌗" }, 
    { name: "Artist", emoji: "🎤" }, 
    { name: "Game", emoji: "🎮" }, 
    { name: "Dance mode", emoji: "👯‍♂️" }, 
    { name: "Broken lvl", emoji: "❌" }, 
    { name: "Difficulty", emoji: "🍂" }, 
    { name: "Effort", emoji: "💦" }, 
    { name: "Times", emoji: "📅" }, 
    { name: "Genre", emoji: "🎹" }, 
    { name: "Tags", emoji: "🎉" }
]

const checkEditMessage = async (msg, id) => {
    if (!id || id.length <= 0) return null;
    let message;
    try {
        let base;
        if (msg.message) base = msg.message
        else base = msg;
        message = await base.channel.messages.fetch(id);
    } catch (error) { console.log(error); return null; }
    if (message) return message;
    return null;
}

const randomHandler = async () => {
    const songs = await Songs.find();
    return songs.length > 1 ? songs[Math.floor(Math.random()*songs.length)] : null;
}

const randomEmbed = async (type, category, user) => {
    let embed;
    if (type === 'settings') {
        switch (category) {
            case 'main':
                embed = new Discord.MessageEmbed()
                .setColor(color.blue)
                .setTitle(`Random settings`)
                .addFields(randomPages.map((el, index) => {
                    let val;
                    if (user.randomSettings[el] ? user.randomSettings[el].length <= 0 : true) val = 'None'
                    else val = user.randomSettings[el].join(' and ');
                    return {
                        name: `${el.emoji} ${el.name} (${index+1})`,
                        value: `Conditions:${val != 'None' ? '\n' : ' '}${val}`,
                        inline: true
                    }
                }))
                .addField(`🤔 How to edit conditions?`, `Type \`.random edit [ID/Name]\`, e.g. \`.random edit artist\``)
                .setAuthor(`TournamentBot`, config.avatar)
                .setFooter(`💖 With love, tournament team`, config.avatar)
                .setTimestamp()
                break;
            case 'edit':
                const songs = await Songs.find();
                let firstValues = [], values;
                values = await getUnique(songs, user.randomMenu);
                if (values.length > 3) firstValues = [`Type \`.top ${user.randomMenu}\` to find available options`]
                else values.map(el => firstValues.push(`- \`${el}\``));
                embed = new Discord.MessageEmbed()
                .setColor(color.blue)
                .setTitle(`Managing ${user.randomMenu}`)
                .addFields({
                    name: 'Available options',
                    value: firstValues.join('\n')
                })
                .setAuthor(`TournamentBot`, config.avatar)
                .setFooter(`💖 With love, tournament team`, config.avatar)
                .setTimestamp()
                break;
        }
        return embed;
    }
}

module.exports = {
    checkEditMessage,
    randomHandler,
    randomEmbed,
    randomPages,
}