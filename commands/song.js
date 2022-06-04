const {
    songManager,
    songsHandler,
    basicEmbed,
    findSong,
    checkUser,
    steps,
    stepsDetails,
    tags,
} = require("../handlers/embeds");
const Songs = require("./../models/songs");
const Settings = require("./../models/settings");
const Users = require("./../models/users");
const emoji = require("../config/emojis.json");
const colors = require("./../config/colors.json");
const fs = require("fs");
const Discord = require("discord.js");
// const toImport = require('./../config/import.json');

const {
    MessageActionRow,
    MessageSelectMenu,
    MessageButton,
} = require("discord.js");

module.exports = {
    name: "song",
    aliases: ["s"],
    cooldown: 0,
    category: "Administration",
    async execute(msg, args, cmd, client) {
        const res = await Settings.find();
        if (res[0].maintenance) {
            const embed = new Discord.MessageEmbed()
                .setColor(colors.red)
                .addField(
                    `${emoji.no} Maintenance break`,
                    `> We are currently on a technical break, we'll be back soon.`
                )
                .setTimestamp()
                .setAuthor(`${msg.guild.me.user.username}`)
                .setFooter(
                    `💖 With love, tournament team`,
                    msg.guild.me.user.avatarURL()
                );
            return msg.channel.send({ embeds: [embed] });
        }
        try {
            if (args[0] != "find") msg.delete();
            let user, page, _msg, message;
            if (
                args[0] === "add" ||
                args[0] === "remove" ||
                args[0] === "set" ||
                args[0] === "page" ||
                args[0] === "p"
            ) {
                user = await checkUser(msg.author.id);

                if (!args[1] || args[1].length <= 0)
                    return msg.channel.send({
                        embeds: [
                            await basicEmbed(
                                msg,
                                "You have to provide a value which should be added!",
                                "no"
                            ),
                        ],
                        ephemeral: true,
                    });
                if (!user.messageId || user.messageId.length <= 0)
                    return msg.channel.send({
                        embeds: [
                            await basicEmbed(
                                msg,
                                `Couldn't find the menu message ID, please resend the menu!`,
                                "no"
                            ),
                        ],
                        ephemeral: true,
                    });
                if (!user.song_page || user.song_page <= 0)
                    return msg.channel.send({
                        embeds: [
                            await basicEmbed(
                                msg,
                                `Your page number is out of range, please resend the menu!`,
                                "no"
                            ),
                        ],
                        ephemeral: true,
                    });

                const msgToCheck = await msg.channel.messages.fetch(
                    user.messageId
                );
                if (!msgToCheck)
                    return msg.channel.send({
                        embeds: [
                            await basicEmbed(
                                msg,
                                `Menu doesn't exist, please create a new one!`,
                                "no"
                            ),
                        ],
                        ephemeral: true,
                    });

                page = user.song_page - 1;
            }
            if (args[0] === "info") {
                let name = args;
                name.splice(0, 1);
                name = name.join(" ");
                const song = await findSong(name);
                if (song.length > 0) {
                    const embed = await songsHandler("info", song[0], msg);
                    if (!embed || embed == null)
                        await msg.channel.send({
                            embeds: [
                                await basicEmbed(
                                    msg,
                                    "An unexpected error has occurred",
                                    "no"
                                ),
                            ],
                        });
                    await msg.channel.send({ embeds: [embed] });
                } else {
                    await msg.channel.send({
                        embeds: [
                            await basicEmbed(
                                msg,
                                `Couldn't find anything related to **${args[0]}**!`,
                                "no"
                            ),
                        ],
                    });
                }
            } else if (args[0] === "menu") {
                user = await checkUser(msg.author.id);
                if (user.messageId) {
                    let _msg;
                    try {
                        _msg = await msg.channel.messages.fetch(user.messageId);
                    } catch (e) {
                        user.messageId = "";
                        await Users.updateOne({ userId: msg.author.id }, user);
                    }
                    if (_msg) _msg.delete().catch(console.log);
                }
                const row = new MessageActionRow().addComponents(
                    new MessageSelectMenu()
                        .setCustomId("select_menu")
                        .setPlaceholder("Select an action")
                        .addOptions([
                            {
                                label: "✅ New song",
                                description:
                                    "Opens menu where you can add a new song",
                                value: "new_song",
                            },
                            {
                                label: "📝 Edit song",
                                description:
                                    "Opens menu where you can edit an existing song",
                                value: "edit_song",
                            },
                            {
                                label: "❌ Delete song",
                                value: "delete_song",
                            },
                        ])
                );
                const _e = await songManager("menu", msg);
                if (_e)
                    message = await msg.channel.send({
                        embeds: [_e],
                        components: [row],
                    });
                else
                    return msg.channel.send(
                        `${emoji.no} Couldn't execute this action!`
                    );
                await Users.updateOne(
                    { userId: msg.author.id },
                    { $set: { messageId: message.id, song_page: 1 } }
                );
            } else if (args[0] === "add") {
                if (!stepsDetails[page].add)
                    return msg.channel
                        .send({
                            embeds: [
                                await basicEmbed(
                                    msg,
                                    `You can't add a value on this page!`,
                                    "no"
                                ),
                            ],
                        })
                        .then((e) =>
                            setTimeout(
                                () => e.delete().catch(console.log),
                                4000
                            )
                        );

                let name = args;
                name.splice(0, 1);
                name = name.join(" ");

                let songs = [];
                if (name.includes(","))
                    name.split(",").map((el) =>
                        el.length > 0 ? songs.push(el) : null
                    );
                else songs.push(name);

                songs.map((el) => user.song_temp[steps[page]].push(el));
                await Users.updateOne({ userId: msg.author.id }, user);

                _msg = await msg.channel.messages.fetch(user.messageId);
                _msg.edit({ embeds: [await songManager("new", msg)] });
            } else if (args[0] === "remove") {
                let name = args;
                name.splice(0, 1);
                name = name.join(" ");

                let songs = [];
                if (name.includes(","))
                    name.split(",").map((el) =>
                        el.length > 0 ? songs.push(el) : null
                    );
                else songs.push(name);

                songs.map((el) => {
                    if (/^\d+$/.test(el))
                        delete user.song_temp[steps[page]][Number(el) - 1];
                    else
                        user.song_temp[steps[page]].splice(
                            user.song_temp[steps[page]].indexOf(el),
                            1
                        );
                });
                user.song_temp[steps[page]] = user.song_temp[
                    steps[page]
                ].filter((el) => el != null);
                await Users.updateOne({ userId: msg.author.id }, user);

                _msg = await msg.channel.messages.fetch(user.messageId);
                _msg.edit({ embeds: [await songManager("new", msg)] });
            } else if (args[0] === "set") {
                if (!stepsDetails[page].set)
                    return msg.channel
                        .send({
                            embeds: [
                                await basicEmbed(
                                    msg,
                                    `You can't set a value on this page!`,
                                    "no"
                                ),
                            ],
                        })
                        .then((e) =>
                            setTimeout(
                                () => e.delete().catch(console.log),
                                4000
                            )
                        );

                let name = args;
                name.splice(0, 1);
                name = name.join(" ");
                if (name.includes("/revision/latest/"))
                    name = name.split("/revision/")[0];
                else if (
                    name.includes("youtu.be/") ||
                    name.includes("youtube.com")
                ) {
                    let info,
                        time = 0,
                        end,
                        id;
                    if (name.includes("youtu.be/")) {
                        if (name.includes("?t=")) {
                            info = name.split("youtu.be/")[1].split("?t=");
                            time = info[1];
                            if (time.includes("&end=")) {
                                end = time.split("&end=")[1];
                                time = time.split("&end=")[0];
                            }
                        } else if (name.includes("?end=")) {
                            info = name.split("youtu.be/")[1].split("?end=");
                            time = 0;
                            end = info[1];
                        }
                        id = info[0];
                    } else id = name.split("?v=")[1];
                    name = `https://youtube.com/embed/${id}${
                        time ? `?start=${time}` : ""
                    }${
                        end
                            ? parseInt(time) > 0
                                ? `&end=${end}`
                                : `?end=${end}`
                            : ""
                    }`;
                }
                user.song_temp[steps[page]] = [name];
                await Users.updateOne({ userId: msg.author.id }, user);

                _msg = await msg.channel.messages.fetch(user.messageId);
                _msg.edit({ embeds: [await songManager("new", msg)] });
            } else if (args[0] === "page" || args[0] === "p") {
                let page = 1;
                if (
                    args[1] != "next" &&
                    args[1] != "n" &&
                    args[1] != "previous" &&
                    args[1] != "p"
                ) {
                    if (/^\d+$/.test(args[1])) {
                        page = Number(args[1]);
                        if (page > steps.length) return;
                    }
                } else {
                    if (args[1] === "next" || args[1] == "n")
                        page =
                            user.song_page < steps.length
                                ? user.song_page + 1
                                : user.song_page;
                    else if (args[1] === "previous" || args[1] === "p")
                        page =
                            user.song_page > 1
                                ? user.song_page - 1
                                : user.song_page;
                }
                await Users.updateOne(
                    { userId: msg.author.id },
                    { $set: { song_page: page } }
                );
                _msg = await msg.channel.messages.fetch(user.messageId);
                let row;
                if (page === steps.length)
                    row = new MessageActionRow().addComponents(
                        new MessageButton()
                            .setCustomId("submit")
                            .setLabel("Submit")
                            .setStyle("SUCCESS")
                            .setEmoji(`${emoji.yes}`)
                    );
                if (steps[page - 1] === "tags") {
                    row = new MessageActionRow().addComponents(
                        new MessageSelectMenu()
                            .setCustomId("select_tags")
                            .setPlaceholder("Select tags to add or remove")
                            .addOptions([
                                tags.map((el) => {
                                    return {
                                        label: `${el.emoji} ${el.name}`,
                                        value: `${el.id}`,
                                    };
                                }),
                                {
                                    label: `❗ CLEAR ALL TAGS`,
                                    value: "clear",
                                },
                            ])
                    );
                }
                if (_msg && row)
                    _msg.edit({
                        embeds: [await songManager("new", msg)],
                        components: [row],
                    });
                else if (_msg)
                    _msg.edit({
                        embeds: [await songManager("new", msg)],
                        components: [],
                    });
            } else if (args[0] === "find" || args[0] === "f") {
                if (!args[1])
                    return msg.channel
                        .send({
                            embeds: [
                                await basicEmbed(
                                    msg,
                                    `You need to provide song's name or ID!`,
                                    "no"
                                ),
                            ],
                        })
                        .then((e) =>
                            setTimeout(
                                () => e.delete().catch(console.log),
                                4000
                            )
                        );

                await msg.react(emoji.loading);
                let name = args;
                name.splice(0, 1);
                name = name.join(" ");

                const song = await findSong(name);
                if (song.length > 0) {
                    msg.delete();

                    const embed = await songsHandler("find", song[0], msg);
                    const attachment = new Discord.MessageAttachment(
                        Buffer.from(song[0].cover.split(",")[1], "base64"),
                        "cover.png"
                    );

                    embed.setThumbnail("attachment://cover.png");

                    if (embed)
                        msg.channel.send({
                            content:
                                song.length > 1
                                    ? `Found ${
                                          song.length - 1
                                      } more results matching given query...`
                                    : null,
                            embeds: [embed],
                            files: [attachment],
                        });
                    else
                        msg.channel.send(
                            `${emoji.no} Couldn't send information about song!`
                        );
                } else {
                    await msg.reactions.removeAll();
                    return msg.react(emoji.no);
                }
            } else if (args[0] === "fillout" || args[0] === "fo") {
                const user = await checkUser(msg.author.id);
                if (user.fillout === true) user.fillout = false;
                else user.fillout = true;
                user.isFilled = false;
                await Users.updateOne({ userId: msg.author.id }, user);
                return msg.channel
                    .send({
                        embeds: [
                            await basicEmbed(
                                msg,
                                `Fill out information has been changed to: **${user.fillout
                                    .toString()
                                    .toUpperCase()}**`,
                                "yes",
                                "green"
                            ),
                        ],
                    })
                    .then((e) =>
                        setTimeout(() => e.delete().catch(console.log), 4000)
                    );
            } else if (args[0] === "import") {
                for await (const song of toImport) {
                    let tagsSemiFinal = [],
                        tagsFinal = [];
                    let _tags = song.tags.split("&&");
                    tags.map((tag) => {
                        _tags.map((_tag) => {
                            if (_tag.includes(tag.name.toLowerCase()))
                                tagsSemiFinal.push(tag.id);
                        });
                    });
                    tagsSemiFinal.map((tag) => {
                        if (/^\d+$/.test(tag)) tagsFinal.push(tag);
                    });
                    await Songs.insertMany({
                        name: song.name ? song.name : "Undefined",
                        artist: song.artist
                            ? song.artist.split("&&")
                            : "Undefined",
                        game: song.game ? song.game : "Undefined",
                        dancemode: song.dancemode
                            ? song.dancemode
                            : "Undefined",
                        xboxbrokenlevel: song.xboxbrokenlevel
                            ? song.xboxbrokenlevel
                            : "Undefined",
                        difficulty: song.difficulty
                            ? song.difficulty
                            : "Undefined",
                        effort: song.effort ? song.effort : "Undefined",
                        times: song.times ? song.times : "Undefined",
                        genre: song.genre
                            ? song.genre.toLowerCase().split("&&")
                            : "Undefined",
                        duration: song.duration ? song.duration : "Undefined",
                        tags: song.tags ? tagsFinal : "Undefined",
                        cover: song.cover ? song.cover : "Undefined",
                    });
                }
            } else if (args[0] === "link" || args[0] === "l") {
                const user = await checkUser(msg.author.id);
                if (!user.song_temp["name"][0]) return;
                const name = user.song_temp["name"][0].replace(/\s/g, "_");
                msg.channel
                    .send({
                        embeds: [
                            await basicEmbed(
                                msg,
                                `[CLICK HERE](https://justdance.fandom.com/wiki/${name})`,
                                "no",
                                "green"
                            ),
                        ],
                    })
                    .then((e) =>
                        setTimeout(() => e.delete().catch(console.log), 5000)
                    );
            } else if (
                args[0] === "clearform" ||
                args[0] === "cf" ||
                args[0] === "clear"
            ) {
                const user = await checkUser(msg.author.id);
                if (!user.isFilled) return;
                if (user.messageId) {
                    const _msg = await msg.channel.messages.fetch(
                        user.messageId
                    );
                    if (_msg) _msg.delete().catch(console.log);
                }
                let fillout = await JSON.parse(
                    fs.readFileSync("config/fillout.json")
                );
                fillout = [
                    `${user.song_temp["name"]}${
                        user.song_temp["version"] != "classic"
                            ? ` > ${user.song_temp["version"]}`
                            : ""
                    }(${user.song_temp["game"]})`,
                    ...fillout,
                ];
                fs.writeFileSync(
                    "config/fillout.json",
                    JSON.stringify(fillout)
                );
                user.song_temp["artist"] = [];
                user.song_temp["dancemode"] = [];
                user.song_temp["xboxbrokenlevel"] = [];
                user.song_temp["difficulty"] = [];
                user.song_temp["effort"] = [];
                user.song_temp["times"] = [];
                user.song_temp["genre"] = [];
                user.song_temp["duration"] = [];
                user.song_temp["tags"] = [];
                user.song_temp["cover"] = [];
                user.song_temp["preview"] = [];
                user.song_temp["name"] = [];
                user.song_temp["game"] = [];
                user.song_temp["version"] = [];
                user.isFilled = false;
                await Users.updateOne({ userId: msg.author.id }, user);
            }
        } catch (e) {
            console.log(`ERROR:`, e);
        }
    },
};
