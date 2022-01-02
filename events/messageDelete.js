
const wait = require('util').promisify(setTimeout);
const Users = require('./../models/users');

module.exports =  {
    name: 'messageDelete',
    async execute(message) {
        // console.log(message.member);
        try {
            const userId = message.member.id || message.user.id;
            const user = await Users.findOne({ userId: userId });
            if (user.messageId == message.id) return await Users.updateOne({ userId: user.userId }, { $set: { messageId: "" } })
        else if (user.randomMessageId == message.id) return await Users.updateOne({ userId: user.userId }, { $set: { randomMessageId: "" } })
        } catch (error) {
            // console.log(error
        }
    }
}


