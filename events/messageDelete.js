
const wait = require('util').promisify(setTimeout);
const Users = require('./../models/users');

module.exports =  {
    name: 'messageDelete',
    async execute(message) {
        const user = await Users.findOne({ userId: message.member.user.id });
        if (user.messageId == message.id) return await Users.updateOne({ userId: user.userId }, { $set: { messageId: "" } })
        else if (user.randomMessageId == message.id) return await Users.updateOne({ userId: user.userId }, { $set: { randomMessageId: "" } })
    } 
}


