(function () {
    'use strict';

    // ─── Sidebar logic ───
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebarToggle');
    const overlay = document.getElementById('sidebarOverlay');

    function openSidebar() {
        sidebar.classList.add('open');
        overlay.classList.add('active');
        toggleBtn.innerHTML = '<i class="bi bi-x-lg"></i>';
    }

    function closeSidebar() {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
        toggleBtn.innerHTML = '<i class="bi bi-list"></i>';
    }

    toggleBtn.addEventListener('click', function () {
        if (sidebar.classList.contains('open')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    overlay.addEventListener('click', closeSidebar);

    window.addEventListener('resize', function () {
        if (window.innerWidth > 900) {
            closeSidebar();
        }
    });

    sidebar.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.addEventListener('click', function (e) {
            if (window.innerWidth <= 900) {
                if (!this.classList.contains('logout')) {
                    closeSidebar();
                }
            }
        });
    });

    // ─── Logout modal logic ───
    const logoutModal = document.getElementById('logoutModal');
    const stayBtn = document.getElementById('stayBtn');
    const confirmLogoutBtn = document.getElementById('confirmLogoutBtn');

    // Find the logout link in the sidebar
    const logoutLink = document.querySelector('.sidebar-nav a.logout');

    if (logoutLink) {
        logoutLink.addEventListener('click', function (e) {
            e.preventDefault(); // prevent default navigation
            openLogoutModal();
        });
    }

    function openLogoutModal() {
        logoutModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLogoutModal() {
        logoutModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Stay button – just close modal
    stayBtn.addEventListener('click', closeLogoutModal);

    // Logout button – redirect to index.html
    confirmLogoutBtn.addEventListener('click', function () {
        // Perform any logout cleanup here (clear session, etc.)
        // Then redirect
        window.location.href = '/landing/index.html';
    });

    // Close modal if user clicks outside
    logoutModal.addEventListener('click', function (e) {
        if (e.target === logoutModal) {
            closeLogoutModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && logoutModal.classList.contains('active')) {
            closeLogoutModal();
        }
    });

})();