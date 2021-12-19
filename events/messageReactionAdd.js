const wait = require('util').promisify(setTimeout);
const emojis = require('./../config/emojis.json');
const Users = require('./../models/users');
const { songManager, steps } = require('./../handlers/embeds');
const { MessageActionRow, MessageButton } = require('discord.js');

const row = new MessageActionRow()
    .addComponents(new MessageButton()
        .setCustomId('submit')
        .setLabel('Submit')
        .setStyle('SUCCESS')
        .setEmoji(`${emojis.yes}`));

module.exports =  {
    name: 'messageReactionAdd',
    async execute(reaction, user) {
        try {
            if (user.bot) return;
            const react = await reaction.fetch();
            const emoji = react._emoji.toString();

            if (!["🔄", "⏪", "⏩", `${emojis.no}`, "🔃"].includes(emoji)) return;

            const userProfile = await Users.findOne({ userId: user.id });
            if (!userProfile.messageId || userProfile.messageId.length <= 0) return;
            if (react.message.id != userProfile.messageId) return;

            react.users.remove(user.id);
            react.user = user;

            if (emoji == "🔄") {
                react.message.delete().catch(console.log);
                const msg = await react.message.channel.send({ embeds: [react.message.embeds[0]] });
                await Users.updateOne({ userId: user.id }, { $set: { messageId: msg.id } });
            } else if (emoji == "⏪") {
                if (userProfile.song_page <= 1) return;
                const page = userProfile.song_page-1;
                await Users.updateOne({ userId: user.id }, { $set: { song_page: page } });
                if (page === steps.length) react.message.edit({ embeds: [await songManager('new', react)], components: [row] });
                else react.message.edit({ embeds: [await songManager('new', react)], components: [] });
            } else if (emoji == "⏩") {
                if (userProfile.song_page >= steps.length) return;
                const page = userProfile.song_page+1;
                await Users.updateOne({ userId: user.id }, { $set: { song_page: page } });
                if (page === steps.length) react.message.edit({ embeds: [await songManager('new', react)], components: [row] });
                else react.message.edit({ embeds: [await songManager('new', react)], components: [] });
            } else if (emoji == `${emojis.no}`) {
                await Users.updateOne({ userId: user.id }, { $set: { song_page: 1, messageId: "" } });
                react.message.delete();
            } else if (emoji == "🔃") {
                await Users.updateOne({ userId: user.id }, { $set: { song_page: 1 } });
                react.message.delete().catch(console.log);
                const msg = await react.message.channel.send({ embeds: [react.message.embeds[0]] });
                await Users.updateOne({ userId: user.id }, { $set: { messageId: msg.id } });
            }
            
        } catch (error) {
            return console.log('Something went wrong when fetching the message:', error);
        }
    } 
}


