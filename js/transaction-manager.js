// transaction-manager.js - Manages transaction creation and display
import { formatNumber, getCurrentDate, getCurrentTime } from './core-utils.js';

// Function to add a new transaction
export function addNewTransaction(amount, purpose) {
    // Get BOTH transactions containers
    const mobileTransactionsSection = document.querySelector('#mobileView .transactions-section');
    const webTransactionsSection = document.querySelector('#webView .transactions-section');
    
    console.log("Adding new transaction:", { amount, purpose });
    
    // Format the amount with commas
    const formattedAmount = formatNumber(amount);
    
    // Generate a unique transaction ID
    const txId = `tx${Date.now()}`;
    
    // Create new transaction HTML
    const transactionHTML = `
        <div class="transaction-item" data-id="${txId}">
            <div class="transaction-info">
                <div class="transaction-icon">💰</div>
                <div class="transaction-details">
                    <span class="transaction-type">Take Loan (${purpose})</span>
                    <span class="transaction-date">${getCurrentDate()}</span>
                </div>
            </div>
            <div class="transaction-amount">NGN${formattedAmount}</div>
        </div>
    `;
    
    // Update mobile view
    if (mobileTransactionsSection) {
        const firstTransaction = mobileTransactionsSection.querySelector('.transaction-item');
        if (firstTransaction) {
            firstTransaction.insertAdjacentHTML('beforebegin', transactionHTML);
        } else {
            mobileTransactionsSection.innerHTML += transactionHTML;
        }
    }
    
    // Update web view
    if (webTransactionsSection) {
        const firstTransaction = webTransactionsSection.querySelector('.transaction-item');
        if (firstTransaction) {
            firstTransaction.insertAdjacentHTML('beforebegin', transactionHTML);
        } else {
            webTransactionsSection.innerHTML += transactionHTML;
        }
    }
    
    // Add this transaction to transactionData for future reference
    window.transactionData[txId] = {
        id: txId,
        type: `Take Loan (${purpose})`,
        date: getCurrentDate(),
        time: getCurrentTime(),
        amount: `NGN${formattedAmount}`,
        status: "Approved",
        interestRate: "15% per annum",
        duration: "12 months",
        purpose: purpose,
        reference: `LN${Date.now().toString().slice(-9)}`,
    };
    
    console.log("Transaction added successfully");
}

// Function to add a new Pay Loan transaction
export function addPayLoanTransaction(amount, method) {
    // Get BOTH transactions containers
    const mobileTransactionsSection = document.querySelector('#mobileView .transactions-section');
    const webTransactionsSection = document.querySelector('#webView .transactions-section');
    
    console.log("Adding new pay loan transaction:", { amount, method });
    
    // Format the amount with commas
    const formattedAmount = formatNumber(amount);
    
    // Generate a unique transaction ID
    const txId = `tx${Date.now()}`;
    
    // Create new transaction HTML
    const transactionHTML = `
        <div class="transaction-item" data-id="${txId}">
            <div class="transaction-info">
                <div class="transaction-icon">💳</div>
                <div class="transaction-details">
                    <span class="transaction-type">Pay Loan (${method})</span>
                    <span class="transaction-date">${getCurrentDate()}</span>
                </div>
            </div>
            <div class="transaction-amount">-NGN${formattedAmount}</div>
        </div>
    `;
    
    // Update mobile view
    if (mobileTransactionsSection) {
        const firstTransaction = mobileTransactionsSection.querySelector('.transaction-item');
        if (firstTransaction) {
            firstTransaction.insertAdjacentHTML('beforebegin', transactionHTML);
        } else {
            mobileTransactionsSection.innerHTML += transactionHTML;
        }
    }
    
    // Update web view
    if (webTransactionsSection) {
        const firstTransaction = webTransactionsSection.querySelector('.transaction-item');
        if (firstTransaction) {
            firstTransaction.insertAdjacentHTML('beforebegin', transactionHTML);
        } else {
            webTransactionsSection.innerHTML += transactionHTML;
        }
    }
    
    // Add this transaction to transactionData for future reference
    window.transactionData[txId] = {
        id: txId,
        type: `Pay Loan (${method})`,
        date: getCurrentDate(),
        time: getCurrentTime(),
        amount: `-NGN${formattedAmount}`,
        status: "Completed",
        paymentMethod: method,
        fee: "NGN0.00",
        reference: `PL${Date.now().toString().slice(-9)}`,
    };
    
    console.log("Pay loan transaction added successfully");
}

