// loan-integration.js - Connects loan system with dashboard and balance

import { addNewTransaction } from './transaction-manager.js';
import { formatNumber, getCurrentDate } from './core-utils.js';

// Function to update the loan status on dashboard
export function updateLoanStatus() {
    // Get approved loans from localStorage
    const approvedLoans = JSON.parse(localStorage.getItem('approvedLoans')) || [];
    const pendingLoans = JSON.parse(localStorage.getItem('pendingLoans')) || [];
    
    // Check for newly approved loans that haven't been processed
    approvedLoans.forEach(loan => {
        if (!loan.processed) {
            console.log("Processing newly approved loan:", loan);
            
            // Update the balance by adding the loan amount
            updateBalance(parseFloat(loan.loanAmount));
            
            // Add the loan transaction to the transaction history
            addNewTransaction(loan.loanAmount, loan.loanPurpose);
            
            // Update the loan status to display "Active" on customer dashboard
            loan.status = "Active";
            loan.processed = true;
            
            // Add notification for the user
            addNotification(`Loan Approved: Your loan application of NGN${formatNumber(loan.loanAmount)} has been approved.`);
        }
    });
    
    // Save updated approved loans back to localStorage
    localStorage.setItem('approvedLoans', JSON.stringify(approvedLoans));
    
    // Display loan status on dashboard
    displayActiveLoan();
}

// Function to update account balance when loan is approved
function updateBalance(amount) {
    // Get current balance elements
    const mobileBalanceText = document.getElementById('balanceText');
    const webBalanceText = document.getElementById('webBalanceText');
    
    if (!mobileBalanceText || !webBalanceText) {
        console.error("Balance elements not found");
        return;
    }
    
    // Extract current balance amounts
    const mobileBalanceStr = mobileBalanceText.textContent.replace(/[^0-9.]/g, '');
    const mobileBalance = parseFloat(mobileBalanceStr);
    
    // Calculate new balance
    const newBalance = mobileBalance + amount;
    
    // Format and update balances
    const formattedBalance = formatNumber(newBalance);
    mobileBalanceText.textContent = `NGN ${formattedBalance}`;
    webBalanceText.textContent = `NGN ${formattedBalance}`;
    
    // Save balance to localStorage for persistence
    localStorage.setItem('accountBalance', newBalance);
    
    console.log(`Balance updated: Added ${amount}, New balance: ${newBalance}`);
}

// Function to display active loan status on dashboard
function displayActiveLoan() {
    // Get approved (active) loans
    const approvedLoans = JSON.parse(localStorage.getItem('approvedLoans')) || [];
    const activeLoans = approvedLoans.filter(loan => loan.status === "Active");
    
    // Get loan status containers or create them if they don't exist
    let mobileLoanStatus = document.getElementById('mobileLoanStatus');
    let webLoanStatus = document.getElementById('webLoanStatus');
    
    // If status elements don't exist, create them
    if (!mobileLoanStatus) {
        const mobileBalanceCard = document.querySelector('#mobileView .balance-card');
        if (mobileBalanceCard) {
            mobileLoanStatus = document.createElement('div');
            mobileLoanStatus.id = 'mobileLoanStatus';
            mobileLoanStatus.className = 'loan-status-indicator';
            mobileBalanceCard.appendChild(mobileLoanStatus);
        }
    }
    
    if (!webLoanStatus) {
        const webBalanceCard = document.querySelector('#webView .balance-card');
        if (webBalanceCard) {
            webLoanStatus = document.createElement('div');
            webLoanStatus.id = 'webLoanStatus';
            webLoanStatus.className = 'loan-status-indicator';
            webBalanceCard.appendChild(webLoanStatus);
        }
    }
    
    // Update loan status display
    if (activeLoans.length > 0) {
        const latestLoan = activeLoans[activeLoans.length - 1];
        const statusHTML = `
            <div class="active-loan-info">
                <span class="loan-status-badge">Active Loan</span>
                <span class="loan-amount">NGN${formatNumber(latestLoan.loanAmount)}</span>
            </div>
        `;
        
        if (mobileLoanStatus) mobileLoanStatus.innerHTML = statusHTML;
        if (webLoanStatus) webLoanStatus.innerHTML = statusHTML;
    } else {
        // Clear status if no active loans
        if (mobileLoanStatus) mobileLoanStatus.innerHTML = '';
        if (webLoanStatus) webLoanStatus.innerHTML = '';
    }
}

// Function to add a notification
function addNotification(message) {
    const notificationList = document.querySelector('.notification-list');
    if (!notificationList) {
        console.error("Notification list element not found");
        return;
    }
    
    const notificationItem = document.createElement('div');
    notificationItem.className = 'notification-item unread';
    notificationItem.innerHTML = `
        <div class="notification-title">Loan Update</div>
        <div class="notification-text">${message}</div>
        <div class="notification-time">Just now</div>
    `;
    
    // Insert at the beginning of the list
    notificationList.insertBefore(notificationItem, notificationList.firstChild);
    
    // Update notification badge
    updateNotificationBadge();
}

// Update notification badge count
function updateNotificationBadge() {
    const badges = document.querySelectorAll('.notification-badge');
    const unreadCount = document.querySelectorAll('.notification-item.unread').length;
    
    badges.forEach(badge => {
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'block' : 'none';
    });
}

// Initialize the loan integration system
export function initLoanIntegration() {
    console.log("Initializing loan integration system");
    
    // Check for loan updates on page load
    updateLoanStatus();
    
    // Set up CSS for loan status indicators
    setupLoanStatusStyles();
    
    // Check for loan updates periodically (every 30 seconds)
    setInterval(updateLoanStatus, 30000);
    
    // Add event listener for the loan application form submission
    const loanForm = document.getElementById('loanForm');
    if (loanForm) {
        loanForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitLoanApplication();
        });
    }
}

// Add required CSS styles for loan status
function setupLoanStatusStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .loan-status-indicator {
            margin-top: 10px;
            font-size: 0.9em;
        }
        
        .active-loan-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .loan-status-badge {
            background-color: #28a745;
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.8em;
        }
        
        .loan-amount {
            font-weight: bold;
        }
    `;
    document.head.appendChild(styleElement);
}

// Function to submit a new loan application
function submitLoanApplication() {
    const loanAmount = document.getElementById('loanFormAmount').value;
    const loanDuration = document.getElementById('loanFormDuration').value;
    const loanPurpose = document.getElementById('loanFormPurpose').value;
    
    if (!loanAmount || !loanDuration || !loanPurpose) {
        alert('Please fill in all fields');
        return;
    }
    
    // Create a new loan application
    const newLoan = {
        id: Date.now(),
        fullName: "Andrew", // Using the name from dashboard
        email: "andrew@example.com", // Example email
        loanAmount: loanAmount,
        loanDuration: loanDuration,
        loanPurpose: loanPurpose,
        submissionDate: new Date().toISOString(),
        status: "Pending"
    };
    
    // Save to pending loans
    const pendingLoans = JSON.parse(localStorage.getItem('pendingLoans')) || [];
    pendingLoans.push(newLoan);
    localStorage.setItem('pendingLoans', JSON.stringify(pendingLoans));
    
    // Close the modal
    const modal = document.getElementById('takeLoanModal');
    if (modal) {
        modal.style.display = 'none';
    }
    
    // Show success message
    alert('Loan application submitted successfully!');
}

// Export to global scope for use in HTML
window.initLoanIntegration = initLoanIntegration;
window.updateLoanStatus = updateLoanStatus;