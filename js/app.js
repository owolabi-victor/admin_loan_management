// app.js - Main entry point for the application
import { formatNumber, calculateMonthlyPayment, getCurrentDate, getCurrentTime, isMobile } from './core-utils.js';
import { setupFormHandlers } from './form-manager.js';
import { addNewTransaction, addPayLoanTransaction, addAirtimeTransaction, setupTransactionHandlers } from './transaction-manager.js';
import { updateUI, setupPasswordToggle, setupBalanceToggles, setupNavigation, setupModalHandlers, setupNotifications } from './ui-manager.js';
import { setupDynamicTransactions, bankAppState } from './balance-manager.js';


// Initialize transaction data globally
window.transactionData = {
    tx1: {
        id: "TX123456789",
        type: "Buy Airtime",
        date: "14th February, 2025",
        time: "14:32",
        amount: "NGN5,000",
        status: "Completed",
        recipient: "MTN (08012345678)",
        paymentMethod: "Account Balance",
        fee: "NGN0.00",
        reference: "AIR123456789",
    },
    tx2: {
        id: "TX987654321",
        type: "Receive",
        date: "11th December, 2024",
        time: "09:15",
        amount: "NGN300,000",
        status: "Completed",
        sender: "John Doe",
        senderAccount: "0123456789",
        senderBank: "First Bank",
        reference: "PAY987654321",
        narration: "Payment for services",
    },
    tx3: {
        id: "TX567891234",
        type: "Take Loan",
        date: "8th October, 2024",
        time: "16:45",
        amount: "NGN200,000",
        status: "Approved",
        interestRate: "15% per annum",
        duration: "12 months",
        repaymentAmount: "NGN230,000",
        reference: "LN567891234",
    },
};

// Make functions available globally
window.addNewTransaction = addNewTransaction;
window.addPayLoanTransaction = addPayLoanTransaction;
window.addAirtimeTransaction = addAirtimeTransaction;
window.formatNumber = formatNumber;
window.calculateMonthlyPayment = calculateMonthlyPayment;
window.bankAppState = bankAppState;

// Initialize application when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
    // Setup all aspects of the application
    setupFormHandlers();
    setupTransactionHandlers();
    setupPasswordToggle();
    setupBalanceToggles();
    setupNavigation();
    setupModalHandlers();
    setupNotifications();
    setupDynamicTransactions();
    
    // Initial UI updates
    updateUI();
    
    // Handle window resize
    window.addEventListener("resize", updateUI);
    
    // Global function for loan submission
    window.submitLoan = function() {
        const loanAmountEl = document.getElementById("loanAmount");
        const loanPlanEl = document.getElementById("loanPlan");
        const loanInterestEl = document.getElementById("loanInterest");
        
        if (!loanAmountEl || !loanPlanEl || !loanInterestEl) {
            console.error("Loan form elements not found");
            return;
        }
        
        const loanAmount = loanAmountEl.value.replace(/,/g, "");
        const loanPlan = loanPlanEl.value;
        const loanInterest = loanInterestEl.value;
        
        // Validate minimum loan amount
        if (parseFloat(loanAmount) < 100000) {
            alert("Loan amount must be at least NGN 100,000");
            return;
        }
        
        // Calculate monthly payment
        const monthlyPayment = calculateMonthlyPayment(
            loanAmount,
            loanInterest,
            loanPlan
        );
        
        console.log({
            loanAmount,
            loanPlan,
            loanInterest,
            monthlyPayment: formatNumber(monthlyPayment.toFixed(2)),
        });
        
        alert(
            `Loan application submitted!\nYour estimated monthly payment: NGN ${formatNumber(
                monthlyPayment.toFixed(2)
            )}`
        );
    };
    
    // Global function for navigation
    window.navigate = function(page) {
        console.log(`Navigating to ${page}`);
        
        // Define actual page URLs
        const routes = {
            home: "dashboard.html",
            messages: "messages.html",
            profile: "profile.html",
        };
        
        // Redirect to the selected page if it exists
        if (routes[page]) {
            window.location.href = routes[page];
        } else {
            console.error("Page not found");
        }
    };
});