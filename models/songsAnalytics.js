const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const songsAnalyticsSchema = new Schema({
    artist: [{ type: String }],
    version: [{ type: String }],
    game: [{ type: String }],
    dancemode: [{ type: String }],
    xboxbrokenlevel: [{ type: String }],
    difficulty: [{ type: String }],
    effort: [{ type: String }],
    times: [{ type: String }],
    genre: [{ type: String }],
    tags: [{ type: String }],
});

const songsAnalytics = mongoose.model('songsAnalytics', songsAnalyticsSchema);
module.exports = songsAnalytics;