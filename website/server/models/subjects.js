const mongoose = require('mongoose');

const subjectsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
}, { collection: 'subjects'});

const Subjects = mongoose.model('subjects', subjectsSchema);

module.exports = Subjects;
