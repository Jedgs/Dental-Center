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

    // ─── Conversation switching ───
    const convItems = document.querySelectorAll('.conv-item');
    const chatHeaderName = document.getElementById('chatHeaderName');
    const chatMessages = document.getElementById('chatMessages');

    // Static conversation data
    const conversations = {
        dental: {
            name: 'Dental Team',
            messages: [
                { type: 'received', text: 'Hello! How can I help you today?', time: '2026-03-17 10:10 AM' },
                { type: 'sent',     text: 'I would like to reschedule my appointment.', time: '2026-03-17 10:21 AM' },
                { type: 'received', text: 'Sure! Which appointment would you like to reschedule', time: '2026-03-17 10:19 AM' },
            ]
        },
        alvin: {
            name: 'Dr. Alvin Santos',
            messages: [
                { type: 'received', text: 'Your next adjustment will be on April 20, 2026. Please be on time!', time: '2026-03-10 9:00 AM' },
                { type: 'sent',     text: 'Thank you, Dr. Santos! I will be there.', time: '2026-03-10 9:05 AM' },
            ]
        }
    };

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

    convItems.forEach(item => {
        item.addEventListener('click', function () {
            convItems.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            renderMessages(this.dataset.conv);
        });
    });

    // ─── Send message ───
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');

    function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        // Find active conv key
        const activeItem = document.querySelector('.conv-item.active');
        const convKey = activeItem ? activeItem.dataset.conv : null;
        if (!convKey || !conversations[convKey]) return;

        const now = new Date();
        const timeStr = now.toLocaleString('en-US', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', hour12: true
        }).replace(',', '');

        const newMsg = { type: 'sent', text: text, time: timeStr };
        conversations[convKey].messages.push(newMsg);

        // Update preview
        if (activeItem) {
            activeItem.querySelector('.conv-preview').textContent = text;
        }

        chatInput.value = '';
        renderMessages(convKey);
    }

    chatSendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // ─── Search conversations ───
    const convSearch = document.getElementById('convSearch');
    convSearch.addEventListener('input', function () {
        const q = this.value.toLowerCase();
        convItems.forEach(item => {
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

    // Init: render first conversation
    renderMessages('dental');

})();