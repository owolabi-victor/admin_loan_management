// admin-integration.js - Enhanced admin dashboard functionality



// Enhanced approve loan function
function approveLoan(loanId) {
    const loans = JSON.parse(localStorage.getItem('pendingLoans')) || [];
    let approvedLoan = null;
    
    const updatedLoans = loans.map(loan => {
        if (loan.id === loanId) {
            loan.status = 'Approved';
            loan.approvalDate = new Date().toISOString();
            approvedLoan = loan;
            
            // Store in approved loans
            const approvedLoans = JSON.parse(localStorage.getItem('approvedLoans')) || [];
            approvedLoans.push(loan);
            localStorage.setItem('approvedLoans', JSON.stringify(approvedLoans));
        }
        return loan;
    });

    localStorage.setItem('pendingLoans', JSON.stringify(updatedLoans));
    renderPendingLoans();
    showNotification('Loan Approved', 'success');
    
    // Dispatch a custom event that other pages can listen for
    const approvalEvent = new CustomEvent('loanApproved', { 
        detail: { loanId: loanId, loan: approvedLoan } 
    });
    window.dispatchEvent(approvalEvent);
    
    // If running in the same window/tab as the dashboard, update directly
    if (typeof updateLoanStatus === 'function') {
        updateLoanStatus();
    }
}

// Enhanced reject loan function
function rejectLoan(loanId) {
    const loans = JSON.parse(localStorage.getItem('pendingLoans')) || [];
    let rejectedLoan = null;
    
    const updatedLoans = loans.map(loan => {
        if (loan.id === loanId) {
            loan.status = 'Rejected';
            loan.rejectionDate = new Date().toISOString();
            rejectedLoan = loan;
            
            // Store in rejected loans
            const rejectedLoans = JSON.parse(localStorage.getItem('rejectedLoans')) || [];
            rejectedLoans.push(loan);
            localStorage.setItem('rejectedLoans', JSON.stringify(rejectedLoans));
        }
        return loan;
    });

    localStorage.setItem('pendingLoans', JSON.stringify(updatedLoans));
    renderPendingLoans();
    showNotification('Loan Rejected', 'error');
    
    // Dispatch a custom event that other pages can listen for
    const rejectionEvent = new CustomEvent('loanRejected', { 
        detail: { loanId: loanId, loan: rejectedLoan } 
    });
    window.dispatchEvent(rejectionEvent);
}

// Enhanced notification function with animation
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    // Add animation
    notification.style.animation = 'slideIn 0.3s forwards, fadeOut 0.5s 2.5s forwards';
    
    setTimeout(() => {
        notification.className = 'notification';
        notification.style.animation = '';
    }, 3000);
}

// Function to initialize additional admin dashboard features
function initAdminDashboard() {
    // Add CSS for enhanced notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateY(-50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        .notification {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 25px;
            border-radius: 5px;
            z-index: 1000;
            font-weight: 500;
            display: none;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
            text-align: center;
        }
        
        .notification.show {
            display: block;
        }
        
        .notification.success {
            background-color: #dff2bf;
            color: #4F8A10;
            border-left: 4px solid #4F8A10;
        }
        
        .notification.error {
            background-color: #ffbaba;
            color: #D8000C;
            border-left: 4px solid #D8000C;
        }
        
        .status-badge {
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            color: white;
            display: inline-block;
        }
        
        .status-pending {
            background-color: #f0ad4e;
        }
        
        .status-approved {
            background-color: #5cb85c;
        }
        
        .status-rejected {
            background-color: #d9534f;
        }
        
        .btn {
            padding: 6px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
            transition: background-color 0.2s;
        }
        
        .btn-approve {
            background-color: #5cb85c;
            color: white;
        }
        
        .btn-approve:hover {
            background-color: #4cae4c;
        }
        
        .btn-reject {
            background-color: #d9534f;
            color: white;
        }
        
        .btn-reject:hover {
            background-color: #c9302c;
        }
    `;
    document.head.appendChild(style);
    
    // Override existing functions with enhanced versions
    window.approveLoan = approveLoan;
    window.rejectLoan = rejectLoan;
    window.showNotification = showNotification;
    
    // Add listeners for any cross-page events
    window.addEventListener('storage', function(e) {
        // React to localStorage changes from other tabs/windows
        if (e.key === 'pendingLoans' || e.key === 'approvedLoans' || e.key === 'rejectedLoans') {
            renderPendingLoans();
        }
    });
    
}


// Initialize on page load
document.addEventListener('DOMContentLoaded', initAdminDashboard);