const { SlashCommandBuilder } = require('@discordjs/builders');

const { songManager, songsHandler, basicEmbed, checkUser, steps } = require('../handlers/embeds');
const Songs = require('./../models/songs');
const Users = require('./../models/users');
const emoji = require('../config/emojis.json');

const { MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('song')
    .setDescription('Song manager')
    .addStringOption(option => 
        option
            .setName('option')
            .setDescription('takes an option')
            .setRequired(true)
            .addChoice('menu', 'menu')
            .addChoice('add', 'add')
    )
    .addStringOption(option => 
        option
            .setName('value')
            .setDescription('takes a specific value')
            .setRequired(false)
    ),
    async execute(interaction) {
        switch(interaction.options.getString('option')) {
            case 'example':
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
                break;
            case 'get':
                const song = await Songs.findOne({ name: 'Calypso' });
                const embed = await songsHandler('info', song, interaction);
                if (!embed || embed == null) await interaction.reply({ embeds: [await basicEmbed(interaction, 'An unexpected error has occurred', 'no')] });
                await interaction.reply({ embeds: [embed] });
                break;
            case 'menu':
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
                const _e = await songManager('menu', interaction);
                if (_e) await interaction.reply({ embeds: [_e], components: [row] });
                else return interaction.reply(`${emoji.no} Couldn't execute this action!`);
                const message = await interaction.fetchReply();
                await Users.updateOne({ userId: interaction.user.id }, { $set: { messageId: message.id } });
                console.log('updated?');
                break;
            case 'add':
                const user = await checkUser(interaction.user.id);
                const value = interaction.options.getString('value');
                
                if (!value || value.length <= 0) return interaction.reply({ embeds: [await basicEmbed(interaction, 'You have to provide a value which should be added!', 'no')], ephemeral: true });
                if (!user.messageId || user.messageId.length <= 0) return interaction.reply({ embeds: [await basicEmbed(interaction, `Couldn't find the menu message ID, please resend the menu!`, 'no')], ephemeral: true })
                if (!user.song_page || user.song_page <= 0) return interaction.reply({ embeds: [await basicEmbed(interaction, `Your page number is out of range, please resend the menu!`, 'no')], ephemeral: true })

                const page = user.song_page - 1;
                user.song_temp[steps[page]].push(value);
                await Users.updateOne({ userId: interaction.user.id }, user);

                const msg = await interaction.channel.messages.fetch(user.messageId);
                msg.edit({ embeds: [await songManager('new', interaction)] });
                interaction.reply({ embeds: [await basicEmbed(interaction, `Successfully added \`${value}\` to current list.`, 'yes', 'green')], ephemeral: true })
        }
    }
}