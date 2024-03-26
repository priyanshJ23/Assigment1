const mongoose = require('mongoose')

const restaurantSchema = new mongoose.Schema({
    name: String,
    address: String,
    location: {
      type: { type: String },
      coordinates: [Number]
    }
  });

restaurantSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Restaurant', restaurantSchema);

