// Main admin dashboard JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeModals();
    loadMockData();
    initializeCharts();
    initializeEventListeners();
});

// Tab functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabGroup = this.parentElement;
            const tabContents = tabGroup.parentElement.querySelectorAll('.tab-content');
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all buttons in this group
            tabGroup.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Hide all tab contents in this section
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding tab content
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Modal functionality
function initializeModals() {
    const modalContainer = document.getElementById('modal-container');
    const closeButtons = document.querySelectorAll('.close-btn');
    
    // Close modal when clicking close button
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            modalContainer.style.display = 'none';
        });
    });
    
    // Close modal when clicking outside the modal
    modalContainer.addEventListener('click', function(e) {
        if (e.target === modalContainer) {
            modalContainer.style.display = 'none';
        }
    });
}

// Show a modal with dynamic content
function showModal(title, content, buttons) {
    const modalContainer = document.getElementById('modal-container');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalFooter = document.getElementById('modal-footer');
    
    modalTitle.textContent = title;
    modalBody.innerHTML = content;
    
    // Clear previous buttons
    modalFooter.innerHTML = '';
    
    // Add new buttons
    if (buttons && buttons.length) {
        buttons.forEach(button => {
            const btn = document.createElement('button');
            btn.className = `btn ${button.class || 'btn-secondary'}`;
            btn.textContent = button.text;
            
            if (button.action) {
                btn.addEventListener('click', button.action);
            }
            
            modalFooter.appendChild(btn);
        });
    }
    
    modalContainer.style.display = 'flex';
}

