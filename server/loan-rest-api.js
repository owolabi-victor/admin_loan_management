// loan-rest-api.js - Express.js REST API for loan service

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { LoanAPIService, loanConfig } = require('./loan-api');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize Loan API
const loanAPI = new LoanAPIService();

// === API ROUTES ===

// Get loan configuration
app.get('/api/loan-config', (req, res) => {
  res.json({
    minLoanAmount: loanConfig.minLoanAmount,
    defaultInterestRate: loanConfig.defaultInterestRate,
    availableDurations: loanConfig.availableDurations,
    loanPurposes: loanConfig.loanPurposes
  });
});

// Create a new loan
app.post('/api/loans', (req, res) => {
  try {
    const { amount, duration, purpose, userId } = req.body;
    
    if (!amount || !duration || !purpose) {
      return res.status(400).json({ error: 'Missing required loan information' });
    }
    
    const result = loanAPI.createLoan({
      amount,
      duration,
      purpose,
      userId: userId || req.headers['user-id'] || 'anonymous'
    });
    
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all loans
app.get('/api/loans', (req, res) => {
  const { status, userId } = req.query;
  let loans = loanAPI.getLoans(status);
  
  // Filter by user if provided
  if (userId) {
    loans = loans.filter(loan => loan.userId === userId);
  }
  
  res.json(loans);
});

// Get a specific loan
app.get('/api/loans/:id', (req, res) => {
  const loan = loanAPI.getLoan(req.params.id);
  
  if (!loan) {
    return res.status(404).json({ error: 'Loan not found' });
  }
  
  res.json(loan);
});

// Make a loan payment
app.post('/api/loans/:id/payments', (req, res) => {
  try {
    const { amount, method } = req.body;
    
    if (!amount) {
      return res.status(400).json({ error: 'Missing payment amount' });
    }
    
    const result = loanAPI.makePayment({
      loanId: req.params.id,
      amount,
      method: method || 'API Payment'
    });
    
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get transactions
app.get('/api/transactions', (req, res) => {
  const { type, startDate, endDate } = req.query;
  const filters = {};
  
  if (type) filters.type = type;
  if (startDate) filters.startDate = startDate;
  if (endDate) filters.endDate = endDate;
  
  const transactions = loanAPI.getTransactions(filters);
  res.json(transactions);
});

// Get a specific transaction
app.get('/api/transactions/:id', (req, res) => {
  const transaction = loanAPI.getTransaction(req.params.id);
  
  if (!transaction) {
    return res.status(404).json({ error: 'Transaction not found' });
  }
  
  res.json(transaction);
});

// Check loan eligibility
app.post('/api/loan-eligibility', (req, res) => {
  try {
    const userProfile = req.body;
    const eligibility = loanAPI.getLoanEligibility(userProfile);
    res.json(eligibility);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Calculate loan details
app.post('/api/calculate-loan', (req, res) => {
  try {
    const { amount, interestRate, duration } = req.body;
    
    if (!amount || !duration) {
      return res.status(400).json({ error: 'Missing required calculation parameters' });
    }
    
    const rate = interestRate || loanConfig.defaultInterestRate;
    
    const monthlyPayment = loanAPI.calculateMonthlyPayment(amount, rate, duration);
    const totalRepayment = monthlyPayment * duration;
    const totalInterest = totalRepayment - amount;
    
    res.json({
      loanAmount: parseFloat(amount),
      interestRate: parseFloat(rate),
      durationMonths: parseInt(duration),
      monthlyPayment,
      totalRepayment,
      totalInterest
    });
} catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update loan status (for admin)
app.patch('/api/loans/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'Missing status parameter' });
    }
    
    const result = loanAPI.updateLoanStatus(req.params.id, status);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get loan payment schedule
app.get('/api/loans/:id/schedule', (req, res) => {
  try {
    const loanId = req.params.id;
    const schedule = loanAPI.getLoanSchedule(loanId);
    
    if (!schedule) {
      return res.status(404).json({ error: 'Loan schedule not found' });
    }
    
    res.json(schedule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Generate loan statement
app.get('/api/loans/:id/statement', (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const loanId = req.params.id;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start and end dates are required' });
    }
    
    const statement = loanAPI.generateLoanStatement(loanId, startDate, endDate);
    res.json(statement);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Loan API server running on port ${PORT}`);
});

module.exports = app;