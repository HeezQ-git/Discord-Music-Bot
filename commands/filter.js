const emoji = require('./../config/emojis.json');
const filtersSettings = require('./../config/filters.json');

module.exports = {
    name: 'filter',
    aliases: ['filters'],
    description: 'Manages filters (add/remove/...).',
    cooldown: 3,
    category: 'Music',
    async execute(msg, args, cmd, client) {
        msg.delete().catch(console.log);

        const queue = client.distube.getQueue(msg.guildId);
        if (!queue || !queue.songs[0]) return msg.channel.send(`${emoji.no} There are no songs in queue.`).then(e => setTimeout(() => e.delete().catch(console.log), 4000));
        
        if (!args[0] || !['add', 'remove', 'clear', 'set', 'list'].includes(args[0].toLowerCase())) return msg.channel.send(`${emoji.no} Please input a correct value: \`add, remove, clear, set, list\``).then(e => setTimeout(() => e.delete().catch(console.log), 6000));
        
        arg0 = args[0];
        args = args.splice(1);

        try {
            let filters, toAdd, toRemove;
            switch (arg0) {
                case 'add':
                    filters = args;
    
                    if (filters.some(a => !filtersSettings[a])) return msg.channel.send(`${emoji.no} You need to input a valid filter: \`${Object.keys(filtersSettings).map(f => `${f}`).join(', ')}\``).then(e => setTimeout(() => e.delete().catch(console.log), 4000));
    
                    toAdd = [];
                    filters.forEach(f => {
                        if (!queue.filters.includes(f)) toAdd.push(f);
                    });
    
                    if (!toAdd || toAdd === [] || toAdd.length === 0) return msg.channel.send(`${emoji.no} You didn't add a unique filter to the list. All current filters: \`${queue.filters.map(e => `${e}`).join(', ')}\``).then(e => setTimeout(() => e.delete().catch(console.log), 6000));
    
                    await queue.setFilter(toAdd);
                    
                    return msg.channel.send(`${emoji.yes} Added ${toAdd.length} ${toAdd.length === filters.length ? 'Filters' : `of ${filters.length} filters! The rest was already added.`} `).then(e => setTimeout(() => e.delete().catch(console.log), 6000));
                case 'clear':
                    await queue.setFilter(false);
    
                    return msg.channel.send(`${emoji.yes} Cleared all filters.`).then(e => setTimeout(() => e.delete().catch(console.log), 4000));
                case 'remove':
                    filters = args;
    
                    if (filters.some(a => !filtersSettings[a])) return msg.channel.send(`${emoji.no} You need to input a valid filter: \`${Object.keys(filtersSettings).map(f => `${f}`).join(', ')}\``).then(e => setTimeout(() => e.delete().catch(console.log), 4000));
    
                    toRemove = [];
                    filters.forEach(f => {
                        if (queue.filters.includes(f)) toRemove.push(f);
                    });
    
                    if (!toRemove || toRemove === [] || toRemove.length === 0) return msg.channel.send(`${emoji.no} Given filter isn't currently applied. All current filters: \`${queue.filters.map(e => `${e}`).join(', ')}\``).then(e => setTimeout(() => e.delete().catch(console.log), 6000));
    
                    await queue.setFilter(toRemove);
    
                    return msg.channel.send(`${emoji.yes} Removed ${toAdd.length} ${toAdd.length === filters.length ? 'Filters' : `of ${filters.length} filters! The rest hasn't been added yet.`} `).then(e => setTimeout(() => e.delete().catch(console.log), 6000));
                case 'set':
                    filters = args;
    
                    if (filters.some(a => !filtersSettings[a])) return msg.channel.send(`${emoji.no} You need to input a valid filter: \`${Object.keys(filtersSettings).map(f => `${f}`).join(', ')}\``).then(e => setTimeout(() => e.delete().catch(console.log), 4000));

                    let amt = filters.length;
                    toAdd = filters;

                    queue.filters.forEach(f => {
                        if (!filters.includes(f)) toAdd.push(f);
                    });

                    if (!toAdd || toAdd === [] || toAdd.length === 0) return msg.channel.send(`${emoji.no} You didn't add a unique filter to the list. All current filters: \`${queue.filters.map(e => `${e}`).join(', ')}\``).then(e => setTimeout(() => e.delete().catch(console.log), 6000));

                    await queue.setFilter(filters);
                    
                    return msg.channel.send(`${emoji.yes} Set ${amt} filters`).then(e => setTimeout(() => e.delete().catch(console.log), 6000));
                case 'list':
                    if (!queue.filters || queue.filters.length <= 0) return msg.channel.send(`${emoji.yes} All available filters: \`${Object.keys(filtersSettings).map(e => `${e}`).join(', ')}\``);
                    
                    return msg.channel.send(`${emoji.yes} All available filters: \n\`${Object.keys(filtersSettings).map(e => `${e}`).join(', ')}\`\n\nAll current filters: \n\`${queue.filters.map(e => `${e}`).join(', ')}\``);
            }
        } catch (e) {
            return msg.channel.send(`${emoji.no} There was an error executing this command:\n**${e}**`);
        }

        return msg.channel.send(`${emoji.no} There was an error executing this command.`).then(e => setTimeout(() => e.delete().catch(console.log), 4000));
    }
}