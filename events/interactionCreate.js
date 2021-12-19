const { songManager, stepsDetails } = require('../handlers/embeds');
const emoji = require('./../config/emojis.json');
const Users = require('./../models/users');

const wait = require('util').promisify(setTimeout);

module.exports =  {
    name: 'interactionCreate',
    async execute(interaction, user) {
        if (interaction.isSelectMenu()) {
            if (interaction.customId === 'select_menu') {
                const embed = await songManager('new', interaction.member);
                if (!embed) return;
                await interaction.deferUpdate();
                const msg = await interaction.editReply({ embeds: [embed], components: [] });
                await msg.react("⏪");
                await msg.react(`${emoji.no}`);
                await msg.react("⏩");
            }
        } else if (interaction.isButton()) {
            if (interaction.customId === 'submit') {
                const userProfile = await Users.findOne({ userId: interaction.member.id });
                // console.log(userProfile.song_temp[0]);
                interaction.message.reactions.removeAll().catch(console.log);
                let options = [false, false, false];

                await interaction.deferUpdate();
                await interaction.editReply({ embeds: [await songManager('save', options)], components: []});

                options[0] = true;
                await wait(Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000);
                await interaction.editReply({ embeds: [await songManager('save', options)]});

                let err = [];
                stepsDetails.map(el => {
                    if (!el.required) return;
                    if (userProfile.song_temp[el.name].length <= 0) err.push(el.name);
                });

                if (err.length > 0) options[1] = 'error';

                if (options[1] != 'error') {
                    options[1] = true
                    await wait(Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000);
                    await interaction.editReply({ embeds: [await songManager('save', options)]});

                    options[2] = true;
                    await wait(Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000);
                    await interaction.editReply({ embeds: [await songManager('save', options)]});
                } else {
                    options[2] = 'error';
                    interaction.message.react(`${emoji.no}`);
                    return interaction.editReply({ embeds: [await songManager('save', options, err)]});
                }

                interaction.message.react(`🔃`);
                interaction.message.react(`${emoji.no}`);
            }
        } else if (interaction.isCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            
            if (!command) return;
    
            try {
                await command.execute(interaction);
            } catch (e) {
                console.log(e);
                await interaction.reply({ 
                    content: 'An error occurred while executing that command!',
                    ephemeral: true,
                });
            }
        }
    } 
}


