const { randomHandler, randomEmbed, randomPages, checkEditMessage } = require('./../handlers/randomHandler');
const { songsHandler, basicEmbed } = require('./../handlers/embeds');
const Users = require('./../models/users');
const emoji = require('./../config/emojis.json');

module.exports = {
    name: 'random',
    aliases: ['r', 'rand'],
    category: 'Administration',
    async execute(msg, args, cmd, client) {
        try {
            msg.delete().catch(console.log);
            const user = await Users.findOne({ userId: msg.author.id });
            let message;
            if (user.randomMessageId) message = await checkEditMessage(msg, user.randomMessageId);

            if (!args[0]) {
                const embed = await songsHandler('info', await randomHandler(), msg);
                if (!message) {
                    message = await msg.channel.send({ embeds: [ embed ] });
                    await Users.updateOne({ userId: user.userId }, { randomMessageId: message.id });
                    await message.react("🔄");
                    await message.react(`${emoji.no}`);
                } else return message.edit({ embeds: [ embed ] });
            } else if (args[0] === 'settings' || args[0] === 's') {
                if (!user.randomMenu) {
                    user.randomMenu = 'main';
                    await Users.updateOne({ userId: user.userId }, user);
                }
                const embed = await randomEmbed('settings', 'main', user);
                if (message) await message.delete();
                const _msg = await msg.channel.send({ embeds: [ embed ] });
                await Users.updateOne({ userId: user.userId }, { randomMessageId: _msg.id });
            } else if (args[0] === 'edit' || args[0] === 'e') {
                if (/^\d+$/.test(args[1])) {
                    const id = Number(args[1])-1;
                    if (id > randomPages.length - 1) return;
                    user.randomMenu = randomPages[id].name.toLowerCase();
                    await Users.updateOne({ userId: user.userId }, user);
                } else {
                    let option = [];
                    randomPages.map(el => {
                        if (el.name.toLowerCase().includes(args[1].toLowerCase())) option.push(el.name.toLowerCase());
                    })
                    if (option.length === 1) {
                        user.randomMenu = option[0];
                        await Users.updateOne({ userId: user.userId }, user);
                    } else {
                        return msg.channel.send('Not found or found many');
                    }
                }
                // msg.channel.send(user.randomMenu);
                if (!message) msg.channel.send({ embeds: [await basicEmbed(msg, `No random menu found. Please create new one using \`.random settings\``, 'no')] })
                else {
                    const embed = await randomEmbed('settings', 'edit', user);
                    await message.edit({ embeds: [embed] });
                }
            }
        } catch (error) {
            console.log(`in random.js:\n`, error);
        }
    }
}