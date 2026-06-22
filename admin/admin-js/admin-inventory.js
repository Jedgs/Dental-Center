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
            if (addModal.classList.contains('active')) closeAddModal();
            if (editModal.classList.contains('active')) closeEditModal();
        }
    });

    // ─── Inventory data ───
    let inventoryItems = [
        {
            id: 1,
            name: 'Gloves',
            code: 'IT0001',
            received: 2350,
            used: 350,
            stock: 200,
            status: 'In Stock',
            category: 'Disposables',
            minStock: 50,
            price: 250
        },
        {
            id: 2,
            name: 'Dental Floss',
            code: 'IT0002',
            received: 5470,
            used: 570,
            stock: 400,
            status: 'In Stock',
            category: 'Disposables',
            minStock: 50,
            price: 120
        },
        {
            id: 3,
            name: 'Cotton rolls',
            code: 'IT0003',
            received: 3456,
            used: 340,
            stock: 56,
            status: 'Low Stock',
            category: 'Disposables',
            minStock: 100,
            price: 80
        },
        {
            id: 4,
            name: 'Gauze',
            code: 'IT0004',
            received: 2345,
            used: 1300,
            stock: 1045,
            status: 'In Stock',
            category: 'Disposables',
            minStock: 200,
            price: 150
        },
        {
            id: 5,
            name: 'Face Masks',
            code: 'IT0005',
            received: 7808,
            used: 7768,
            stock: 40,
            status: 'Low Stock',
            category: 'Disposables',
            minStock: 100,
            price: 50
        }
    ];

    const tableBody = document.getElementById('tableBody');
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');

    // ─── Render table ───
    function renderTable(searchText, filterStatus) {
        const filtered = inventoryItems.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase()) ||
                                  item.code.toLowerCase().includes(searchText.toLowerCase());
            const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
            return matchesSearch && matchesStatus;
        });

        if (filtered.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 30px 0; color: var(--text-muted);">No items found.</td></tr>`;
            return;
        }

        let html = '';
        filtered.forEach((item) => {
            const statusClass = item.status.toLowerCase().replace(' ', '-');
            html += `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.code}</td>
                    <td>${item.received}</td>
                    <td>${item.used}</td>
                    <td>${item.stock}</td>
                    <td><span class="status-badge ${statusClass}">${item.status}</span></td>
                    <td>
                        <div class="action-btns">
                            <button class="btn-edit" data-id="${item.id}"><i class="bi bi-pencil"></i> Edit</button>
                            <button class="btn-delete" data-id="${item.id}"><i class="bi bi-trash"></i> Delete</button>
                        </div>
                    </td>
                </tr>
            `;
        });
        tableBody.innerHTML = html;

        // Attach Edit events
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', function () {
                const id = parseInt(this.dataset.id);
                const item = inventoryItems.find(i => i.id === id);
                if (item) openEditModal(item);
            });
        });

        // Attach Delete events
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', function () {
                const id = parseInt(this.dataset.id);
                const item = inventoryItems.find(i => i.id === id);
                if (item && confirm('Are you sure you want to delete "' + item.name + '"?')) {
                    inventoryItems = inventoryItems.filter(i => i.id !== id);
                    renderTable(searchInput.value, statusFilter.value);
                    updateStats();
                }
            });
        });

        updateStats();
    }

    // ─── Update stats ───
    function updateStats() {
        const totalItems = inventoryItems.length;
        const totalStock = inventoryItems.reduce((sum, item) => sum + item.stock, 0);
        const lowStockCount = inventoryItems.filter(item => item.status === 'Low Stock').length;
        document.getElementById('totalItems').textContent = totalItems;
        document.getElementById('totalStock').textContent = totalStock;
        document.getElementById('lowStockCount').textContent = lowStockCount;
    }

    // ─── Modal elements ───
    const addModal = document.getElementById('addModal');
    const editModal = document.getElementById('editModal');
    const addForm = document.getElementById('addForm');
    const editForm = document.getElementById('editForm');

    // ─── Add Modal ───
    function openAddModal() {
        addForm.reset();
        addModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeAddModal() {
        addModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    document.getElementById('addItemBtn').addEventListener('click', openAddModal);
    document.getElementById('addCancelBtn').addEventListener('click', closeAddModal);
    addModal.addEventListener('click', function (e) {
        if (e.target === addModal) closeAddModal();
    });

    addForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('addItemName').value.trim();
        const code = document.getElementById('addItemCode').value.trim();
        const category = document.getElementById('addCategory').value;
        const qty = parseInt(document.getElementById('addQuantity').value);
        const minStock = parseInt(document.getElementById('addMinStock').value);
        const price = parseFloat(document.getElementById('addPrice').value);

        if (!name || !code || isNaN(qty) || isNaN(minStock) || isNaN(price)) {
            alert('Please fill in all fields correctly.');
            return;
        }

        // Generate new ID
        const newId = inventoryItems.reduce((max, item) => Math.max(max, item.id), 0) + 1;
        const newItem = {
            id: newId,
            name: name,
            code: code,
            received: qty,
            used: 0,
            stock: qty,
            status: qty <= minStock ? 'Low Stock' : 'In Stock',
            category: category,
            minStock: minStock,
            price: price
        };
        inventoryItems.push(newItem);
        renderTable(searchInput.value, statusFilter.value);
        closeAddModal();
        alert('Item added successfully!');
    });

    // ─── Edit Modal ───
    let editingItemId = null;

    function openEditModal(item) {
        editingItemId = item.id;
        document.getElementById('editItemId').value = item.id;
        document.getElementById('editItemName').value = item.name;
        document.getElementById('editItemCode').value = item.code;
        document.getElementById('editCategory').value = item.category || 'Disposables';
        document.getElementById('editQuantity').value = item.received;
        document.getElementById('editMinStock').value = item.minStock || 10;
        document.getElementById('editPrice').value = item.price || 0;
        editModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeEditModal() {
        editModal.classList.remove('active');
        document.body.style.overflow = '';
        editingItemId = null;
    }

    document.getElementById('editCancelBtn').addEventListener('click', closeEditModal);
    editModal.addEventListener('click', function (e) {
        if (e.target === editModal) closeEditModal();
    });

    editForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const id = parseInt(document.getElementById('editItemId').value);
        const name = document.getElementById('editItemName').value.trim();
        const code = document.getElementById('editItemCode').value.trim();
        const category = document.getElementById('editCategory').value;
        const qty = parseInt(document.getElementById('editQuantity').value);
        const minStock = parseInt(document.getElementById('editMinStock').value);
        const price = parseFloat(document.getElementById('editPrice').value);

        if (!name || !code || isNaN(qty) || isNaN(minStock) || isNaN(price)) {
            alert('Please fill in all fields correctly.');
            return;
        }

        const item = inventoryItems.find(i => i.id === id);
        if (item) {
            const used = item.used;
            item.name = name;
            item.code = code;
            item.category = category;
            item.received = qty;
            item.minStock = minStock;
            item.price = price;
            item.stock = qty - used;
            item.status = item.stock <= minStock ? 'Low Stock' : 'In Stock';
            renderTable(searchInput.value, statusFilter.value);
            closeEditModal();
            alert('Item updated successfully!');
        }
    });

    // ─── Search and filter events ───
    searchInput.addEventListener('input', function () {
        renderTable(this.value, statusFilter.value);
    });

    statusFilter.addEventListener('change', function () {
        renderTable(searchInput.value, this.value);
    });

    // ─── Initial render ───
    renderTable('', 'all');

})();