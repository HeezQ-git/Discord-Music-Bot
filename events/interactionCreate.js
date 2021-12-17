const { songManager } = require('../handlers/embeds');

const wait = require('util').promisify(setTimeout);

module.exports =  {
    name: 'interactionCreate',
    async execute(interaction, user) {
        if (interaction.isSelectMenu()) {
            if (interaction.customId === 'select_menu') {
                const embed = await songManager('new', interaction.member);
                if (!embed) return;
                await interaction.deferUpdate();
                await interaction.editReply({ embeds: [embed], components: [] });
            }
        }
        if (interaction.isCommand()) {
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


