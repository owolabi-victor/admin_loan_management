document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard data and UI
    initializeDashboard();
    setupEventListeners();
    loadMockData();
});

// ===== INITIALIZATION FUNCTIONS =====
function initializeDashboard() {
    // Show active section based on URL hash or default to dashboard
    const hash = window.location.hash || '#dashboard';
    showSection(hash.substring(1));
    
    // Activate corresponding sidebar menu item
    document.querySelector(`.menu-item[href="${hash}"]`)?.classList.add('active');
    
    // Initialize charts
    initializeCharts();
}

function setupEventListeners() {
    // Sidebar navigation
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
            
            // Update active menu item
            document.querySelectorAll('.menu-item').forEach(menuItem => {
                menuItem.classList.remove('active');
            });
            this.classList.add('active');
            
            // Update URL hash
            window.location.hash = section;
        });
    });
    
    // Tab navigation in sections
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            const tabContainer = this.closest('.section-tabs').parentElement;
            
            // Update active tab button
            tabContainer.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            // Show corresponding tab content
            tabContainer.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(tabId)?.classList.add('active');
        });
    });
    
    // Form submissions
    setupFormSubmissions();
    
    // Filter actions
    setupFilterActions();
    
    // Search functionality
    document.getElementById('customerSearchBtn')?.addEventListener('click', function() {
        const searchTerm = document.getElementById('customerSearch').value.toLowerCase();
        searchCustomers(searchTerm);
    });
    
    document.getElementById('customerSearch')?.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            const searchTerm = this.value.toLowerCase();
            searchCustomers(searchTerm);
        }
    });
    
    // Action buttons
    setupActionButtons();
    
    // Add real-time data refresh
    setupDataRefreshInterval();
}

// Setup automatic data refresh every 5 minutes
function setupDataRefreshInterval() {
    setInterval(() => {
        refreshAllData();
    }, 300000); // 5 minutes
}

function refreshAllData() {
    // Refresh all data displays
    loadDashboardData();
    loadLoanManagementData();
    loadRepaymentTrackingData();
    loadDebtRecoveryData();
    loadCustomerManagementData();
    updateKPIMetrics();
    
    // Show notification
    showNotification('Data refreshed', 'info');
}

// ===== SECTION VISIBILITY =====
function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
        sectionElement.classList.add('active');
        // Trigger data refresh for the active section
        refreshSectionData(sectionId);
    }
}

function refreshSectionData(sectionId) {
    switch(sectionId) {
        case 'dashboard':
            loadDashboardData();
            updateKPIMetrics();
            break;
        case 'loanManagement':
            loadLoanManagementData();
            break;
        case 'repaymentTracking':
            loadRepaymentTrackingData();
            break;
        case 'debtRecovery':
            loadDebtRecoveryData();
            break;
        case 'customerManagement':
            loadCustomerManagementData();
            break;
        case 'reporting':
            refreshReportingData();
            break;
    }
}

