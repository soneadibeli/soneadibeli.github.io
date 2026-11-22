// ============================================
// SITE SCRIPT: theme, mobile menu, navbar state, active section link
// ============================================

(function () {
    'use strict';

    // ---------- Theme (dark by default, remembers the visitor's choice) ----------
    const Theme = {
        init() {
            this.button = document.getElementById('themeToggle');
            if (!this.button) return;
            this.updateIcon();
            this.button.addEventListener('click', () => this.toggle());
        },
        toggle() {
            const light = document.body.classList.toggle('light-theme');
            try { localStorage.setItem('theme', light ? 'light' : 'dark'); } catch (e) { /* storage unavailable */ }
            this.updateIcon();
        },
        updateIcon() {
            const light = document.body.classList.contains('light-theme');
            this.button.innerHTML = light ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        }
    };

    // ---------- Mobile menu ----------
    const MobileNav = {
        init() {
            this.toggleBtn = document.getElementById('menuToggle');
            this.links = document.querySelector('.navbar .nav-links');
            if (!this.toggleBtn || !this.links) return;

            this.toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.links.classList.contains('active') ? this.close() : this.open();
            });
            this.links.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => this.close()));
            document.addEventListener('click', (e) => {
                if (this.links.classList.contains('active') && !this.links.contains(e.target)) this.close();
            });
            document.addEventListener('keydown', (e) => { if (e.key === 'Escape') this.close(); });
            window.addEventListener('resize', () => { if (window.innerWidth > 1024) this.close(); });
        },
        open() {
            this.links.classList.add('active');
            this.toggleBtn.innerHTML = '<i class="fas fa-times"></i>';
            this.toggleBtn.setAttribute('aria-expanded', 'true');
        },
        close() {
            this.links.classList.remove('active');
            this.toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
            this.toggleBtn.setAttribute('aria-expanded', 'false');
        }
    };

    // ---------- Navbar border/shadow after scrolling ----------
    const NavbarState = {
        init() {
            this.navbar = document.querySelector('.navbar');
            if (!this.navbar) return;
            const update = () => this.navbar.classList.toggle('scrolled', window.scrollY > 30);
            update();
            window.addEventListener('scroll', update, { passive: true });
        }
    };

    // ---------- Highlight the menu link of the section in view (home page only) ----------
    const ActiveLink = {
        init() {
            this.sections = Array.from(document.querySelectorAll('main section[id]'));
            this.links = Array.from(document.querySelectorAll('.navbar .nav-links a'));
            if (this.sections.length < 2) return;
            this.update();
            window.addEventListener('scroll', () => this.update(), { passive: true });
        },
        update() {
            const pos = window.scrollY + 120;
            let current = this.sections[0].id;
            this.sections.forEach((s) => { if (s.offsetTop <= pos) current = s.id; });
            this.links.forEach((a) => {
                const hash = new URL(a.href, window.location.href).hash;
                a.classList.toggle('active', hash === '#' + current);
            });
        }
    };

    function init() {
        Theme.init();
        MobileNav.init();
        NavbarState.init();
        ActiveLink.init();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
