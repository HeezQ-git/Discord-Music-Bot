const mongoose = require('mongoose');

const classesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
}, { collection: 'classes'});

const Classes = mongoose.model('classes', classesSchema);

module.exports = Classes;
