
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  isbn: String,
  status: { type: String, enum: ['Available', 'Checked Out'], default: 'Available' }
});

module.exports = mongoose.model('Book', bookSchema);