// ===== DATA SERVICE LAYER =====
const DataService = {
    // Get all loans
    getLoans: function() {
        return JSON.parse(localStorage.getItem('mockLoans') || '[]');
    },
    
    // Save loans
    saveLoans: function(loans) {
        localStorage.setItem('mockLoans', JSON.stringify(loans));
    },
    
    // Get loans by status
    getLoansByStatus: function(status) {
        const loans = this.getLoans();
        return loans.filter(loan => loan.status === status);
    },
    
    // Get loan by ID
    getLoanById: function(id) {
        const loans = this.getLoans();
        return loans.find(loan => loan.id === id);
    },
    
    // Create new loan
    createLoan: function(loanData) {
        const loans = this.getLoans();
        loanData.id = 'LOAN-' + Math.floor(Math.random() * 10000);
        loans.push(loanData);
        this.saveLoans(loans);
        return loanData;
    },
    
    // Update loan
    updateLoan: function(id, updatedData) {
        const loans = this.getLoans();
        const index = loans.findIndex(loan => loan.id === id);
        if (index !== -1) {
            loans[index] = { ...loans[index], ...updatedData };
            this.saveLoans(loans);
            return loans[index];
        }
        return null;
    },
    
    // Get all payments
    getPayments: function() {
        return JSON.parse(localStorage.getItem('mockPayments') || '[]');
    },
    
    // Save payments
    savePayments: function(payments) {
        localStorage.setItem('mockPayments', JSON.stringify(payments));
    },
    
    // Get payments by loan ID
    getPaymentsByLoanId: function(loanId) {
        const payments = this.getPayments();
        return payments.filter(payment => payment.loanId === loanId);
    },
    
    // Create new payment
    createPayment: function(paymentData) {
        const payments = this.getPayments();
        paymentData.id = 'PMT-' + Math.floor(Math.random() * 10000);
        payments.push(paymentData);
        this.savePayments(payments);
        return paymentData;
    },
    
    // Get all customers
    getCustomers: function() {
        return JSON.parse(localStorage.getItem('mockCustomers') || '[]');
    },
    
    // Save customers
    saveCustomers: function(customers) {
        localStorage.setItem('mockCustomers', JSON.stringify(customers));
    },
    
    // Get customer by email
    getCustomerByEmail: function(email) {
        const customers = this.getCustomers();
        return customers.find(customer => customer.email === email);
    },
    
    // Create new customer
    createCustomer: function(customerData) {
        const customers = this.getCustomers();
        customerData.id = 'CUST-' + Math.floor(Math.random() * 10000);
        customers.push(customerData);
        this.saveCustomers(customers);
        return customerData;
    },
    
    // Update customer
    updateCustomer: function(id, updatedData) {
        const customers = this.getCustomers();
        const index = customers.findIndex(customer => customer.id === id);
        if (index !== -1) {
            customers[index] = { ...customers[index], ...updatedData };
            this.saveCustomers(customers);
            return customers[index];
        }
        return null;
    },
    
    // Get customer statistics
    getCustomerStatistics: function() {
        const customers = this.getCustomers();
        const loans = this.getLoans();
        
        return {
            totalCustomers: customers.length,
            activeCustomers: customers.filter(c => c.status === 'Active').length,
            inactiveCustomers: customers.filter(c => c.status !== 'Active').length,
            averageLoanAmount: this.calculateAverageLoanAmount(loans),
            topBorrowers: this.getTopBorrowers(customers, 5)
        };
    },
    
    // Calculate average loan amount
    calculateAverageLoanAmount: function(loans) {
        if (loans.length === 0) return 0;
        const totalAmount = loans.reduce((sum, loan) => sum + parseFloat(loan.loanAmount || 0), 0);
        return totalAmount / loans.length;
    },
    
    // Get top borrowers
    getTopBorrowers: function(customers, limit) {
        return customers
            .filter(c => c.totalBorrowed > 0)
            .sort((a, b) => b.totalBorrowed - a.totalBorrowed)
            .slice(0, limit);
    },
    
    // Get communications
    getCommunications: function() {
        return JSON.parse(localStorage.getItem('mockCommunications') || '[]');
    },
    
    // Save communications
    saveCommunications: function(communications) {
        localStorage.setItem('mockCommunications', JSON.stringify(communications));
    },
    
    // Create communication
    createCommunication: function(communicationData) {
        const communications = this.getCommunications();
        communicationData.id = 'COMM-' + Math.floor(Math.random() * 10000);
        communications.push(communicationData);
        this.saveCommunications(communications);
        return communicationData;
    },
    
    // Get recovery actions
    getRecoveryActions: function() {
        return JSON.parse(localStorage.getItem('mockRecoveryActions') || '[]');
    },
    
    // Create recovery action
    createRecoveryAction: function(actionData) {
        const actions = this.getRecoveryActions();
        actionData.id = 'ACT-' + Math.floor(Math.random() * 10000);
        actions.push(actionData);
        localStorage.setItem('mockRecoveryActions', JSON.stringify(actions));
        return actionData;
    },
    
    // Get agents
    getAgents: function() {
        return JSON.parse(localStorage.getItem('mockAgents') || '[]');
    }
};

// ===== FORMS HANDLING =====
function setupFormSubmissions() {
    // Loan Origination Form
    document.getElementById('loanOriginationForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const loanData = {
            customerName: document.getElementById('customerName').value,
            customerEmail: document.getElementById('customerEmail').value,
            customerPhone: document.getElementById('customerPhone').value,
            loanAmount: document.getElementById('loanAmount').value,
            loanTermMonths: document.getElementById('loanTermMonths').value,
            interestRate: document.getElementById('interestRate').value,
            loanPurpose: document.getElementById('loanPurpose').value,
            loanDetails: document.getElementById('loanDetails').value,
            submissionDate: new Date().toISOString().split('T')[0],
            status: 'Pending'
        };
        
        // Create the loan using data service
        const createdLoan = DataService.createLoan(loanData);
        
        // Check if customer exists, if not create them
        let customer = DataService.getCustomerByEmail(loanData.customerEmail);
        if (!customer) {
            customer = DataService.createCustomer({
                name: loanData.customerName,
                email: loanData.customerEmail,
                phone: loanData.customerPhone,
                activeLoans: 0,
                totalBorrowed: 0,
                status: 'Pending'
            });
        }
        
        // Refresh loans data
        loadPendingLoans();
        
        // Show success notification
        showNotification('Loan application created successfully!', 'success');
        
        // Reset form
        this.reset();
    });
    
    // Record Payment Form
    document.getElementById('recordPaymentForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const paymentData = {
            loanId: document.getElementById('paymentLoanId').value,
            customer: document.getElementById('paymentCustomer').value,
            amount: document.getElementById('paymentAmount').value,
            date: document.getElementById('paymentDate').value || new Date().toISOString().split('T')[0],
            method: document.getElementById('paymentMethod').value,
            reference: document.getElementById('paymentReference').value,
            notes: document.getElementById('paymentNotes').value
        };
        
        // Create payment using data service
        DataService.createPayment(paymentData);
        
        // Update loan data
        const loan = DataService.getLoanById(paymentData.loanId);
        if (loan) {
            // Calculate remaining balance
            const payments = DataService.getPaymentsByLoanId(loan.id);
            const totalPaid = payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
            const totalDue = calculateTotalLoanAmount(loan.loanAmount, loan.interestRate, loan.loanTermMonths);
            
            // Update loan status if fully paid
            if (totalPaid >= totalDue) {
                DataService.updateLoan(loan.id, { status: 'Completed' });
                
                // Update customer record
                const customer = DataService.getCustomerByEmail(loan.customerEmail);
                if (customer) {
                    DataService.updateCustomer(customer.id, {
                        activeLoans: Math.max(0, customer.activeLoans - 1)
                    });
                }
            }
        }
        
        // Refresh payment data
        loadPaymentHistory();
        
        // Show success notification
        showNotification('Payment recorded successfully!', 'success');
        
        // Reset form
        this.reset();
    });
    
    // Loan ID selection changes customer name
    document.getElementById('paymentLoanId')?.addEventListener('change', function() {
        const loanId = this.value;
        if (loanId) {
            const loan = DataService.getLoanById(loanId);
            if (loan) {
                document.getElementById('paymentCustomer').value = loan.customerName;
                
                // Calculate and show remaining balance
                const payments = DataService.getPaymentsByLoanId(loanId);
                const totalPaid = payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
                const totalDue = calculateTotalLoanAmount(loan.loanAmount, loan.interestRate, loan.loanTermMonths);
                const remainingBalance = totalDue - totalPaid;
                
                // Update remaining balance field if it exists
                const remainingBalanceField = document.getElementById('remainingBalance');
                if (remainingBalanceField) {
                    remainingBalanceField.value = `₦${remainingBalance.toLocaleString()}`;
                }
            }
        } else {
            document.getElementById('paymentCustomer').value = '';
            
            // Clear remaining balance field if it exists
            const remainingBalanceField = document.getElementById('remainingBalance');
            if (remainingBalanceField) {
                remainingBalanceField.value = '';
            }
        }
    });
}

