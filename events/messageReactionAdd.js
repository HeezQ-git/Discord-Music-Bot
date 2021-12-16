const wait = require('util').promisify(setTimeout);
const Users = require('./../models/users');
const { songManager } = require('./../handlers/embeds');

module.exports =  {
    name: 'messageReactionAdd',
    async execute(reaction, user) {
        try {
            const react = await reaction.fetch();
            const emoji = react._emoji.toString();
            if (emoji == "🔄") {
                const userProfile = await Users.findOne({ userId: user.id });
                if (!userProfile.messageId || userProfile.messageId.length <= 0) return;
                if (react.message.id != userProfile.messageId) return;
                const msg = await react.message.channel.messages.fetch(userProfile.messageId);
                msg.delete().catch(console.log);
                const _msg = await react.message.channel.send({ embeds: [react.message.embeds[0]] });
                await Users.updateOne({ userId: user.id }, { $set: { messageId: _msg.id } });
            }
        } catch (error) {
            return console.log('Something went wrong when fetching the message:', error);
        }
    } 
}


