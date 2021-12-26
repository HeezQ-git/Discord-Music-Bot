const { randomHandler, checkEditMessage } = require('./../handlers/randomHandler');
const { songsHandler } = require('./../handlers/embeds');
const Users = require('./../models/users');
const emoji = require('./../config/emojis.json');

module.exports = {
    name: 'random',
    aliases: ['r', 'rand'],
    category: 'Administration',
    async execute(msg, args, cmd, client) {
        msg.delete().catch(console.log);
        const user = await Users.findOne({ userId: msg.author.id });

        let message;
        if (user.randomMessageId) message = await checkEditMessage(msg, user.randomMessageId);
        
        const embed = await songsHandler('info', await randomHandler(), msg);
        if (!message) {
            message = await msg.channel.send({ embeds: [ embed ] });
            await Users.updateOne({ userId: user.userId }, { randomMessageId: message.id });
            await message.react("🔄");
            await message.react(`${emoji.no}`);
        } else return message.edit({ embeds: [ embed ] });
    }
}