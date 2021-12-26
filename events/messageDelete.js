
const wait = require('util').promisify(setTimeout);
const Users = require('./../models/users');

module.exports =  {
    name: 'messageDelete',
    async execute(message) {
        console.log(message.member);
        const user = await Users.findOne({ userId: message.member.id });
        if (user.messageId == message.id) return await Users.updateOne({ userId: user.userId }, { $set: { messageId: "" } })
        else if (user.randomMessageId == message.id) return await Users.updateOne({ userId: user.userId }, { $set: { randomMessageId: "" } })
    } 
}


