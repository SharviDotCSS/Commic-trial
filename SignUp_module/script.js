document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const usernameError = document.getElementById('username-error');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const confirmPasswordError = document.getElementById('confirm-password-error');
    const submitButton = document.querySelector('.cta-button');

    // Function to validate a field
    function validateField(fieldName) {
        const fieldValue = document.getElementById(fieldName).value.trim();
        const errorElement = document.getElementById(fieldName + '-error');
        const inputField = document.getElementById(fieldName);

        // Clear previous error message and remove error class
        errorElement.textContent = '';
        inputField.classList.remove('error');

        // Perform your validation logic here
        let isValid = true;
        let errorMessage = '';

        if (fieldName === "username") {
            isValid = /^[A-Za-z]+$/.test(fieldValue);
            if (!isValid) {
                errorMessage = 'Username should not be a number and should be at least 2 characters.';
            } else if (fieldValue.length < 2) {
                isValid = false;
                errorMessage = 'Username should be at least 2 characters.';
            }
        } else if (fieldName === "email") {
            if (!isValidEmail(fieldValue)) {
                isValid = false;
                errorMessage = 'Invalid email address.';
            }
        } else if (fieldName === "password") {
            if (!isValidPassword(fieldValue)) {
                isValid = false;
                errorMessage = 'Password should be at least 6 characters long, alphanumeric, and contain at least 1 special character.';
            }
        } else if (fieldName === "confirm-password") {
            const passwordValue = document.getElementById("password").value.trim();
            if (fieldValue !== passwordValue) {
                isValid = false;
                errorMessage = 'Passwords do not match.';
            }
        }

        if (!isValid) {
            errorElement.textContent = errorMessage;
            inputField.classList.add('error');
        } else {
            errorElement.textContent = '';
        }

        // Check if all fields are valid to enable the submit button
        const isValidForm = validateForm();
        if (isValidForm) {
            submitButton.removeAttribute('disabled');
        } else {
            submitButton.setAttribute('disabled', 'true');
        }
    }

    // Add event listeners to input fields for 'Enter' key
    usernameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            validateField('username');
            if (!usernameInput.classList.contains('error')) {
                emailInput.focus();
            }
        }
    });

    emailInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            validateField('email');
            if (!emailInput.classList.contains('error')) {
                passwordInput.focus();
            }
        }
    });

    passwordInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            validateField('password');
            if (!passwordInput.classList.contains('error')) {
                confirmPasswordInput.focus();
            }
        }
    });

    confirmPasswordInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            validateField('confirm-password');
        }
    });

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Reset errors
        usernameError.textContent = '';
        emailError.textContent = '';
        passwordError.textContent = '';
        confirmPasswordError.textContent = '';

        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // Simple validation
        if (username.length < 2) {
            usernameError.textContent = 'Username should be at least 2 characters.';
            return;
        }

        if (!isValidEmail(email)) {
            emailError.textContent = 'Invalid email address.';
            return;
        }

        if (!isValidPassword(password)) {
            passwordError.textContent = 'Password should be at least 6 characters long, alphanumeric, and contain at least 1 special character.';
            return;
        }

        if (password !== confirmPassword) {
            confirmPasswordError.textContent = 'Passwords do not match.';
            return;
        }

        // Send signup data to the server (you will add this code)
        const formData = { username, email, password };
        // You need to send this data to the server for processing

        // Reset the form after successful signup (you will add this code)
        signupForm.reset();

        // Show a popup message upon successful submission
        alert('Your account is created! You are now a part of the creative community :)');
        window.location.href = '../Comic.html';
    });

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPassword(password) {
        // Password should be at least 6 characters long, alphanumeric, and contain at least 1 special character
        const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[\W_]).{6,}$/;
        return passwordRegex.test(password);
    }

    // Function to validate the entire form
    function validateForm() {
        return (
            !usernameInput.classList.contains('error') &&
            !emailInput.classList.contains('error') &&
            !passwordInput.classList.contains('error') &&
            !confirmPasswordInput.classList.contains('error')
        );
    }
});

