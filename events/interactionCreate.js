const { songsHandler, songManager, stepsDetails, checkUser, findSong } = require('../handlers/embeds');
const emoji = require('./../config/emojis.json');
const Users = require('./../models/users');
const Songs = require('./../models/songs');

const wait = require('util').promisify(setTimeout);
const fs = require('fs');

module.exports =  {
    name: 'interactionCreate',
    async execute(interaction, user) {
        const userProfile = await checkUser(interaction.member.id);
        if (!userProfile || userProfile.messageId != interaction.message.id) return;
        if (interaction.isSelectMenu()) {
            if (interaction.customId === 'select_menu') {
                if (interaction.values[0] == 'edit_song' || interaction.values[0] == 'delete_song') {
                    await interaction.deferUpdate();
                    let songInfo, song;
                    const _msg = await interaction.channel.send(`${emoji.loading} Please input name of desired song below:`);
                    
                    const filter = m => m.author.id === interaction.member.id;
                    const collector = interaction.channel.createMessageCollector({ filter, max: 1, time: 15000 });
                    
                    collector.on('collect', async m => {
                        songInfo = m.content;
                        m.delete().catch(console.log);

                        let song = await findSong(songInfo);
                        song = song[0];
                        if (interaction.values[0] == 'edit_song') {
                            if (song) {
                                _msg.delete().catch(console.log);
                                await Users.updateOne({ userId: interaction.member.id }, { $set: { mode: 'edit', song_temp: {
                                    songId: song._id,
                                    name: [song.name],
                                    artist: song.artist,
                                    game: [song.game],
                                    dancemode: [song.dancemode],
                                    xboxbrokenlevel: [song.xboxbrokenlevel],
                                    difficulty: [song.difficulty],
                                    effort: [song.effort],
                                    times: [song.times],
                                    genre: song.genre,
                                    duration: [song.duration],
                                    tags: song.tags,
                                    cover: [song.cover],
                                    preview: [song.preview]
                                }}});
                                
                                const embed = await songManager('new', interaction.member);
                                if (!embed) return;

                                const msg = await interaction.editReply({ embeds: [embed], components: [] });

                                await msg.react("⏪");
                                await msg.react(`${emoji.no}`);
                                await msg.react("⏩");
                            }  else {
                                interaction.channel.send(`${emoji.no} Couldn't find related song!`);
                            }
                        } else if (interaction.values[0] == 'delete_song') {
                            if (song) {
                                _msg.delete().catch(console.log);
                                
                                const embed = await songsHandler('info', song, interaction);
                                if (!embed) return;

                                const msg = await interaction.editReply({ content: `${emoji.warning} Would you like to remove this song from database?`, embeds: [embed], components: [] });

                                await msg.react("⏪");
                                await msg.react(`${emoji.no}`);
                                await msg.react("⏩");
                            } else {
                                interaction.channel.send(`${emoji.no} Couldn't find related song!`);
                            }
                        }
                    })

                    collector.on('end', async collected => {
                        if (collected.size <= 0) {
                            _msg.delete().catch(console.log);
                        };
                    })
                } else if (interaction.values[0] == 'new_song') {
                    if (userProfile.fillout) {
                        if (!userProfile.isFilled) {
                            let fillout = await JSON.parse(fs.readFileSync('config/fillout.json'));
                            let song = fillout[0];
                            fillout.splice(0, 1);
                            fs.writeFileSync('config/fillout.json', JSON.stringify(fillout));
                            let game = (song.match(/\(([^)]+)\)$/g))[0].replace(/\(|\)/g, '')
                            song = song.replace((song.match(/\(([^)]+)\)$/g))[0], '')
                            let version = "classic";
                            if (song.includes(' > ')) {
                                version = song.split(' > ');
                                song = version[0];
                                version = version[1].toLowerCase()
                            }
                            if (version.includes('sweat')) version = 'sweat';
                            if (version.includes('sing')) version = 'sing-along';
                            if (version.includes('alt')) version = 'alt';
                            if (version.includes('extreme')) {
                                version = 'alt';
                                userProfile.song_temp['difficulty'] = ['extreme'];
                            };
                            userProfile.song_temp['artist'] = [];
                            userProfile.song_temp['dancemode'] = [];
                            userProfile.song_temp['xboxbrokenlevel'] = [];
                            userProfile.song_temp['difficulty'] = [];
                            userProfile.song_temp['effort'] = [];
                            userProfile.song_temp['times'] = [];
                            userProfile.song_temp['genre'] = [];
                            userProfile.song_temp['duration'] = [];
                            userProfile.song_temp['tags'] = [];
                            userProfile.song_temp['cover'] = [];
                            userProfile.song_temp['preview'] = [];
                            userProfile.song_temp['name'] = [song];
                            userProfile.song_temp['game'] = [game];
                            userProfile.song_temp['version'] = [version];
                            userProfile.isFilled = true;
                            await Users.updateOne({ userId: interaction.member.id }, userProfile);
                            // console.log(`SONG: ${song} | GAME: ${game} | VERSION: ${version}`);
                        }
                    }
                    await Users.updateOne({ userId: interaction.member.id }, { $set: { mode: 'new' } });
                    const embed = await songManager('new', interaction.member);
                    if (!embed) return;
                    await interaction.deferUpdate();
                    const msg = await interaction.editReply({ embeds: [embed], components: [] });
                    await msg.react("⏪");
                    await msg.react(`${emoji.no}`);
                    await msg.react("⏩");
                }

            } else if (interaction.customId === 'select_tags') {
                if (`${interaction.values[0]}`.includes('clear')) {
                    userProfile.song_temp['tags'] = [];
                } else {
                    if (!userProfile.song_temp['tags'].includes(`${interaction.values[0]}`)) userProfile.song_temp['tags'].push(`${interaction.values[0]}`)
                    else userProfile.song_temp['tags'].splice(userProfile.song_temp['tags'].indexOf(`${interaction.values[0]}`), 1);
                }
                await Users.updateOne({ userId: interaction.member.id }, userProfile)
                await interaction.deferUpdate();
                await interaction.editReply({ embeds: [await songManager('new', interaction)]});
            }
        } else if (interaction.isButton()) {
            if (interaction.customId === 'submit') {
                const userProfile = await Users.findOne({ userId: interaction.member.id });
                interaction.message.reactions.removeAll().catch(console.log);
                let options = [false, false, false];

                await interaction.deferUpdate();
                await interaction.editReply({ embeds: [await songManager('save', options)], components: []});

                options[0] = true;
                await wait(Math.floor(Math.random() * (3000 - 1000 + 1)));
                await interaction.editReply({ embeds: [await songManager('save', options)]});

                let err = [];
                stepsDetails.map(el => {
                    if (!el.required) return;
                    if (userProfile.song_temp[el.name].length <= 0) err.push(el.name);
                });

                if (err.length > 0) options[1] = 'error';

                if (options[1] != 'error') {
                    options[1] = true
                    await wait(Math.floor(Math.random() * (3000 - 1000 + 1)));
                    await interaction.editReply({ embeds: [await songManager('save', options)]});

                    let song;
                    song = await Songs.findOne({ name: `${userProfile.song_temp['name'][0]}` });
                    if (userProfile.mode == 'new') {
                        if (song) {
                            err.push(`Song named \`${userProfile.song_temp['name'][0]}\` already exists.\nYou may want to edit it instead!`);
                            options[2] = 'error';
                        } else {
                            try {
                                await Songs.insertMany({ 
                                    name: userProfile.song_temp['name'][0],
                                    artist: userProfile.song_temp['artist'],
                                    version: userProfile.song_temp['version'][0],
                                    game: userProfile.song_temp['game'][0],
                                    dancemode: userProfile.song_temp['dancemode'][0],
                                    xboxbrokenlevel: userProfile.song_temp['xboxbrokenlevel'][0],
                                    difficulty: userProfile.song_temp['difficulty'][0],
                                    effort: userProfile.song_temp['effort'][0],
                                    times: userProfile.song_temp['times'][0],
                                    genre: userProfile.song_temp['genre'],
                                    duration: userProfile.song_temp['duration'][0],
                                    tags: userProfile.song_temp['tags'],
                                    cover: userProfile.song_temp['cover'][0],
                                    preview: userProfile.song_temp['preview'][0],
                                });
                                userProfile.song_temp['artist'] = [];
                                userProfile.song_temp['dancemode'] = [];
                                userProfile.song_temp['xboxbrokenlevel'] = [];
                                userProfile.song_temp['difficulty'] = [];
                                userProfile.song_temp['effort'] = [];
                                userProfile.song_temp['times'] = [];
                                userProfile.song_temp['genre'] = [];
                                userProfile.song_temp['duration'] = [];
                                userProfile.song_temp['tags'] = [];
                                userProfile.song_temp['cover'] = [];
                                userProfile.song_temp['preview'] = [];
                                userProfile.song_temp['name'] = [];
                                userProfile.song_temp['game'] = [];
                                userProfile.song_temp['version'] = [];
                                userProfile.isFilled = false;
                                await Users.updateOne({ userId: interaction.member.id }, userProfile);
                                options[2] = true;
                            } catch (e) {
                                console.log(e);
                                err.push(`Couldn't add desired song to database!\nAsk developer for assistance.`);
                                options[2] = 'error';
                            }
                        };
                    } else {
                        if (!song) song = await Songs.findOne({ _id: userProfile.song_temp['songId'] });
                        if (song) {
                            try {
                                await Songs.updateOne({ _id: userProfile.song_temp['songId'] }, {
                                    $set: {
                                        name: userProfile.song_temp['name'][0],
                                        artist: userProfile.song_temp['artist'],
                                        version: userProfile.song_temp['version'][0],
                                        game: userProfile.song_temp['game'][0],
                                        dancemode: userProfile.song_temp['dancemode'][0],
                                        xboxbrokenlevel: userProfile.song_temp['xboxbrokenlevel'][0],
                                        difficulty: userProfile.song_temp['difficulty'][0],
                                        effort: userProfile.song_temp['effort'][0],
                                        times: userProfile.song_temp['times'][0],
                                        genre: userProfile.song_temp['genre'],
                                        duration: userProfile.song_temp['duration'][0],
                                        tags: userProfile.song_temp['tags'],
                                        cover: userProfile.song_temp['cover'][0],
                                        preview: userProfile.song_temp['preview'][0],
                                    }
                                });
                                options[2] = true;
                            } catch (e) {
                                console.log(e);
                                err.push(`Couldn't edit desired song in database!\nAsk developer for assistance.`);
                                options[2] = 'error';
                            }
                        } else {
                            err.push(`Given song wasn't found in database!`);
                            options[2] = 'error';
                        };
                    }
                    
                    await wait(Math.floor(Math.random() * (3000 - 1000 + 1)));
                    await interaction.editReply({ embeds: [await songManager('save', options, err)]});
                } else {
                    options[2] = 'error';
                    interaction.editReply({ embeds: [await songManager('save', options, err)]});
                }

                interaction.message.react(`🔃`);
                interaction.message.react(`${emoji.no}`);
            }
        } else if (interaction.isCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            
            if (!command) return;
    
            try {
                await command.execute(interaction);
            } catch (e) {
                console.log(e);
                await interaction.reply({ 
                    content: 'An error occurred while executing that command!',
                    ephemeral: true,
                });
            }
        }
    } 
}


