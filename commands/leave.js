module.exports = {
    name: 'leave',
    aliases: ['leavevc'],
    cooldown: 3,
    category: 'Music',
    async execute(msg, args, cmd, client) {
        msg.delete().catch(console.log);

        client.distube.voices.leave(msg);

        try {
            const queue = client.distube.getQueue(msg.guildId);
            queue.stop();
        } catch (e) {}
    }
}