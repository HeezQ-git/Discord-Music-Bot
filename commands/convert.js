const { unformatTime } = require('../handlers/functions');

module.exports = {
    name: 'convert',
    aliases: [],
    cooldown: 0,
    category: 'Test',
    async execute(msg, args, cmd, client) {
        msg.delete().catch(console.log);
        if (args[0]) {
            msg.channel.send(`${args[0]} to seconds is equal to \`\`${unformatTime(args[0])} seconds\`\``);
        }
    }
}
