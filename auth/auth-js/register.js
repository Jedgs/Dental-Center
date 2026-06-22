(function () {
    'use strict';

    // ── DOM refs: registration form ──
    const form = document.getElementById('registerForm');
    const passwordInput = document.getElementById('password');
    const confirmInput = document.getElementById('confirm_password');
    const passwordFeedback = document.getElementById('passwordFeedback');
    const confirmFeedback = document.getElementById('confirmFeedback');
    const registerBtn = document.getElementById('registerBtn');

    // ── DOM refs: OTP overlay ──
    const modal = document.getElementById('otpModal');
    const emailDisplay = document.getElementById('otpEmailDisplay');
    const otpInputs = document.querySelectorAll('.otp-digit');
    const verifyBtn = document.getElementById('verifyBtn');
    const resendBtn = document.getElementById('resendBtn');
    const resendTimer = document.getElementById('resendTimer');
    const closeModalBtn = document.getElementById('closeModal');

    let countdownInterval = null;
    let countdownSeconds = 60;
    let isVerified = false;

    // ── Password toggle ──
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', function () {
            const targetId = this.dataset.target;
            const input = document.getElementById(targetId);
            if (!input) return;
            const icon = this.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // ── Password strength & confirmation validation ──

    function validatePassword() {
        const password = passwordInput.value;
        const confirm = confirmInput.value;

        let passwordValid = false;
        let confirmValid = false;
        let feedbackMsg = '';

        // Password strength check
        if (password.length === 0) {
            feedbackMsg = '';
            passwordValid = false;
        } else if (password.length < 6) {
            feedbackMsg = '⚠️ Password must be at least 6 characters';
            passwordValid = false;
        } else {
            feedbackMsg = '✅ Strong password';
            passwordValid = true;
        }

        // Update password feedback
        if (password.length === 0) {
            passwordFeedback.textContent = '';
            passwordFeedback.className = 'password-feedback hidden';
            passwordInput.classList.remove('error', 'success');
        } else {
            passwordFeedback.textContent = feedbackMsg;
            passwordFeedback.className = 'password-feedback ' + (passwordValid ? 'success' : 'error');
            passwordInput.classList.remove('error', 'success');
            passwordInput.classList.add(passwordValid ? 'success' : 'error');
        }

        // Confirm password validation
        if (confirm.length === 0) {
            confirmFeedback.textContent = '';
            confirmFeedback.className = 'password-feedback hidden';
            confirmInput.classList.remove('error', 'success');
            confirmValid = false;
        } else if (confirm === password && passwordValid) {
            confirmFeedback.textContent = '✅ Passwords match';
            confirmFeedback.className = 'password-feedback success';
            confirmInput.classList.remove('error', 'success');
            confirmInput.classList.add('success');
            confirmValid = true;
        } else if (confirm === password && !passwordValid) {
            confirmFeedback.textContent = '⚠️ Password is too weak';
            confirmFeedback.className = 'password-feedback error';
            confirmInput.classList.remove('error', 'success');
            confirmInput.classList.add('error');
            confirmValid = false;
        } else {
            confirmFeedback.textContent = '❌ Passwords do not match';
            confirmFeedback.className = 'password-feedback error';
            confirmInput.classList.remove('error', 'success');
            confirmInput.classList.add('error');
            confirmValid = false;
        }

        // Enable/disable register button
        const allValid = passwordValid && confirmValid && password.length > 0 && confirm.length > 0;
        registerBtn.disabled = !allValid;

        return allValid;
    }

    // ── Real-time validation on input ──
    passwordInput.addEventListener('input', validatePassword);
    confirmInput.addEventListener('input', validatePassword);

    // ── Initial state ──
    registerBtn.disabled = true;

    // ── Show OTP overlay on form submit ──
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Re-validate before showing the overlay
        if (!validatePassword()) {
            return;
        }

        // Get email from form
        const emailInput = document.getElementById('email');
        const email = emailInput.value.trim();
        emailDisplay.textContent = email || 'your@email.com';

        // Reset OTP fields
        otpInputs.forEach(inp => inp.value = '');
        otpInputs[0].focus();

        // Reset timer
        resetTimer();

        // Show overlay
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // ── OTP digit input behavior ──
    otpInputs.forEach((input, index) => {
        input.addEventListener('input', function () {
            const val = this.value;
            if (!/^\d$/.test(val)) {
                this.value = '';
                return;
            }
            if (val && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });

        input.addEventListener('keydown', function (e) {
            if (e.key === 'Backspace' && !this.value && index > 0) {
                otpInputs[index - 1].focus();
            }
            if (e.key === 'ArrowLeft' && index > 0) {
                otpInputs[index - 1].focus();
                e.preventDefault();
            }
            if (e.key === 'ArrowRight' && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
                e.preventDefault();
            }
        });

        input.addEventListener('paste', function (e) {
            e.preventDefault();
            const paste = (e.clipboardData || window.clipboardData).getData('text');
            const digits = paste.replace(/\D/g, '').slice(0, 6);
            if (digits.length === 0) return;
            for (let i = 0; i < Math.min(digits.length, otpInputs.length); i++) {
                otpInputs[i].value = digits[i];
            }
            const nextIndex = Math.min(digits.length, otpInputs.length - 1);
            otpInputs[nextIndex].focus();
        });
    });

    // ── Verify OTP ──
    verifyBtn.addEventListener('click', function () {
        const code = Array.from(otpInputs).map(inp => inp.value).join('');
        if (code.length < 6) {
            alert('Please enter the complete 6-digit code.');
            return;
        }

        isVerified = true;
        alert('✅ Verification successful! Your account has been created.');
        closeModal();
    });

    // ── Resend OTP ──
    resendBtn.addEventListener('click', function () {
        resetTimer();
        alert('📧 A new verification code has been sent to your email.');
    });

    function resetTimer() {
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }
        countdownSeconds = 60;
        resendBtn.disabled = true;
        resendTimer.textContent = `Resend code in ${countdownSeconds}s`;
        countdownInterval = setInterval(() => {
            countdownSeconds--;
            if (countdownSeconds <= 0) {
                clearInterval(countdownInterval);
                countdownInterval = null;
                resendBtn.disabled = false;
                resendTimer.textContent = 'Resend code now';
            } else {
                resendTimer.textContent = `Resend code in ${countdownSeconds}s`;
            }
        }, 1000);
    }

    // ── Close OTP overlay ──
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }
        resendBtn.disabled = true;
        resendTimer.textContent = 'Resend code in 60s';
    }

    closeModalBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // ── Keyboard support ──
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && modal.classList.contains('active')) {
            verifyBtn.click();
        }
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // ── Auto-focus first OTP input when overlay opens ──
    const observer = new MutationObserver(() => {
        if (modal.classList.contains('active')) {
            setTimeout(() => otpInputs[0].focus(), 100);
        }
    });
    observer.observe(modal, { attributes: true, attributeFilter: ['class'] });

})();