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

    // ── Form Submit ──
    const form = document.getElementById('loginForm');
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Simple validation
        const email = document.getElementById('email');
        const password = document.getElementById('password');

        if (!email.value || !password.value) {
            alert('Please fill in all required fields.');
            return;
        }

        // For demo purposes, just log and show success
        console.log('Login attempt:', { email: email.value, rememberMe: document.getElementById('rememberMe').checked });
        alert('✅ Login successful! (Demo)');
        // window.location.href = '/dashboard'; // uncomment when backend ready
    });

})();