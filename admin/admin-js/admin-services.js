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
            if (serviceModal.classList.contains('active')) closeServiceModal();
            if (viewModal.classList.contains('active')) closeViewModal();
        }
    });

    // ─── Services data with IDs ───
    let services = [
        { id: 1, name: 'Dental Consultation', description: 'A oral examination where the dentist evaluates your...', price: 800, time: '20 min', status: 'Active', updated: '6/15/2026' },
        { id: 2, name: 'Oral Prophylaxis', description: 'A professional dental cleaning procedure', price: 800, time: '20 min', status: 'Active', updated: '6/15/2026' },
        { id: 3, name: 'Oral Examination', description: 'Assessment of teeth, gums, and oral health.', price: 300, time: '20 min', status: 'Inactive', updated: '6/15/2026' },
        { id: 4, name: 'TMJ Consultation', description: 'Evaluation of jaw pain and temporomandibular joint...', price: 800, time: '20 min', status: 'Active', updated: '6/15/2026' }
    ];
    let nextId = 5;

    const tableBody = document.getElementById('tableBody');
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const serviceCount = document.getElementById('serviceCount');

    // ─── Render table ───
    function renderTable(searchText, filterStatus) {
        const filtered = services.filter(service => {
            const matchesSearch = service.name.toLowerCase().includes(searchText.toLowerCase()) ||
                                  service.description.toLowerCase().includes(searchText.toLowerCase());
            const matchesStatus = filterStatus === 'all' || service.status === filterStatus;
            return matchesSearch && matchesStatus;
        });

        if (filtered.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 30px 0; color: var(--text-muted);">No services found.</td></tr>`;
            serviceCount.textContent = `Showing 0 of ${services.length} services`;
            return;
        }

        let html = '';
        filtered.forEach(service => {
            const statusClass = service.status.toLowerCase();
            html += `
                <tr>
                    <td><strong>${service.name}</strong></td>
                    <td>${service.description}</td>
                    <td>₱ ${service.price}</td>
                    <td>${service.time}</td>
                    <td><span class="status-badge ${statusClass}">${service.status}</span></td>
                    <td>${service.updated}</td>
                    <td>
                        <div class="dropdown">
                            <button class="action-btn" data-id="${service.id}"><i class="bi bi-three-dots-vertical"></i></button>
                            <div class="dropdown-menu" id="dropdown-${service.id}">
                                <a href="#" data-action="view" data-id="${service.id}">View</a>
                                <a href="#" data-action="edit" data-id="${service.id}">Edit</a>
                                <a href="#" data-action="deactivate" data-id="${service.id}">${service.status === 'Active' ? 'Deactivate' : 'Activate'}</a>
                                <a href="#" data-action="delete" data-id="${service.id}">Delete</a>
                            </div>
                        </div>
                    </td>
                </tr>
            `;
        });
        tableBody.innerHTML = html;

        serviceCount.textContent = `Showing ${filtered.length} of ${services.length} services`;

        // Attach dropdown toggle and actions
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                const menu = this.nextElementSibling;
                // Close any other open dropdowns
                document.querySelectorAll('.dropdown-menu.show').forEach(m => {
                    if (m !== menu) m.classList.remove('show');
                });
                menu.classList.toggle('show');
            });
        });

        document.querySelectorAll('.dropdown-menu a').forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const id = parseInt(this.dataset.id);
                const action = this.dataset.action;
                const service = services.find(s => s.id === id);
                if (!service) return;

                // Close the dropdown
                this.closest('.dropdown-menu').classList.remove('show');

                switch (action) {
                    case 'view':
                        openViewModal(service);
                        break;
                    case 'edit':
                        openEditModal(service);
                        break;
                    case 'deactivate':
                        toggleStatus(id);
                        break;
                    case 'delete':
                        deleteService(id);
                        break;
                }
            });
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', function () {
            document.querySelectorAll('.dropdown-menu.show').forEach(m => m.classList.remove('show'));
        });

        document.getElementById('pageInfo').textContent = 'Page 1 of 1';
        document.getElementById('prevPageBtn').disabled = true;
        document.getElementById('nextPageBtn').disabled = true;
    }

    // ─── Toggle status (Deactivate / Activate) ───
    function toggleStatus(id) {
        const service = services.find(s => s.id === id);
        if (!service) return;
        const newStatus = service.status === 'Active' ? 'Inactive' : 'Active';
        if (confirm(`Are you sure you want to ${newStatus === 'Active' ? 'activate' : 'deactivate'} "${service.name}"?`)) {
            service.status = newStatus;
            // Update timestamp
            const now = new Date();
            service.updated = now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
            renderTable(searchInput.value, statusFilter.value);
        }
    }

    // ─── Delete service ───
    function deleteService(id) {
        const service = services.find(s => s.id === id);
        if (!service) return;
        if (confirm(`Are you sure you want to delete "${service.name}"? This action cannot be undone.`)) {
            services = services.filter(s => s.id !== id);
            renderTable(searchInput.value, statusFilter.value);
        }
    }

    // ─── Modals ───
    const serviceModal = document.getElementById('serviceModal');
    const viewModal = document.getElementById('viewModal');
    const serviceForm = document.getElementById('serviceForm');
    const modalCancelBtn = document.getElementById('modalCancelBtn');
    const viewCloseBtn = document.getElementById('viewCloseBtn');

    // ─── Open Add Modal ───
    function openAddModal() {
        document.getElementById('modalTitle').textContent = 'Add New Dental Service';
        document.getElementById('modalSubtitle').textContent = 'Define service details, treatment options, and pricing';
        document.getElementById('modalSaveBtn').textContent = 'Save Service';
        serviceForm.reset();
        document.getElementById('serviceId').value = '';
        document.getElementById('svcStatus').checked = true;
        document.getElementById('svcStatusLabel').textContent = 'Active';
        document.getElementById('installmentFields').style.display = 'none';
        document.getElementById('svcInstallment').checked = false;
        serviceModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // ─── Open Edit Modal ───
    function openEditModal(service) {
        document.getElementById('modalTitle').textContent = 'Edit Service';
        document.getElementById('modalSubtitle').textContent = 'Update service details, treatment options, and pricing';
        document.getElementById('modalSaveBtn').textContent = 'Update Service';
        document.getElementById('serviceId').value = service.id;
        document.getElementById('svcName').value = service.name;
        document.getElementById('svcDesc').value = service.description;
        document.getElementById('svcPrice').value = service.price;
        document.getElementById('svcTime').value = parseInt(service.time);
        // Status toggle
        const isActive = service.status === 'Active';
        document.getElementById('svcStatus').checked = isActive;
        document.getElementById('svcStatusLabel').textContent = isActive ? 'Active' : 'Inactive';
        // We don't store installment data yet, so we ignore that part.
        serviceModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeServiceModal() {
        serviceModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // ─── View Modal (read-only) ───
    function openViewModal(service) {
        document.getElementById('viewName').textContent = service.name;
        document.getElementById('viewDesc').textContent = service.description;
        document.getElementById('viewPrice').textContent = '₱ ' + service.price;
        document.getElementById('viewTime').textContent = service.time;
        const statusClass = service.status.toLowerCase();
        document.getElementById('viewStatus').innerHTML = `<span class="status-badge ${statusClass}">${service.status}</span>`;
        document.getElementById('viewUpdated').textContent = service.updated;
        document.getElementById('viewInstallment').textContent = 'No'; // placeholder
        viewModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeViewModal() {
        viewModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // ─── Add / Edit form submit ───
    serviceForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const id = parseInt(document.getElementById('serviceId').value) || 0;
        const name = document.getElementById('svcName').value.trim();
        const description = document.getElementById('svcDesc').value.trim();
        const status = document.getElementById('svcStatus').checked ? 'Active' : 'Inactive';
        const price = parseFloat(document.getElementById('svcPrice').value);
        const time = parseInt(document.getElementById('svcTime').value);
        const hasTypes = document.querySelector('input[name="hasTypes"]:checked').value;

        if (!name) { alert('Please enter a service name.'); return; }
        if (isNaN(price) || price <= 0) { alert('Please enter a valid price.'); return; }
        if (isNaN(time) || time <= 0) { alert('Please enter a valid estimated time.'); return; }

        const now = new Date();
        const updated = now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });

        if (id) {
            // Edit existing
            const service = services.find(s => s.id === id);
            if (service) {
                service.name = name;
                service.description = description || 'No description provided';
                service.price = price;
                service.time = time + ' min';
                service.status = status;
                service.updated = updated;
            }
        } else {
            // Add new
            const newService = {
                id: nextId++,
                name: name,
                description: description || 'No description provided',
                price: price,
                time: time + ' min',
                status: status,
                updated: updated
            };
            services.push(newService);
        }

        renderTable(searchInput.value, statusFilter.value);
        closeServiceModal();
        alert(id ? 'Service updated successfully!' : 'Service added successfully!');
    });

    // ─── Modal triggers ───
    document.getElementById('addServiceBtn').addEventListener('click', openAddModal);
    modalCancelBtn.addEventListener('click', closeServiceModal);
    serviceModal.addEventListener('click', function (e) {
        if (e.target === serviceModal) closeServiceModal();
    });
    viewCloseBtn.addEventListener('click', closeViewModal);
    viewModal.addEventListener('click', function (e) {
        if (e.target === viewModal) closeViewModal();
    });

    // ─── Toggle status label ───
    document.getElementById('svcStatus').addEventListener('change', function () {
        document.getElementById('svcStatusLabel').textContent = this.checked ? 'Active' : 'Inactive';
    });

    // ─── Toggle installment fields ───
    document.getElementById('svcInstallment').addEventListener('change', function () {
        document.getElementById('installmentFields').style.display = this.checked ? 'block' : 'none';
    });

    // ─── Search and filter ───
    searchInput.addEventListener('input', function () {
        renderTable(this.value, statusFilter.value);
    });

    statusFilter.addEventListener('change', function () {
        renderTable(searchInput.value, this.value);
    });

    // ─── Pagination (placeholder) ───
    document.getElementById('prevPageBtn').addEventListener('click', function () {
        alert('Previous page – implement pagination if needed.');
    });

    document.getElementById('nextPageBtn').addEventListener('click', function () {
        alert('Next page – implement pagination if needed.');
    });

    // ─── Initial render ───
    renderTable('', 'all');

})();