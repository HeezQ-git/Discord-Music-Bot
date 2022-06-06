const mongoose = require("mongoose");

mongoose.set("autoIndex", true);
mongoose.set("useCreateIndex", true);
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
mongoose.set("useFindAndModify", false);

require("dotenv").config();

const hostDB = `mongodb+srv://HeezQ:${process.env.DATABASE_PASSWORD}@cluster0.kccye.mongodb.net/TournamentBot?retryWrites=true&w=majority`;

module.exports = {
    hostDB,
};
