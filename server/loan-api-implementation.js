// loan-api-implementation.js - Integration with your existing code

document.addEventListener("DOMContentLoaded", function() {
    // Initialize the Loan API
    const loanAPI = new LoanAPI.LoanAPIService();
    
    // Make the API available globally for debugging
    window.loanAPI = loanAPI;
    
    // === FORM HANDLING ===
    
    // Take Loan Form
    const loanForm = document.getElementById('loanForm');
    if (loanForm) {
      loanForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const amountInput = document.getElementById('loanFormAmount');
        const durationInput = document.getElementById('loanFormDuration');
        const purposeSelect = document.getElementById('loanFormPurpose');
        
        if (!amountInput || !durationInput || !purposeSelect) {
          console.error("Couldn't find all form inputs");
          return;
        }
        
        const amount = amountInput.value.replace(/,/g, "");
        const duration = durationInput.value;
        const purpose = purposeSelect.options[purposeSelect.selectedIndex].text;
        
        try {
          // Use the API to create a loan
          const result = loanAPI.createLoan({
            amount: amount,
            duration: duration,
            purpose: purpose
          });
          
          console.log("Loan created:", result);
          
          // Update UI with new transaction
          refreshTransactions();
          
          // Close the modal
          const modal = document.getElementById('takeLoanModal');
          if (modal) {
            modal.style.display = 'none';
          }
          
          // Optionally show success message
          alert(`Loan approved! Your monthly payment will be NGN${loanAPI.formatNumber(result.loan.monthlyPayment.toFixed(2))}`);
          
          // Reset the form
          this.reset();
        } catch (error) {
          alert(error.message);
        }
      });
    }
    
    // Pay Loan Form
    const payLoanForm = document.getElementById('payLoanForm');
    if (payLoanForm) {
      payLoanForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const amountInput = this.querySelector('input[type="number"]');
        const methodSelect = this.querySelector('select');
        
        if (!amountInput || !methodSelect) {
          console.error("Couldn't find all form inputs for pay loan");
          return;
        }
        
        const amount = amountInput.value.replace(/,/g, "");
        const method = methodSelect.options[methodSelect.selectedIndex].text;
        
        try {
          // Get active loans
          const activeLoans = loanAPI.getActiveLoans();
          if (activeLoans.length === 0) {
            throw new Error("You don't have any active loans to pay");
          }
          
          // Use the first active loan (in a real app, you'd let the user select which loan to pay)
          const loanId = activeLoans[0].id;
          
          // Use the API to make a payment
          const result = loanAPI.makePayment({
            loanId: loanId,
            amount: amount,
            method: method
          });
          
          console.log("Payment made:", result);
          
          // Update UI with new transaction
          refreshTransactions();
          
          // Close the modal
          const modal = document.getElementById('payLoanModal');
          if (modal) {
            modal.style.display = 'none';
          }
          
          // Reset the form
          this.reset();
        } catch (error) {
          alert(error.message);
        }
      });
    }
    
    // === UI UPDATES ===
    
    // Function to refresh the transactions list in the UI
    function refreshTransactions() {
      // Get recent transactions
      const transactions = loanAPI.getTransactions();
      
      // Get both transactions containers
      const mobileTransactionsSection = document.querySelector('#mobileView .transactions-section');
      const webTransactionsSection = document.querySelector('#webView .transactions-section');
      
      if (!mobileTransactionsSection && !webTransactionsSection) {
        console.error("Transaction sections not found");
        return;
      }
      
      // Update mobile view if it exists
      if (mobileTransactionsSection) {
        updateTransactionView(mobileTransactionsSection, transactions);
      }
      
      // Update web view if it exists
      if (webTransactionsSection) {
        updateTransactionView(webTransactionsSection, transactions);
      }
    }
    
    // Function to update a transaction container with transactions
    function updateTransactionView(container, transactions) {
      // Generate HTML for transactions
      let transactionsHTML = '';
      
      transactions.forEach(tx => {
        // Select appropriate icon based on transaction type
        let icon = '💰'; // Default
        if (tx.type.includes('Pay Loan')) {
          icon = '💳';
        } else if (tx.type.includes('Buy Airtime')) {
          icon = '📱';
        }
        
        transactionsHTML += `
          <div class="transaction-item" data-id="${tx.id}">
            <div class="transaction-info">
              <div class="transaction-icon">${icon}</div>
              <div class="transaction-details">
                <span class="transaction-type">${tx.details}</span>
                <span class="transaction-date">${tx.date}</span>
                ${tx.recipient ? `<span class="transaction-recipient">${tx.recipient}</span>` : ''}
              </div>
            </div>
            <div class="transaction-amount">${tx.amount}</div>
          </div>
        `;
      });
      
      // Set the HTML content
      if (transactionsHTML) {
        container.innerHTML = transactionsHTML;
      }
      
      // Expose transactions to the global scope for the transaction details panel
      window.transactionData = {};
      transactions.forEach(tx => {
        window.transactionData[tx.id] = tx;
      });
    }
    
    // === INITIALIZATION ===
    
    // Populate loan purpose select options
    function populateLoanPurposes() {
      const purposeSelects = document.querySelectorAll('select[name="purpose"]');
      if (purposeSelects.length > 0) {
        const purposes = loanAPI.config.loanPurposes;
        
        purposeSelects.forEach(select => {
          select.innerHTML = '';
          purposes.forEach(purpose => {
            const option = document.createElement('option');
            option.value = purpose.toLowerCase().replace(/\s+/g, '-');
            option.textContent = purpose;
            select.appendChild(option);
          });
        });
      }
    }
    
    // Populate loan duration select options
    function populateLoanDurations() {
      const durationSelects = document.querySelectorAll('select[name="duration"]');
      if (durationSelects.length > 0) {
        const durations = loanAPI.config.availableDurations;
        
        durationSelects.forEach(select => {
          select.innerHTML = '';
          durations.forEach(months => {
            const option = document.createElement('option');
            option.value = months;
            option.textContent = months === 1 ? '1 month' : `${months} months`;
            select.appendChild(option);
          });
        });
      }
    }
    
    // Initialize the loan calculator
    function initLoanCalculator() {
      const calculator = document.getElementById('loanCalculator');
      if (calculator) {
        const amountInput = calculator.querySelector('input[name="amount"]');
        const durationInput = calculator.querySelector('select[name="duration"]');
        const resultElement = calculator.querySelector('.calculation-result');
        
        if (amountInput && durationInput && resultElement) {
          // Function to update the calculation
          const updateCalculation = () => {
            const amount = parseFloat(amountInput.value.replace(/,/g, ""));
            const duration = parseInt(durationInput.value);
            
            if (!isNaN(amount) && !isNaN(duration) && amount > 0 && duration > 0) {
              const monthlyPayment = loanAPI.calculateMonthlyPayment(
                amount, 
                loanAPI.config.defaultInterestRate, 
                duration
              );
              
              resultElement.textContent = `NGN${loanAPI.formatNumber(monthlyPayment.toFixed(2))} per month`;
            } else {
              resultElement.textContent = 'Please enter valid values';
            }
          };
          
          // Add event listeners
          amountInput.addEventListener('input', updateCalculation);
          durationInput.addEventListener('change', updateCalculation);
          
          // Initial calculation
          updateCalculation();
        }
      }
    }
    
    // Initialize everything
    function init() {
      populateLoanPurposes();
      populateLoanDurations();
      initLoanCalculator();
      refreshTransactions();
    }
    
    // Call initialization
    init();
  });