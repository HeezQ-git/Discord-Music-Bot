const Discord = require('discord.js');
const config = require('./config.json');
const DisTube = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');
const filters = require('./config/filters.json');

const fs = require('fs');
const Channels = require('./models/channels');
const emoji = require('./config/emojis.json');

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
client.cooldowns = new Map();

const commands = [];

const commandFiles = fs.readdirSync('./slashCommands/').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const cmd = require(`./slashCommands/${file}`);
    commands.push(cmd.data.toJSON());
    client.commands.set(cmd.data.name, cmd);
}

const cmdFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of cmdFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(file.replace('.js', ''), command);
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

client.on('messageCreate', async (msg) => {
    const prefix = config.prefix;
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;
    if (msg.content === prefix) return;
    
    let channels;
    channels = await Channels.findOne({ _id: msg.guildId });
    if (!channels) {
        try {
            const _msg = new Channels({
                _id: msg.guildId,
                tMusic: ""
            });
            _msg.save();
        } catch (e) { console.log(e) };
        channels = await Channels.findOne({ _id: msg.guildId });
    }

    const args = msg.content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();
        
    const command = client.commands.get(cmd) || 
                    client.commands.find(a => a.aliases && a.aliases.includes(cmd));

    if (!client.cooldowns.has(command.name)) client.cooldowns.set(command.name, new Discord.Collection());

    const current_time = Date.now();
    const time_stamps = client.cooldowns.get(command.name);
    const cooldown_amount = (command.cooldown) * 1000;

    if (time_stamps.has(msg.author.id)) {
        const expiration_time = time_stamps.get(msg.author.id) + cooldown_amount;
        if (current_time < expiration_time) {
            const time_left = (expiration_time - current_time) / 1000;
            msg.delete();
            return msg.channel.send(`${emoji.no} Please wait ${time_left.toFixed(1)} more seconds before using ${command.name}`).then(e => setTimeout(() => e.delete().catch(console.log), 4000));
        }
    }

    time_stamps.set(msg.author.id, current_time);
    setTimeout(() => time_stamps.delete(msg.author.id), cooldown_amount);

    if (command) {
        if (command.category === 'Music') {
            if (!channels.tMusic || channels.tMusic.length === 0 || channels.tMusic === null) {
                msg.delete().catch(console.log);
                return msg.channel.send(`${emoji.no} Please specify music channel! Use \`.sm #channel\` command`).then(e => setTimeout(() => e.delete().catch(console.log), 4000));
            }
            if (msg.channel.id.toString() != channels.tMusic) {
                msg.delete().catch(console.log);
                return msg.channel.send(`${emoji.no} <@${msg.author.id}>, please use <#${channels.tMusic}> channel for music management!`).then(e => setTimeout(() => e.delete().catch(console.log), 8000));
            }
        }
        command.execute(msg, args, cmd, client);
    }
})

client.login(config.token);