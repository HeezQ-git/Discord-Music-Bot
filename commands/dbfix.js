const Songs = require("../models/songs");
const Fillout = require("../models/fillout");
const fs = require("fs");

module.exports = {
    name: "dbfix",
    async execute(msg, args, cmd, client) {
        msg.channel.send("Working, please wait...");
        msg.delete();
        let fillout = await JSON.parse(fs.readFileSync("config/fillout.json"));
        for await (let _ of fillout) {
            let game = _.match(/\(([^)]+)\)$/g)[0].replace(/\(|\)/g, "");
            _ = _.replace(_.match(/\(([^)]+)\)$/g)[0], "");

            let version = "1";
            if (_.includes(" > ")) {
                version = _.split(" > ");
                _ = version[0];
                version = version[1].toLowerCase();
                if (version.includes("sweat")) version = "5";
                else if (version.includes("sing")) version = "6";
                else if (version.includes("extreme")) version = "3";
                else if (version.includes("kids")) version = "4";
                else if (version.includes("alt")) version = "2";
            }

            await Fillout.create({ name: _, game, version: parseInt(version) });
            console.log(_, game, parseInt(version));
        }
        // const songs = await Songs.find();
        // const tags = [];
        // songs.forEach((_) => tags.push(..._.tags));
        // console.log([...new Set(tags.map((_) => parseInt(_)))]);

        // for await (const song of songs) {
        //     song.tags = song.tags.filter((_) => _ != "3" && _ != "8");
        //     await Songs.updateOne({ _id: song._id }, song);
        //     console.log(song.name, song.tags);
        // }

        msg.channel.send("Done!");
    },
};

const filterDifficulty = (diff) => {
    diff = diff.toLowerCase();
    if (diff == "solo") return 1;
    else if (diff == "duo") return 2;
    else if (diff == "trio") return 3;
    else if (diff == "quartet") return 4;
    else return parseInt(diff);
};

const filterGenre = (genre) => {
    genre = genre.toLowerCase().trim();
    if (genre == "hiphop" || genre == "hip hop") return genresList[2].id;
    if (genre == "kpop" || genre == "k-pop") return genresList[1].id;

    let reGenre = null;
    for (const _ of genresList) {
        if (_.label.toLowerCase() == genre) return (reGenre = _.id);
        else if (_.label.toLowerCase().includes(genre)) return (reGenre = _.id);
    }

    return reGenre;
};

const tags = [
    { emoji: "💃", label: "Sassy", id: 1 },
    { emoji: "👒", label: "Latin", id: 2 },
    { emoji: "🌺", label: "BOP", id: 4 },
    { emoji: "🎉", label: "Party", id: 5 },
    { emoji: "🤡", label: "Troll", id: 7 },
    { emoji: "🎤", label: "Cover", id: 9 },
    { emoji: "💦", label: "Sweat", id: 10 },
    { emoji: "🐼", label: "Panda", id: 11 },
    { emoji: "📺", label: "Cartoon", id: 12 },
    { emoji: "🌹", label: "Romantic", id: 13 },
    { emoji: "🐢", label: "Animal", id: 14 },
    { emoji: "⚔", label: "Battle", id: 15 },
    { emoji: "🤖", label: "Robot", id: 16 },
    { emoji: "🦇", label: "Halloween", id: 17 },
    { emoji: "🎄", label: "Christmas", id: 18 },
    { emoji: "😱", label: "Drama", id: 19 },
    { emoji: "👪", label: "Family", id: 20 },
    { emoji: "🥴", label: "Wacky", id: 21 },
    { emoji: "🌞", label: "Summer", id: 22 },
    { emoji: "⚽", label: "Brasilian", id: 23 },
    { emoji: "🤠", label: "Western", id: 24 },
];

const genresList = [
    { label: "POP", id: 1 },
    { label: "K-POP", id: 2 },
    { label: "HIP-HOP", id: 3 },
    { label: "EDM", id: 4 },
    { label: "FUNK", id: 5 },
    { label: "PUNK", id: 6 },
    { label: "DISCO", id: 7 },
    { label: "HOUSE", id: 8 },
    { label: "RAP", id: 9 },
    { label: "ROCK", id: 10 },
    { label: "REGGAE", id: 11 },
    { label: "CLASSICAL", id: 12 },
    { label: "COUNTRY", id: 13 },
    { label: "ELECTRONIC", id: 14 },
    { label: "J-POP", id: 15 },
    { label: "JAZZ", id: 16 },
    { label: "METAL", id: 17 },
    { label: "DUTCH", id: 18 },
    { label: "GERMAN", id: 19 },
    { label: "TURKISH", id: 20 },
    { label: "CHINESE", id: 21 },
    { label: "FRENCH", id: 22 },
    { label: "ITALIAN", id: 23 },
    { label: "SPANISH", id: 24 },
    { label: "SWING", id: 25 },
    { label: "PORTUGUESE", id: 26 },
    { label: "GOSPEL", id: 27 },
];
