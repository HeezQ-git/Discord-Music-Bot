// const { prefix } = require('../../config.json');
// const emoji = require('./../../config/emojis.json');
// const Channels = require('./../../models/channels');

// const cooldowns = new Map();

// module.exports = async (Discord, client, msg) => {
//     if (!msg.content.startsWith(prefix) || msg.author.bot) return;
//     if (msg.content === prefix) return;
    
//     let channels;
//     channels = await Channels.findOne({ _id: msg.guildId });
//     if (!channels) {
//         try {
//             const _msg = new Channels({
//                 _id: msg.guildId,
//                 tMusic: ""
//             });
//             _msg.save();
//         } catch (e) { console.log(e) };
//         channels = await Channels.findOne({ _id: msg.guildId });
//     }

//     const args = msg.content.slice(prefix.length).split(/ +/);
//     const cmd = args.shift().toLowerCase();
        
//     const command = client.commands.get(cmd) || 
//                     client.commands.find(a => a.aliases && a.aliases.includes(cmd));

//     if (!cooldowns.has(command.name)) cooldowns.set(command.name, new Discord.Collection());

//     const current_time = Date.now();
//     const time_stamps = cooldowns.get(command.name);
//     const cooldown_amount = (command.cooldown) * 1000;

//     if (time_stamps.has(msg.author.id)) {
//         const expiration_time = time_stamps.get(msg.author.id) + cooldown_amount;
//         if (current_time < expiration_time) {
//             const time_left = (expiration_time - current_time) / 1000;
//             msg.delete();
//             return msg.channel.send(`${emoji.no} Please wait ${time_left.toFixed(1)} more seconds before using ${command.name}`).then(e => setTimeout(() => e.delete().catch(console.log), 4000));
//         }
//     }

//     time_stamps.set(msg.author.id, current_time);
//     setTimeout(() => time_stamps.delete(msg.author.id), cooldown_amount);

//     if (command) {
//         if (command.category === 'Music') {
//             if (!channels.tMusic || channels.tMusic.length === 0 || channels.tMusic === null) {
//                 msg.delete().catch(console.log);
//                 return msg.channel.send(`${emoji.no} Please specify music channel! Use \`.sm #channel\` command`).then(e => setTimeout(() => e.delete().catch(console.log), 4000));
//             }
//             if (msg.channel.id.toString() != channels.tMusic) {
//                 msg.delete().catch(console.log);
//                 return msg.channel.send(`${emoji.no} <@${msg.author.id}>, please use <#${channels.tMusic}> channel for music management!`).then(e => setTimeout(() => e.delete().catch(console.log), 8000));
//             }
//         }
//         command.execute(msg, args, cmd, client);
//     }
// }