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
        if (window.innerWidth > 900) closeSidebar();
    });
    sidebar.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.addEventListener('click', function (e) {
            if (window.innerWidth <= 900 && !this.classList.contains('logout')) {
                closeSidebar();
            }
        });
    });

    // ─── Retrieve selected services from localStorage ───
    let selectedServices = [];
    try {
        const stored = localStorage.getItem('selectedServices');
        if (stored) {
            selectedServices = JSON.parse(stored);
        }
    } catch (e) {}

    if (!selectedServices || selectedServices.length === 0) {
        // Redirect back if no services selected
        window.location.href = 'admin-book-appointment.html';
        return;
    }

    // ─── Populate selected services list ───
    const servicesList = document.getElementById('selectedServicesList');
    let totalDuration = 0;
    let totalCost = 0;

    selectedServices.forEach(service => {
        const div = document.createElement('div');
        div.className = 'selected-service-row';
        div.innerHTML = `
            <span class="service-name">${service.name}</span>
            <span class="service-duration">${service.duration} mins</span>
        `;
        servicesList.appendChild(div);
        totalDuration += service.duration;
        totalCost += service.price;
    });

    document.getElementById('totalDurationDisplay').textContent = totalDuration + ' mins';
    document.getElementById('totalCostDisplay').textContent = '₱' + totalCost.toLocaleString();

    // ─── Date picker (set min to today) ───
    const dateInput = document.getElementById('appointmentDate');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
    dateInput.value = today;

    // ─── Time selection ───
    const timeBtns = document.querySelectorAll('.time-btn');
    let selectedTime = null;

    timeBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            timeBtns.forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            selectedTime = this.dataset.time;
        });
    });

    // ─── Form inputs ───
    const fullName = document.getElementById('fullName');
    const contactNumber = document.getElementById('contactNumber');
    const email = document.getElementById('email');
    const notes = document.getElementById('notes');

    // ─── Back button ───
    document.getElementById('backBtn').addEventListener('click', function () {
        window.location.href = 'admin-book-appointment.html';
    });

    // ─── Confirm button ───
    document.getElementById('confirmBtn').addEventListener('click', function () {
        // Validate
        if (!dateInput.value) {
            alert('Please select a date.');
            return;
        }
        if (!selectedTime) {
            alert('Please select a time.');
            return;
        }
        if (!fullName.value.trim()) {
            alert('Please enter your full name.');
            return;
        }
        if (!contactNumber.value.trim()) {
            alert('Please enter your contact number.');
            return;
        }
        if (!email.value.trim() || !email.value.includes('@')) {
            alert('Please enter a valid email address.');
            return;
        }

        // Build confirmation data
        const dateObj = new Date(dateInput.value);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = dateObj.toLocaleDateString('en-US', options);

        // Show confirmation modal
        document.getElementById('confirmDate').textContent = formattedDate;
        document.getElementById('confirmTime').textContent = selectedTime;
        document.getElementById('confirmName').textContent = fullName.value.trim();
        document.getElementById('confirmPhone').textContent = contactNumber.value.trim();
        document.getElementById('confirmEmail').textContent = email.value.trim();

        const confirmList = document.getElementById('confirmServicesList');
        confirmList.innerHTML = '';
        selectedServices.forEach(service => {
            const li = document.createElement('li');
            li.textContent = service.name + ' – ' + service.duration + ' mins';
            confirmList.appendChild(li);
        });

        document.getElementById('confirmTotalCount').textContent = selectedServices.length;
        document.getElementById('confirmTotalDuration').textContent = totalDuration + ' mins';
        document.getElementById('confirmTotalCost').textContent = '₱' + totalCost.toLocaleString();

        // Show modal
        document.getElementById('confirmationModal').classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // ─── Modal actions ───
    document.getElementById('homeBtn').addEventListener('click', function () {
        window.location.href = 'admin-dash.html';
    });

    document.getElementById('downloadBtn').addEventListener('click', function () {
        alert('Download receipt functionality would go here.');
    });

    // Close modal on overlay click
    document.getElementById('confirmationModal').addEventListener('click', function (e) {
        if (e.target === this) {
            this.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Escape key to close modal
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('confirmationModal');
            if (modal.classList.contains('active')) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });

})();