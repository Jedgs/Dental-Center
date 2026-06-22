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

    // ─── Appointments data ───
    const appointments = [
        { name: 'Rade Tejano', date: '2026-04-29', time: '5:00 PM', service: 'Cleaning', dentist: 'Dr. James Wilson', status: 'Pending' },
        { name: 'Lea Santos', date: '2026-04-18', time: '12:00 PM', service: 'Dental Consultation', dentist: 'Dr. Lisa Park', status: 'Pending' },
        { name: 'Van Santos', date: '2026-04-10', time: '9:00 AM', service: 'Odontectomy', dentist: 'Dr. Lisa Park', status: 'Cancelled' },
        { name: 'Andrea Santillan', date: '2026-03-28', time: '1:00 PM', service: 'Veneers', dentist: 'Dr. Lisa Park', status: 'Cancelled' },
        { name: 'Rayleen Mariano', date: '2026-03-28', time: '10:00 AM', service: 'Tooth Bleaching/Partial', dentist: 'Dr. James Wilson', status: 'Cancelled' },
        { name: 'Marie San Pedro', date: '2026-03-25', time: '9:00 AM', service: 'Dental Consultation', dentist: 'Dr. James Wilson', status: 'Completed' },
        { name: 'Ivan Lee', date: '2025-02-26', time: '9:00 AM', service: 'Oral Prophylaxis', dentist: 'Dr. Lisa Park', status: 'Completed' },
        { name: 'Adric Vallejo', date: '2025-02-20', time: '9:00 AM', service: 'Cleaning', dentist: 'Dr. James Wilson', status: 'Completed' },
        { name: 'Romeo Veras', date: '2025-02-10', time: '9:00 AM', service: 'Cleaning', dentist: 'Dr. Lisa Park', status: 'Cancelled' }
    ];

    const tableBody = document.getElementById('tableBody');
    const statusFilter = document.getElementById('statusFilter');

    // ─── Render table ───
    function renderTable(filterStatus) {
        const filtered = filterStatus === 'all' ? appointments : appointments.filter(a => a.status === filterStatus);
        if (filtered.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 30px 0; color: var(--text-muted);">No appointments found.</td></tr>`;
            return;
        }
        let html = '';
        filtered.forEach(appt => {
            const statusClass = appt.status.toLowerCase();
            html += `
                <tr>
                    <td>${appt.name}</td>
                    <td>${appt.date}</td>
                    <td>${appt.time}</td>
                    <td>${appt.service}</td>
                    <td>${appt.dentist}</td>
                    <td><span class="status-badge ${statusClass}">${appt.status}</span></td>
                </tr>
            `;
        });
        tableBody.innerHTML = html;
    }

    // ─── Initial render ───
    renderTable('all');

    // ─── Filter change event ───
    statusFilter.addEventListener('change', function () {
        renderTable(this.value);
    });

})();