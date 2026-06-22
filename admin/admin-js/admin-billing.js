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
        if (e.key === 'Escape' && billModal.classList.contains('active')) {
            closeBillModal();
        }
    });

    // ─── Billing data with full details ───
    const bills = [
        {
            billNumber: 'BILL-0016',
            invoiceDate: '03-20-2026',
            patientName: 'Ronan Slade Lopez',
            service: 'Orthodontic Treatment',
            amount: 1000,
            status: 'Paid',
            patientAge: '26',
            patientAddress: '134 Baliuag Bulacan',
            patientGender: 'Male',
            treatmentDate: 'March 20, 2025',
            procedure: 'Adjust',
            dentist: 'Dr. Bobbie Salazar',
            amountCharged: '1,000',
            amountPaid: '1,000',
            balance: '23,000',
            nextBill: '1,000 | 04-20-2026'
        },
        {
            billNumber: 'BILL-0017',
            invoiceDate: '03-20-2026',
            patientName: 'Mary Ann Cunanan',
            service: 'Dental Consultation',
            amount: 8000,
            status: 'Paid',
            patientAge: '34',
            patientAddress: '45 Mabini St, Baliuag Bulacan',
            patientGender: 'Female',
            treatmentDate: 'March 20, 2025',
            procedure: 'Consultation',
            dentist: 'Dr. Lisa Park',
            amountCharged: '8,000',
            amountPaid: '8,000',
            balance: '0',
            nextBill: 'N/A'
        },
        {
            billNumber: 'BILL-0018',
            invoiceDate: '03-20-2026',
            patientName: 'Sally San Pedro',
            service: 'Cleaning',
            amount: 500,
            status: 'Paid',
            patientAge: '28',
            patientAddress: '12 Rizal Ave, Baliuag Bulacan',
            patientGender: 'Female',
            treatmentDate: 'March 20, 2025',
            procedure: 'Prophylaxis',
            dentist: 'Dr. James Wilson',
            amountCharged: '500',
            amountPaid: '500',
            balance: '0',
            nextBill: 'N/A'
        },
        {
            billNumber: 'BILL-0019',
            invoiceDate: '03-20-2026',
            patientName: 'Janroas Ramirez',
            service: 'Veneers',
            amount: 9000,
            status: 'Paid',
            patientAge: '45',
            patientAddress: '78 Del Pilar St, Baliuag Bulacan',
            patientGender: 'Male',
            treatmentDate: 'March 20, 2025',
            procedure: 'Placement',
            dentist: 'Dr. Abbiee Salazar',
            amountCharged: '9,000',
            amountPaid: '9,000',
            balance: '0',
            nextBill: 'N/A'
        },
        {
            billNumber: 'BILL-0020',
            invoiceDate: '03-21-2026',
            patientName: 'Maria Santos',
            service: 'Root Canal',
            amount: 2500,
            status: 'Pending',
            patientAge: '32',
            patientAddress: '56 Luna St, Baliuag Bulacan',
            patientGender: 'Female',
            treatmentDate: 'March 21, 2025',
            procedure: 'Endodontic Therapy',
            dentist: 'Dr. Lisa Park',
            amountCharged: '2,500',
            amountPaid: '0',
            balance: '2,500',
            nextBill: '2,500 | 04-21-2026'
        },
        {
            billNumber: 'BILL-0021',
            invoiceDate: '03-21-2026',
            patientName: 'Jake Dela Cruz',
            service: 'Tooth Extraction',
            amount: 1500,
            status: 'Pending',
            patientAge: '55',
            patientAddress: '23 Bonifacio St, Baliuag Bulacan',
            patientGender: 'Male',
            treatmentDate: 'March 21, 2025',
            procedure: 'Surgical Extraction',
            dentist: 'Dr. James Wilson',
            amountCharged: '1,500',
            amountPaid: '0',
            balance: '1,500',
            nextBill: '1,500 | 04-21-2026'
        }
    ];

    const tableBody = document.getElementById('tableBody');
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');

    // ─── Render table ───
    function renderTable(searchText, filterStatus) {
        const filtered = bills.filter(bill => {
            const matchesSearch = bill.patientName.toLowerCase().includes(searchText.toLowerCase()) ||
                                  bill.billNumber.toLowerCase().includes(searchText.toLowerCase());
            const matchesStatus = filterStatus === 'all' || bill.status === filterStatus;
            return matchesSearch && matchesStatus;
        });

        if (filtered.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 30px 0; color: var(--text-muted);">No bills found.</td></tr>`;
            return;
        }

        let html = '';
        filtered.forEach((bill, index) => {
            const statusClass = bill.status.toLowerCase();
            html += `
                <tr>
                    <td>${bill.billNumber}</td>
                    <td>${bill.invoiceDate}</td>
                    <td>${bill.patientName}</td>
                    <td>${bill.service}</td>
                    <td>${bill.amount.toLocaleString()}</td>
                    <td><span class="status-badge ${statusClass}">${bill.status}</span></td>
                    <td>
                        <div class="action-btns">
                            <button class="btn-view" data-index="${index}"><i class="bi bi-eye"></i> View</button>
                            <button class="btn-edit" data-index="${index}"><i class="bi bi-pencil"></i> Edit</button>
                        </div>
                    </td>
                </tr>
            `;
        });
        tableBody.innerHTML = html;

        // Attach View button events
        document.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', function () {
                const idx = parseInt(this.dataset.index);
                const filteredBills = bills.filter(bill => {
                    const matchesSearch = bill.patientName.toLowerCase().includes(searchInput.value.toLowerCase()) ||
                                          bill.billNumber.toLowerCase().includes(searchInput.value.toLowerCase());
                    const matchesStatus = statusFilter.value === 'all' || bill.status === statusFilter.value;
                    return matchesSearch && matchesStatus;
                });
                if (filteredBills[idx]) {
                    openBillModal(filteredBills[idx]);
                }
            });
        });

        // Attach Edit button events (placeholder)
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', function () {
                const idx = parseInt(this.dataset.index);
                const filteredBills = bills.filter(bill => {
                    const matchesSearch = bill.patientName.toLowerCase().includes(searchInput.value.toLowerCase()) ||
                                          bill.billNumber.toLowerCase().includes(searchInput.value.toLowerCase());
                    const matchesStatus = statusFilter.value === 'all' || bill.status === statusFilter.value;
                    return matchesSearch && matchesStatus;
                });
                if (filteredBills[idx]) {
                    alert('Edit bill: ' + filteredBills[idx].billNumber);
                }
            });
        });

        // Update stats
        updateStats(filtered);
    }

    // ─── Update stats ───
    function updateStats(filtered) {
        const totalRevenue = filtered.reduce((sum, bill) => sum + bill.amount, 0);
        const pendingTotal = filtered.filter(b => b.status === 'Pending').reduce((sum, bill) => sum + bill.amount, 0);
        document.getElementById('totalRevenue').textContent = totalRevenue.toLocaleString();
        document.getElementById('pendingTotal').textContent = pendingTotal.toLocaleString();
    }

    // ─── Bill Modal ───
    const billModal = document.getElementById('billModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalCloseAction = document.getElementById('modalCloseAction');
    const modalDownloadAction = document.getElementById('modalDownloadAction');

    function openBillModal(bill) {
        // Billing Details
        document.getElementById('modalBillNumber').textContent = bill.billNumber;
        document.getElementById('modalInvoiceDate').textContent = bill.invoiceDate;

        // Patient Information
        document.getElementById('modalPatientName').textContent = bill.patientName;
        document.getElementById('modalPatientAge').textContent = bill.patientAge || 'N/A';
        document.getElementById('modalPatientAddress').textContent = bill.patientAddress || 'N/A';
        document.getElementById('modalPatientGender').textContent = bill.patientGender || 'N/A';

        // Treatment Record
        document.getElementById('modalDate').textContent = bill.treatmentDate || bill.invoiceDate;
        document.getElementById('modalService').textContent = bill.service;
        document.getElementById('modalProcedure').textContent = bill.procedure || 'N/A';
        document.getElementById('modalDentist').textContent = bill.dentist || 'N/A';
        document.getElementById('modalAmountCharged').textContent = bill.amountCharged || bill.amount.toLocaleString();
        document.getElementById('modalAmountPaid').textContent = bill.amountPaid || '0';
        document.getElementById('modalBalance').textContent = bill.balance || '0';

        // Next Monthly Bill
        document.getElementById('modalNextBill').textContent = bill.nextBill || 'N/A';

        billModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeBillModal() {
        billModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    modalCloseBtn.addEventListener('click', closeBillModal);
    modalCloseAction.addEventListener('click', closeBillModal);

    modalDownloadAction.addEventListener('click', function () {
        alert('Downloading bill... (functionality can be added here)');
    });

    billModal.addEventListener('click', function (e) {
        if (e.target === billModal) {
            closeBillModal();
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