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
        sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
    });

    overlay.addEventListener('click', closeSidebar);

    window.addEventListener('resize', function () {
        if (window.innerWidth > 900) closeSidebar();
    });

    sidebar.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.addEventListener('click', function () {
            if (window.innerWidth <= 900 && !this.classList.contains('logout')) {
                closeSidebar();
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

    // ─── Conversations data ───
    const conversations = {
        aldrin: {
            name: 'Aldrin Santiago',
            messages: [
                {
                    type: 'received',
                    text: 'Good day, Doc! Can I reschedule my Appointment?',
                    time: '2026-03-17 10:19 AM'
                },
                {
                    type: 'sent',
                    text: 'Good day, Mr. Santiago! We can certainly help with that.',
                    time: '2026-03-17 10:19 AM'
                }
            ]
        },
        mikaela: {
            name: 'Mikaela Celani',
            messages: [
                {
                    type: 'received',
                    text: 'Good day, are your clinic open?',
                    time: '2026-03-16 09:00 AM'
                },
                {
                    type: 'sent',
                    text: 'Yes, we are open from 8 AM to 5 PM, Monday to Saturday.',
                    time: '2026-03-16 09:05 AM'
                }
            ]
        },
        gian: {
            name: 'Gian Bernardino',
            messages: [
                {
                    type: 'received',
                    text: 'Thank you for your confirmation Mr. Jarsdel!',
                    time: '2026-03-15 02:30 PM'
                },
                {
                    type: 'sent',
                    text: 'You are welcome! Please let us know if you need anything else.',
                    time: '2026-03-15 02:35 PM'
                }
            ]
        }
    };

    // ─── DOM references ───
    const convList = document.getElementById('convList');
    const chatHeaderName = document.getElementById('chatHeaderName');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');
    const convSearch = document.getElementById('convSearch');

    // ─── Render conversation list ───
    function renderConvList() {
        convList.innerHTML = '';
        Object.keys(conversations).forEach((key, index) => {
            const conv = conversations[key];
            const item = document.createElement('div');
            item.className = `conv-item${index === 0 ? ' active' : ''}`;
            item.dataset.conv = key;
            item.innerHTML = `
                <div class="conv-avatar">
                    <i class="bi bi-person-fill"></i>
                </div>
                <div class="conv-info">
                    <div class="conv-name">${conv.name}</div>
                    <div class="conv-preview">${conv.messages[conv.messages.length - 1].text}</div>
                </div>
            `;
            convList.appendChild(item);
        });

        // Attach click events
        document.querySelectorAll('.conv-item').forEach(item => {
            item.addEventListener('click', function () {
                document.querySelectorAll('.conv-item').forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                renderMessages(this.dataset.conv);
            });
        });
    }

    // ─── Render messages for a conversation ───
    function renderMessages(convKey) {
        const conv = conversations[convKey];
        if (!conv) return;
        chatHeaderName.textContent = conv.name;
        chatMessages.innerHTML = '';
        conv.messages.forEach(msg => {
            const row = document.createElement('div');
            row.className = `msg-row msg-${msg.type}`;
            row.innerHTML = `
                <div class="msg-bubble">${escapeHtml(msg.text)}</div>
                <div class="msg-time">${msg.time}</div>
            `;
            chatMessages.appendChild(row);
        });
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // ─── Send message ───
    function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        const activeItem = document.querySelector('.conv-item.active');
        if (!activeItem) return;
        const convKey = activeItem.dataset.conv;
        const conv = conversations[convKey];
        if (!conv) return;

        const now = new Date();
        const timeStr = now.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).replace(',', '');

        const newMsg = { type: 'sent', text: text, time: timeStr };
        conv.messages.push(newMsg);

        // Update preview in conversation list
        activeItem.querySelector('.conv-preview').textContent = text;

        chatInput.value = '';
        renderMessages(convKey);
    }

    // ─── Search conversations ───
    convSearch.addEventListener('input', function () {
        const q = this.value.toLowerCase();
        document.querySelectorAll('.conv-item').forEach(item => {
            const name = item.querySelector('.conv-name').textContent.toLowerCase();
            const preview = item.querySelector('.conv-preview').textContent.toLowerCase();
            item.style.display = (name.includes(q) || preview.includes(q)) ? '' : 'none';
        });
    });

    // ─── Helpers ───
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(text));
        return div.innerHTML;
    }

    // ─── Event listeners ───
    chatSendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // ─── Init ───
    renderConvList();
    renderMessages('aldrin');

})();