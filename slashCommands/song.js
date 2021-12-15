const { SlashCommandBuilder } = require('@discordjs/builders');

const { songManager, songsHandler, basicEmbed } = require('../handlers/embeds');
const Songs = require('../models/songs');
const emoji = require('../config/emojis.json');

const { MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('song')
    .setDescription('Database <-> song connector and manager')
    .addStringOption(option =>
        option
            .setName('argument')
            .setDescription('an argument that has to be given')
            .setRequired(true)
    ),
    async execute(interaction) {
        // interaction.reply(`Your content: ${interaction.options.getString('name')}`);
        switch(interaction.options.getString('argument')) {
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
            case 'new':
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
                if (_e) interaction.reply({embeds: [_e], components: [row]});
                else interaction.reply(`${emoji.no} Couldn't execute this action!`)
                break;
        }
    }
}