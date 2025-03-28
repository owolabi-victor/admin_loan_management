document.addEventListener("DOMContentLoaded", function() {
  // ===== FORM HANDLING =====
  
  // Get the loan form
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
          
          const amount = amountInput.value;
          const duration = durationInput.value;
          const purpose = purposeSelect.options[purposeSelect.selectedIndex].text;
          
          console.log("Form submitted with values:", { amount, duration, purpose });
          
          // Create a new transaction item
          addNewTransaction(amount, purpose);
          
          // Close the modal
          const modal = document.getElementById('takeLoanModal');
          if (modal) {
              modal.style.display = 'none';
          }
          
          // Reset the form
          this.reset();
      });
  }
  
  // Get the Pay Loan form
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
          
          const amount = amountInput.value;
          const method = methodSelect.options[methodSelect.selectedIndex].text;
          
          console.log("Pay Loan form submitted with values:", { amount, method });
          
          // Create a new transaction item
          addPayLoanTransaction(amount, method);
          
          // Close the modal
          const modal = document.getElementById('payLoanModal');
          if (modal) {
              modal.style.display = 'none';
          }
          
          // Reset the form
          this.reset();
      });
  }

  // Get the Buy Airtime form
  const airtimeForm = document.getElementById('airtimeForm');
  if (airtimeForm) {
      airtimeForm.addEventListener('submit', function(e) {
          e.preventDefault();
          
          // Get form values
          const phoneInput = this.querySelector('input[type="tel"]');
          const amountInput = this.querySelector('input[type="number"]');
          const providerSelect = this.querySelector('select');
          
          if (!phoneInput || !amountInput || !providerSelect) {
              console.error("Couldn't find all form inputs for airtime");
              return;
          }
          
          const phone = phoneInput.value;
          const amount = amountInput.value;
          const provider = providerSelect.options[providerSelect.selectedIndex].text;
          
          console.log("Airtime form submitted with values:", { phone, amount, provider });
          
          // Create a new transaction item
          addAirtimeTransaction(phone, amount, provider);
          
          // Close the modal
          const modal = document.getElementById('buyAirtimeModal');
          if (modal) {
              modal.style.display = 'none';
          }
          
          // Reset the form
          this.reset();
      });
  }
  
  // Handle all form submissions (general case from second script)
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
      // Skip forms we've already handled specifically
      if (form.id === 'loanForm' || form.id === 'payLoanForm' || form.id === 'airtimeForm') {
          return;
      }
      
      form.addEventListener('submit', (e) => {
          e.preventDefault();
          // Here you would normally send the form data to your backend
          // For this demo, we'll just close the modal
          const modal = form.closest('.modal-overlay');
          if (modal) {
              modal.style.display = 'none';
              
              // Show a success notification
              alert('Operation successful!');
          }
      });
  });
  
  // Function to add a new transaction
  function addNewTransaction(amount, purpose) {
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
  function addPayLoanTransaction(amount, method) {
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
  function addAirtimeTransaction(phone, amount, provider) {
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
  
  // ===== HELPER FUNCTIONS =====
  
  // Function to get current date in the format: "12th March, 2025"
  function getCurrentDate() {
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
  
  // Function to get current time in the format: "14:32"
  function getCurrentTime() {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
  }
  
  // Format number with commas
  function formatNumber(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
  // Calculate monthly payment
  function calculateMonthlyPayment(amount, interestRate, months) {
      amount = parseFloat(amount);
      interestRate = parseFloat(interestRate) / 100 / 12; // Monthly interest rate
      months = parseInt(months);
      
      // Calculate monthly payment using loan formula
      return (
          (amount * interestRate * Math.pow(1 + interestRate, months)) /
          (Math.pow(1 + interestRate, months) - 1)
      );
  }
  
  // Check if device is mobile
  function isMobile() {
      return window.innerWidth <= 480;
  }
  
  // ===== UI UPDATES =====
  
  // Update status bar time
  function updateTime() {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const timeElement = document.querySelector(".status-bar div:first-child");
      if (timeElement) {
          timeElement.textContent = `${hours}:${minutes}`;
      }
  }
  
  // Update time when page loads
  updateTime();
  
  // Adjust UI based on screen size
  function adjustUI() {
      const appContainer = document.querySelector(".app-container");
      if (appContainer) {
          if (isMobile()) {
              appContainer.style.height = `${window.innerHeight}px`;
          } else {
              appContainer.style.height = "auto";
          }
      }
      
      // View switch (for demonstration)
      const width = window.innerWidth;
      const mobileView = document.getElementById("mobileView");
      const webView = document.getElementById("webView");
      
      if (mobileView && webView) {
          if (width >= 1024) {
              mobileView.style.display = "none";
              webView.style.display = "flex";
          } else {
              mobileView.style.display = "block";
              webView.style.display = "none";
          }
      }
  }
  
  // Initial UI adjustment
  adjustUI();
  
  // Handle window resize
  window.addEventListener("resize", adjustUI);
  
  // ===== BALANCE VISIBILITY TOGGLES =====
  
  // Generic toggle balance function
  function setupBalanceToggle(toggleId, textId, originalText) {
      const toggleBtn = document.getElementById(toggleId);
      const balanceText = document.getElementById(textId);
      
      if (toggleBtn && balanceText) {
          // Use provided originalText or get the current text
          const textToUse = originalText || balanceText.textContent;
          let isHidden = false;
          
          toggleBtn.addEventListener("click", () => {
              isHidden = !isHidden;
              if (isHidden) {
                  balanceText.textContent = "••••••••••••";
                  balanceText.classList.add("hidden-balance");
              } else {
                  balanceText.textContent = textToUse;
                  balanceText.classList.remove("hidden-balance");
              }
          });
      }
  }
  
  // Setup all balance toggles
  setupBalanceToggle("toggleBalance", "balanceText", "NGN 30,000.00");
  setupBalanceToggle("webToggleBalance", "webBalanceText", "NGN 30,000.00");
  setupBalanceToggle("webToggleSavings", "savingsBalanceText", "NGN 125,000.00");
  
  // ===== PASSWORD VISIBILITY TOGGLE =====
  
  // Use event delegation for toggle password buttons
  document.addEventListener("click", function(e) {
      if (e.target.classList.contains("toggle-password")) {
          const passwordInput = e.target.previousElementSibling;
          if (passwordInput && (passwordInput.type === "password" || passwordInput.type === "text")) {
              passwordInput.type = passwordInput.type === "password" ? "text" : "password";
              e.target.textContent = passwordInput.type === "text" ? "👁️‍🗨️" : "👁️";
          }
      }
  });
  
  // ===== LOAN AMOUNT FORMATTING =====
  
  const loanAmount = document.getElementById("loanAmount");
  if (loanAmount) {
      loanAmount.addEventListener("input", function(e) {
          // Remove any commas first
          let value = e.target.value.replace(/,/g, "");
          
          // Check if it's a valid number
          if (!isNaN(value) && value) {
              // Format with commas
              e.target.value = formatNumber(value);
          }
      });
  }
  
  // ===== HANDLE LOAN SUBMISSION =====
  
  // Add global function for loan submission
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
  
  // ===== NAVIGATION =====
  
  // Global navigation function
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
  
  // Navigation handlers from second script
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
      item.addEventListener('click', () => {
          navItems.forEach(nav => nav.classList.remove('active-nav'));
          item.classList.add('active-nav');
          // Here you would normally change the view
      });
  });
  
  // Web sidebar navigation
  const sidebarNavItems = document.querySelectorAll('.sidebar-nav-item');
  sidebarNavItems.forEach(item => {
      item.addEventListener('click', () => {
          sidebarNavItems.forEach(nav => nav.classList.remove('active'));
          item.classList.add('active');
          // Here you would normally change the content
      });
  });
  
  // ===== MODAL HANDLING =====
  
  // Setup modal open buttons
  const modalConfigs = {
      'takeLoanBtn': 'takeLoanModal',
      'payLoanBtn': 'payLoanModal',
      'buyAirtimeBtn': 'buyAirtimeModal',
      'checkStatusBtn': 'checkStatusModal',
      // Web buttons
      'webTakeLoanBtn': 'takeLoanModal',
      'webPayLoanBtn': 'payLoanModal',
      'webBuyAirtimeBtn': 'buyAirtimeModal',
      'webCheckStatusBtn': 'checkStatusModal',
  };
  
  for (const btnId in modalConfigs) {
      const btn = document.getElementById(btnId);
      const modalId = modalConfigs[btnId];
      const modal = document.getElementById(modalId);
      
      if (btn && modal) {
          btn.addEventListener("click", () => {
              modal.style.display = "flex";
          });
      }
  }
  
  // Close modals with close buttons
  document.addEventListener("click", function(e) {
      if (e.target.classList.contains("modal-close")) {
          const modalId = e.target.dataset.modal;
          const modal = document.getElementById(modalId);
          if (modal) {
              modal.style.display = "none";
          }
      }
  });
  
  // Close modals when clicking outside
  document.addEventListener("click", function(e) {
      if (e.target.classList.contains("modal-overlay")) {
          e.target.style.display = "none";
      }
  });
  
  // ===== NOTIFICATION PANEL =====
  
  const notificationBell = document.getElementById("notificationBell");
  const webNotificationBell = document.getElementById("webNotificationBell");
  const notificationPanel = document.getElementById("notificationPanel");
  const closeNotifications = document.getElementById("closeNotifications");
  
  if (notificationBell && notificationPanel) {
      notificationBell.addEventListener("click", () => {
          notificationPanel.style.display = "block";
      });
  }
  
  if (webNotificationBell && notificationPanel) {
      webNotificationBell.addEventListener("click", () => {
          notificationPanel.style.display = "block";
      });
  }
  
  if (closeNotifications && notificationPanel) {
      closeNotifications.addEventListener("click", () => {
          notificationPanel.style.display = "none";
      });
  }
  
  // ===== TRANSACTION DATA AND HANDLING =====
  
  // Sample transaction data - MADE GLOBAL
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
  
  // Fix for transaction item click handler
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
});