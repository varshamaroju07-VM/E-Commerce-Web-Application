const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 10
    },
    image: {
      type: String,
      required: true,
      default: 'https://images.unsplash.com/...'
    },
    featured: {
      type: Boolean,
      default: false
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Product', productSchema);
