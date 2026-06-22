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

    // ─── Cancel modal logic ───
    const modalOverlay = document.getElementById('cancelModalOverlay');
    const keepBtn = document.getElementById('keepAppointmentBtn');
    const confirmCancelBtn = document.getElementById('confirmCancelBtn');
    const toast = document.getElementById('successToast');
    const toastClose = document.getElementById('toastCloseBtn');

    let pendingApptId = null;
    let pendingApptItem = null;

    function openCancelModal(apptId, apptItem) {
        pendingApptId = apptId;
        pendingApptItem = apptItem;
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCancelModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        pendingApptId = null;
        pendingApptItem = null;
    }

    function showSuccessToast(message) {
        toast.querySelector('.toast-text').textContent = message || 'Appointment Updated';
        toast.classList.add('show');
        clearTimeout(toast._hideTimer);
        toast._hideTimer = setTimeout(function () {
            toast.classList.remove('show');
        }, 3500);
    }

    function hideToast() {
        toast.classList.remove('show');
        clearTimeout(toast._hideTimer);
    }

    function confirmCancelAppointment() {
        if (pendingApptItem) {
            pendingApptItem.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            pendingApptItem.style.opacity = '0';
            pendingApptItem.style.transform = 'scale(0.95)';
            setTimeout(function () {
                if (pendingApptItem && pendingApptItem.parentNode) {
                    pendingApptItem.parentNode.removeChild(pendingApptItem);
                }
            }, 300);
        }
        closeCancelModal();
        setTimeout(function () {
            showSuccessToast('Appointment Cancelled');
        }, 200);
    }

    document.querySelectorAll('.cancel-btn').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            const apptId = this.getAttribute('data-appt-id');
            const apptItem = this.closest('.appointment-item');
            if (apptItem) {
                openCancelModal(apptId, apptItem);
            }
        });
    });

    keepBtn.addEventListener('click', closeCancelModal);
    confirmCancelBtn.addEventListener('click', confirmCancelAppointment);

    modalOverlay.addEventListener('click', function (e) {
        if (e.target === modalOverlay) {
            closeCancelModal();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            if (modalOverlay.classList.contains('active')) {
                closeCancelModal();
            }
            if (serviceModal.classList.contains('active')) {
                closeServiceModal();
            }
            if (rescheduleModal.classList.contains('active')) {
                closeRescheduleModal();
            }
            hideToast();
        }
    });

    toastClose.addEventListener('click', hideToast);

    // ─── STEP 1: Service Selection Modal ───
    const serviceModal = document.getElementById('serviceModalOverlay');
    const serviceList = document.getElementById('serviceList');
    const serviceNextBtn = document.getElementById('serviceNextBtn');
    const serviceCancelBtn = document.getElementById('serviceCancelBtn');

    let selectedService = null;
    let currentApptItemForReschedule = null;

    function openServiceModal(apptItem) {
        currentApptItemForReschedule = apptItem;
        // Reset selection
        document.querySelectorAll('.service-list li').forEach(li => li.classList.remove('selected'));
        selectedService = null;
        serviceNextBtn.disabled = true;
        serviceModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeServiceModal() {
        serviceModal.classList.remove('active');
        document.body.style.overflow = '';
        currentApptItemForReschedule = null;
        // Clean up selection
        document.querySelectorAll('.service-list li').forEach(li => li.classList.remove('selected'));
        selectedService = null;
        serviceNextBtn.disabled = true;
    }

    // Service list click handler (select)
    serviceList.addEventListener('click', function (e) {
        const li = e.target.closest('li');
        if (!li) return;

        // Deselect all
        document.querySelectorAll('.service-list li').forEach(item => item.classList.remove('selected'));
        // Select clicked
        li.classList.add('selected');
        selectedService = {
            name: li.textContent.trim(),
            price: li.dataset.price,
            duration: li.dataset.duration
        };
        serviceNextBtn.disabled = false;
    });

    serviceNextBtn.addEventListener('click', function () {
        if (!selectedService || !currentApptItemForReschedule) return;
        // Close service modal, open reschedule modal
        serviceModal.classList.remove('active');
        openRescheduleModal(currentApptItemForReschedule, selectedService);
    });

    serviceCancelBtn.addEventListener('click', closeServiceModal);
    serviceModal.addEventListener('click', function (e) {
        if (e.target === serviceModal) {
            closeServiceModal();
        }
    });

    // ─── STEP 2: Reschedule Details Modal ───
    const rescheduleModal = document.getElementById('rescheduleModalOverlay');
    const rescheduleCancelBtn = document.getElementById('rescheduleCancelBtn');
    const rescheduleUpdateBtn = document.getElementById('rescheduleUpdateBtn');
    const rescheduleServiceTitle = document.getElementById('selectedServiceTitle');
    const reschedulePrice = document.getElementById('reschedulePrice');
    const rescheduleDuration = document.getElementById('rescheduleDuration');
    const rescheduleDate = document.getElementById('rescheduleDate');
    const rescheduleTime = document.getElementById('rescheduleTime');

    let currentRescheduleItem = null;
    let currentRescheduleService = null;

    function openRescheduleModal(apptItem, service) {
        currentRescheduleItem = apptItem;
        currentRescheduleService = service;

        // Populate service details
        rescheduleServiceTitle.textContent = service.name;
        reschedulePrice.textContent = `₱${parseInt(service.price).toLocaleString()}`;
        rescheduleDuration.textContent = `${service.duration} minutes`;

        // Extract current date and time from the appointment item's meta
        const metaSpans = apptItem.querySelectorAll('.appt-meta span');
        let dateStr = '';
        let timeStr = '';
        metaSpans.forEach(span => {
            const text = span.textContent.trim();
            // Simple detection: if it contains a month name or slash
            if (text.match(/(January|February|March|April|May|June|July|August|September|October|November|December|\d{1,2}\/\d{1,2}\/\d{2,4})/i)) {
                dateStr = text;
            }
            if (text.match(/(AM|PM)/i)) {
                timeStr = text;
            }
        });

        // Set date (default to today if not found)
        let dateVal = '';
        if (dateStr) {
            const match = dateStr.match(/(\d{1,2})\s*\/\s*(\d{1,2})\s*\/\s*(\d{2,4})/);
            if (match) {
                let month = parseInt(match[1]);
                let day = parseInt(match[2]);
                let year = parseInt(match[3]);
                if (year < 100) year += 2000;
                dateVal = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            } else {
                const parts = dateStr.split(' ');
                if (parts.length >= 2) {
                    const monthName = parts[0];
                    const dayNum = parseInt(parts[1]);
                    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                    const idx = months.findIndex(m => m.toLowerCase() === monthName.toLowerCase());
                    if (idx !== -1) {
                        const now = new Date();
                        let year = now.getFullYear();
                        let month = idx + 1;
                        let day = dayNum;
                        // Check if the month/day is in the past, if so use next year
                        const testDate = new Date(year, month - 1, day);
                        if (testDate < now) year += 1;
                        dateVal = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    }
                }
            }
        }
        if (!dateVal) {
            const today = new Date();
            dateVal = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        }
        rescheduleDate.value = dateVal;

        // Set time
        let timeVal = '14:15';
        if (timeStr) {
            const match = timeStr.match(/(\d{1,2}):(\d{2})\s?(AM|PM)/i);
            if (match) {
                let hours = parseInt(match[1]);
                const minutes = match[2];
                const ampm = match[3].toUpperCase();
                if (ampm === 'PM' && hours !== 12) hours += 12;
                if (ampm === 'AM' && hours === 12) hours = 0;
                timeVal = `${String(hours).padStart(2, '0')}:${minutes}`;
            }
        }
        rescheduleTime.value = timeVal;

        rescheduleModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeRescheduleModal() {
        rescheduleModal.classList.remove('active');
        document.body.style.overflow = '';
        currentRescheduleItem = null;
        currentRescheduleService = null;
    }

    // Attach to reschedule buttons
    document.querySelectorAll('.reschedule-btn').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            const apptItem = this.closest('.appointment-item');
            if (apptItem) {
                openServiceModal(apptItem);
            }
        });
    });

    rescheduleCancelBtn.addEventListener('click', closeRescheduleModal);

    rescheduleModal.addEventListener('click', function (e) {
        if (e.target === rescheduleModal) {
            closeRescheduleModal();
        }
    });

    rescheduleUpdateBtn.addEventListener('click', function () {
        if (!currentRescheduleItem || !currentRescheduleService) return;

        const newDate = rescheduleDate.value;
        const newTime = rescheduleTime.value;

        if (!newDate || !newTime) {
            alert('Please select both date and time.');
            return;
        }

        // Format date
        const dateObj = new Date(`${newDate}T${newTime}`);

        const displayDate = dateObj.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });

        const displayTime = dateObj.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });

        // Update title
        const titleEl = currentRescheduleItem.querySelector('.appt-title');
        if (titleEl) {
            titleEl.textContent = currentRescheduleService.name;
        }

        // Update subtitle
        const subtitleEl = currentRescheduleItem.querySelector('.appt-subtitle');
        if (subtitleEl) {
            subtitleEl.textContent = 'Updated service';
        }

        // Update meta fields safely
        const metaSpans = currentRescheduleItem.querySelectorAll('.appt-meta span');

        metaSpans.forEach(span => {
            const icon = span.querySelector('i');

            if (!icon) return;

            if (icon.classList.contains('bi-tag')) {
                span.innerHTML = `<i class="bi bi-tag"></i> ${currentRescheduleService.name}`;
            }

            if (icon.classList.contains('bi-calendar3')) {
                span.innerHTML = `<i class="bi bi-calendar3"></i> ${displayDate}`;
            }

            if (icon.classList.contains('bi-clock')) {
                span.innerHTML = `<i class="bi bi-clock"></i> ${displayTime}`;
            }
        });

        closeRescheduleModal();
        showSuccessToast('Appointment Updated Successfully');
    });

})();