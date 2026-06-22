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
        if (e.key === 'Escape' && patientModal.classList.contains('active')) {
            closePatientModal();
        }
    });

    // ─── Patients data ───
    const patients = [
        {
            name: 'Ronan Slade Lopez',
            sex: 'Male',
            birthdate: '08/04/1985',
            contact: 'ronanidl@gmail.com',
            address: '123 Tangos Baliuag Sulacan',
            insurance: 'None',
            // full details for modal
            contactNo: '09234534567',
            fullAddress: 'Tangos, Baliuag, Bulacan',
            occupation: 'Engineer',
            email: 'ronanside@gmail.com',
            age: '26',
            gender: 'Male',
            dob: '06/25/2000',
            effective: 'N/A',
            prevDentist: 'Dr. Marie Roque',
            lastVisit: 'March 23, 2026',
            physician: 'Dr. Marie Roque',
            clinicAddr: 'Tangos Baliuag, Bulacan',
            specialty: 'None',
            officeNum: '09345678',
            questions: [
                '1. Are you in good health? Yes',
                '2. Are you under medical treatment now? No',
                '3. Have you ever had serious illness or surgical operation? No',
                '4. Have you ever been hospitalized? No',
                '5. Are taking any prescription/non-prescription medication? No',
                '6. Do you use tobacco products? No',
                '7. Do you use alcohol, cocaine, or other dangerous drugs? No'
            ]
        },
        {
            name: 'MJ Dela Cruz',
            sex: 'Female',
            birthdate: '08/31/2004',
            contact: 'mjdelscruz@gmail.com',
            address: '232 Sulivan Baliuag Sulacan',
            insurance: 'None',
            contactNo: '09123456789',
            fullAddress: 'Sulivan, Baliuag, Bulacan',
            occupation: 'Student',
            email: 'mjdelscruz@gmail.com',
            age: '21',
            gender: 'Female',
            dob: '08/31/2004',
            effective: 'N/A',
            prevDentist: 'Dr. Mario Roque',
            lastVisit: 'February 15, 2026',
            physician: 'Dr. Lisa Park',
            clinicAddr: 'Baliuag Medical Center',
            specialty: 'Pediatrics',
            officeNum: '09123456789',
            questions: [
                '1. Are you in good health? Yes',
                '2. Are you under medical treatment now? No',
                '3. Have you ever had serious illness or surgical operation? No',
                '4. Have you ever been hospitalized? No',
                '5. Are taking any prescription/non-prescription medication? No',
                '6. Do you use tobacco products? No',
                '7. Do you use alcohol, cocaine, or other dangerous drugs? No'
            ]
        },
        {
            name: 'Alvin Ramos',
            sex: 'Male',
            birthdate: '10/04/2000',
            contact: 'alvinmrs@gmail.com',
            address: '445 Sulivan Baliuag Sulacan',
            insurance: 'None',
            contactNo: '09234567890',
            fullAddress: 'Sulivan, Baliuag, Bulacan',
            occupation: 'Architect',
            email: 'alvinmrs@gmail.com',
            age: '25',
            gender: 'Male',
            dob: '10/04/2000',
            effective: 'N/A',
            prevDentist: 'Dr. James Wilson',
            lastVisit: 'January 10, 2026',
            physician: 'Dr. James Wilson',
            clinicAddr: 'Baliuag Dental Clinic',
            specialty: 'None',
            officeNum: '09456789012',
            questions: [
                '1. Are you in good health? Yes',
                '2. Are you under medical treatment now? No',
                '3. Have you ever had serious illness or surgical operation? No',
                '4. Have you ever been hospitalized? No',
                '5. Are taking any prescription/non-prescription medication? No',
                '6. Do you use tobacco products? No',
                '7. Do you use alcohol, cocaine, or other dangerous drugs? No'
            ]
        },
        {
            name: 'Cardo Dantes',
            sex: 'Male',
            birthdate: '08/31/1996',
            contact: 'cardodantes@gmail.com',
            address: '276 Sulivan Baliuag Sulacan',
            insurance: 'None',
            contactNo: '09345678901',
            fullAddress: 'Sulivan, Baliuag, Bulacan',
            occupation: 'Police Officer',
            email: 'cardodantes@gmail.com',
            age: '29',
            gender: 'Male',
            dob: '08/31/1996',
            effective: 'N/A',
            prevDentist: 'Dr. Lisa Park',
            lastVisit: 'December 5, 2025',
            physician: 'Dr. Maria Santos',
            clinicAddr: 'Baliuag General Hospital',
            specialty: 'Orthopedics',
            officeNum: '09567890123',
            questions: [
                '1. Are you in good health? Yes',
                '2. Are you under medical treatment now? No',
                '3. Have you ever had serious illness or surgical operation? No',
                '4. Have you ever been hospitalized? No',
                '5. Are taking any prescription/non-prescription medication? No',
                '6. Do you use tobacco products? No',
                '7. Do you use alcohol, cocaine, or other dangerous drugs? No'
            ]
        },
        {
            name: 'Les Torizio',
            sex: 'Female',
            birthdate: '11/04/2005',
            contact: 'lextribio@gmail.com',
            address: '169 Tilapyong Baliuag Sulacan',
            insurance: 'None',
            contactNo: '09678901234',
            fullAddress: 'Tilapyong, Baliuag, Bulacan',
            occupation: 'Student',
            email: 'lextribio@gmail.com',
            age: '20',
            gender: 'Female',
            dob: '11/04/2005',
            effective: 'N/A',
            prevDentist: 'Dr. Mario Roque',
            lastVisit: 'November 20, 2025',
            physician: 'Dr. James Wilson',
            clinicAddr: 'Baliuag Dental Center',
            specialty: 'None',
            officeNum: '09789012345',
            questions: [
                '1. Are you in good health? Yes',
                '2. Are you under medical treatment now? No',
                '3. Have you ever had serious illness or surgical operation? No',
                '4. Have you ever been hospitalized? No',
                '5. Are taking any prescription/non-prescription medication? No',
                '6. Do you use tobacco products? No',
                '7. Do you use alcohol, cocaine, or other dangerous drugs? No'
            ]
        }
    ];

    const tableBody = document.getElementById('tableBody');
    const searchInput = document.getElementById('searchInput');

    // ─── Render table ───
    function renderTable(filterText) {
        const filtered = patients.filter(p => 
            p.name.toLowerCase().includes(filterText.toLowerCase())
        );
        if (filtered.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 30px 0; color: var(--text-muted);">No patients found.</td></tr>`;
            return;
        }
        let html = '';
        filtered.forEach((p, index) => {
            html += `
                <tr>
                    <td>${p.name}</td>
                    <td>${p.sex}</td>
                    <td>${p.birthdate}</td>
                    <td>${p.contact}</td>
                    <td>${p.address}</td>
                    <td>${p.insurance}</td>
                    <td>
                        <button class="btn-view-patient" data-index="${index}">
                            <i class="bi bi-eye"></i> View
                        </button>
                    </td>
                </tr>
            `;
        });
        tableBody.innerHTML = html;

        // Attach click events to View buttons
        document.querySelectorAll('.btn-view-patient').forEach(btn => {
            btn.addEventListener('click', function () {
                const idx = parseInt(this.dataset.index);
                // Find the actual patient data (filtered may have different indices)
                const filteredPatients = patients.filter(p => 
                    p.name.toLowerCase().includes(searchInput.value.toLowerCase())
                );
                if (filteredPatients[idx]) {
                    openPatientModal(filteredPatients[idx]);
                }
            });
        });
    }

    // ─── Patient Modal ───
    const patientModal = document.getElementById('patientModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalViewBtn = document.getElementById('modalViewBtn');

    function openPatientModal(patient) {
        // Fill modal fields
        document.getElementById('modalName').textContent = patient.name;
        document.getElementById('modalContact').textContent = patient.contactNo || patient.contact;
        document.getElementById('modalAddress').textContent = patient.fullAddress || patient.address;
        document.getElementById('modalOccupation').textContent = patient.occupation || 'N/A';
        document.getElementById('modalEmail').textContent = patient.email || patient.contact;
        document.getElementById('modalAge').textContent = patient.age || 'N/A';
        document.getElementById('modalGender').textContent = patient.gender || patient.sex;
        document.getElementById('modalDob').textContent = patient.dob || patient.birthdate;
        document.getElementById('modalInsurance').textContent = patient.insurance || 'None';
        document.getElementById('modalEffective').textContent = patient.effective || 'N/A';

        document.getElementById('modalPrevDentist').textContent = patient.prevDentist || 'N/A';
        document.getElementById('modalLastVisit').textContent = patient.lastVisit || 'N/A';

        document.getElementById('modalPhysician').textContent = patient.physician || 'N/A';
        document.getElementById('modalClinicAddr').textContent = patient.clinicAddr || 'N/A';
        document.getElementById('modalSpecialty').textContent = patient.specialty || 'None';
        document.getElementById('modalOfficeNum').textContent = patient.officeNum || 'N/A';

        // Medical questions
        const questionsList = document.getElementById('modalQuestions');
        if (patient.questions) {
            questionsList.innerHTML = patient.questions.map(q => `<li><strong>${q.split('?')[0]}?</strong>${q.split('?')[1] || ''}</li>`).join('');
        } else {
            questionsList.innerHTML = `<li>No medical history recorded.</li>`;
        }

        patientModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closePatientModal() {
        patientModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    modalCloseBtn.addEventListener('click', closePatientModal);
    modalViewBtn.addEventListener('click', function () {
        // Placeholder for additional action – you can customize this
        alert('View action – you can add further functionality here.');
    });

    patientModal.addEventListener('click', function (e) {
        if (e.target === patientModal) {
            closePatientModal();
        }
    });

    // ─── Search ───
    searchInput.addEventListener('input', function () {
        renderTable(this.value);
    });

    // ─── Initial render ───
    renderTable('');

})();