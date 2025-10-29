
const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  dueDate: Date,
  returned: { type: Boolean, default: false }
});

module.exports = mongoose.model('Loan', loanSchema);