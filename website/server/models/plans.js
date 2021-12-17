const mongoose = require('mongoose');

const plansSchema = new mongoose.Schema({
  classId: {
    type: String,
    required: true,
  },
  plan: {
    type: Object,
    required: true,
  },
}, { collection: 'plans'});

const Plans = mongoose.model('plans', plansSchema);

module.exports = Plans;
