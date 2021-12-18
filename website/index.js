const express = require('express');
const app = express();
const mongoose = require('mongoose');
const config = require('./server/config');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const songsApi = require('./server/backoffice_api/songs');

app.use('/', express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '2mb' }));
app.use(cookieParser());
app.use(songsApi);

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server up and running on port ${process.env.PORT || 8080}`);
});

mongoose.connect(config.hostDB);

mongoose.connection.on('connected', () => {
  console.log('Connected with database');
});
