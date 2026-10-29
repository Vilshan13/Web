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


    /* ─── Particles ─── */

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


    /* ─── Scroll-triggered Reveal Animations (Intersection Observer) ─── */

    function initScrollReveal() {
        const revealElements = $$('.reveal');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Keep observing so re-entering re-triggers if needed
                } else {
                    // Optional: remove class when out of view so it can re-animate on scroll back
                    entry.target.classList.remove('revealed');
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach((el) => observer.observe(el));
    }


    /* ─── Nav Active Link on Scroll ─── */

    function initNavHighlight() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinkEls.forEach((link) => {
                        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                    });
                }
            });
        }, {
            threshold: 0.35
        });

        sections.forEach((section) => {
            if (section.id) observer.observe(section);
        });
    }


    /* ─── Scroll Progress Bar ─── */

    function updateProgressBar() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = progress + '%';
    }


    /* ─── Nav Background on Scroll ─── */

    function updateNavBackground() {
        nav.classList.toggle('scrolled', window.scrollY > 60);
    }


    /* ─── Sound Toggle ─── */

    function toggleSound() {
        video.muted = !video.muted;
        soundToggle.querySelector('.sound-off').style.display = video.muted ? 'block' : 'none';
        soundToggle.querySelector('.sound-on').style.display = video.muted ? 'none' : 'block';
    }


    /* ─── Smooth Scroll for Nav Links ─── */

    function initSmoothNav() {
        navLinkEls.forEach((link) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').slice(1);
                const targetEl = document.getElementById(targetId);
                if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                navToggle.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });

        // Footer links smooth scroll
        $$('.footer-links a').forEach((link) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').slice(1);
                const targetEl = document.getElementById(targetId);
                if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        // Hero CTA buttons smooth scroll
        $$('.hero-cta .btn').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = btn.getAttribute('href').slice(1);
                const targetEl = document.getElementById(targetId);
                if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        // CTA section button smooth scroll
        const ctaBtn = $('.section--cta .btn');
        if (ctaBtn) {
            ctaBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = ctaBtn.getAttribute('href').slice(1);
                const targetEl = document.getElementById(targetId);
                if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        }
    }


    /* ─── Init ─── */

    function init() {
        createParticles();
        initScrollReveal();
        initNavHighlight();
        initSmoothNav();

        // Scroll events
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateProgressBar();
                    updateNavBackground();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        // Sound toggle
        soundToggle.addEventListener('click', toggleSound);

        // Mobile nav toggle
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('open');
        });

        // Keyboard shortcut for sound
        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'm') toggleSound();
        });

        // Video playback
        video.muted = true;
        video.play().catch(() => {
            setTimeout(() => {
                video.muted = true;
                video.play();
            }, 300);
        });

        // Initial state
        updateProgressBar();
        updateNavBackground();
    }

    document.addEventListener('DOMContentLoaded', init);
})();
