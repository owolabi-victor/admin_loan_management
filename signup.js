document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const showPasswordToggles = document.querySelectorAll('.toggle-password');
    const termsCheckbox = document.getElementById('terms');

    // Password visibility toggles
    showPasswordToggles.forEach((toggle, index) => {
        toggle.addEventListener('click', () => {
            const input = index === 0 ? passwordInput : confirmPasswordInput;
            input.type = input.type === 'password' ? 'text' : 'password';
            toggle.textContent = input.type === 'password' ? '👁️' : '👁️‍🗨️';
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get input values
        const email = emailInput.value;
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const termsAgreed = termsCheckbox.checked;

        // Basic validation
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        if (!termsAgreed) {
            alert("Please agree to the Terms & Conditions");
            return;
        }

        // Store user in local storage (mock backend)
        const userCredentials = {
            email,
            password
        };

        localStorage.setItem("user", JSON.stringify(userCredentials));
        
        alert("Sign up successful!");
        
        // Redirect to login page
        window.location.href = 'index.html';
    });
});