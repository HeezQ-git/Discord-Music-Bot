const { songManager, songsHandler, basicEmbed, checkUser, steps } = require('../handlers/embeds');
const Songs = require('./../models/songs');
const Users = require('./../models/users');
const emoji = require('../config/emojis.json');

const { MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = {
    name: 'song',
    aliases: ['s'],
    cooldown: 0,
    category: 'Administration',
    async execute(msg, args, cmd, client) {
        msg.delete();
        let user, page, _msg, message;
        if (
            args[0] === 'add' || 
            args[0] === 'remove' || 
            args[0] === 'set' ||
            args[0] === 'page' || 
            args[0] === 'p'
        ) {
            user = await checkUser(msg.author.id);
            args[2] = args[1];
            
            if (!args[2] || args[2].length <= 0) return msg.channel.send({ embeds: [await basicEmbed(msg, 'You have to provide a args[2] which should be added!', 'no')], ephemeral: true });
            if (!user.messageId || user.messageId.length <= 0) return msg.channel.send({ embeds: [await basicEmbed(msg, `Couldn't find the menu message ID, please resend the menu!`, 'no')], ephemeral: true })
            if (!user.song_page || user.song_page <= 0) return msg.channel.send({ embeds: [await basicEmbed(msg, `Your page number is out of range, please resend the menu!`, 'no')], ephemeral: true })

            page = user.song_page - 1;
        }
        if (args[0] === 'example') {
            Songs.insertMany({ 
                name: 'Calypso',
                artist: ['Luis Fonsi', 'Stefflon Don'],
                game: '2019',
                dancemode: 'Solo',
                xboxbrokenlevel: '9',
                difficulty: 'Easy',
                effort: 'Low',
                times: '2010s',
                genre: 'pop',
                duration: '3:25',
                tags: ['latin', 'summer', 'bop', 'sassy'],
                cover: 'https://static.wikia.nocookie.net/justdance/images/a/af/Calypso_cover_generic.png',
            });
        } else if (args[0] === 'get') {
            const song = await Songs.findOne({ name: 'Calypso' });
            const embed = await songsHandler('info', song, msg);
            if (!embed || embed == null) await msg.channel.send({ embeds: [await basicEmbed(msg, 'An unexpected error has occurred', 'no')] });
            await msg.channel.send({ embeds: [embed] });
        } else if (args[0] === 'menu') {
            const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('select_menu')
                    .setPlaceholder('Select an action')
                    .addOptions([
                        {
                            label: 'New song',
                            description: 'Opens menu where you can add a new song',
                            value: 'new_song',
                        },
                        {
                            label: 'Edit song',
                            description: 'Opens menu where you can edit an existing song',
                            value: 'edit_song',
                        },
                    ]),
            );
            const _e = await songManager('menu', msg);
            if (_e) message = await msg.channel.send({ embeds: [_e], components: [row] });
            else return msg.channel.send(`${emoji.no} Couldn't execute this action!`);
            await Users.updateOne({ userId: msg.author.id }, { $set: { messageId: message.id } });
            console.log('updated?');
        } else if (args[0] === 'add') {
            user.song_temp[steps[page]].push(args[2]);
            await Users.updateOne({ userId: msg.author.id }, user);

            _msg = await msg.channel.messages.fetch(user.messageId);
            _msg.edit({ embeds: [await songManager('new', msg)] });
        } else if (args[0] === 'remove') { 
            let _tmp;
            if (/^\d+$/.test(args[2])) _tmp = user.song_temp[steps[page]].splice(Number(args[2]-1), 1)
            else _tmp = user.song_temp[steps[page]].splice(user.song_temp[steps[page]].indexOf(args[2]), 1);
            await Users.updateOne({ userId: msg.author.id }, user);

            _msg = await msg.channel.messages.fetch(user.messageId);
            _msg.edit({ embeds: [await songManager('new', msg)] });
        } else if (args[0] === 'set') {
            user.song_temp[steps[page]] = [args[2]];
            await Users.updateOne({ userId: msg.author.id }, user);

            _msg = await msg.channel.messages.fetch(user.messageId);
            _msg.edit({ embeds: [await songManager('new', msg)] });
        } else if (args[0] === 'page' || args[0] === 'p') {
            let page = 1;
            if (args[1] != 'next' && args[1] != 'n' && args[1] != 'previous' && args[1] != 'p') {
                if (/^\d+$/.test(args[1])) page = Number(args[1]);
            } else {
                if (args[1] === 'next' || args[1] == 'n') page = user.song_page < steps.length ? user.song_page + 1 : user.song_page
                else if (args[1] === 'previous' || args[1] === 'p') page = user.song_page > 1 ? user.song_page - 1 : user.song_page
            }
            await Users.updateOne({ userId: msg.author.id }, { $set: { song_page: page } });
            _msg = await msg.channel.messages.fetch(user.messageId);
            if (_msg) _msg.edit({ embeds: [await songManager('new', msg)] });
        }
    }
}