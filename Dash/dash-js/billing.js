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

    // ─── Bill Modal logic ───
    const modalOverlay = document.getElementById('billModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalCloseAction = document.getElementById('modalCloseAction');
    const modalDownloadAction = document.getElementById('modalDownloadAction');
    const viewButtons = document.querySelectorAll('.btn-view');
    const downloadButtons = document.querySelectorAll('.btn-download');

    // Toast elements
    const toast = document.getElementById('downloadToast');
    const toastClose = document.getElementById('toastCloseBtn');

    // Helper: show toast
    function showToast() {
        toast.classList.add('show');
        clearTimeout(toast._hideTimer);
        toast._hideTimer = setTimeout(function () {
            toast.classList.remove('show');
        }, 4000);
    }

    function hideToast() {
        toast.classList.remove('show');
        clearTimeout(toast._hideTimer);
    }

    // Helper: open modal with bill data
    function openModal(billId) {
        // In a real app, you would fetch data from an API or use a lookup.
        // For demo, we update the fields with static data.
        document.getElementById('modalBillNumber').textContent = billId;
        // You could also update other fields based on the bill ID.
        // For now, we keep the static data shown in the template.
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // View Bill buttons
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            const billId = this.dataset.billId || 'BILL-B0016';
            openModal(billId);
        });
    });

    // Close modal events
    modalCloseBtn.addEventListener('click', closeModal);
    modalCloseAction.addEventListener('click', closeModal);

    modalOverlay.addEventListener('click', function (e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            if (modalOverlay.classList.contains('active')) {
                closeModal();
            }
            hideToast();
        }
    });

    // Download button in modal
    modalDownloadAction.addEventListener('click', function () {
        showToast();
        // Optionally close modal after download
        // closeModal();
    });

    // Download buttons on the bill list
    downloadButtons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            showToast();
        });
    });

    // Toast close button
    toastClose.addEventListener('click', hideToast);

})();