
const wait = require('util').promisify(setTimeout);
const Users = require('./../models/users');

module.exports =  {
    name: 'messageDelete',
    async execute(message) {
        const user = await Users.findOne({ messageId: message.id });
        if (user) await Users.updateOne({ userId: user.userId }, { $set: { messageId: "" } });
    } 
}


