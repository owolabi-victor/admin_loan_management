document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePasswordSpan = document.querySelector('.toggle-password');
    const rememberCheckbox = document.getElementById('remember');
    const loginBtn = document.querySelector('.login-btn');

    // Remove the inline onclick attribute
    loginBtn.removeAttribute('onclick');

    // Password visibility toggle
    togglePasswordSpan.addEventListener('click', () => {
        passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
        togglePasswordSpan.textContent = passwordInput.type === 'password' ? '👁️' : '👁️‍🗨️';
    });

    // Login validation function
    function validateLogin() {
        // Get input values
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Check if user exists
        const storedUser = JSON.parse(localStorage.getItem('user'));

        // Validate credentials
        if (!storedUser) {
            alert('No user account found. Please sign up first.');
            return false;
        }

        if (storedUser.email !== email) {
            alert('Email not found. Please check your email or sign up.');
            return false;
        }

        if (storedUser.password !== password) {
            alert('Incorrect password. Please try again.');
            return false;
        }

        // If we reach here, credentials are correct
        // Generate a simple authentication token
        const authToken = `token_${Date.now()}_${Math.random().toString(36).substring(2)}`;
        
        // Store authentication token
        localStorage.setItem('authToken', authToken);
        
        // Optional: Store user info for dashboard
        localStorage.setItem('userEmail', email);

        // Optional: Remember me functionality
        if (rememberCheckbox.checked) {
            localStorage.setItem('rememberedEmail', email);
        } else {
            localStorage.removeItem('rememberedEmail');
        }

        return true;
    }

    // Form submission event
    form.addEventListener('submit', (e) => {
        e.preventDefault();
    });

    // Button click event 
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Check if user exists
        const storedUser = JSON.parse(localStorage.getItem('user'));

        // Validate credentials
        if (!storedUser) {
            alert('No user account found. Please sign up first.');
            return;
        }

        if (storedUser.email !== email) {
            alert('Email not found. Please check your email or sign up.');
            return;
        }

        if (storedUser.password !== password) {
            alert('Incorrect password. Please try again.');
            return;
        }

        // If we reach here, credentials are correct
        // Generate a simple authentication token
        const authToken = `token_${Date.now()}_${Math.random().toString(36).substring(2)}`;
        
        // Store authentication token
        localStorage.setItem('authToken', authToken);
        
        // Optional: Store user info for dashboard
        localStorage.setItem('userEmail', email);

        // Optional: Remember me functionality
        if (rememberCheckbox.checked) {
            localStorage.setItem('rememberedEmail', email);
        } else {
            localStorage.removeItem('rememberedEmail');
        }

        // Show success and then navigate
        alert('Login successful!');
        window.location.href = 'dashboard.html';
    });

    // Pre-fill remembered email if exists
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        emailInput.value = rememberedEmail;
        rememberCheckbox.checked = true;
    }
});