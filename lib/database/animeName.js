const mongoose = require('mongoose');

const animeNameSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const AnimeName = mongoose.model('AnimeName', animeNameSchema);

module.exports = AnimeName;
