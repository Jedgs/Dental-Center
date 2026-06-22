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
        if (e.key === 'Escape') {
            if (logoutModal.classList.contains('active')) closeLogoutModal();
            if (editModal.classList.contains('active')) closeEditModal();
            if (declineModal.classList.contains('active')) closeDeclineModal();
        }
    });

    // ─── Appointments data ───
    let appointments = [
        { id: 1, patient: 'Rade Tejano', date: '2026-04-29', time: '3:00 PM', service: 'Cleaning', status: 'Pending' },
        { id: 2, patient: 'Lea Santos', date: '2026-04-18', time: '12:00 PM', service: 'Dental Consultation', status: 'Pending' },
        { id: 3, patient: 'Van Santos', date: '2026-04-10', time: '9:00 AM', service: 'Odontectomy', status: 'Scheduled' },
        { id: 4, patient: 'Andrea Santillan', date: '2026-03-28', time: '1:00 PM', service: 'Veneers', status: 'Scheduled' },
        { id: 5, patient: 'Rayleen Meriano', date: '2026-03-28', time: '10:00 AM', service: 'Tooth Bleaching/Partial', status: 'Pending' },
        { id: 6, patient: 'Marie San Pedro', date: '2026-03-26', time: '9:00 AM', service: 'Dental Consultation', status: 'Scheduled' },
        { id: 7, patient: 'Evan Lee', date: '2025-02-26', time: '9:00 AM', service: 'Oral Prophylaxis', status: 'Completed' },
        { id: 8, patient: 'Aldric Vallejo', date: '2025-02-20', time: '9:00 AM', service: 'Cleaning', status: 'Completed' },
        { id: 9, patient: 'Romeo Veras', date: '2025-02-10', time: '9:00 AM', service: 'Cleaning', status: 'Completed' }
    ];

    // Service list for dropdown
    const serviceList = [
        'Odontectomy',
        'Dental Consultation',
        'Orthodontic Treatment/Braces',
        'Full Denture/Complete Denture',
        'Oral Prophylaxis',
        'Jacket Crown/Fixed Bridge',
        'Veneers'
    ];

    const tableBody = document.getElementById('tableBody');
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');

    // ─── Modal refs ───
    const editModal = document.getElementById('editModal');
    const declineModal = document.getElementById('declineModal');
    const editServiceSelect = document.getElementById('editServiceSelect');
    const editDateInput = document.getElementById('editDateInput');
    const editTimeInput = document.getElementById('editTimeInput');
    const editSaveBtn = document.getElementById('editSaveBtn');
    const editModalClose = document.getElementById('editModalClose');
    const declineModalClose = document.getElementById('declineModalClose');
    const declineCancelBtn = document.getElementById('declineCancelBtn');
    const declineConfirmBtn = document.getElementById('declineConfirmBtn');

    let currentAppointmentId = null;
    let declineAppointmentId = null;

    // ─── Populate service dropdown ───
    function populateServiceDropdown() {
        editServiceSelect.innerHTML = '';
        serviceList.forEach(service => {
            const option = document.createElement('option');
            option.value = service;
            option.textContent = service;
            editServiceSelect.appendChild(option);
        });
    }
    populateServiceDropdown();

    // ─── Render table ───
    function renderTable(searchText, filterStatus) {
        const filtered = appointments.filter(appt => {
            const matchesSearch = appt.patient.toLowerCase().includes(searchText.toLowerCase()) ||
                                  appt.service.toLowerCase().includes(searchText.toLowerCase());
            const matchesStatus = filterStatus === 'all' || appt.status === filterStatus;
            return matchesSearch && matchesStatus;
        });

        if (filtered.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 30px 0; color: var(--text-muted);">No appointments found.</td></tr>`;
            return;
        }

        let html = '';
        filtered.forEach((appt) => {
            const statusClass = appt.status.toLowerCase().replace(' ', '-');
            const actions = getActions(appt);
            html += `
                <tr>
                    <td>${appt.patient}</td>
                    <td>${appt.date}</td>
                    <td>${appt.time}</td>
                    <td>${appt.service}</td>
                    <td><span class="status-badge ${statusClass}">${appt.status}</span></td>
                    <td>
                        <div class="action-btns" data-id="${appt.id}">
                            ${actions}
                        </div>
                    </td>
                </tr>
            `;
        });
        tableBody.innerHTML = html;

        // Attach event listeners to buttons
        document.querySelectorAll('.action-btns').forEach(container => {
            const id = parseInt(container.dataset.id);
            container.querySelectorAll('button').forEach(btn => {
                btn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    const action = this.dataset.action;
                    const appt = appointments.find(a => a.id === id);
                    if (!appt) return;
                    handleAction(appt, action);
                });
            });
        });
    }

    // ─── Get action buttons ───
    function getActions(appt) {
        const status = appt.status;
        let buttons = '';
        if (status === 'Pending') {
            buttons = `
                <button class="btn-accept" data-action="accept">Accept</button>
                <button class="btn-edit" data-action="edit">Edit</button>
                <button class="btn-decline" data-action="decline">Decline</button>
            `;
        } else if (status === 'Scheduled' || status === 'Service Ongoing') {
            buttons = `
                <button class="btn-edit" data-action="edit">Edit</button>
                <button class="btn-decline" data-action="decline">Decline</button>
            `;
        } else if (status === 'Completed') {
            buttons = `
                <button class="btn-complete" data-action="complete">Service Complete</button>
            `;
        }
        return buttons;
    }

    // ─── Handle actions ───
    function handleAction(appt, action) {
        if (action === 'edit') {
            openEditModal(appt);
        } else if (action === 'accept') {
            appt.status = 'Service Ongoing';
            renderTable(searchInput.value, statusFilter.value);
            alert(`Appointment for ${appt.patient} is now "Service Ongoing".`);
        } else if (action === 'decline') {
            declineAppointmentId = appt.id;
            declineModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else if (action === 'complete') {
            alert(`Service Complete for ${appt.patient}.`);
        }
    }

    // ─── Edit Modal ───
    function openEditModal(appt) {
        currentAppointmentId = appt.id;
        // Pre-fill form with current values
        editServiceSelect.value = appt.service;
        // Convert date format from "2026-04-29" to "2026-04-29" (it's already in YYYY-MM-DD)
        editDateInput.value = appt.date;
        // Convert time from "3:00 PM" to 24-hour format for time input
        const timeStr = appt.time;
        let hours, minutes;
        const match = timeStr.match(/(\d{1,2}):(\d{2})\s?(AM|PM)/i);
        if (match) {
            hours = parseInt(match[1]);
            minutes = match[2];
            const ampm = match[3].toUpperCase();
            if (ampm === 'PM' && hours !== 12) hours += 12;
            if (ampm === 'AM' && hours === 12) hours = 0;
            editTimeInput.value = `${String(hours).padStart(2, '0')}:${minutes}`;
        } else {
            editTimeInput.value = '14:15'; // fallback
        }
        editModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeEditModal() {
        editModal.classList.remove('active');
        document.body.style.overflow = '';
        currentAppointmentId = null;
    }

    editModalClose.addEventListener('click', closeEditModal);
    editModal.addEventListener('click', function (e) {
        if (e.target === editModal) closeEditModal();
    });

    // ─── Save changes ───
    editSaveBtn.addEventListener('click', function () {
        if (currentAppointmentId === null) return;
        const appt = appointments.find(a => a.id === currentAppointmentId);
        if (!appt) return;

        const newService = editServiceSelect.value;
        const newDate = editDateInput.value;
        const newTimeRaw = editTimeInput.value;

        if (!newDate || !newTimeRaw) {
            alert('Please select both date and time.');
            return;
        }

        // Convert 24-hour time to 12-hour format for display
        const parts = newTimeRaw.split(':');
        let hours = parseInt(parts[0]);
        const minutes = parts[1];
        const ampm = hours >= 12 ? 'PM' : 'AM';
        if (hours > 12) hours -= 12;
        if (hours === 0) hours = 12;
        const newTimeDisplay = `${hours}:${minutes} ${ampm}`;

        // Update appointment
        appt.service = newService;
        appt.date = newDate;
        appt.time = newTimeDisplay;

        renderTable(searchInput.value, statusFilter.value);
        closeEditModal();
        alert(`Appointment for ${appt.patient} updated successfully.`);
    });

    // ─── Decline Modal ───
    function closeDeclineModal() {
        declineModal.classList.remove('active');
        document.body.style.overflow = '';
        declineAppointmentId = null;
    }

    declineModalClose.addEventListener('click', closeDeclineModal);
    declineCancelBtn.addEventListener('click', closeDeclineModal);
    declineModal.addEventListener('click', function (e) {
        if (e.target === declineModal) closeDeclineModal();
    });

    declineConfirmBtn.addEventListener('click', function () {
        if (declineAppointmentId !== null) {
            const appt = appointments.find(a => a.id === declineAppointmentId);
            if (appt) {
                appt.status = 'Cancelled';
                renderTable(searchInput.value, statusFilter.value);
                alert(`Appointment for ${appt.patient} has been declined.`);
            }
        }
        closeDeclineModal();
    });

    // ─── Search and filter ───
    searchInput.addEventListener('input', function () {
        renderTable(this.value, statusFilter.value);
    });

    statusFilter.addEventListener('change', function () {
        renderTable(searchInput.value, this.value);
    });

    // ─── Initial render ───
    renderTable('', 'all');

})();