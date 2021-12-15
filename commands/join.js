module.exports = {
    name: 'join',
    aliases: ['joinvc'],
    cooldown: 3,
    category: 'Music',
    async execute(msg, args, cmd, client) {
        msg.delete().catch(console.log);

        client.distube.voices.join(msg.member.voice.channel);
    }
}