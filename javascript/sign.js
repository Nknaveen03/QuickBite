document.addEventListener('DOMContentLoaded', function() {
    const signinForm = document.getElementById('signinForm');
    const signupForm = document.getElementById('signupForm');
    if (signinForm) {
        signinForm.addEventListener('submit', validateSignIn);
    }

    if (signupForm) {
        signupForm.addEventListener('submit', validateSignUp);
        const pwd = document.getElementById('password');
        if (pwd) {
            pwd.addEventListener('input', function() {
                checkPasswordStrength(this.value);
            });
        }
        const confirmPwd = document.getElementById('confirmPassword');
        if (confirmPwd) {
            confirmPwd.addEventListener('input', function() {
                const password = document.getElementById('password').value;
                const confirmPassword = this.value;
                if (password === confirmPassword && confirmPassword.length > 0) {
                    hideError('confirmPasswordError');
                } else if (confirmPassword.length > 0) {
                    showError('confirmPasswordError');
                }
            });
        }
    }

    hideFormErrors();
});

function hideFormErrors() {
    document.querySelectorAll('.error').forEach(function(errorElement) {
        errorElement.classList.add('hidden');
    });

    const passwordStrength = document.getElementById('passwordStrength');
    if (passwordStrength) {
        passwordStrength.innerHTML = '';
    }
}

function validateSignIn(e) {
    e.preventDefault();
    let valid = true;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!isValidEmail(email)) {
       
        valid = false;
         showError('emailError');
    } else {
        hideError('emailError');
    }

    if (password.length < 6) {
        showError('passwordError');
        valid = false;
    } else {
        hideError('passwordError');
    }

    if (valid) {
        window.location.href = 'index.html';
    }

}
function validateSignUp(e) {
    e.preventDefault();
    let valid = true;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    if (!name.trim()) {
        showError('nameError');
        valid = false;
    } else {
        hideError('nameError');
    }

    if (!isValidEmail(email)) {
        showError('emailError');
        valid = false;
    } else {
        hideError('emailError');
    }

    if (password.length < 6) {
        showError('passwordError');
        valid = false;
    } else {
        hideError('passwordError');
    }

    if (password !== confirmPassword) {
        showError('confirmPasswordError');
        valid = false;
    } else {
        hideError('confirmPasswordError');
    }
    if (valid) {
        window.location.href = 'signin.html';
    }
}

function isValidEmail(email) {
    return email.includes('@') && email.includes('.') && email.trim() !== '';
}

function showError(errorId) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.classList.remove('hidden');
    }
}
function hideError(errorId) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.classList.add('hidden');
    }
}
function checkPasswordStrength(password) {
    const div = document.getElementById('passwordStrength');
    if (!div) return;

    if (!password) {
        div.innerHTML = '';
        return;
    }

    let strength = 0;
    let feedback = [];

    if (password.length >= 6) {
        strength++; 
    } else {
        feedback.push('6+ characters'); 
    }

    if (/[a-z]/.test(password)) { 
        strength++;
    } else {
        feedback.push('Lowercase letter');
    }

    if (/[A-Z]/.test(password)) { 
        strength++;
    } else {
        feedback.push('Uppercase letter');
    }

    if (/\d/.test(password)) { 
        strength++;
    } else {
        feedback.push('Number');
    }

    if (/[^A-Za-z0-9]/.test(password)) { 
        strength++;
    } else {
        feedback.push('Special character');
    }
    let text = '';
    let color = '';
    if (strength < 3) {
        text = 'Weak';
        color = '#ef4444'; 
    } else if (strength < 5) {
        text = 'Medium';
        color = '#f59e0b';
    } else {
        text = 'Strong';
        color = '#10b981';
    }

    div.innerHTML = `<span style="color: ${color};">Password: ${text}</span>`;

    if (feedback.length > 0 && strength < 5) {
        div.innerHTML += `<br><small style="color: #6b7280;">Needs: ${feedback.join(', ')}</small>`;
    }
}