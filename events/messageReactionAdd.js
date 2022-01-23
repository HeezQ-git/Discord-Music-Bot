const wait = require('util').promisify(setTimeout);
const emojis = require('./../config/emojis.json');
const Users = require('./../models/users');
const { songsHandler, songManager, steps, tags } = require('./../handlers/embeds');
const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const { randomHandler, checkEditMessage } = require('./../handlers/randomHandler');

const row = new MessageActionRow()
    .addComponents(new MessageButton()
        .setCustomId('submit')
        .setLabel('Submit')
        .setStyle('SUCCESS')
        .setEmoji(`${emojis.yes}`));

const row_tags = new MessageActionRow()
    .addComponents(
        new MessageSelectMenu()
            .setCustomId('select_tags')
            .setPlaceholder('Select tags to add or remove')
            .addOptions([
                tags.map(el => {
                    return {
                        label: `${el.emoji} ${el.name}`,
                        description: '',
                        value: `${el.id}`,
                    }
                }),
                {
                    label: `❗ Clear all tags`,
                    value: `clear`
                }
            ]),
    );

module.exports =  {
    name: 'messageReactionAdd',
    async execute(reaction, user) {
        try {
            if (user.bot) return;
            const react = await reaction.fetch();
            const emoji = react._emoji.toString();

            if (!["🔄", "⏪", "⏩", `${emojis.no}`, "🔃"].includes(emoji)) return;

            const userProfile = await Users.findOne({ userId: user.id });
            react.users.remove(user.id).catch(console.log);

            if (react.message.id == userProfile.messageId) {
                react.user = user;

                if (emoji == "🔄") {
                    react.message.delete().catch(console.log);
                    const page = userProfile.song_page-1;

                    const msg = await react.message.channel.send({ embeds: [react.message.embeds[0]] });
                    
                    await Users.updateOne({ userId: user.id }, { $set: { messageId: msg.id } });
                    await msg.react("⏪");
                    await msg.react(`${emojis.no}`);
                    await msg.react("⏩");
                } else if (emoji == "⏪") {
                    if (userProfile.song_page <= 1) return;
                    const page = userProfile.song_page-1;
                    await Users.updateOne({ userId: user.id }, { $set: { song_page: page } });
                    if (page === steps.length) react.message.edit({ embeds: [await songManager('new', react)], components: [row] });
                    else if (steps[page-1] === 'tags') react.message.edit({ embeds: [await songManager('new', react)], components: [row_tags] });
                    else react.message.edit({ embeds: [await songManager('new', react)], components: [] });
                } else if (emoji == "⏩") {
                    if (userProfile.song_page >= steps.length) return;
                    const page = userProfile.song_page+1;
                    await Users.updateOne({ userId: user.id }, { $set: { song_page: page } });
                    if (page === steps.length) react.message.edit({ embeds: [await songManager('new', react)], components: [row] });
                    else if (steps[page-1] === 'tags') react.message.edit({ embeds: [await songManager('new', react)], components: [row_tags] });
                    else react.message.edit({ embeds: [await songManager('new', react)], components: [] });
                } else if (emoji == `${emojis.no}`) {
                    await Users.updateOne({ userId: user.id }, { $set: { song_page: 1, messageId: "" } });
                    react.message.delete();
                } else if (emoji == "🔃") {
                    react.message.delete().catch(console.log);
                    const msg = await react.message.channel.send({ embeds: [await songManager('new', react)] });
                    await Users.updateOne({ userId: user.id }, { $set: { messageId: msg.id, song_page: 1 } });
                    await msg.react("⏪");
                    await msg.react(`${emojis.no}`);
                    await msg.react("⏩");
                }
            } else if (react.message.id == userProfile.randomMessageId) {
                if (emoji == "🔄") {
                    react.guild = await react.client.guilds.fetch(react.message.guildId);
                    let message;
                    if (userProfile.randomMessageId) message = await checkEditMessage(react, userProfile.randomMessageId);

                    const embed = await songsHandler('info', await randomHandler(), react);
                    if (!message) message = await react.message.channel.send({ embeds: [ embed ] });
                    else return message.edit({ embeds: [ embed ] });

                    await message.react("🔄");
                    await message.react(`${emojis.no}`);

                    await Users.updateOne({ userId: userProfile.userId }, { randomMessageId: message.id });
                } else if (emoji == `${emojis.no}`) {
                    await Users.updateOne({ userId: userProfile.userId }, { randomMessageId: "" });
                    react.message.delete().catch(console.log);
                }
            }
        } catch (error) {
            return console.log('Something went wrong when fetching the message:', error);
        }
    } 
}


