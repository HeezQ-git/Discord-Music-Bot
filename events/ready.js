const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('./../config.json');

module.exports =  {
    name: 'ready',
    execute(client, commands) {
        console.log('Bot is up!');
        const global = false;

        const CLIENT_ID = client.user.id;

        const rest = new REST({
            version: "9"
        }).setToken(config.token);

        (async () => {
            try {
                if (global) {
                    await rest.put(Routes.applicationCommands(CLIENT_ID), {
                        body: commands
                    });
                    console.log('Successfully registered commands globally.');
                } else {
                    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, '799823184614260737'), {
                        body: commands
                    });
                    console.log('Successfully registered commands locally.');
                }
            } catch (e) {
                console.log(e);
            }
        })();
    } 
}