// Calculate total loan amount including interest
function calculateTotalLoanAmount(principal, rate, term) {
    const monthlyPayment = calculateMonthlyPayment(principal, rate, term);
    return monthlyPayment * term;
}

// ===== FILTER ACTIONS =====
function setupFilterActions() {
    // Repayment schedule filters
    document.getElementById('applyRepaymentFilter')?.addEventListener('click', function() {
        const customer = document.getElementById('repaymentCustomerFilter').value;
        const month = document.getElementById('repaymentDateFilter').value;
        
        filterRepaymentSchedule(customer, month);
    });
    
    // Payment history filters
    document.getElementById('applyPaymentHistoryFilter')?.addEventListener('click', function() {
        const customer = document.getElementById('paymentHistoryCustomerFilter').value;
        const startDate = document.getElementById('paymentHistoryStartDate').value;
        const endDate = document.getElementById('paymentHistoryEndDate').value;
        
        filterPaymentHistory(customer, startDate, endDate);
    });
    
    // Overdue accounts filter
    document.getElementById('applyOverdueFilter')?.addEventListener('click', function() {
        const overdueRange = document.getElementById('overdueFilter').value;
        
        filterOverdueAccounts(overdueRange);
    });
    
    // Communication logs filter
    document.getElementById('applyCommunicationFilter')?.addEventListener('click', function() {
        const customer = document.getElementById('communicationCustomerFilter').value;
        const type = document.getElementById('communicationType').value;
        
        filterCommunicationLogs(customer, type);
    });
    
    // Reset filter buttons
    document.querySelectorAll('.reset-filter').forEach(button => {
        button.addEventListener('click', function() {
            const filterId = this.getAttribute('data-filter');
            resetFilter(filterId);
        });
    });
}

function resetFilter(filterId) {
    switch(filterId) {
        case 'repayment':
            document.getElementById('repaymentCustomerFilter').value = '';
            document.getElementById('repaymentDateFilter').value = '';
            loadRepaymentSchedule();
            break;
        case 'payment':
            document.getElementById('paymentHistoryCustomerFilter').value = '';
            document.getElementById('paymentHistoryStartDate').value = '';
            document.getElementById('paymentHistoryEndDate').value = '';
            loadPaymentHistory();
            break;
        case 'overdue':
            document.getElementById('overdueFilter').value = '';
            loadOverdueAccounts();
            break;
        case 'communication':
            document.getElementById('communicationCustomerFilter').value = '';
            document.getElementById('communicationType').value = '';
            loadCommunicationLogs();
            break;
    }
}

// Filter implementation for payment history
function filterPaymentHistory(customer, startDate, endDate) {
    const payments = DataService.getPayments();
    let filtered = [...payments];
    
    if (customer) {
        filtered = filtered.filter(payment => 
            payment.customer.toLowerCase().includes(customer.toLowerCase())
        );
    }
    
    if (startDate) {
        filtered = filtered.filter(payment => 
            new Date(payment.date) >= new Date(startDate)
        );
    }
    
    if (endDate) {
        filtered = filtered.filter(payment => 
            new Date(payment.date) <= new Date(endDate)
        );
    }
    
    displayPaymentHistory(filtered);
}

// ===== ACTION BUTTONS =====
function setupActionButtons() {
    // Add customer button
    document.getElementById('addCustomer')?.addEventListener('click', function() {
        showCustomerModal();
    });
    
    // Log communication button
    document.getElementById('logCommunication')?.addEventListener('click', function() {
        showCommunicationModal();
    });
    
    // Add recovery action button
    document.getElementById('addRecoveryAction')?.addEventListener('click', function() {
        showRecoveryActionModal();
    });
    
    // Add recovery agent button
    document.getElementById('addRecoveryAgent')?.addEventListener('click', function() {
        showRecoveryAgentModal();
    });
    
    // Generate loan performance report
    document.getElementById('generateLoanPerformance')?.addEventListener('click', function() {
        const period = document.getElementById('loanPerformancePeriod').value;
        generateLoanPerformanceReport(period);
    });
    
    // Export data buttons
    document.querySelectorAll('.export-data').forEach(button => {
        button.addEventListener('click', function() {
            const dataType = this.getAttribute('data-type');
            exportData(dataType);
        });
    });
}

