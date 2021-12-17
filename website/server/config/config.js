const mongoose = require('mongoose');

mongoose.set('autoIndex', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);

const dbCredencials = {
    user: 'admin',
    pass: 'TechniSchools!'
}
const hostDB = `mongodb+srv://${dbCredencials.user}:${dbCredencials.pass}@cluster0.zfvtf.mongodb.net/techni?retryWrites=true&w=majority`;

module.exports = {
  hostDB,
};
