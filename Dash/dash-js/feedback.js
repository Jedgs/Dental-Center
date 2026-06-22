(function () {
    'use strict';

    // ─── Sidebar logic (same as dashboard) ───
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

    // ─── Star Rating ───
    const stars = document.querySelectorAll('.star');
    let selectedRating = 0;

    stars.forEach(star => {
        // Hover effect
        star.addEventListener('mouseenter', function () {
            const value = parseInt(this.dataset.value);
            highlightStars(value);
        });

        star.addEventListener('mouseleave', function () {
            highlightStars(selectedRating);
        });

        // Click to select
        star.addEventListener('click', function () {
            selectedRating = parseInt(this.dataset.value);
            highlightStars(selectedRating);
        });
    });

    function highlightStars(value) {
        stars.forEach(s => {
            const starVal = parseInt(s.dataset.value);
            if (starVal <= value) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });
    }

    // ─── Form submission ───
    document.getElementById('feedbackForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const category = document.getElementById('feedbackCategory').value;
        const comments = document.getElementById('comments').value.trim();

        if (!category) {
            alert('Please select a feedback category.');
            return;
        }

        if (!comments) {
            alert('Please enter your feedback.');
            return;
        }

        if (selectedRating === 0) {
            alert('Please rate your experience using the stars.');
            return;
        }

        // Simulate submission
        alert(`Thank you for your feedback!\nRating: ${selectedRating} stars\nCategory: ${category}\nComments: ${comments}`);

        // Reset form
        this.reset();
        selectedRating = 0;
        highlightStars(0);
    });

})();