(function () {
    'use strict';

    // ── Password Toggle ──
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

    // ── OTP Modal elements ──
    const modal = document.getElementById('otpModal');
    const emailDisplay = document.getElementById('otpEmailDisplay');
    const otpInputs = document.querySelectorAll('.otp-digit');
    const verifyBtn = document.getElementById('verifyBtn');
    const resendBtn = document.getElementById('resendBtn');
    const resendTimer = document.getElementById('resendTimer');
    const closeModalBtn = document.getElementById('closeModal');

    let countdownInterval = null;
    let countdownSeconds = 60;

    // ── Email Form Submit ──
    const emailForm = document.getElementById('forgotEmailForm');
    const resetSection = document.getElementById('resetSection');

    emailForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        if (!email) {
            alert('Please enter your email address.');
            return;
        }

        // Set email in modal
        emailDisplay.textContent = email;

        // Reset OTP fields
        otpInputs.forEach(inp => inp.value = '');
        otpInputs[0].focus();

        // Reset timer
        resetTimer();

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // ── OTP input navigation ──
    otpInputs.forEach((input, index) => {
        input.addEventListener('input', function (e) {
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
            const inputs = otpInputs;
            for (let i = 0; i < Math.min(digits.length, inputs.length); i++) {
                inputs[i].value = digits[i];
            }
            const nextIndex = Math.min(digits.length, inputs.length - 1);
            inputs[nextIndex].focus();
        });
    });

    // ── Verify OTP ──
    verifyBtn.addEventListener('click', function () {
        const code = Array.from(otpInputs).map(inp => inp.value).join('');
        if (code.length < 6) {
            alert('Please enter the complete 6-digit code.');
            return;
        }

        // Simulate verification – always succeeds
        alert('✅ Verification successful! You can now reset your password.');
        closeModal();

        // Show reset section, hide email form and links
        resetSection.classList.add('visible');
        emailForm.style.display = 'none';
        document.querySelector('.additional-links').style.display = 'none';
        resetSection.scrollIntoView({ behavior: 'smooth' });
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

    // ── Close modal ──
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

    // ── Auto-focus first OTP input ──
    const observer = new MutationObserver(() => {
        if (modal.classList.contains('active')) {
            setTimeout(() => otpInputs[0].focus(), 100);
        }
    });
    observer.observe(modal, { attributes: true, attributeFilter: ['class'] });

    // ── Reset Password Form Submit ──
    const resetForm = document.getElementById('resetPasswordForm');
    resetForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const newPw = document.getElementById('newPassword').value;
        const confirmPw = document.getElementById('confirmPassword').value;

        if (newPw.length < 6) {
            alert('Password must be at least 6 characters.');
            return;
        }
        if (newPw !== confirmPw) {
            alert('Passwords do not match.');
            return;
        }
        alert('✅ Password updated successfully! Redirecting to login...');
        // window.location.href = 'login.html'; // uncomment when ready
    });

})();