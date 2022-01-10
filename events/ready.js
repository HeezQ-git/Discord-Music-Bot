// const { REST } = require('@discordjs/rest');
// const { Routes } = require('discord-api-types/v9');
// const config = require('./../config.json');
const Songs = require('./../models/songs');
const SongsAnalytics = require('./../models/songsAnalytics');
const { getUnique } = require('./../handlers/functions');

module.exports =  {
    name: 'ready',
    async execute(client, commands) {
        console.log('Bot is up!');
        const songs = await Songs.find();
        const analytics = await SongsAnalytics.find();
        const values = ['version', 'artist', 'game', 'dancemode', 'xboxbrokenlevel', 'difficulty', 'effort', 'times', 'genre', 'tags'];
        const toSave = [];
        for await (const el of values) {
            // console.log(`CHECKING: ${el}`)
            toSave.push(await getUnique(songs, el));
        }
        toSave.map((el, index) => analytics[values[index]] = el );
        await SongsAnalytics.create(analytics);
        // console.log(analytics);
        // console.log(toSave[1]);
        // const global = false;

        // const CLIENT_ID = client.user.id;

        // const rest = new REST({
        //     version: "9"
        // }).setToken(config.token);

        // (async () => {
        //     try {
        //         if (global) {
        //             await rest.put(Routes.applicationCommands(CLIENT_ID), {
        //                 body: commands
        //             });
        //             console.log('Successfully registered commands globally.');
        //         } else {
        //             await rest.put(Routes.applicationGuildCommands(CLIENT_ID, '799823184614260737'), {
        //                 body: commands
        //             });
        //             console.log('Successfully registered commands locally.');
        //         }
        //     } catch (e) {
        //         console.log(e);
        //     }
        // })();
    } 
}