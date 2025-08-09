export class Navigation {
    constructor() {
        this.eventListeners = new Map();
        this.currentMode = 'pro';
        this.activeSection = 'home';
        
        this.proNavItems = [
            { id: 'home', label: 'Accueil' },
            { id: 'about', label: 'À propos' },
            { id: 'services', label: 'Services' },
            { id: 'projects', label: 'Projets' },
            { id: 'templates', label: 'Templates' },
            { id: 'testimonials', label: 'Témoignages' },
            { id: 'blog', label: 'Blog' },
            { id: 'contact', label: 'Contact' }
        ];

        this.labNavItems = [
            { id: 'lab-home', label: 'Lab Home' },
            { id: 'lab-passions', label: 'Passions' },
            { id: 'lab-tools', label: 'Outils' },
            { id: 'lab-experiments', label: 'Expériences' },
            { id: 'lab-templates', label: 'Templates Lab' },
            { id: 'lab-guestbook', label: 'Guestbook' }
        ];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupMobileMenu();
    }

    setupEventListeners() {
        // Navigation links
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link')) {
                e.preventDefault();
                const href = e.target.getAttribute('href');
                const targetId = href.replace('#', '');
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                    // Update URL hash without triggering hashchange event
                    history.pushState(null, '', href);
                    this.setActive(targetId);
                } else {
                    // Fallback to router navigation if element not found (e.g., for dynamic content)
                    this.emit('navigate', targetId);
                }
            }
        });

        // Logo click
        const logoLink = document.getElementById('logo-link');
        if (logoLink) {
            logoLink.addEventListener('click', (e) => {
                e.preventDefault();
                const homeSection = this.currentMode === 'lab' ? 'lab-home' : 'home';
                this.emit('navigate', homeSection);
            });
        }
    }

    setupMobileMenu() {
        const mobileToggle = document.getElementById('mobile-toggle');
        const navMenu = document.getElementById('nav-menu');

        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', () => {
                mobileToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Close mobile menu when clicking a link
            navMenu.addEventListener('click', (e) => {
                if (e.target.classList.contains('nav-link')) {
                    mobileToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    mobileToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        }
    }

    updateForMode(mode) {
        this.currentMode = mode;
        
        const navMenu = document.getElementById('nav-menu');
        const logoText = document.querySelector('.logo-text');
        
        if (!navMenu || !logoText) return;

        // Update logo
        logoText.textContent = mode === 'lab' ? 'LAB_MODE' : 'Portfolio';
        
        // Update navigation items
        const navItems = mode === 'lab' ? this.labNavItems : this.proNavItems;
        
        navMenu.innerHTML = navItems.map(item => `
            <li><a href="#${item.id}" class="nav-link">${item.label}</a></li>
        `).join('');

        // Add return button in lab mode
        if (mode === 'lab') {
            navMenu.innerHTML += `
                <li><a href="#" class="nav-link lab-return-btn" data-action="return-pro">Retour Pro</a></li>
            `;
            
            // Setup return button
            const returnBtn = navMenu.querySelector('.lab-return-btn');
            if (returnBtn) {
                returnBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.emit('modeChange', 'pro');
                });
            }
        }
    }

    setActive(section) {
        this.activeSection = section;
        
        // Remove active class from all links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current section
        const activeLink = document.querySelector(`.nav-link[href="#${section}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    // Event system
    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }

    emit(event, data) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => {
                callback(data);
            });
        }
    }
}