// Initialize charts
function initializeCharts() {
    // Loan overview charts
    if (document.getElementById('loanDistributionChart')) {
        new Chart(document.getElementById('loanDistributionChart'), {
            type: 'doughnut',
            data: {
                labels: ['Active', 'Completed', 'Overdue', 'Default'],
                datasets: [{
                    data: [65, 20, 10, 5],
                    backgroundColor: ['#00A884', '#34D399', '#FBBF24', '#F87171']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    if (document.getElementById('monthlyLoanTrendsChart')) {
        new Chart(document.getElementById('monthlyLoanTrendsChart'), {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Loan Amount (₦)',
                    data: [2500000, 3100000, 2800000, 3500000, 3800000, 4200000],
                    borderColor: '#00A884',
                    backgroundColor: 'rgba(0, 168, 132, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top'
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
    
    // Repayment trends charts
    if (document.getElementById('monthlyRepaymentsReportChart')) {
        new Chart(document.getElementById('monthlyRepaymentsReportChart'), {
            type: 'bar',
            data: {
                labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
                datasets: [{
                    label: 'Expected',
                    data: [1800000, 1950000, 2100000, 2300000, 2400000, 2600000],
                    backgroundColor: 'rgba(0, 168, 132, 0.3)',
                    borderColor: '#00A884',
                    borderWidth: 1
                }, {
                    label: 'Actual',
                    data: [1750000, 1850000, 2050000, 2200000, 2350000, 2500000],
                    backgroundColor: 'rgba(0, 168, 132, 0.8)',
                    borderColor: '#008064',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top'
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
    
    if (document.getElementById('paymentTimingChart')) {
        new Chart(document.getElementById('paymentTimingChart'), {
            type: 'pie',
            data: {
                labels: ['On-time', '1-7 Days Late', '8-30 Days Late', '30+ Days Late'],
                datasets: [{
                    data: [75, 15, 7, 3],
                    backgroundColor: ['#00A884', '#34D399', '#FBBF24', '#F87171']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    // Recovery metrics charts
    if (document.getElementById('agentPerformanceChart')) {
        new Chart(document.getElementById('agentPerformanceChart'), {
            type: 'bar',
            data: {
                labels: ['Adebayo T.', 'Chioma N.', 'Daniel O.', 'Fatima M.', 'Gabriel E.'],
                datasets: [{
                    label: 'Recovery Rate (%)',
                    data: [78, 85, 65, 92, 71],
                    backgroundColor: 'rgba(0, 168, 132, 0.7)',
                    borderColor: '#008064',
                    borderWidth: 1
                }, {
                    label: 'Amount Recovered (₦ Millions)',
                    data: [5.2, 6.8, 3.9, 7.5, 4.6],
                    backgroundColor: 'rgba(0, 168, 132, 0.3)',
                    borderColor: '#00A884',
                    borderWidth: 1,
                    yAxisID: 'y1'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Recovery Rate (%)'
                        },
                        max: 100
                    },
                    y1: {
                        beginAtZero: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Amount (₦ Millions)'
                        },
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                }
            }
        });
    }
    
    if (document.getElementById('actionTypeChart')) {
        new Chart(document.getElementById('actionTypeChart'), {
            type: 'doughnut',
            data: {
                labels: ['SMS', 'Phone Call', 'Email', 'In-Person', 'Legal'],
                datasets: [{
                    data: [35, 30, 20, 10, 5],
                    backgroundColor: [
                        '#00A884', 
                        '#34D399', 
                        '#60A5FA', 
                        '#A78BFA', 
                        '#F87171'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    // Customer analysis charts
    if (document.getElementById('customerSegmentChart')) {
        new Chart(document.getElementById('customerSegmentChart'), {
            type: 'pie',
            data: {
                labels: ['New (1st loan)', 'Regular (2-5 loans)', 'Loyal (6+ loans)'],
                datasets: [{
                    data: [30, 45, 25],
                    backgroundColor: ['#60A5FA', '#00A884', '#34D399']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    if (document.getElementById('segmentPurposeChart')) {
        new Chart(document.getElementById('segmentPurposeChart'), {
            type: 'bar',
            data: {
                labels: ['Business', 'Education', 'Medical', 'Home Improvement', 'Personal'],
                datasets: [{
                    label: 'New Customers',
                    data: [15, 30, 25, 20, 10],
                    backgroundColor: 'rgba(96, 165, 250, 0.7)',
                }, {
                    label: 'Regular Customers',
                    data: [30, 20, 15, 25, 10],
                    backgroundColor: 'rgba(0, 168, 132, 0.7)',
                }, {
                    label: 'Loyal Customers',
                    data: [40, 10, 10, 30, 10],
                    backgroundColor: 'rgba(52, 211, 153, 0.7)',
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Percentage (%)'
                        }
                    }
                }
            }
        });
    }
    
    if (document.getElementById('customerLTVChart')) {
        new Chart(document.getElementById('customerLTVChart'), {
            type: 'line',
            data: {
                labels: ['1st', '2nd', '3rd', '4th', '5th', '6th+'],
                datasets: [{
                    label: 'Average Loan Amount',
                    data: [50000, 75000, 100000, 125000, 150000, 200000],
                    borderColor: '#00A884',
                    backgroundColor: 'transparent',
                    tension: 0.4
                }, {
                    label: 'Average Profit',
                    data: [5000, 10000, 18000, 25000, 35000, 50000],
                    borderColor: '#34D399',
                    backgroundColor: 'transparent',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top'
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
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Loan Number'
                        }
                    }
                }
            }
        });
    }
    
    // Risk management charts
    if (document.getElementById('riskDistributionChart')) {
        new Chart(document.getElementById('riskDistributionChart'), {
            type: 'bar',
            data: {
                labels: ['Very Low', 'Low', 'Medium', 'High', 'Very High'],
                datasets: [{
                    label: 'Risk Distribution',
                    data: [20, 35, 30, 10, 5],
                    backgroundColor: [
                        '#34D399', 
                        '#00A884',
                        '#FBBF24',
                        '#FB923C',
                        '#F87171'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Percentage (%)'
                        }
                    }
                }
            }
        });
    }
    
    if (document.getElementById('riskTrendChart')) {
        new Chart(document.getElementById('riskTrendChart'), {
            type: 'line',
            data: {
                labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
                datasets: [{
                    label: 'NPL Ratio',
                    data: [3.8, 4.1, 3.9, 4.2, 4.3, 4.2],
                    borderColor: '#FB923C',
                    backgroundColor: 'transparent',
                    tension: 0.4,
                    yAxisID: 'y'
                }, {
                    label: 'Default Rate',
                    data: [2.3, 2.5, 2.8, 2.7, 2.9, 2.8],
                    borderColor: '#F87171',
                    backgroundColor: 'transparent',
                    tension: 0.4,
                    yAxisID: 'y'
                }, {
                    label: 'Risk Score (scaled)',
                    data: [6.9, 6.86, 6.82, 6.85, 6.83, 6.85],
                    borderColor: '#00A884',
                    backgroundColor: 'transparent',
                    tension: 0.4,
                    yAxisID: 'y1'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.dataset.yAxisID === 'y1') {
                                    return label + (context.parsed.y * 100).toFixed(0);
                                }
                                return label + context.parsed.y + '%';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Percentage (%)'
                        },
                        max: 10
                    },
                    y1: {
                        beginAtZero: false,
                        position: 'right',
                        min: 6.5,
                        max: 7.5,
                        title: {
                            display: true,
                            text: 'Risk Score (scaled)'
                        },
                        grid: {
                            drawOnChartArea: false
                        },
                        ticks: {
                            callback: function(value) {
                                return (value * 100).toFixed(0);
                            }
                        }
                    }
                }
            }
        });
    }
}

// Load mock data for tables
function loadMockData() {
    // Mock data for user management
    const users = [
        { username: 'admin', fullName: 'Admin User', email: 'admin@example.com', role: 'Administrator', status: 'Active', lastLogin: '2025-03-28 09:15' },
        { username: 'manager1', fullName: 'Chika Okonkwo', email: 'chika@example.com', role: 'Manager', status: 'Active', lastLogin: '2025-03-28 10:23' },
        { username: 'agent1', fullName: 'Adebayo Taiwo', email: 'adebayo@example.com', role: 'Agent', status: 'Active', lastLogin: '2025-03-28 08:45' },
        { username: 'agent2', fullName: 'Fatima Mohammed', email: 'fatima@example.com', role: 'Agent', status: 'Active', lastLogin: '2025-03-28 09:30' },
        { username: 'analyst1', fullName: 'Daniel Okafor', email: 'daniel@example.com', role: 'Analyst', status: 'Inactive', lastLogin: '2025-03-25 14:10' }
    ];
    
    const userTable = document.getElementById('userManagementBody');
    if (userTable) {
        userTable.innerHTML = '';
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.fullName}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td><span class="status-badge ${user.status.toLowerCase()}">${user.status}</span></td>
                <td>${user.lastLogin}</td>
                <td>
                    <button class="action-btn edit-btn"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;
            userTable.appendChild(row);
        });
    }
    
    // Mock data for roles
    const roles = [
        { name: 'Administrator', description: 'Full system access', users: 1, permissions: 'All permissions' },
        { name: 'Manager', description: 'Manage loans and agents', users: 2, permissions: 'Loan management, reporting, agent management' },
        { name: 'Agent', description: 'Process loans and payments', users: 5, permissions: 'Create loans, process payments, customer management' },
        { name: 'Analyst', description: 'View reports and analytics', users: 3, permissions: 'View reports, export data' },
        { name: 'Auditor', description: 'View audit logs and compliance', users: 2, permissions: 'View logs, compliance reports' }
    ];
    
    const roleTable = document.getElementById('roleManagementBody');
    if (roleTable) {
        roleTable.innerHTML = '';
        roles.forEach(role => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${role.name}</td>
                <td>${role.description}</td>
                <td>${role.users}</td>
                <td>${role.permissions}</td>
                <td>
                    <button class="action-btn edit-btn"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;
            roleTable.appendChild(row);
        });
    }
    
    // Mock data for audit logs
    const auditLogs = [
        { timestamp: '2025-03-28 15:45:23', user: 'admin', eventType: 'settings', action: 'Updated system settings', details: 'Changed payment gateway settings', ip: '192.168.1.10' },
        { timestamp: '2025-03-28 14:32:10', user: 'manager1', eventType: 'loan', action: 'Approved loan', details: 'Loan #LN-2025-0342 for ₦350,000', ip: '192.168.1.15' },
        { timestamp: '2025-03-28 13:15:56', user: 'agent1', eventType: 'customer', action: 'Created customer', details: 'New customer: Oluwaseun Adeyemi', ip: '192.168.1.22' },
        { timestamp: '2025-03-28 11:47:30', user: 'agent2', eventType: 'payment', action: 'Processed payment', details: 'Payment of ₦25,000 for Loan #LN-2025-0298', ip: '192.168.1.18' },
        { timestamp: '2025-03-28 10:22:15', user: 'admin', eventType: 'login', action: 'User login', details: 'Successful login', ip: '192.168.1.10' }
    ];
    
    const auditTable = document.getElementById('auditLogsBody');
    if (auditTable) {
        auditTable.innerHTML = '';
        auditLogs.forEach(log => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${log.timestamp}</td>
                <td>${log.user}</td>
                <td>${log.eventType}</td>
                <td>${log.action}</td>
                <td>${log.details}</td>
                <td>${log.ip}</td>
            `;
            auditTable.appendChild(row);
        });
    }
    
    // Mock data for scheduled reports
    const scheduledReports = [
        { name: 'Monthly Loan Performance', frequency: 'Monthly', lastGenerated: '2025-03-01', recipients: 'management@example.com', status: 'Active' },
        { name: 'Quarterly Compliance Summary', frequency: 'Quarterly', lastGenerated: '2025-01-01', recipients: 'compliance@example.com, management@example.com', status: 'Active' },
        { name: 'Weekly Recovery Report', frequency: 'Weekly', lastGenerated: '2025-03-22', recipients: 'recovery@example.com', status: 'Active' },
        { name: 'Daily New Loan Alert', frequency: 'Daily', lastGenerated: '2025-03-28', recipients: 'loans@example.com', status: 'Active' }
    ];
    
    const reportsTable = document.getElementById('scheduledReportsBody');
    if (reportsTable) {
        reportsTable.innerHTML = '';
        scheduledReports.forEach(report => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${report.name}</td>
                <td>${report.frequency}</td>
                <td>${report.lastGenerated}</td>
                <td>${report.recipients}</td>
                <td><span class="status-badge ${report.status.toLowerCase()}">${report.status}</span></td>
                <td>
                    <button class="action-btn edit-btn"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;
            reportsTable.appendChild(row);
        });
    }
    
    // Mock data for risk policies
    const riskPolicies = [
        { name: 'Credit Score Threshold', description: 'Minimum credit score required for approval', lastUpdated: '2025-02-15', status: 'Active' },
        { name: 'Maximum Loan Amount', description: 'Maximum loan amount based on income verification', lastUpdated: '2025-01-10', status: 'Active' },
        { name: 'Debt to Income Ratio', description: 'Maximum debt-to-income ratio for loan approval', lastUpdated: '2025-03-05', status: 'Active' },
        { name: 'Repeat Borrower Rules', description: 'Special rules for repeat borrowers', lastUpdated: '2025-02-28', status: 'Under Review' }
    ];
    
    const policiesTable = document.getElementById('riskPoliciesBody');
    if (policiesTable) {
        policiesTable.innerHTML = '';
        riskPolicies.forEach(policy => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${policy.name}</td>
                <td>${policy.description}</td>
                <td>${policy.lastUpdated}</td>
                <td><span class="status-badge ${policy.status.toLowerCase().replace(/\s+/g, '-')}">${policy.status}</span></td>
                <td>
                    <button class="action-btn edit-btn"><i class="fas fa-edit"></i></button>
                    <button class="action-btn view-btn"><i class="fas fa-eye"></i></button>
                </td>
            `;
            policiesTable.appendChild(row);
        });
    }
    
    // Mock data for recovery buckets
    const recoveryBuckets = [
        { bucket: '1-30 Days', totalCases: 245, recoveredCases: 185, recoveryRate: '75.5%', amountRecovered: '₦3,850,000' },
        { bucket: '31-60 Days', totalCases: 120, recoveredCases: 75, recoveryRate: '62.5%', amountRecovered: '₦1,950,000' },
        { bucket: '61-90 Days', totalCases: 85, recoveredCases: 42, recoveryRate: '49.4%', amountRecovered: '₦1,320,000' },
        { bucket: '91+ Days', totalCases: 65, recoveredCases: 18, recoveryRate: '27.7%', amountRecovered: '₦750,000' }
    ];
    
    const bucketTable = document.getElementById('recoveryBucketTable');
    if (bucketTable && bucketTable.querySelector('tbody')) {
        const tbody = bucketTable.querySelector('tbody');
        tbody.innerHTML = '';
        recoveryBuckets.forEach(bucket => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${bucket.bucket}</td>
                <td>${bucket.totalCases}</td>
                <td>${bucket.recoveredCases}</td>
                <td>${bucket.recoveryRate}</td>
                <td>${bucket.amountRecovered}</td>
            `;
            tbody.appendChild(row);
        });
    }
    
    // Update metrics
    document.getElementById('totalLoansMetric').textContent = '1,254';
    document.getElementById('avgLoanAmountMetric').textContent = '₦185,000';
    document.getElementById('defaultRateMetric').textContent = '2.8%';
    document.getElementById('avgTermMetric').textContent = '8 months';
    
    document.getElementById('onTimeRateMetric').textContent = '75%';
    document.getElementById('avgDaysLateMetric').textContent = '3.5 days';
    document.getElementById('totalCollectedMetric').textContent = '₦185,450,000';
    document.getElementById('collectionRateMetric').textContent = '92.3%';
    
    document.getElementById('totalRecoveredMetric').textContent = '₦7,870,000';
    document.getElementById('recoveryRateMetric').textContent = '63.5%';
    document.getElementById('avgRecoveryTimeMetric').textContent = '15 days';
    document.getElementById('costPerRecoveryMetric').textContent = '₦3,250';
    
    document.getElementById('activeCustomersMetric').textContent = '3,850';
    document.getElementById('avgLoansPerCustomerMetric').textContent = '1.8';
    document.getElementById('customerRetentionMetric').textContent = '72%';
    document.getElementById('avgLTVMetric').textContent = '₦42,500';
}

// Initialize event listeners
function initializeEventListeners() {
    // Main navigation
    const mainNavItems = document.querySelectorAll('.nav-item');
    mainNavItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetId = this.dataset.section;
            
            // Hide all sections
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Remove active class from all nav items
            mainNavItems.forEach(nav => {
                nav.classList.remove('active');
            });
            
            // Show selected section and make nav item active
            document.getElementById(targetId).classList.add('active');
            this.classList.add('active');
        });
    });
    
    // Button handlers
    const buttons = {
        'addUser': () => showAddUserModal(),
        'addRole': () => showAddRoleModal(),
        'addScheduledReport': () => showAddReportModal(),
        'addRiskPolicy': () => showAddPolicyModal(),
        'exportAuditLogs': () => exportAuditLogs(),
        'generateLoanPerformance': () => generateReport('loan-performance'),
        'generateRepaymentTrends': () => generateReport('repayment-trends'),
        'generateRecoveryMetrics': () => generateReport('recovery-metrics'),
        'generateCustomerAnalysis': () => generateReport('customer-analysis')
    };
    
    // Add event listeners for all buttons
    for (const [id, handler] of Object.entries(buttons)) {
        const button = document.getElementById(id);
        if (button) {
            button.addEventListener('click', handler);
        }
    }
    
    // Form submissions
    const notificationForm = document.getElementById('notificationSettingsForm');
    if (notificationForm) {
        notificationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Notification settings saved successfully!');
        });
    }
}

// Modal handlers
function showAddUserModal() {
    const content = `
        <form id="addUserForm" class="form-container">
            <div class="form-row">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" required>
                </div>
                <div class="form-group">
                    <label for="fullName">Full Name</label>
                    <input type="text" id="fullName" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" required>
                </div>
                <div class="form-group">
                    <label for="role">Role</label>
                    <select id="role" required>
                        <option value="">Select a role</option>
                        <option value="Administrator">Administrator</option>
                        <option value="Manager">Manager</option>
                        <option value="Agent">Agent</option>
                        <option value="Analyst">Analyst</option>
                        <option value="Auditor">Auditor</option>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" required>
                </div>
                <div class="form-group">
                    <label for="confirmPassword">Confirm Password</label>
                    <input type="password" id="confirmPassword" required>
                </div>
            </div>
        </form>
    `;
    
    const buttons = [
        {
            text: 'Cancel',
            class: 'btn-secondary',
            action: function() {
                document.getElementById('modal-container').style.display = 'none';
            }
        },
        {
            text: 'Add User',
            class: 'btn-primary',
            action: function() {
                const form = document.getElementById('addUserForm');
                if (form.checkValidity()) {
                    // Process form data
                    const username = document.getElementById('username').value;
                    const fullName = document.getElementById('fullName').value;
                    const email = document.getElementById('email').value;
                    const role = document.getElementById('role').value;
                    
                    // Add user to table
                    const userTable = document.getElementById('userManagementBody');
                    const newRow = document.createElement('tr');
                    newRow.innerHTML = `
                        <td>${username}</td>
                        <td>${fullName}</td>
                        <td>${email}</td>
                        <td>${role}</td>
                        <td><span class="status-badge active">Active</span></td>
                        <td>Never</td>
                        <td>
                            <button class="action-btn edit-btn"><i class="fas fa-edit"></i></button>
                            <button class="action-btn delete-btn"><i class="fas fa-trash-alt"></i></button>
                        </td>
                    `;
                    userTable.appendChild(newRow);
                    
                    document.getElementById('modal-container').style.display = 'none';
                    showNotification('User added successfully!');
                } else {
                    // Trigger form validation
                    form.reportValidity();
                }
            }
        }
    ];
    
    showModal('Add New User', content, buttons);
}

function showAddRoleModal() {
    const content = `
        <form id="addRoleForm" class="form-container">
            <div class="form-group">
                <label for="roleName">Role Name</label>
                <input type="text" id="roleName" required>
            </div>
            <div class="form-group">
                <label for="roleDescription">Description</label>
                <input type="text" id="roleDescription" required>
            </div>
            <div class="form-group">
                <label>Permissions</label>
                <div class="checkbox-group">
                    <label class="checkbox-label">
                        <input type="checkbox" name="permission" value="view_dashboard"> View Dashboard
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" name="permission" value="manage_users"> Manage Users
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" name="permission" value="manage_loans"> Manage Loans
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" name="permission" value="manage_payments"> Process Payments
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" name="permission" value="view_reports"> View Reports
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" name="permission" value="manage_settings"> Manage Settings
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" name="permission" value="export_data"> Export Data
                    </label>
                </div>
            </div>
        </form>
    `;
    
    const buttons = [
        {
            text: 'Cancel',
            class: 'btn-secondary',
            action: function() {
                document.getElementById('modal-container').style.display = 'none';
            }
        },
        {
            text: 'Add Role',
            class: 'btn-primary',
            action: function() {
                const form = document.getElementById('addRoleForm');
                if (form.checkValidity()) {
                    // Process form data
                    const roleName = document.getElementById('roleName').value;
                    const roleDescription = document.getElementById('roleDescription').value;
                    
                    // Get selected permissions
                    const selectedPermissions = [];
                    document.querySelectorAll('input[name="permission"]:checked').forEach(checkbox => {
                        selectedPermissions.push(checkbox.value.replace('_', ' '));
                    });
                    
                    // Add role to table
                    const roleTable = document.getElementById('roleManagementBody');
                    const newRow = document.createElement('tr');
                    newRow.innerHTML = `
                        <td>${roleName}</td>
                        <td>${roleDescription}</td>
                        <td>0</td>
                        <td>${selectedPermissions.join(', ')}</td>
                        <td>
                            <button class="action-btn edit-btn"><i class="fas fa-edit"></i></button>
                            <button class="action-btn delete-btn"><i class="fas fa-trash-alt"></i></button>
                        </td>
                    `;
                    roleTable.appendChild(newRow);
                    
                    document.getElementById('modal-container').style.display = 'none';
                    showNotification('Role added successfully!');
                } else {
                    // Trigger form validation
                    form.reportValidity();
                }
            }
        }
    ];
    
    showModal('Add New Role', content, buttons);
}

function showAddReportModal() {
    const content = `
        <form id="addReportForm" class="form-container">
            <div class="form-group">
                <label for="reportName">Report Name</label>
                <input type="text" id="reportName" required>
            </div>
            <div class="form-group">
                <label for="reportType">Report Type</label>
                <select id="reportType" required>
                    <option value="">Select report type</option>
                    <option value="Loan Performance">Loan Performance</option>
                    <option value="Repayment Trends">Repayment Trends</option>
                    <option value="Recovery Metrics">Recovery Metrics</option>
                    <option value="Customer Analysis">Customer Analysis</option>
                    <option value="Risk Analysis">Risk Analysis</option>
                </select>
            </div>
            <div class="form-group">
                <label for="frequency">Frequency</label>
                <select id="frequency" required>
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                </select>
            </div>
            <div class="form-group">
                <label for="recipients">Recipients (comma separated)</label>
                <input type="text" id="recipients" required>
            </div>
        </form>
    `;
    
    const buttons = [
        {
            text: 'Cancel',
            class: 'btn-secondary',
            action: function() {
                document.getElementById('modal-container').style.display = 'none';
            }
        },
        {
            text: 'Add Report',
            class: 'btn-primary',
            action: function() {
                const form = document.getElementById('addReportForm');
                if (form.checkValidity()) {
                    // Process form data
                    const reportName = document.getElementById('reportName').value;
                    const frequency = document.getElementById('frequency').value;
                    const recipients = document.getElementById('recipients').value;
                    
                    // Get current date
                    const today = new Date();
                    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                    
                    // Add report to table
                    const reportTable = document.getElementById('scheduledReportsBody');
                    const newRow = document.createElement('tr');
                    newRow.innerHTML = `
                        <td>${reportName}</td>
                        <td>${frequency}</td>
                        <td>${formattedDate}</td>
                        <td>${recipients}</td>
                        <td><span class="status-badge active">Active</span></td>
                        <td>
                            <button class="action-btn edit-btn"><i class="fas fa-edit"></i></button>
                            <button class="action-btn delete-btn"><i class="fas fa-trash-alt"></i></button>
                        </td>
                    `;
                    reportTable.appendChild(newRow);
                    
                    document.getElementById('modal-container').style.display = 'none';
                    showNotification('Scheduled report added successfully!');
                } else {
                    // Trigger form validation
                    form.reportValidity();
                }
            }
        }
    ];
    
    showModal('Add Scheduled Report', content, buttons);
}

function showAddPolicyModal() {
    const content = `
        <form id="addPolicyForm" class="form-container">
            <div class="form-group">
                <label for="policyName">Policy Name</label>
                <input type="text" id="policyName" required>
            </div>
            <div class="form-group">
                <label for="policyDescription">Description</label>
                <textarea id="policyDescription" rows="3" required></textarea>
            </div>
            <div class="form-group">
                <label for="policyRules">Rules (JSON format)</label>
                <textarea id="policyRules" rows="5" required></textarea>
                <small class="helper-text">Example: {"min_score": 650, "max_dti": 0.4}</small>
            </div>
            <div class="form-group">
                <label for="policyStatus">Status</label>
                <select id="policyStatus" required>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Under Review">Under Review</option>
                </select>
            </div>
        </form>
    `;
    
    const buttons = [
        {
            text: 'Cancel',
            class: 'btn-secondary',
            action: function() {
                document.getElementById('modal-container').style.display = 'none';
            }
        },
        {
            text: 'Add Policy',
            class: 'btn-primary',
            action: function() {
                const form = document.getElementById('addPolicyForm');
                if (form.checkValidity()) {
                    // Process form data
                    const policyName = document.getElementById('policyName').value;
                    const policyDescription = document.getElementById('policyDescription').value;
                    const policyStatus = document.getElementById('policyStatus').value;
                    
                    // Get current date
                    const today = new Date();
                    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                    
                    // Add policy to table
                    const policyTable = document.getElementById('riskPoliciesBody');
                    const newRow = document.createElement('tr');
                    newRow.innerHTML = `
                        <td>${policyName}</td>
                        <td>${policyDescription}</td>
                        <td>${formattedDate}</td>
                        <td><span class="status-badge ${policyStatus.toLowerCase().replace(/\s+/g, '-')}">${policyStatus}</span></td>
                        <td>
                            <button class="action-btn edit-btn"><i class="fas fa-edit"></i></button>
                            <button class="action-btn view-btn"><i class="fas fa-eye"></i></button>
                        </td>
                    `;
                    policyTable.appendChild(newRow);
                    
                    document.getElementById('modal-container').style.display = 'none';
                    showNotification('Risk policy added successfully!');
                } else {
                    // Trigger form validation
                    form.reportValidity();
                }
            }
        }
    ];
    
    showModal('Add Risk Policy', content, buttons);
}

// Utility functions
function exportAuditLogs() {
    showNotification('Audit logs exported successfully!');
}

function generateReport(reportType) {
    const reportNames = {
        'loan-performance': 'Loan Performance',
        'repayment-trends': 'Repayment Trends',
        'recovery-metrics': 'Recovery Metrics',
        'customer-analysis': 'Customer Analysis'
    };
    
    showNotification(`Generating ${reportNames[reportType]} report...`);
    
    // Simulate report generation delay
    setTimeout(() => {
        showNotification(`${reportNames[reportType]} report generated successfully!`);
    }, 2000);
}

function showNotification(message, type = 'success') {
    const notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) {
        // Create notification container if it doesn't exist
        const container = document.createElement('div');
        container.id = 'notification-container';
        document.body.appendChild(container);
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    document.getElementById('notification-container').appendChild(notification);
    
    // Add close button functionality
    notification.querySelector('.notification-close').addEventListener('click', function() {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.add('fade-out');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Initialize theme switcher
function initializeThemeSwitcher() {
    const themeSwitch = document.getElementById('themeSwitch');
    
    if (themeSwitch) {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            themeSwitch.checked = true;
        }
        
        // Add event listener for theme switch
        themeSwitch.addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.add('dark-theme');
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.classList.remove('dark-theme');
                localStorage.setItem('theme', 'light');
            }
        });
    }
}

// Call theme switcher initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeThemeSwitcher();
});