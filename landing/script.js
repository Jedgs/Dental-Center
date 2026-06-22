(function () {
    'use strict';

    const wrapper = document.getElementById('sliderWrapper');
    const track = document.getElementById('sliderTrack');
    const dotsContainer = document.getElementById('sliderDots');
    const cards = track.querySelectorAll('.slide-card');
    const total = cards.length;

    const GAP = 28;
    let visible = 3;
    let current = 0;
    let cardWidth = 0;
    let isDragging = false;
    let startX = 0;
    let startScroll = 0;
    let dragOffset = 0;
    let isAnimating = false;

    function getMaxIndex() {
        return Math.max(0, total - visible);
    }

    function getSlideWidth() {
        return cardWidth + GAP;
    }


    function calcLayout() {
        const wrapW = wrapper.offsetWidth;
        cardWidth = (wrapW - (visible - 1) * GAP) / visible;
        if (cardWidth < 80) cardWidth = 80;
        if (cardWidth > 280) cardWidth = 280;

        cards.forEach(c => {
            c.style.flex = `0 0 ${cardWidth}px`;
            c.style.minWidth = `${cardWidth}px`;
        });

        const maxIdx = getMaxIndex();
        if (current > maxIdx) current = maxIdx;
        if (current < 0) current = 0;
        track.style.transform = `translateX(-${current * getSlideWidth()}px)`;
    }

    // ── navigation ──
    function goTo(idx, animate = true) {
        if (isAnimating) return;
        const maxIdx = getMaxIndex();
        idx = Math.max(0, Math.min(idx, maxIdx));
        if (idx === current) {
            updateDots();
            return;
        }
        current = idx;
        if (!animate) {
            track.style.transition = 'none';
        } else {
            track.style.transition = 'transform 0.45s cubic-bezier(0.25, 0.8, 0.25, 1)';
        }
        track.style.transform = `translateX(-${current * getSlideWidth()}px)`;
        updateDots();

        if (!animate) {
            requestAnimationFrame(() => {
                track.style.transition = 'transform 0.45s cubic-bezier(0.25, 0.8, 0.25, 1)';
            });
        }
    }

    function next() {
        if (current < getMaxIndex()) {
            goTo(current + 1);
        } else {
            goTo(0);
        }
    }

    function prev() {
        if (current > 0) {
            goTo(current - 1);
        } else {
            goTo(getMaxIndex());
        }
    }

    function buildDots() {
        dotsContainer.innerHTML = '';
        const maxIdx = getMaxIndex();
        for (let i = 0; i <= maxIdx; i++) {
            const dot = document.createElement('button');
            dot.className = 'dot' + (i === current ? ' active' : '');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.dataset.index = i;
            dot.addEventListener('click', function (e) {
                e.stopPropagation();
                const idx = parseInt(this.dataset.index, 10);
                goTo(idx);
            });
            dotsContainer.appendChild(dot);
        }
    }

    function updateDots() {
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((d, i) => {
            d.classList.toggle('active', i === current);
        });
    }

    function handleDragStart(clientX) {
        if (isAnimating) return;
        isDragging = true;
        startX = clientX;
        startScroll = current * getSlideWidth();
        dragOffset = 0;
        wrapper.classList.add('grabbing');
        track.style.transition = 'none';
    }

    function handleDragMove(clientX) {
        if (!isDragging) return;
        const delta = clientX - startX;
        const newOffset = startScroll - delta;
        const maxOffset = getMaxIndex() * getSlideWidth();
        const clamped = Math.max(0, Math.min(newOffset, maxOffset));
        dragOffset = clamped;
        track.style.transform = `translateX(-${clamped}px)`;
    }

    function handleDragEnd(clientX) {
        if (!isDragging) return;
        isDragging = false;
        wrapper.classList.remove('grabbing');
        track.style.transition = 'transform 0.45s cubic-bezier(0.25, 0.8, 0.25, 1)';

        const delta = clientX - startX;
        const threshold = 40;

        if (Math.abs(delta) > threshold) {
            if (delta < 0 && current < getMaxIndex()) {
                goTo(current + 1);
            } else if (delta > 0 && current > 0) {
                goTo(current - 1);
            } else {
                goTo(current);
            }
        } else {
            goTo(current);
        }
    }

    // Mouse
    wrapper.addEventListener('mousedown', (e) => {
        handleDragStart(e.clientX);
    });
    window.addEventListener('mousemove', (e) => {
        handleDragMove(e.clientX);
    });
    window.addEventListener('mouseup', (e) => {
        if (isDragging) handleDragEnd(e.clientX);
    });

    // Touch
    wrapper.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        if (touch) handleDragStart(touch.clientX);
    }, { passive: true });
    wrapper.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        if (touch) handleDragMove(touch.clientX);
    }, { passive: true });
    wrapper.addEventListener('touchend', (e) => {
        if (isDragging) {
            const touch = e.changedTouches[0];
            if (touch) handleDragEnd(touch.clientX);
        }
    }, { passive: true });

    // Buttons
    document.getElementById('prevBtn').addEventListener('click', prev);
    document.getElementById('nextBtn').addEventListener('click', next);

    // Keyboard
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prev();
        if (e.key === 'ArrowRight') next();
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const oldMax = getMaxIndex();
            calcLayout();
            const newMax = getMaxIndex();
            if (newMax !== oldMax) {
                buildDots();
            }
            if (current > newMax) {
                current = newMax;
            }
            goTo(current, false);
        }, 120);
    });

    function init() {
        calcLayout();
        buildDots();
        const maxIdx = getMaxIndex();
        if (current > maxIdx) current = maxIdx;
        goTo(current, false);
    }

    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }

    window.__slider = { goTo, next, prev, current: () => current };

})();