// Function to add a new Buy Airtime transaction
export function addAirtimeTransaction(phone, amount, provider) {
    // Get BOTH transactions containers
    const mobileTransactionsSection = document.querySelector('#mobileView .transactions-section');
    const webTransactionsSection = document.querySelector('#webView .transactions-section');
    
    console.log("Adding new airtime transaction:", { phone, amount, provider });
    
    // Format the amount with commas
    const formattedAmount = formatNumber(amount);
    
    // Generate a unique transaction ID
    const txId = `tx${Date.now()}`;
    
    // Create new transaction HTML
    const transactionHTML = `
        <div class="transaction-item" data-id="${txId}">
            <div class="transaction-info">
                <div class="transaction-icon">📱</div>
                <div class="transaction-details">
                    <span class="transaction-type">Buy Airtime (${provider})</span>
                    <span class="transaction-date">${getCurrentDate()}</span>
                    <span class="transaction-recipient">${phone}</span>
                </div>
            </div>
            <div class="transaction-amount">-NGN${formattedAmount}</div>
        </div>
    `;
    
    // Update mobile view
    if (mobileTransactionsSection) {
        const firstTransaction = mobileTransactionsSection.querySelector('.transaction-item');
        if (firstTransaction) {
            firstTransaction.insertAdjacentHTML('beforebegin', transactionHTML);
        } else {
            mobileTransactionsSection.innerHTML += transactionHTML;
        }
    }
    
    // Update web view
    if (webTransactionsSection) {
        const firstTransaction = webTransactionsSection.querySelector('.transaction-item');
        if (firstTransaction) {
            firstTransaction.insertAdjacentHTML('beforebegin', transactionHTML);
        } else {
            webTransactionsSection.innerHTML += transactionHTML;
        }
    }
    
    // Add this transaction to transactionData for future reference
    window.transactionData[txId] = {
        id: txId,
        type: `Buy Airtime (${provider})`,
        date: getCurrentDate(),
        time: getCurrentTime(),
        amount: `-NGN${formattedAmount}`,
        status: "Completed",
        recipient: phone,
        provider: provider,
        paymentMethod: "Account Balance",
        fee: "NGN0.00",
        reference: `AIR${Date.now().toString().slice(-9)}`,
    };
    
    console.log("Airtime transaction added successfully");
}

// Set up transaction handling
export function setupTransactionHandlers() {
    // Transaction click handler
    document.addEventListener("click", function(e) {
        const transactionItem = e.target.closest(".transaction-item");
        
        if (transactionItem) {
            const txId = transactionItem.dataset.id;
            console.log("Clicked transaction with ID:", txId);
            
            // Get transaction data
            let txData = window.transactionData[txId];
            
            // If txData doesn't exist in our predefined data, create it from the transaction item
            if (!txData && transactionItem) {
                console.log("Creating fallback transaction data");
                const typeElement = transactionItem.querySelector(".transaction-type");
                const dateElement = transactionItem.querySelector(".transaction-date");
                const amountElement = transactionItem.querySelector(".transaction-amount");
                const recipientElement = transactionItem.querySelector(".transaction-recipient");
                
                // Create a basic transaction data object
                txData = {
                    id: txId || `TX${Date.now()}`,
                    type: typeElement ? typeElement.textContent : "Transaction",
                    date: dateElement ? dateElement.textContent : getCurrentDate(),
                    time: getCurrentTime(),
                    amount: amountElement ? amountElement.textContent : "",
                    status: "Completed",
                };
                
                // Add recipient info if available
                if (recipientElement) {
                    txData.recipient = recipientElement.textContent;
                }
                
                // Add additional details based on transaction type
                if (typeElement) {
                    const typeText = typeElement.textContent;
                    
                    if (typeText.includes("Take Loan")) {
                        const purpose = typeText.match(/\(([^)]+)\)/);
                        txData.purpose = purpose ? purpose[1] : "General";
                        txData.interestRate = "15% per annum";
                        txData.duration = "12 months";
                        txData.reference = `LN${Date.now().toString().slice(-9)}`;
                    } else if (typeText.includes("Pay Loan")) {
                        const method = typeText.match(/\(([^)]+)\)/);
                        txData.paymentMethod = method ? method[1] : "Account Balance";
                        txData.fee = "NGN0.00";
                        txData.reference = `PL${Date.now().toString().slice(-9)}`;
                    } else if (typeText.includes("Buy Airtime")) {
                        const provider = typeText.match(/\(([^)]+)\)/);
                        txData.provider = provider ? provider[1] : "Unknown";
                        txData.paymentMethod = "Account Balance";
                        txData.fee = "NGN0.00";
                        txData.reference = `AIR${Date.now().toString().slice(-9)}`;
                    }
                }
                
                // Store this transaction data for future reference
                window.transactionData[txId] = txData;
            }
            
            const transactionDetailsContent = document.getElementById("transactionDetailsContent");
            const transactionDetailsPanel = document.getElementById("transactionDetailsPanel");
            
            if (!transactionDetailsContent || !transactionDetailsPanel) {
                console.error("Transaction details elements not found");
                return;
            }
            
            if (txData) {
                let detailsHtml = "";
                
                // Build HTML for transaction details
                for (const [key, value] of Object.entries(txData)) {
                    // Skip the id field or any other fields you want to hide
                    if (key === "id" && txId.startsWith("tx")) continue;
                    
                    // Format the key for display
                    const formattedKey =
                        key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1");
                    
                    detailsHtml += `
                        <div class="transaction-details-item">
                            <span class="detail-label">${formattedKey}</span>
                            <span class="detail-value">${value}</span>
                        </div>`;
                }
                
                transactionDetailsContent.innerHTML = detailsHtml;
                transactionDetailsPanel.style.display = "block";
            } else {
                console.error("No transaction data found for", txId);
            }
        }
    });
    
    // Close transaction details panel
    const closeTransactionDetails = document.getElementById("closeTransactionDetails");
    if (closeTransactionDetails) {
        closeTransactionDetails.addEventListener("click", () => {
            const transactionDetailsPanel = document.getElementById("transactionDetailsPanel");
            if (transactionDetailsPanel) {
                transactionDetailsPanel.style.display = "none";
            }
        });
    }
    // Add these at the end of the file
window.addNewTransaction = addNewTransaction;
window.addPayLoanTransaction = addPayLoanTransaction;
window.addAirtimeTransaction = addAirtimeTransaction;
}