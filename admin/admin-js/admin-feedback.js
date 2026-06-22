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

    const logoutLink = document.querySelector('.sidebar-nav a.logout');
    if (logoutLink) {
        logoutLink.addEventListener('click', function (e) {
            e.preventDefault();
            logoutModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    function closeLogoutModal() {
        logoutModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    stayBtn.addEventListener('click', closeLogoutModal);

    confirmLogoutBtn.addEventListener('click', function () {
        window.location.href = 'index.html';
    });

    logoutModal.addEventListener('click', function (e) {
        if (e.target === logoutModal) {
            closeLogoutModal();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && logoutModal.classList.contains('active')) {
            closeLogoutModal();
        }
    });

    // ─── Reviews status filter dropdown ───
    const statusDropdown = document.getElementById('statusDropdown');
    const statusDropdownBtn = document.getElementById('statusDropdownBtn');
    const statusDropdownMenu = document.getElementById('statusDropdownMenu');
    const statusDropdownLabel = document.getElementById('statusDropdownLabel');
    const reviewItems = document.querySelectorAll('.review-item');

    if (statusDropdown && statusDropdownBtn && statusDropdownMenu) {
        statusDropdownBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            statusDropdown.classList.toggle('open');
        });

        statusDropdownMenu.querySelectorAll('li').forEach(option => {
            option.addEventListener('click', function () {
                statusDropdownMenu.querySelectorAll('li').forEach(li => li.classList.remove('active'));
                this.classList.add('active');
                statusDropdownLabel.textContent = this.textContent;

                const rating = this.dataset.rating;
                reviewItems.forEach(item => {
                    const matches = rating === 'all' || item.dataset.rating === rating;
                    item.classList.toggle('hidden', !matches);
                });

                statusDropdown.classList.remove('open');
            });
        });

        document.addEventListener('click', function (e) {
            if (!statusDropdown.contains(e.target)) {
                statusDropdown.classList.remove('open');
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                statusDropdown.classList.remove('open');
            }
        });
    }

    // ─── Download feedback (placeholder) ───
    const downloadBtn = document.getElementById('downloadFeedbackBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function () {
            alert('Downloading feedback report... (functionality can be added here)');
        });
    }

})();