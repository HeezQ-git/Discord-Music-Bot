const Discord = require('discord.js');
const config = require('./config.json');
const DisTube = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');
const filters = require('./config/filters.json');

const fs = require('fs');


const mongoose = require('mongoose');

const { Client, Intents } = require('discord.js');

const client = new Client({ 
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

const commands = [];

const commandFiles = fs.readdirSync('./slashCommands/').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const cmd = require(`./slashCommands/${file}`);
    commands.push(cmd.data.toJSON());
    client.commands.set(cmd.data.name, cmd);
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);

    client.on(event.name, (...args) => event.execute(...args, commands));
}

mongoose.connect(config.MONGODB_SRV, {
   useNewUrlParser: true,
   useUnifiedTopology: true
})
.then(() => console.log('Connected to the database!'))
.catch((err) => console.log(err));

let spotifyoptions = {
    parallel: true,
    emitEventsAfterFetching: true,
}

spotifyoptions.api = {
    clientId: config.spotify_api.clientID,
    clientSecret: config.spotify_api.clientSECRET,
}

client.distube = new DisTube.default(client, {
    emitNewSongOnly: false,
    leaveOnEmpty: true,
    leaveOnFinish: true,
    leaveOnStop: true,
    savePreviousSongs: true,
    emitAddSongWhenCreatingQueue: false,
    searchSongs: 1,
    nsfw: true,
    emptyCooldown: 25,
    ytdlOptions: {
        highWaterMark: 1024 * 1024 * 64,
        quality: "highestaudio",
        format: "audioonly",
        liveBuffer: 60000,
        dlChunkSize: 1024 * 1024 * 64,
    },
    youtubeDL: true,
    updateYouTubeDL: false,
    customFilters: filters,
    plugins: [new SpotifyPlugin(spotifyoptions)]
});

['distubeEvent'].forEach(e => {
    require(`./handlers/${e}`)(client);
});

client.login(config.token);