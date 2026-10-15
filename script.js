(function () {
    'use strict';

    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    const video = $('#bgVideo');
    const progressBar = $('#progressBar');
    const nav = $('#mainNav');
    const navToggle = $('#navToggle');
    const navLinks = $('#navLinks');
    const soundToggle = $('#soundToggle');
    const sections = $$('.section');
    const navLinkEls = $$('.nav-link');
    const totalSections = sections.length;
    const TIME_PER_SECTION = 15 / totalSections;

    let currentSection = 0;
    let isTransitioning = false;
    let hasStarted = false;
    let autoAdvanceTimer = null;



    function createParticles() {
        const container = document.createElement('div');
        container.className = 'particles';
        for (let i = 0; i < 10; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            container.appendChild(p);
        }
        document.body.appendChild(container);
    }

    function createDots() {
        const container = document.createElement('div');
        container.className = 'section-dots';
        container.id = 'sectionDots';
        for (let i = 0; i < totalSections; i++) {
            const dot = document.createElement('button');
            dot.className = 'section-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Go to section ${i + 1}`);
            dot.addEventListener('click', () => goToSection(i));
            container.appendChild(dot);
        }
        document.body.appendChild(container);
    }


    function goToSection(index) {
        if (index === currentSection || isTransitioning || index < 0 || index >= totalSections) return;

        isTransitioning = true;
        sections[currentSection].classList.remove('active');
        currentSection = index;
        sections[currentSection].classList.add('active');

        $$('.section-dot').forEach((dot, i) => dot.classList.toggle('active', i === currentSection));

        const currentId = sections[currentSection].id;
        navLinkEls.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
        });

        nav.classList.toggle('scrolled', currentSection > 0);

        clearTimeout(autoAdvanceTimer);
        if (currentSection < totalSections - 1) {
            autoAdvanceTimer = setTimeout(() => {
                goToSection(currentSection + 1);
            }, TIME_PER_SECTION * 1000);
        }

        setTimeout(() => { isTransitioning = false; }, 500);
    }


    function toggleSound() {
        video.muted = !video.muted;
        soundToggle.querySelector('.sound-off').style.display = video.muted ? 'block' : 'none';
        soundToggle.querySelector('.sound-on').style.display = video.muted ? 'none' : 'block';
    }


    function handleWheel(e) {
        if (!hasStarted || isTransitioning) return;
        e.preventDefault();
        if (e.deltaY > 30) goToSection(currentSection + 1);
        else if (e.deltaY < -30) goToSection(currentSection - 1);
    }

    function handleKeyboard(e) {
        if (!hasStarted) return;
        const keyMap = {
            'ArrowDown': 1, 'ArrowRight': 1, ' ': 1,
            'ArrowUp': -1, 'ArrowLeft': -1,
        };

        if (keyMap[e.key] !== undefined) {
            e.preventDefault();
            goToSection(currentSection + keyMap[e.key]);
        } else if (e.key === 'Home') {
            e.preventDefault();
            goToSection(0);
        } else if (e.key === 'End') {
            e.preventDefault();
            goToSection(totalSections - 1);
        } else if (e.key.toLowerCase() === 'm') {
            toggleSound();
        }
    }


    function init() {
        createParticles();
        createDots();
        sections[0].classList.add('active');

        soundToggle.addEventListener('click', toggleSound);

        document.addEventListener('keydown', handleKeyboard);
        document.addEventListener('wheel', handleWheel, { passive: false });

        let touchStartY = 0;
        document.addEventListener('touchstart', (e) => { touchStartY = e.touches[0].clientY; }, { passive: true });
        document.addEventListener('touchend', (e) => {
            const diff = touchStartY - e.changedTouches[0].clientY;
            if (Math.abs(diff) > 50) goToSection(currentSection + (diff > 0 ? 1 : -1));
        }, { passive: true });

        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('open');
        });

        navLinkEls.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = Array.from(sections).findIndex(s => s.id === link.getAttribute('href').slice(1));
                if (target !== -1) goToSection(target);
                navToggle.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });

        video.addEventListener('ended', () => {
            video.currentTime = 0;
            video.play();
            currentSection = totalSections;
            goToSection(0);
        });

        video.addEventListener('timeupdate', () => {
            progressBar.style.width = ((video.currentTime / (video.duration || 15)) * 100) + '%';
        });

        hasStarted = true;
        video.muted = true;
        video.play().catch(() => setTimeout(() => { video.muted = true; video.play(); }, 300));

        if (currentSection < totalSections - 1) {
            autoAdvanceTimer = setTimeout(() => goToSection(currentSection + 1), TIME_PER_SECTION * 1000);
        }
    }

    document.addEventListener('DOMContentLoaded', init);
})();
