// form-manager.js - Manages all form handling across the application
import { formatNumber, getCurrentDate, getCurrentTime } from './core-utils.js';
import { addNewTransaction, addPayLoanTransaction, addAirtimeTransaction } from './transaction-manager.js';

export function setupFormHandlers() {
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
    
    // Setup loan amount formatting
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
    
    // Handle all form submissions (general case)
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
}