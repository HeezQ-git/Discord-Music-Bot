const Discord = require('discord.js');

module.exports = {
    name: 'search',
    aliases: ['find'],
    cooldown: 3,
    category: 'Music',
    async execute(msg, args) {
        msg.delete().catch(console.log);

        const _amt = [0, 1, 2, 3, 4];
        const results = await distube.search(args.join(' '));
        const embed = new Discord.MessageEmbed()
        .setTitle(`Search results for \`${args.join(' ')}\``)
        .setColor('#0F9D58')
        .setFields(
            _amt.map(i => {
                return {
                    name: `⏩ ${i+1}:`,
                    value: `[${results[i].name}](${results[i].url})`
                }
            })
        )
        .setTimestamp()
        .setFooter(`Response to user query ${msg.author.username}`, msg.author.avatarURL())
        msg.channel.send({embeds: [embed]});
    }
}