// Function to export data
function exportData(dataType) {
    let data;
    let filename;
    
    switch(dataType) {
        case 'loans':
            data = DataService.getLoans();
            filename = 'loans_export.json';
            break;
        case 'payments':
            data = DataService.getPayments();
            filename = 'payments_export.json';
            break;
        case 'customers':
            data = DataService.getCustomers();
            filename = 'customers_export.json';
            break;
        case 'communications':
            data = DataService.getCommunications();
            filename = 'communications_export.json';
            break;
        case 'recoveryActions':
            data = DataService.getRecoveryActions();
            filename = 'recovery_actions_export.json';
            break;
    }
    
    if (data) {
        const dataStr = JSON.stringify(data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportLink = document.createElement('a');
        exportLink.setAttribute('href', dataUri);
        exportLink.setAttribute('download', filename);
        exportLink.click();
        
        showNotification(`${dataType} exported successfully`, 'success');
    }
}

// ===== CHARTS INITIALIZATION =====
function initializeCharts() {
    // Dashboard charts
    initializeLoanDistributionChart();
    initializeMonthlyRepaymentsChart();
    
    // Reporting charts
    initializeLoanStatusChart();
    initializeLoanPurposeChart();
    initializeDelinquencyRateChart();
    initializeCustomerAcquisitionChart();
}

function initializeLoanDistributionChart() {
    const ctx = document.getElementById('loanDistributionChart');
    
    if (!ctx) return;
    
    // Get real data from data service
    const loans = DataService.getLoans();
    const loanPurposes = {};
    
    // Count loans by purpose
    loans.forEach(loan => {
        if (loan.loanPurpose) {
            loanPurposes[loan.loanPurpose] = (loanPurposes[loan.loanPurpose] || 0) + 1;
        }
    });
    
    // Prepare chart data
    const labels = Object.keys(loanPurposes);
    const data = Object.values(loanPurposes);
    
    // Create color arrays
    const baseColor = [0, 128, 132];
    const backgroundColor = labels.map((_, i) => {
        const shade = 168 - (i * 20);
        return `rgba(0, ${shade}, 132, 0.8)`;
    });
    
    const borderColor = labels.map((_, i) => {
        const shade = 168 - (i * 20);
        return `rgba(0, ${shade}, 132, 1)`;
    });
    
    const chartData = {
        labels: labels,
        datasets: [{
            label: 'Loan Distribution',
            data: data,
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            borderWidth: 1
        }]
    };
    
    // Check if chart already exists and destroy it
    if (window.loanDistributionChart) {
        window.loanDistributionChart.destroy();
    }
    
    // Create new chart
    window.loanDistributionChart = new Chart(ctx, {
        type: 'pie',
        data: chartData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

function initializeMonthlyRepaymentsChart() {
    const ctx = document.getElementById('monthlyRepaymentsChart');
    
    if (!ctx) return;
    
    // Get real data from data service
    const loans = DataService.getLoansByStatus('Active');
    const payments = DataService.getPayments();
    
    // Get unique months from the last 6 months
    const months = [];
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
        const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthStr = month.toLocaleString('default', { month: 'short' });
        months.push(monthStr);
    }
    
    // Calculate expected and actual repayments
    const expectedData = [];
    const actualData = [];
    
    months.forEach((month, i) => {
        // Calculate expected repayments for this month
        const expectedTotal = loans.reduce((total, loan) => {
            const monthlyPayment = calculateMonthlyPayment(
                loan.loanAmount, 
                loan.interestRate, 
                loan.loanTermMonths
            );
            return total + monthlyPayment;
        }, 0);
        
        expectedData.push(expectedTotal);
        
        // Calculate actual repayments for this month
        const monthDate = new Date(today.getFullYear(), today.getMonth() - (5 - i), 1);
        const nextMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
        
        const monthPayments = payments.filter(payment => {
            const paymentDate = new Date(payment.date);
            return paymentDate >= monthDate && paymentDate <= nextMonth;
        });
        
        const actualTotal = monthPayments.reduce((total, payment) => {
            return total + parseFloat(payment.amount || 0);
        }, 0);
        
        actualData.push(actualTotal);
    });
    
    const data = {
        labels: months,
        datasets: [{
            label: 'Expected',
            data: expectedData,
            borderColor: 'rgba(0, 168, 132, 1)',
            backgroundColor: 'rgba(0, 168, 132, 0.1)',
            borderWidth: 2,
            fill: true
        },
        {
            label: 'Actual',
            data: actualData,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.1)',
            borderWidth: 2,
            fill: true
        }]
    };
    
    // Check if chart already exists and destroy it
    if (window.monthlyRepaymentsChart) {
        window.monthlyRepaymentsChart.destroy();
    }
    
    // Create new chart
    window.monthlyRepaymentsChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const value = context.raw || 0;
                            return `${label}: ₦${value.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₦' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

function initializeDelinquencyRateChart() {
    const ctx = document.getElementById('delinquencyRateChart');
    
    if (!ctx) return;
    
    // Get real data
    const loans = DataService.getLoans();
    const activeLoans = loans.filter(loan => loan.status === 'Active');
    
    // Calculate delinquency rates by month
    const months = [];
    const delinquencyRates = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
        const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthStr = month.toLocaleString('default', { month: 'short' });
        months.push(monthStr);
        
        // Calculate delinquency for this month (simplified for demo)
        // In a real app, you would compare due dates with payment dates
        const delinquencyRate = Math.max(5, Math.min(25, Math.random() * 20 + 5)).toFixed(1);
        delinquencyRates.push(delinquencyRate);
    }
    
    const data = {
        labels: months,
        datasets: [{
            label: 'Delinquency Rate (%)',
            data: delinquencyRates,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            borderWidth: 2,
            fill: true
        }]
    };
    
    new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 30,
                    title: {
                        display: true,
                        text: 'Delinquency Rate (%)'
                    }
                }
            }
        }
    });
}

function initializeCustomerAcquisitionChart() {
    const ctx = document.getElementById('customerAcquisitionChart');
    
    if (!ctx) return;
    
    // Get real data
    const customers = DataService.getCustomers();
    
    // Calculate customer acquisition by month (simplified for demo)
    const months = [];
    const acquisitionCounts = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
        const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthStr = month.toLocaleString('default', { month: 'short' });
        months.push(monthStr);
        
        // In a real app, you would calculate based on customer registration dates
        const count = Math.floor(Math.random() * 50 + 20);
        acquisitionCounts.push(count);
    }
    
    const data = {
        labels: months,
        datasets: [{
            label: 'New Customers',
            data: acquisitionCounts,
            backgroundColor: 'rgba(54, 162, 235, 0.8)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    };
    new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of New Customers'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `New Customers: ${context.raw}`;
                        }
                    }
                }
            }
        }
    });
    }
    
    function initializeLoanStatusChart() {
        const ctx = document.getElementById('loanStatusChart');
        
        if (!ctx) return;
        
        // Get actual loan status data
        const loans = DataService.getLoans();
        const statusCounts = {};
        
        // Count loans by status
        loans.forEach(loan => {
            statusCounts[loan.status] = (statusCounts[loan.status] || 0) + 1;
        });
        
        // Prepare chart data
        const labels = Object.keys(statusCounts);
        const data = Object.values(statusCounts);
        
        // Define status colors
        const statusColors = {
            'Pending': 'rgba(255, 206, 86, 0.8)',
            'Active': 'rgba(75, 192, 192, 0.8)',
            'Overdue': 'rgba(255, 99, 132, 0.8)',
            'Completed': 'rgba(54, 162, 235, 0.8)',
            'Cancelled': 'rgba(153, 102, 255, 0.8)',
            'Default': 'rgba(255, 159, 64, 0.8)'
        };
        
        // Create background color array based on status
        const backgroundColor = labels.map(status => statusColors[status] || 'rgba(201, 203, 207, 0.8)');
        
        const chartData = {
            labels: labels,
            datasets: [{
                label: 'Loans by Status',
                data: data,
                backgroundColor: backgroundColor,
                borderColor: backgroundColor.map(color => color.replace('0.8', '1')),
                borderWidth: 1
            }]
        };
        
        // Check if chart already exists and destroy it
        if (window.loanStatusChart) {
            window.loanStatusChart.destroy();
        }
        
        // Create new chart
        window.loanStatusChart = new Chart(ctx, {
            type: 'doughnut',
            data: chartData,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    function initializeLoanPurposeChart() {
        const ctx = document.getElementById('loanPurposeChart');
        
        if (!ctx) return;
        
        // Get actual loan purpose data
        const loans = DataService.getLoans();
        const purposeAmounts = {};
        
        // Sum loan amounts by purpose
        loans.forEach(loan => {
            if (loan.loanPurpose && loan.loanAmount) {
                const amount = parseFloat(loan.loanAmount) || 0;
                purposeAmounts[loan.loanPurpose] = (purposeAmounts[loan.loanPurpose] || 0) + amount;
            }
        });
        
        // Prepare chart data
        const labels = Object.keys(purposeAmounts);
        const data = Object.values(purposeAmounts);
        
        // Generate colors based on purpose count
        const generateColors = (count) => {
            const colors = [];
            for (let i = 0; i < count; i++) {
                const hue = (i * 137.5) % 360; // Use golden angle approximation for distribution
                colors.push(`hsla(${hue}, 70%, 60%, 0.8)`);
            }
            return colors;
        };
        
        const backgroundColors = generateColors(labels.length);
        
        const chartData = {
            labels: labels,
            datasets: [{
                label: 'Total Amount by Purpose',
                data: data,
                backgroundColor: backgroundColors,
                borderColor: backgroundColors.map(color => color.replace('0.8', '1')),
                borderWidth: 1
            }]
        };
        
        // Check if chart already exists and destroy it
        if (window.loanPurposeChart) {
            window.loanPurposeChart.destroy();
        }
        
        // Create new chart
        window.loanPurposeChart = new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: {
                indexAxis: 'y',
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.raw || 0;
                                return `₦${value.toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₦' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }
    
    // ===== DATA LOADING FUNCTIONS =====
    function loadMockData() {
        // Check if data already exists in localStorage
        if (!localStorage.getItem('mockLoans')) {
            // Generate mock loans
            const mockLoans = generateMockLoans(50);
            localStorage.setItem('mockLoans', JSON.stringify(mockLoans));
            
            // Generate mock customers based on loans
            const mockCustomers = generateMockCustomers(mockLoans);
            localStorage.setItem('mockCustomers', JSON.stringify(mockCustomers));
            
            // Generate mock payments based on loans
            const mockPayments = generateMockPayments(mockLoans);
            localStorage.setItem('mockPayments', JSON.stringify(mockPayments));
            
            // Generate mock communications
            const mockCommunications = generateMockCommunications(mockLoans);
            localStorage.setItem('mockCommunications', JSON.stringify(mockCommunications));
            
            // Generate mock recovery actions
            const mockRecoveryActions = generateMockRecoveryActions(mockLoans);
            localStorage.setItem('mockRecoveryActions', JSON.stringify(mockRecoveryActions));
            
            // Generate mock agents
            const mockAgents = generateMockAgents();
            localStorage.setItem('mockAgents', JSON.stringify(mockAgents));
        }
        
        // Populate dropdowns and other UI elements with data
        populateUIWithData();
    }
    
    // Function to generate mock loans
    function generateMockLoans(count) {
        const loans = [];
        const loanPurposes = ['Business', 'Education', 'Medical', 'Home Improvement', 'Personal', 'Debt Consolidation'];
        const statusOptions = ['Pending', 'Active', 'Overdue', 'Completed', 'Cancelled', 'Default'];
        
        // Weighted status distribution
        const statusWeights = [0.1, 0.4, 0.2, 0.2, 0.05, 0.05]; // Probabilities that sum to 1
        
        for (let i = 0; i < count; i++) {
            // Generate a random date within the last year
            const submissionDate = new Date();
            submissionDate.setDate(submissionDate.getDate() - Math.floor(Math.random() * 365));
            
            // Generate random loan amount between 50,000 and 5,000,000
            const loanAmount = Math.floor((Math.random() * 4950000) + 50000);
            
            // Generate random term between 3 and 36 months
            const loanTermMonths = Math.floor((Math.random() * 34) + 3);
            
            // Generate random interest rate between 5% and 25%
            const interestRate = (Math.random() * 20 + 5).toFixed(2);
            
            // Select random loan purpose
            const loanPurpose = loanPurposes[Math.floor(Math.random() * loanPurposes.length)];
            
            // Generate random name
            const firstNames = ['John', 'Mary', 'David', 'Sarah', 'Michael', 'Jennifer', 'Robert', 'Linda', 'William', 'Elizabeth', 'Chioma', 'Emeka', 'Ngozi', 'Oluwaseun', 'Chinedu'];
            const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Okonkwo', 'Adeyemi', 'Okafor', 'Nwachukwu', 'Eze'];
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const customerName = `${firstName} ${lastName}`;
            
            // Generate random email
            const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 1000)}@example.com`;
            
            // Generate random phone number
            const phone = `080${Math.floor(Math.random() * 10000000).toString().padStart(8, '0')}`;
            
            // Select random status based on weighted distribution
            let status;
            const rand = Math.random();
            let cumulative = 0;
            for (let j = 0; j < statusOptions.length; j++) {
                cumulative += statusWeights[j];
                if (rand < cumulative) {
                    status = statusOptions[j];
                    break;
                }
            }
            
            loans.push({
                id: `LOAN-${i + 1000}`,
                customerName: customerName,
                customerEmail: email,
                customerPhone: phone,
                loanAmount: loanAmount,
                loanTermMonths: loanTermMonths,
                interestRate: interestRate,
                loanPurpose: loanPurpose,
                loanDetails: `Loan for ${loanPurpose.toLowerCase()} purposes.`,
                submissionDate: submissionDate.toISOString().split('T')[0],
                status: status
            });
        }
        
        return loans;
    }
    
    // Function to generate mock customers based on loans
    function generateMockCustomers(loans) {
        const customerMap = {};
        
        // Extract unique customers from loans
        loans.forEach(loan => {
            if (!customerMap[loan.customerEmail]) {
                customerMap[loan.customerEmail] = {
                    id: `CUST-${Object.keys(customerMap).length + 1000}`,
                    name: loan.customerName,
                    email: loan.customerEmail,
                    phone: loan.customerPhone,
                    activeLoans: 0,
                    totalBorrowed: 0,
                    status: 'Active',
                    registrationDate: loan.submissionDate
                };
            }
            
            // Count active loans and total borrowed
            if (loan.status === 'Active' || loan.status === 'Overdue') {
                customerMap[loan.customerEmail].activeLoans++;
            }
            customerMap[loan.customerEmail].totalBorrowed += parseFloat(loan.loanAmount);
        });
        
        return Object.values(customerMap);
    }
    
    // Function to generate mock payments based on loans
    function generateMockPayments(loans) {
        const payments = [];
        const paymentMethods = ['Bank Transfer', 'Debit Card', 'Cash', 'Mobile Money'];
        
        loans.forEach(loan => {
            // Only generate payments for active, overdue or completed loans
            if (['Active', 'Overdue', 'Completed'].includes(loan.status)) {
                const loanAmount = parseFloat(loan.loanAmount);
                const interestRate = parseFloat(loan.interestRate);
                const termMonths = parseInt(loan.loanTermMonths);
                
                // Calculate monthly payment
                const monthlyPayment = calculateMonthlyPayment(loanAmount, interestRate, termMonths);
                
                // Determine how many months have passed since loan was issued
                const submissionDate = new Date(loan.submissionDate);
                const currentDate = new Date();
                let monthsPassed = (currentDate.getFullYear() - submissionDate.getFullYear()) * 12 + 
                                  (currentDate.getMonth() - submissionDate.getMonth());
                
                // Cap at term length for completed loans
                if (loan.status === 'Completed') {
                    monthsPassed = termMonths;
                } else {
                    // For active/overdue loans, cap at term or actual months passed
                    monthsPassed = Math.min(monthsPassed, termMonths);
                }
                
                // Generate payments for each month
                for (let i = 0; i < monthsPassed; i++) {
                    // For overdue loans, skip some recent payments
                    if (loan.status === 'Overdue' && i >= monthsPassed - 2) {
                        // 80% chance to skip payment for overdue loans
                        if (Math.random() < 0.8) continue;
                    }
                    
                    // Calculate payment date
                    const paymentDate = new Date(submissionDate);
                    paymentDate.setMonth(submissionDate.getMonth() + i + 1);
                    
                    // Add some randomness to payment amounts (±5%) for realism
                    const actualPayment = monthlyPayment * (0.95 + Math.random() * 0.1);
                    
                    // Random payment method
                    const method = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
                    
                    payments.push({
                        id: `PMT-${payments.length + 1000}`,
                        loanId: loan.id,
                        customer: loan.customerName,
                        amount: actualPayment.toFixed(2),
                        date: paymentDate.toISOString().split('T')[0],
                        method: method,
                        reference: `REF-${Math.floor(Math.random() * 1000000)}`,
                        notes: ''
                    });
                }
            }
        });
        
        return payments;
    }
    
    // Calculate monthly payment using amortization formula
    function calculateMonthlyPayment(principal, annualRate, termMonths) {
        // Convert annual rate to monthly rate as decimal
        const monthlyRate = (annualRate / 100) / 12;
        
        // Calculate monthly payment
        if (monthlyRate === 0) {
            return principal / termMonths;
        } else {
            return (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                   (Math.pow(1 + monthlyRate, termMonths) - 1);
        }
    }
    
    // Function to generate mock communications
    function generateMockCommunications(loans) {
        const communications = [];
        const communicationTypes = ['Email', 'Phone', 'SMS', 'In-Person'];
        const communicationSubjects = [
            'Payment Reminder', 
            'Late Payment Notice', 
            'Loan Approval', 
            'Application Update', 
            'Account Statement', 
            'Restructuring Option'
        ];
        
        // Generate more communications for overdue loans
        const overdueLoans = loans.filter(loan => loan.status === 'Overdue');
        
        // Generate regular communications for all loans
        loans.forEach(loan => {
            // Generate 1-3 communications per loan
            const numCommunications = Math.floor(Math.random() * 3) + 1;
            
            for (let i = 0; i < numCommunications; i++) {
                // Calculate communication date
                const loanDate = new Date(loan.submissionDate);
                const commDate = new Date(loanDate);
                commDate.setDate(loanDate.getDate() + Math.floor(Math.random() * 90));
                
                // Random type and subject
                const type = communicationTypes[Math.floor(Math.random() * communicationTypes.length)];
                const subject = communicationSubjects[Math.floor(Math.random() * communicationSubjects.length)];
                
                // Generate content based on subject
                let content = '';
                switch (subject) {
                    case 'Payment Reminder':
                        content = `Reminder that your loan payment of ₦${calculateMonthlyPayment(loan.loanAmount, loan.interestRate, loan.loanTermMonths).toFixed(2)} is due on the 5th of next month.`;
                        break;
                    case 'Late Payment Notice':
                        content = `Your payment of ₦${calculateMonthlyPayment(loan.loanAmount, loan.interestRate, loan.loanTermMonths).toFixed(2)} is overdue. Please make payment as soon as possible to avoid additional fees.`;
                        break;
                    case 'Loan Approval':
                        content = `Your loan application for ₦${parseFloat(loan.loanAmount).toLocaleString()} has been approved.`;
                        break;
                    default:
                        content = `Communication regarding your loan (ID: ${loan.id}).`;
                }
                
                communications.push({
                    id: `COMM-${communications.length + 1000}`,
                    loanId: loan.id,
                    customerName: loan.customerName,
                    type: type,
                    date: commDate.toISOString().split('T')[0],
                    subject: subject,
                    content: content,
                    status: 'Sent',
                    responseRequired: Math.random() < 0.3 // 30% chance to require response
                });
            }
        });
        
        // Generate additional communications for overdue loans
        overdueLoans.forEach(loan => {
            // Generate 2-5 additional communications for overdue loans
            const numCommunications = Math.floor(Math.random() * 4) + 2;
            
            for (let i = 0; i < numCommunications; i++) {
                // Calculate communication date - more recent for overdue loans
                const loanDate = new Date(loan.submissionDate);
                const commDate = new Date();
                commDate.setDate(commDate.getDate() - Math.floor(Math.random() * 30));
                
                // For overdue loans, focus on payment reminders and notices
                const type = communicationTypes[Math.floor(Math.random() * communicationTypes.length)];
                const subject = Math.random() < 0.7 ? 
                            (Math.random() < 0.5 ? 'Payment Reminder' : 'Late Payment Notice') : 
                            'Restructuring Option';
                
                let content = '';
                switch (subject) {
                    case 'Payment Reminder':
                        content = `URGENT: Your loan payment of ₦${calculateMonthlyPayment(loan.loanAmount, loan.interestRate, loan.loanTermMonths).toFixed(2)} is overdue. Please contact us immediately.`;
                        break;
                    case 'Late Payment Notice':
                        content = `FINAL NOTICE: Your payment of ₦${calculateMonthlyPayment(loan.loanAmount, loan.interestRate, loan.loanTermMonths).toFixed(2)} is seriously overdue. Please make payment within 48 hours to avoid further action.`;
                        break;
                    case 'Restructuring Option':
                        content = `We understand you may be facing difficulties. Please contact us to discuss restructuring options for your loan.`;
                        break;
                }
                
                communications.push({
                    id: `COMM-${communications.length + 1000}`,
                    loanId: loan.id,
                    customerName: loan.customerName,
                    type: type,
                    date: commDate.toISOString().split('T')[0],
                    subject: subject,
                    content: content,
                    status: 'Sent',
                    responseRequired: true
                });
            }
        });
        
        return communications;
    }
    
    // Function to generate mock recovery actions
    function generateMockRecoveryActions(loans) {
        const actions = [];
        const actionTypes = ['Call', 'Final Notice', 'Visit', 'Legal Action', 'Restructure'];
        
        // Only generate recovery actions for overdue and default loans
        const problematicLoans = loans.filter(loan => 
            loan.status === 'Overdue' || loan.status === 'Default'
        );
        
        problematicLoans.forEach(loan => {
            // Generate 1-4 recovery actions per problematic loan
            const numActions = Math.floor(Math.random() * 4) + 1;
            
            for (let i = 0; i < numActions; i++) {
                // Calculate action date
                const loanDate = new Date(loan.submissionDate);
                const actionDate = new Date();
                actionDate.setDate(actionDate.getDate() - Math.floor(Math.random() * 30));
                
                // Action type based on severity
                let actionType;
                if (loan.status === 'Default') {
                    // Higher chance of severe actions for defaulted loans
                    const severeActionIndex = Math.floor(Math.random() * 5);
                    actionType = actionTypes[severeActionIndex];
                } else {
                    // Milder actions for just overdue loans
                    const mildActionIndex = Math.floor(Math.random() * 3);
                    actionType = actionTypes[mildActionIndex];
                }
                
                // Assign a random agent
                const agentId = `AGENT-${1000 + Math.floor(Math.random() * 5)}`;
                
                // Generate action details based on type
                let details = '';
                let status = '';
                
                switch (actionType) {
                    case 'Call':
                        details = `Phone call to remind customer about overdue payment of ₦${calculateMonthlyPayment(loan.loanAmount, loan.interestRate, loan.loanTermMonths).toFixed(2)}.`;
                        status = Math.random() < 0.7 ? 'Completed' : 'Pending';
                        break;
                    case 'Final Notice':
                        details = `Final written notice sent to customer regarding loan ${loan.id} with total outstanding amount of ₦${parseFloat(loan.loanAmount).toLocaleString()}.`;
                        status = Math.random() < 0.8 ? 'Completed' : 'Pending';
                        break;
                    case 'Visit':
                        details = `Personal visit to customer's address to discuss repayment options.`;
                        status = Math.random() < 0.5 ? 'Completed' : 'Scheduled';
                        break;
                    case 'Legal Action':
                        details = `Initiate legal proceedings for loan recovery.`;
                        status = Math.random() < 0.3 ? 'In Progress' : 'Pending Approval';
                        break;
                    case 'Restructure':
                        details = `Offer loan restructuring with extended term of ${loan.loanTermMonths + 6} months.`;
                        status = Math.random() < 0.6 ? 'Offered' : 'Customer Considering';
                        break;
                }
                
                actions.push({
                    id: `ACT-${actions.length + 1000}`,
                    loanId: loan.id,
                    customerName: loan.customerName,
                    type: actionType,
                    date: actionDate.toISOString().split('T')[0],
                    agentId: agentId,
                    details: details,
                    status: status,
                    result: status === 'Completed' ? (Math.random() < 0.5 ? 'Successful' : 'No Response') : ''
                });
            }
        });
        
        return actions;
    }
    
    // Function to generate mock agents
    function generateMockAgents() {
        const agents = [
            {
                id: 'AGENT-1000',
                name: 'James Wilson',
                email: 'james.wilson@example.com',
                phone: '08012345678',
                role: 'Senior Recovery Agent',
                activeCases: 12,
                successRate: '78%'
            },
            {
                id: 'AGENT-1001',
                name: 'Sarah Johnson',
                email: 'sarah.johnson@example.com',
                phone: '08087654321',
                role: 'Recovery Agent',
                activeCases: 8,
                successRate: '65%'
            },
            {
                id: 'AGENT-1002',
                name: 'Emeka Okafor',
                email: 'emeka.okafor@example.com',
                phone: '08023456789',
                role: 'Field Agent',
                activeCases: 15,
                successRate: '82%'
            },
            {
                id: 'AGENT-1003',
                name: 'Chioma Nwachukwu',
                email: 'chioma.nwachukwu@example.com',
                phone: '08056781234',
                role: 'Recovery Specialist',
                activeCases: 10,
                successRate: '73%'
            },
            {
                id: 'AGENT-1004',
                name: 'Daniel Adeyemi',
                email: 'daniel.adeyemi@example.com',
                phone: '08098765432',
                role: 'Legal Recovery Agent',
                activeCases: 6,
                successRate: '70%'
            }
        ];
        
        return agents;
    }
    
    // Function to populate UI elements with data
    function populateUIWithData() {
        // Populate loan select boxes
        populateLoanDropdowns();
        
        // Populate customer select boxes
        populateCustomerDropdowns();
        
        // Update KPI metrics
        updateKPIMetrics();
        
        // Load data for active section
        const activeSection = document.querySelector('.content-section.active');
        if (activeSection) {
            refreshSectionData(activeSection.id);
        }
    }