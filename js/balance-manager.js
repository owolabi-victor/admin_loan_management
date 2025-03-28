import { formatNumber } from './core-utils.js';

class BankAppState {
    constructor() {
        // Use BigInt for precise large number handling
        this.mainBalance = BigInt(30000);
        this.savingsBalance = BigInt(125000);
        this.loanBalance = BigInt(200000);
        
        // Track transaction prevention to avoid duplicate transactions
        this.preventDuplicateTransactions = true;
    }

    // Validate transaction with more robust checks
    canPerformTransaction(amount, balanceType = 'main') {
        // Convert amount to BigInt and ensure it's a positive number
        const amountBigInt = BigInt(Math.max(0, Number(amount)));
        
        let currentBalance;
        switch(balanceType) {
            case 'main':
                currentBalance = this.mainBalance;
                break;
            case 'savings':
                currentBalance = this.savingsBalance;
                break;
            case 'loan':
                currentBalance = this.loanBalance;
                break;
            default:
                return false;
        }

        // Check for sufficient funds and prevent negative transactions
        return amountBigInt > 0n && amountBigInt <= currentBalance;
    }

    // Enhanced loan application method
    applyForLoan(amount, purpose) {
        const amountBigInt = BigInt(Math.max(0, Number(amount)));
        
        // Additional validation to prevent excessive loans
        if (amountBigInt > this.loanBalance) {
            console.error('Loan amount exceeds maximum allowed');
            return false;
        }

        const prevMainBalance = this.mainBalance;
        const prevLoanBalance = this.loanBalance;

        // Add loan amount to main balance
        this.mainBalance += amountBigInt;
        // Track loan liability
        this.loanBalance += amountBigInt;
        
        this.updateBalanceDisplay();
        this.logLoanApplication(amount, purpose, prevMainBalance, prevLoanBalance);
        
        return true;
    }

    // Enhanced update methods with BigInt and more validation
    updateMainBalance(amount, isDeduct = false) {
        const amountBigInt = BigInt(Math.max(0, Number(amount)));
        
        // Additional validation before transaction
        if (isDeduct && !this.canPerformTransaction(amountBigInt)) {
            console.error('Insufficient funds for main balance transaction');
            return this.mainBalance;
        }

        const prevBalance = this.mainBalance;
        this.mainBalance = isDeduct 
            ? this.mainBalance - amountBigInt 
            : this.mainBalance + amountBigInt;
        
        this.updateBalanceDisplay();
        this.logBalanceChange(prevBalance, this.mainBalance, isDeduct);
        return this.mainBalance;
    }

    updateSavingsBalance(amount, isDeduct = false) {
        const amountBigInt = BigInt(Math.max(0, Number(amount)));
        
        // Additional validation before transaction
        if (isDeduct && !this.canPerformTransaction(amountBigInt, 'savings')) {
            console.error('Insufficient funds for savings balance transaction');
            return this.savingsBalance;
        }

        const prevBalance = this.savingsBalance;
        this.savingsBalance = isDeduct 
            ? this.savingsBalance - amountBigInt 
            : this.savingsBalance + amountBigInt;
        
        this.updateBalanceDisplay();
        this.logBalanceChange(prevBalance, this.savingsBalance, isDeduct);
        return this.savingsBalance;
    }

    updateLoanBalance(amount) {
        const amountBigInt = BigInt(Math.max(0, Number(amount)));
        
        // Validate loan payment amount
        if (!this.canPerformTransaction(amountBigInt, 'loan')) {
            console.error('Invalid loan payment amount');
            return this.loanBalance;
        }

        const prevLoanBalance = this.loanBalance;
        this.loanBalance -= amountBigInt;
        
        this.updateLoanStatusDisplay();
        this.logLoanBalanceChange(prevLoanBalance, this.loanBalance);
        return this.loanBalance;
    }

    // Improved display methods to handle large numbers
    updateBalanceDisplay() {
        const mobileBalanceText = document.getElementById('balanceText');
        const webBalanceText = document.getElementById('webBalanceText');
        
        const formattedMainBalance = `NGN ${formatNumber(Number(this.mainBalance))}.00`;
        
        if (mobileBalanceText) {
            mobileBalanceText.textContent = formattedMainBalance;
        }
        
        if (webBalanceText) {
            webBalanceText.textContent = formattedMainBalance;

            // Savings balance display
            const webSavingsBalanceText = document.getElementById('savingsBalanceText');
            if (webSavingsBalanceText) {
                const formattedSavingsBalance = `NGN ${formatNumber(Number(this.savingsBalance))}.00`;
                webSavingsBalanceText.textContent = formattedSavingsBalance;
            }
        }
    }

