const express = require('express');
const Loan = require('../models/Loan');
const router = express.Router();

// Simple unprotected route for demo
router.get('/my', async (req, res) => {
  const loans = await Loan.find({ returned: false }).populate('bookId');
  res.json(loans);
});

module.exports = router;
