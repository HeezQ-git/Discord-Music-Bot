const Songs = require('../models/songs');

const checkEditMessage = async (msg, id) => {
    if (!id || id.length <= 0) return null;
    let message;
    try {
        message = await msg.channel.messages.fetch(id);
    } catch { return null }
    if (message) return message;
    return null;
}

const randomHandler = async () => {
    const songs = await Songs.find();
    return songs.length > 1 ? songs[Math.floor(Math.random()*songs.length)] : null;
}

module.exports = {
    randomHandler,
    checkEditMessage,
}