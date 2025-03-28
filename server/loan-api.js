// loan-api.js - API handling loan operations

// Loan configuration - can be modified as needed
const loanConfig = {
    minLoanAmount: 100000, // Minimum loan amount in NGN
    defaultInterestRate: 15, // Annual interest rate percentage
    availableDurations: [3, 6, 12, 24, 36], // Available loan durations in months
    loanPurposes: [
      "Business", 
      "Education", 
      "Personal", 
      "Home Improvement", 
      "Medical", 
      "Debt Consolidation"
    ]
  };
  
  /**
   * Loan API Service
   * Handles loan calculations, validation, and data management
   */
  class LoanAPIService {
    constructor(config = loanConfig) {
      this.config = config;
      this.loans = this.loadLoans();
      this.transactions = this.loadTransactions();
    }
  
    // CORE LOAN FUNCTIONS
  
    /**
     * Calculate monthly loan payment
     * @param {number} amount - Loan amount
     * @param {number} interestRate - Annual interest rate percentage
     * @param {number} months - Loan duration in months
     * @returns {number} Monthly payment amount
     */
    calculateMonthlyPayment(amount, interestRate, months) {
      amount = parseFloat(amount);
      interestRate = parseFloat(interestRate) / 100 / 12; // Monthly interest rate
      months = parseInt(months);
  
      // Calculate monthly payment using loan formula
      return (
        (amount * interestRate * Math.pow(1 + interestRate, months)) /
        (Math.pow(1 + interestRate, months) - 1)
      );
    }
  
    /**
     * Calculate total loan repayment amount
     * @param {number} amount - Loan amount
     * @param {number} interestRate - Annual interest rate percentage
     * @param {number} months - Loan duration in months
     * @returns {number} Total repayment amount
     */
    calculateTotalRepayment(amount, interestRate, months) {
      const monthlyPayment = this.calculateMonthlyPayment(amount, interestRate, months);
      return monthlyPayment * months;
    }
  
    /**
     * Create a new loan
     * @param {Object} loanData - Loan information
     * @returns {Object} Created loan with ID and status
     */
    createLoan(loanData) {
      // Validate required fields
      if (!loanData.amount || !loanData.duration || !loanData.purpose) {
        throw new Error('Missing required loan information');
      }
  
      // Validate loan amount
      if (parseFloat(loanData.amount) < this.config.minLoanAmount) {
        throw new Error(`Loan amount must be at least NGN ${this.formatNumber(this.config.minLoanAmount)}`);
      }
  
      // Use default interest rate if not provided
      const interestRate = loanData.interestRate || this.config.defaultInterestRate;
      
      // Calculate repayment details
      const monthlyPayment = this.calculateMonthlyPayment(
        loanData.amount,
        interestRate,
        loanData.duration
      );
      
      const totalRepayment = this.calculateTotalRepayment(
        loanData.amount,
        interestRate,
        loanData.duration
      );
  
      // Create new loan object
      const loanId = `LOAN${Date.now()}`;
      const creationDate = new Date();
      const dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() + parseInt(loanData.duration));
  
      const newLoan = {
        id: loanId,
        userId: loanData.userId || 'current-user', // Replace with actual user ID if available
        amount: parseFloat(loanData.amount),
        interestRate: parseFloat(interestRate),
        duration: parseInt(loanData.duration),
        purpose: loanData.purpose,
        monthlyPayment: monthlyPayment,
        totalRepayment: totalRepayment,
        remainingBalance: parseFloat(loanData.amount),
        creationDate: this.formatDateTime(creationDate),
        dueDate: this.formatDateTime(dueDate),
        status: 'Approved',
        payments: []
      };
  
      // Add to loans collection
      this.loans.push(newLoan);
      this.saveLoans();
  
      // Create transaction record
      const transactionId = this.createTransaction({
        type: 'Take Loan',
        amount: loanData.amount,
        details: `Take Loan (${loanData.purpose})`,
        referenceId: loanId
      });
  
      return {
        loan: newLoan,
        transactionId: transactionId
      };
    }
  
    /**
     * Make a loan payment
     * @param {Object} paymentData - Payment information
     * @returns {Object} Payment receipt
     */
    makePayment(paymentData) {
      // Validate required fields
      if (!paymentData.loanId || !paymentData.amount) {
        throw new Error('Missing required payment information');
      }
  
      // Find the loan
      const loan = this.loans.find(l => l.id === paymentData.loanId);
      if (!loan) {
        throw new Error('Loan not found');
      }
  
      // Validate loan is active
      if (loan.status !== 'Approved' && loan.status !== 'Active') {
        throw new Error(`Cannot make payment on loan with status: ${loan.status}`);
      }
  
      const paymentAmount = parseFloat(paymentData.amount);
      const paymentMethod = paymentData.method || 'Account Balance';
  
      // Validate payment amount
      if (paymentAmount <= 0) {
        throw new Error('Payment amount must be greater than zero');
      }
  
      if (paymentAmount > loan.remainingBalance) {
        throw new Error('Payment amount exceeds remaining balance');
      }
  
      // Create payment record
      const paymentId = `PAY${Date.now()}`;
      const paymentDate = new Date();
      
      const payment = {
        id: paymentId,
        date: this.formatDateTime(paymentDate),
        amount: paymentAmount,
        method: paymentMethod
      };
  
      // Update loan
      loan.payments.push(payment);
      loan.remainingBalance -= paymentAmount;
      
      // Update loan status if fully paid
      if (loan.remainingBalance <= 0) {
        loan.status = 'Paid';
        loan.remainingBalance = 0;
      } else if (loan.status === 'Approved') {
        loan.status = 'Active';
      }
  
      this.saveLoans();
  
      // Create transaction record
      const transactionId = this.createTransaction({
        type: 'Pay Loan',
        amount: -paymentAmount, // Negative for outgoing payment
        details: `Pay Loan (${paymentMethod})`,
        referenceId: paymentId
      });
  
      return {
        payment: payment,
        loan: loan,
        transactionId: transactionId
      };
    }
  
    /**
     * Get loan details
     * @param {string} loanId - Loan ID
     * @returns {Object} Loan details or null if not found
     */
    getLoan(loanId) {
      return this.loans.find(loan => loan.id === loanId) || null;
    }
  
    /**
     * Get all loans (or filtered by status)
     * @param {string} status - Optional status filter
     * @returns {Array} Array of loans
     */
    getLoans(status = null) {
      if (status) {
        return this.loans.filter(loan => loan.status === status);
      }
      return this.loans;
    }
  
    /**
     * Get active loans with amounts due
     * @returns {Array} Array of active loans
     */
    getActiveLoans() {
      return this.loans.filter(loan => 
        (loan.status === 'Approved' || loan.status === 'Active') && 
        loan.remainingBalance > 0
      );
    }
  
    // TRANSACTION MANAGEMENT
  
    /**
     * Create a transaction record
     * @param {Object} transactionData - Transaction information
     * @returns {string} Transaction ID
     */
    createTransaction(transactionData) {
      if (!transactionData.type || !transactionData.amount) {
        throw new Error('Missing required transaction information');
      }
  
      const amount = parseFloat(transactionData.amount);
      const transactionId = `tx${Date.now()}`;
      const now = new Date();
  
      // Format amount with sign for display
      const formattedAmount = amount >= 0 
        ? `NGN${this.formatNumber(Math.abs(amount))}` 
        : `-NGN${this.formatNumber(Math.abs(amount))}`;
  
      const transaction = {
        id: transactionId,
        type: transactionData.type,
        details: transactionData.details || transactionData.type,
        date: this.getCurrentDate(),
        time: this.getCurrentTime(),
        amount: formattedAmount,
        status: "Completed",
        referenceId: transactionData.referenceId || transactionId,
        timestamp: now.getTime()
      };
  
      // Add additional fields based on transaction type
      if (transactionData.type === 'Take Loan') {
        transaction.interestRate = `${this.config.defaultInterestRate}% per annum`;
        transaction.purpose = transactionData.details.match(/\(([^)]+)\)/)?.[1] || 'General';
      } else if (transactionData.type === 'Pay Loan') {
        transaction.paymentMethod = transactionData.details.match(/\(([^)]+)\)/)?.[1] || 'Account Balance';
        transaction.fee = "NGN0.00";
      }
  
      this.transactions.push(transaction);
      this.saveTransactions();
  
      return transactionId;
    }
  
    /**
     * Get a transaction by ID
     * @param {string} transactionId - Transaction ID
     * @returns {Object} Transaction details or null if not found
     */
    getTransaction(transactionId) {
      return this.transactions.find(t => t.id === transactionId) || null;
    }
  
    /**
     * Get all transactions (optionally filtered)
     * @param {Object} filters - Optional filters like type, date range
     * @returns {Array} Array of matching transactions
     */
    getTransactions(filters = {}) {
      let result = [...this.transactions];
      
      // Apply filters if provided
      if (filters.type) {
        result = result.filter(t => t.type === filters.type);
      }
      if (filters.startDate) {
        const startTimestamp = new Date(filters.startDate).getTime();
        result = result.filter(t => t.timestamp >= startTimestamp);
      }
      if (filters.endDate) {
        const endTimestamp = new Date(filters.endDate).getTime();
        result = result.filter(t => t.timestamp <= endTimestamp);
      }
      
      // Sort by timestamp descending (most recent first)
      return result.sort((a, b) => b.timestamp - a.timestamp);
    }
  
    // HELPER METHODS
  
    /**
     * Format number with commas
     * @param {number} num - Number to format
     * @returns {string} Formatted number string
     */
    formatNumber(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  
    /**
     * Get current date in the format: "12th March, 2025"
     * @returns {string} Formatted date
     */
    getCurrentDate() {
      const date = new Date();
      const day = date.getDate();
      const month = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();
      
      // Add suffix to day
      let suffix = 'th';
      if (day === 1 || day === 21 || day === 31) suffix = 'st';
      else if (day === 2 || day === 22) suffix = 'nd';
      else if (day === 3 || day === 23) suffix = 'rd';
      
      return `${day}${suffix} ${month}, ${year}`;
    }
  
    /**
     * Get current time in the format: "14:32"
     * @returns {string} Formatted time
     */
    getCurrentTime() {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    }
  
    /**
     * Format date and time
     * @param {Date} date - Date object
     * @returns {string} Formatted date and time
     */
    formatDateTime(date) {
      const day = date.getDate();
      const month = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();
      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, "0");
      
      // Add suffix to day
      let suffix = 'th';
      if (day === 1 || day === 21 || day === 31) suffix = 'st';
      else if (day === 2 || day === 22) suffix = 'nd';
      else if (day === 3 || day === 23) suffix = 'rd';
      
      return `${day}${suffix} ${month}, ${year} at ${hours}:${minutes}`;
    }
  
    // LOCAL STORAGE MANAGEMENT
    
    /**
     * Load loans from storage
     * @returns {Array} Array of loan objects
     */
    loadLoans() {
      if (typeof localStorage !== 'undefined') {
        const storedLoans = localStorage.getItem('loans');
        return storedLoans ? JSON.parse(storedLoans) : [];
      }
      return [];
    }
  
    /**
     * Save loans to storage
     */
    saveLoans() {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('loans', JSON.stringify(this.loans));
      }
    }
  
    /**
     * Load transactions from storage
     * @returns {Array} Array of transaction objects
     */
    loadTransactions() {
      if (typeof localStorage !== 'undefined') {
        const storedTransactions = localStorage.getItem('transactions');
        return storedTransactions ? JSON.parse(storedTransactions) : [];
      }
      return [];
    }
  
    /**
     * Save transactions to storage
     */
    saveTransactions() {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('transactions', JSON.stringify(this.transactions));
      }
    }
  
    /**
     * Get loan eligibility assessment
     * @param {Object} userProfile - User profile information
     * @returns {Object} Eligibility assessment
     */
    getLoanEligibility(userProfile = {}) {
      // This is a placeholder implementation
      // Actual implementation would consider income, credit score, etc.
      
      // Default values
      const defaultProfile = {
        income: 500000,
        creditScore: 700,
        employmentStatus: 'Employed',
        existingDebts: 0,
        accountAge: 365 // days
      };
      
      const profile = { ...defaultProfile, ...userProfile };
      
      // Simple eligibility calculation
      const maxLoanAmount = profile.income * 3;
      const isEligible = profile.income > this.config.minLoanAmount * 0.1;
      const interestRate = this.calculateInterestRate(profile);
      
      return {
        isEligible: isEligible,
        maxLoanAmount: maxLoanAmount,
        recommendedInterestRate: interestRate,
        recommendedDuration: 12,
        reason: isEligible ? 'Based on your profile' : 'Income too low'
      };
    }
    
    /**
     * Calculate interest rate based on user profile
     * @param {Object} profile - User profile
     * @returns {number} Recommended interest rate
     */
    calculateInterestRate(profile) {
      // Base rate
      let rate = this.config.defaultInterestRate;
      
      // Adjust based on credit score
      if (profile.creditScore >= 800) {
        rate -= 3;
      } else if (profile.creditScore >= 700) {
        rate -= 1.5;
      } else if (profile.creditScore < 600) {
        rate += 2;
      }
      
      // Adjust based on employment
      if (profile.employmentStatus !== 'Employed') {
        rate += 1;
      }
      
      // Adjust based on account age
      if (profile.accountAge < 180) {
        rate += 1;
      }
      
      return Math.max(5, Math.min(25, rate)); // Cap between 5% and 25%
    }
  }
  
  // Export the API
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LoanAPIService, loanConfig };
  } else {
    // For browser usage
    window.LoanAPI = { LoanAPIService, loanConfig };
  }