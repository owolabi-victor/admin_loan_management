// ui-manager.js - Manages UI interactions and display
import { updateTime, isMobile } from './core-utils.js';

// Adjust UI based on screen size
export function updateUI() {
    // Update time display
    updateTime();
    
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

// Setup password visibility toggle - fixed version
export function setupPasswordToggle() {
  // Find all toggle-password elements and add event listeners
  document.querySelectorAll('.toggle-password').forEach(button => {
      button.addEventListener('click', function() {
          // Find the closest password input within the same password field
          const passwordInput = this.closest('.password-field').querySelector('input');

          if (passwordInput) {
              // Toggle the input type
              passwordInput.type = passwordInput.type === "password" ? "text" : "password";

              // Update the button text/icon
              this.textContent = passwordInput.type === "text" ? "👁️‍🗨️" : "👁️";
          }
      });
  });

  // Handle dynamically added elements
  document.addEventListener("click", function(e) {
      if (e.target.classList.contains("toggle-password")) {
          const passwordInput = e.target.closest('.password-field')?.querySelector('input');
          if (passwordInput) {
              passwordInput.type = passwordInput.type === "password" ? "text" : "password";
              e.target.textContent = passwordInput.type === "text" ? "👁️‍🗨️" : "👁️";
          }
      }
  });
}


// Setup balance visibility toggles
export function setupBalanceToggles() {
    const balanceToggles = [
        { toggleId: "toggleBalance", textId: "balanceText", originalText: "NGN 30,000.00" },
        { toggleId: "webToggleBalance", textId: "webBalanceText", originalText: "NGN 30,000.00" },
        { toggleId: "webToggleSavings", textId: "savingsBalanceText", originalText: "NGN 125,000.00" }
    ];
    
    balanceToggles.forEach(config => {
        const toggleBtn = document.getElementById(config.toggleId);
        const balanceText = document.getElementById(config.textId);
        
        if (toggleBtn && balanceText) {
            // Use provided originalText or get the current text
            const textToUse = config.originalText || balanceText.textContent;
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
    });
}

// Setup navigation
export function setupNavigation() {
    // Navigation handlers
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
}

// Setup modal handlers
export function setupModalHandlers() {
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
}

// Setup notification panel
export function setupNotifications() {
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
    
    // Close notifications when clicking outside
    document.addEventListener("click", (e) => {
        if (notificationPanel && 
            e.target !== notificationPanel && 
            !notificationPanel.contains(e.target) && 
            e.target !== notificationBell &&
            e.target !== webNotificationBell) {
            notificationPanel.style.display = "none";
        }
    });
}

// Initialize all UI components
export function initializeUI() {
    // Call all setup functions
    updateUI();
    setupPasswordToggle();
    setupBalanceToggles();
    setupNavigation();
    setupModalHandlers();
    setupNotifications();
    
    // Set up resize listener for responsive adjustments
    window.addEventListener('resize', updateUI);
    
    // Initial UI update
    updateUI();
}

// Setup search functionality
export function setupSearch() {
    const searchInputs = document.querySelectorAll('.search-input');
    
    searchInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            // Here you would implement the actual search functionality
            // For example, filtering transaction history
            console.log(`Searching for: ${searchTerm}`);
        });
    });
}

// Export all functions
export default {
    updateUI,
    setupPasswordToggle,
    setupBalanceToggles,
    setupNavigation,
    setupModalHandlers,
    setupNotifications,
    initializeUI,
    setupSearch
};