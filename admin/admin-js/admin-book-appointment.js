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

    // ─── Dropdown toggle for Oral Prophylaxis ───
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdownContent = document.querySelector('.dropdown-content');

    dropdownToggle.addEventListener('click', function (e) {
        e.stopPropagation();
        dropdownContent.classList.toggle('open');
        this.textContent = dropdownContent.classList.contains('open') ? 'Less Info' : 'More Info';
    });

    // ─── Service Selection Logic ───
    const mainCheckboxes = document.querySelectorAll('.service-checkbox');
    const subCheckboxes = document.querySelectorAll('.sub-service-checkbox');
    const selectedContainer = document.getElementById('selectedServicesContainer');
    const totalCount = document.getElementById('totalCount');
    const totalDuration = document.getElementById('totalDuration');
    const totalCost = document.getElementById('totalCost');
    const clearBtn = document.getElementById('clearBtn');
    const proceedBtn = document.getElementById('proceedBtn');

    // Helper to format currency
    function formatCurrency(amount) {
        return '₱' + amount.toLocaleString();
    }

    // Get all selected services (both main and sub)
    function getSelectedServices() {
        const selected = [];

        // Main checkboxes
        mainCheckboxes.forEach(cb => {
            if (cb.checked) {
                const item = cb.closest('.service-item');
                const name = item.dataset.name;
                const price = parseInt(item.dataset.price);
                const duration = parseInt(item.dataset.duration);
                selected.push({ name, price, duration });
            }
        });

        // Sub checkboxes (from Oral Prophylaxis dropdown)
        subCheckboxes.forEach(cb => {
            if (cb.checked) {
                const subItem = cb.closest('.sub-service-item');
                const name = subItem.dataset.name;
                const price = parseInt(subItem.dataset.price);
                const duration = parseInt(subItem.dataset.duration);
                selected.push({ name, price, duration });
            }
        });

        return selected;
    }

    // Update summary
    function updateSummary() {
        const selected = getSelectedServices();
        let count = selected.length;
        let duration = 0;
        let cost = 0;

        selected.forEach(service => {
            duration += service.duration;
            cost += service.price;
        });

        // Update selected list
        if (selected.length === 0) {
            selectedContainer.innerHTML = `<div class="selected-placeholder">No services selected yet.</div>`;
        } else {
            let html = '';
            selected.forEach(service => {
                html += `
                    <div class="selected-service-item">
                        <span class="sel-name">${service.name}</span>
                        <span class="sel-meta"><span class="sel-price">${formatCurrency(service.price)}</span> · ${service.duration} mins</span>
                    </div>
                `;
            });
            selectedContainer.innerHTML = html;
        }

        // Update totals
        totalCount.textContent = count;
        totalDuration.textContent = duration + ' min';
        totalCost.textContent = formatCurrency(cost);

        // Highlight main checkboxes
        mainCheckboxes.forEach(cb => {
            const item = cb.closest('.service-item');
            if (cb.checked) {
                item.classList.add('checked');
            } else {
                item.classList.remove('checked');
            }
        });

        // Highlight sub checkboxes
        subCheckboxes.forEach(cb => {
            const subItem = cb.closest('.sub-service-item');
            if (cb.checked) {
                subItem.classList.add('checked');
            } else {
                subItem.classList.remove('checked');
            }
        });
    }

    // Attach change events to all checkboxes
    mainCheckboxes.forEach(cb => {
        cb.addEventListener('change', updateSummary);
    });
    subCheckboxes.forEach(cb => {
        cb.addEventListener('change', updateSummary);
    });

    // Clear all selections
    clearBtn.addEventListener('click', function () {
        mainCheckboxes.forEach(cb => { cb.checked = false; });
        subCheckboxes.forEach(cb => { cb.checked = false; });
        updateSummary();
    });

    // Proceed to schedule
    proceedBtn.addEventListener('click', function () {
        const selected = getSelectedServices();
        if (selected.length === 0) {
            alert('Please select at least one service.');
            return;
        }
        // Store selected services in localStorage
        localStorage.setItem('selectedServices', JSON.stringify(selected));
        // Redirect to booking page
        window.location.href = 'admin-book-appointment-service.html';
    });
})();