    // Logging methods
    logBalanceChange(prevBalance, newBalance, isDeduct) {
        console.log(`Balance ${isDeduct ? 'reduced' : 'increased'}: 
            ${formatNumber(Number(prevBalance))} → ${formatNumber(Number(newBalance))}`);
    }

    logLoanBalanceChange(prevLoanBalance, newLoanBalance) {
        console.log(`Loan balance reduced: 
            ${formatNumber(Number(prevLoanBalance))} → ${formatNumber(Number(newLoanBalance))}`);
    }

    logLoanApplication(amount, purpose, prevMainBalance, prevLoanBalance) {
        console.log(`Loan applied: 
            Amount: ${amount}
            Purpose: ${purpose}
            Main Balance: ${formatNumber(Number(prevMainBalance))} → ${formatNumber(Number(this.mainBalance))}
            Loan Balance: ${formatNumber(Number(prevLoanBalance))} → ${formatNumber(Number(this.loanBalance))}`);
    }

    // Update loan status display (assuming this method exists)
    updateLoanStatusDisplay() {
        const loanStatusElement = document.getElementById('loanStatusText');
        if (loanStatusElement) {
            loanStatusElement.textContent = `Loan Balance: NGN ${formatNumber(Number(this.loanBalance))}.00`;
        }
    }
}

// Create a singleton instance of bank app state
export const bankAppState = new BankAppState();

// Modify transaction setup to use improved validation
export function setupDynamicTransactions() {
    // Loan Application Handler
    document.getElementById('loanForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const loanAmount = parseFloat(document.getElementById('loanFormAmount').value);
        const loanPurpose = document.getElementById('loanFormPurpose').value;
        
        if (bankAppState.preventDuplicateTransactions) {
            // Prevent duplicate transactions
            bankAppState.preventDuplicateTransactions = false;
            
            // Apply for loan
            if (bankAppState.applyForLoan(loanAmount, loanPurpose)) {
                window.addNewTransaction(loanAmount, loanPurpose);
                
                // Close modal
                document.getElementById('takeLoanModal').style.display = 'none';
            } else {
                alert('Loan application failed. Please check the amount.');
            }
            
            // Reset transaction prevention after a short delay
            setTimeout(() => {
                bankAppState.preventDuplicateTransactions = true;
            }, 1000);
        } else {
            alert('Please wait before making another transaction.');
        }
    });

    // Pay Loan Handler
    document.getElementById('payLoanForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const paymentAmount = parseFloat(this.querySelector('input[type="number"]').value);
        const paymentMethod = this.querySelector('select').value;
        
        if (bankAppState.preventDuplicateTransactions && 
            bankAppState.canPerformTransaction(paymentAmount) && 
            bankAppState.canPerformTransaction(paymentAmount, 'loan')) {
            
            bankAppState.preventDuplicateTransactions = false;
            
            // Deduct from main balance and reduce loan balance
            bankAppState.updateMainBalance(paymentAmount, true);
            bankAppState.updateLoanBalance(paymentAmount);
            window.addPayLoanTransaction(paymentAmount, paymentMethod);
            
            // Close modal
            document.getElementById('payLoanModal').style.display = 'none';
            
            // Reset transaction prevention
            setTimeout(() => {
                bankAppState.preventDuplicateTransactions = true;
            }, 1000);
        } else {
            alert('Transaction cannot be completed. Check balance and loan amount.');
        }
    });

    // Buy Airtime Handler
    document.getElementById('airtimeForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const phoneNumber = this.querySelector('input[type="tel"]').value;
        const amount = parseFloat(this.querySelector('input[type="number"]').value);
        const provider = this.querySelector('select').value;
        
        if (bankAppState.preventDuplicateTransactions && 
            bankAppState.canPerformTransaction(amount)) {
            
            bankAppState.preventDuplicateTransactions = false;
            
            // Deduct from main balance
            bankAppState.updateMainBalance(amount, true);
            window.addAirtimeTransaction(phoneNumber, amount, provider);
            
            // Close modal
            document.getElementById('buyAirtimeModal').style.display = 'none';
            
            // Reset transaction prevention
            setTimeout(() => {
                bankAppState.preventDuplicateTransactions = true;
            }, 1000);
        } else {
            alert('Transaction cannot be completed. Insufficient funds.');
        }
    });
}

// Initialize dynamic transactions when the script loads
setupDynamicTransactions();

export default bankAppState;