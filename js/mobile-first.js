/**
 * Mobile-First Portfolio Manager
 * Optimized for performance and UX on mobile devices
 */

class MobileFirstPortfolio {
    constructor() {
        this.isMobile = window.innerWidth <= 768;
        this.isMenuOpen = false;
        this.currentSection = 'home';
        this.dataCache = new Map();
        
        if (this.isMobile) {
            this.init();
        }
    }

    async init() {
        console.log('🚀 Initializing Mobile-First Portfolio');
        
        try {
            // Load essential data only
            await this.loadEssentialData();
            
            // Setup mobile structure
            this.setupMobileStructure();
            
            // Setup navigation
            this.setupMobileNavigation();
            
            // Setup performance optimizations
            this.setupPerformanceOptimizations();
            
            // Setup touch interactions
            this.setupTouchInteractions();
            
            // Load initial content
            this.loadMobileContent();
            
            console.log('✅ Mobile-First Portfolio initialized');
            
        } catch (error) {
            console.error('❌ Error initializing mobile portfolio:', error);
            this.showError('Erreur de chargement');
        }
    }

    async loadEssentialData() {
        try {
            // Load only essential data to reduce initial load time
            const response = await fetch('./data/pro.json');
            if (!response.ok) throw new Error('Failed to load data');
            
            const data = await response.json();
            
            // Cache only essential sections
            this.dataCache.set('home', data.home);
            this.dataCache.set('stats', data.stats);
            this.dataCache.set('services', data.services);
            this.dataCache.set('contact', data.contact);
            
            // Cache only featured projects to reduce data size
            if (data.projects && data.projects.items) {
                const featuredProjects = data.projects.items.filter(p => p.featured);
                this.dataCache.set('projects', {
                    ...data.projects,
                    items: featuredProjects.slice(0, 3) // Limit to 3 projects
                });
            }
            
        } catch (error) {
            console.error('Error loading essential data:', error);
            throw error;
        }
    }

    setupMobileStructure() {
        // Hide desktop elements
        this.hideDesktopElements();
        
        // Create mobile structure
        this.createMobileHeader();
        this.createMobileMain();
        this.createMobileFooter();
        
        // Add mobile-specific classes
        document.body.classList.add('mobile-optimized');
    }

    hideDesktopElements() {
        const desktopElements = [
            '.header',
            '.main-content',
            '.footer',
            '#terminal-trigger',
            '#mini-terminal'
        ];
        
        desktopElements.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => el.style.display = 'none');
        });
    }

    createMobileHeader() {
        const header = document.createElement('header');
        header.className = 'mobile-header';
        header.innerHTML = `
            <a href="#home" class="mobile-logo">Portfolio</a>
            <button class="mobile-menu-btn" id="mobile-menu-btn" aria-label="Menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
        `;
        
        const nav = document.createElement('nav');
        nav.className = 'mobile-nav';
        nav.id = 'mobile-nav';
        nav.innerHTML = `
            <a href="#home" class="mobile-nav-link active">Accueil</a>
            <a href="#services" class="mobile-nav-link">Services</a>
            <a href="#projects" class="mobile-nav-link">Projets</a>
            <a href="#contact" class="mobile-nav-link">Contact</a>
        `;
        
        document.body.insertBefore(header, document.body.firstChild);
        document.body.insertBefore(nav, header.nextSibling);
    }

    createMobileMain() {
        const main = document.createElement('main');
        main.className = 'mobile-main';
        main.id = 'mobile-main';
        
        document.body.appendChild(main);
    }

    createMobileFooter() {
        const footer = document.createElement('footer');
        footer.className = 'mobile-footer';
        footer.innerHTML = `
            <p class="mobile-footer-text">&copy; 2025 Portfolio. Tous droits réservés.</p>
        `;
        
        document.body.appendChild(footer);
    }

    setupMobileNavigation() {
        const menuBtn = document.getElementById('mobile-menu-btn');
        const nav = document.getElementById('mobile-nav');
        const navLinks = document.querySelectorAll('.mobile-nav-link');
        
        if (menuBtn && nav) {
            menuBtn.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
            
            // Close menu when clicking a link
            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const section = link.getAttribute('href').substring(1);
                    this.navigateToSection(section);
                    this.closeMobileMenu();
                });
            });
            
            // Close menu when clicking outside
            nav.addEventListener('click', (e) => {
                if (e.target === nav) {
                    this.closeMobileMenu();
                }
            });
        }
    }

    toggleMobileMenu() {
        const menuBtn = document.getElementById('mobile-menu-btn');
        const nav = document.getElementById('mobile-nav');
        
        this.isMenuOpen = !this.isMenuOpen;
        
        menuBtn.classList.toggle('active', this.isMenuOpen);
        nav.classList.toggle('active', this.isMenuOpen);
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
    }

    closeMobileMenu() {
        if (this.isMenuOpen) {
            this.toggleMobileMenu();
        }
    }

    navigateToSection(section) {
        this.currentSection = section;
        this.updateActiveNavLink(section);
        this.loadSectionContent(section);
        
        // Update URL without triggering page reload
        history.pushState(null, '', `#${section}`);
    }

    updateActiveNavLink(section) {
        const navLinks = document.querySelectorAll('.mobile-nav-link');
        navLinks.forEach(link => {
            const linkSection = link.getAttribute('href').substring(1);
            link.classList.toggle('active', linkSection === section);
        });
    }

    async loadSectionContent(section) {
        const main = document.getElementById('mobile-main');
        if (!main) return;
        
        // Show loading state
        main.innerHTML = '<div class="mobile-loading">Chargement...</div>';
        
        try {
            let content = '';
            
            switch (section) {
                case 'home':
                    content = this.renderMobileHome();
                    break;
                case 'services':
                    content = this.renderMobileServices();
                    break;
                case 'projects':
                    content = this.renderMobileProjects();
                    break;
                case 'contact':
                    content = this.renderMobileContact();
                    break;
                default:
                    content = this.renderMobileHome();
            }
            
            main.innerHTML = content;
            
            // Setup section-specific interactions
            this.setupSectionInteractions(section);
            
            // Animate content in
            this.animateContentIn();
            
        } catch (error) {
            console.error(`Error loading section ${section}:`, error);
            main.innerHTML = '<div class="mobile-error">Erreur de chargement</div>';
        }
    }

    renderMobileHome() {
        const homeData = this.dataCache.get('home');
        const statsData = this.dataCache.get('stats');
        
        if (!homeData) return '<div class="mobile-error">Données non disponibles</div>';
        
        return `
            <section class="mobile-hero">
                <img src="${homeData.photo}" alt="${homeData.name}" class="mobile-hero-photo mobile-fade-in">
                <div class="mobile-hero-greeting mobile-fade-in mobile-fade-in-delay-1">${homeData.greeting}</div>
                <h1 class="mobile-hero-name mobile-fade-in mobile-fade-in-delay-2">${homeData.name}</h1>
                <div class="mobile-hero-title mobile-fade-in mobile-fade-in-delay-3">${homeData.title}</div>
                <p class="mobile-hero-description mobile-fade-in mobile-fade-in-delay-3">${homeData.description}</p>
                <a href="#projects" class="mobile-hero-cta mobile-fade-in mobile-fade-in-delay-3">${homeData.cta.primary}</a>
            </section>
            
            ${statsData ? `
            <section class="mobile-stats">
                <div class="mobile-stats-grid">
                    ${statsData.items.map((stat, index) => `
                        <div class="mobile-stat-item mobile-fade-in mobile-fade-in-delay-${index + 1}">
                            <div class="mobile-stat-number">${stat.number}</div>
                            <div class="mobile-stat-label">${stat.label}</div>
                        </div>
                    `).join('')}
                </div>
            </section>
            ` : ''}
        `;
    }

    renderMobileServices() {
        const servicesData = this.dataCache.get('services');
        if (!servicesData) return '<div class="mobile-error">Services non disponibles</div>';
        
        return `
            <section class="mobile-services">
                <h2 class="mobile-section-title mobile-fade-in">${servicesData.title}</h2>
                <p class="mobile-section-subtitle mobile-fade-in">${servicesData.description}</p>
                
                <div class="mobile-services-grid">
                    ${servicesData.items.map((service, index) => `
                        <div class="mobile-service-card mobile-fade-in mobile-fade-in-delay-${index + 1}">
                            <div class="mobile-service-icon">
                                <i class="${service.icon}"></i>
                            </div>
                            <h3 class="mobile-service-title">${service.title}</h3>
                            <p class="mobile-service-description">${service.description}</p>
                            <ul class="mobile-service-features">
                                ${service.features.slice(0, 3).map(feature => `
                                    <li>${feature}</li>
                                `).join('')}
                            </ul>
                        </div>
                    `).join('')}
                </div>
                
                <div class="mobile-text-center mobile-mt-xl">
                    <a href="#contact" class="mobile-hero-cta">Demander un devis</a>
                </div>
            </section>
        `;
    }

    renderMobileProjects() {
        const projectsData = this.dataCache.get('projects');
        if (!projectsData) return '<div class="mobile-error">Projets non disponibles</div>';
        
        return `
            <section class="mobile-projects">
                <h2 class="mobile-section-title mobile-fade-in">${projectsData.title}</h2>
                <p class="mobile-section-subtitle mobile-fade-in">${projectsData.description}</p>
                
                <div class="mobile-projects-grid">
                    ${projectsData.items.map((project, index) => `
                        <div class="mobile-project-card mobile-fade-in mobile-fade-in-delay-${index + 1}">
                            <img src="${project.image}" alt="${project.title}" class="mobile-project-image" loading="lazy">
                            <div class="mobile-project-content">
                                <div class="mobile-project-category">${project.category}</div>
                                <h3 class="mobile-project-title">${project.title}</h3>
                                <p class="mobile-project-description">${project.description}</p>
                                <div class="mobile-project-tags">
                                    ${project.tags.slice(0, 3).map(tag => `
                                        <span class="mobile-project-tag">${tag}</span>
                                    `).join('')}
                                </div>
                                ${project.demoUrl ? `
                                    <a href="${project.demoUrl}" target="_blank" class="mobile-project-link">
                                        Voir le projet
                                        <i class="fas fa-external-link-alt"></i>
                                    </a>
                                ` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="mobile-text-center mobile-mt-xl">
                    <a href="#contact" class="mobile-hero-cta">Discutons de votre projet</a>
                </div>
            </section>
        `;
    }

    renderMobileContact() {
        const contactData = this.dataCache.get('contact');
        if (!contactData) return '<div class="mobile-error">Contact non disponible</div>';
        
        return `
            <section class="mobile-contact">
                <h2 class="mobile-contact-title mobile-fade-in">${contactData.title}</h2>
                <p class="mobile-contact-subtitle mobile-fade-in">${contactData.description}</p>
                
                <div class="mobile-contact-info">
                    <div class="mobile-contact-item mobile-fade-in mobile-fade-in-delay-1">
                        <div class="mobile-contact-icon">
                            <i class="fas fa-envelope"></i>
                        </div>
                        <div class="mobile-contact-text">
                            <div class="mobile-contact-label">Email</div>
                            <div class="mobile-contact-value">${contactData.info.email}</div>
                        </div>
                    </div>
                    
                    <div class="mobile-contact-item mobile-fade-in mobile-fade-in-delay-2">
                        <div class="mobile-contact-icon">
                            <i class="fas fa-phone"></i>
                        </div>
                        <div class="mobile-contact-text">
                            <div class="mobile-contact-label">Téléphone</div>
                            <div class="mobile-contact-value">${contactData.info.phone}</div>
                        </div>
                    </div>
                    
                    <div class="mobile-contact-item mobile-fade-in mobile-fade-in-delay-3">
                        <div class="mobile-contact-icon">
                            <i class="fas fa-map-marker-alt"></i>
                        </div>
                        <div class="mobile-contact-text">
                            <div class="mobile-contact-label">Localisation</div>
                            <div class="mobile-contact-value">${contactData.info.location}</div>
                        </div>
                    </div>
                </div>
                
                <div class="mobile-social-links mobile-fade-in mobile-fade-in-delay-3">
                    ${contactData.social.map(social => `
                        <a href="${social.url}" target="_blank" class="mobile-social-link" aria-label="${social.platform}">
                            <i class="${social.icon}"></i>
                        </a>
                    `).join('')}
                </div>
                
                <a href="mailto:${contactData.info.email}" class="mobile-contact-cta mobile-fade-in mobile-fade-in-delay-3">
                    Envoyer un email
                </a>
            </section>
        `;
    }

    setupSectionInteractions(section) {
        switch (section) {
            case 'home':
                this.setupHomeInteractions();
                break;
            case 'projects':
                this.setupProjectsInteractions();
                break;
            case 'contact':
                this.setupContactInteractions();
                break;
        }
    }

    setupHomeInteractions() {
        // Setup smooth scroll for CTA
        const cta = document.querySelector('.mobile-hero-cta');
        if (cta) {
            cta.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToSection('projects');
            });
        }
    }

    setupProjectsInteractions() {
        // Setup project links
        const projectLinks = document.querySelectorAll('.mobile-project-link');
        projectLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Add loading state
                link.innerHTML = 'Chargement...';
                setTimeout(() => {
                    link.innerHTML = 'Voir le projet <i class="fas fa-external-link-alt"></i>';
                }, 1000);
            });
        });
        
        // Setup CTA
        const cta = document.querySelector('.mobile-hero-cta');
        if (cta) {
            cta.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToSection('contact');
            });
        }
    }

    setupContactInteractions() {
        // Setup email link
        const emailCta = document.querySelector('.mobile-contact-cta');
        if (emailCta) {
            emailCta.addEventListener('click', () => {
                this.showSuccess('Ouverture de votre client email...');
            });
        }
        
        // Setup social links
        const socialLinks = document.querySelectorAll('.mobile-social-link');
        socialLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.showSuccess('Redirection en cours...');
            });
        });
    }

    setupPerformanceOptimizations() {
        // Lazy load images
        this.setupLazyLoading();
        
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Setup intersection observer for animations
        this.setupIntersectionObserver();
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
    }

    preloadCriticalResources() {
        const homeData = this.dataCache.get('home');
        if (homeData && homeData.photo) {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = homeData.photo;
            document.head.appendChild(link);
        }
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observe elements with fade-in animations
        document.querySelectorAll('.mobile-fade-in').forEach(el => {
            el.style.animationPlayState = 'paused';
            observer.observe(el);
        });
    }

    setupTouchInteractions() {
        // Add touch feedback to interactive elements
        const touchElements = document.querySelectorAll('.mobile-hero-cta, .mobile-project-link, .mobile-contact-cta, .mobile-nav-link');
        
        touchElements.forEach(element => {
            element.addEventListener('touchstart', () => {
                element.style.transform = 'scale(0.98)';
            });
            
            element.addEventListener('touchend', () => {
                element.style.transform = '';
            });
        });
    }

    loadMobileContent() {
        // Load home section by default
        this.loadSectionContent('home');
        
        // Handle initial hash
        const hash = window.location.hash.substring(1);
        if (hash && ['home', 'services', 'projects', 'contact'].includes(hash)) {
            this.navigateToSection(hash);
        }
        
        // Handle hash changes
        window.addEventListener('hashchange', () => {
            const newHash = window.location.hash.substring(1) || 'home';
            if (['home', 'services', 'projects', 'contact'].includes(newHash)) {
                this.navigateToSection(newHash);
            }
        });
    }

    animateContentIn() {
        const animatedElements = document.querySelectorAll('.mobile-fade-in');
        animatedElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.animationPlayState = 'running';
            }, index * 100);
        });
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `mobile-notification mobile-notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Handle resize events
    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 768;
        
        if (wasMobile !== this.isMobile) {
            if (this.isMobile) {
                this.init();
            } else {
                this.cleanup();
            }
        }
    }

    cleanup() {
        // Remove mobile elements and restore desktop
        const mobileElements = document.querySelectorAll('.mobile-header, .mobile-nav, .mobile-main, .mobile-footer');
        mobileElements.forEach(el => el.remove());
        
        // Show desktop elements
        const desktopElements = document.querySelectorAll('.header, .main-content, .footer');
        desktopElements.forEach(el => el.style.display = '');
        
        document.body.classList.remove('mobile-optimized');
        document.body.style.overflow = '';
    }
}

// Notification styles
const notificationStyles = `
.mobile-notification {
    position: fixed;
    top: 80px;
    left: var(--mobile-space-md);
    right: var(--mobile-space-md);
    padding: var(--mobile-space-md);
    border-radius: var(--radius-lg);
    color: var(--text-white);
    font-weight: 500;
    z-index: 10000;
    transform: translateY(-100px);
    opacity: 0;
    transition: all var(--transition-base);
}

.mobile-notification.show {
    transform: translateY(0);
    opacity: 1;
}

.mobile-notification-success {
    background: var(--success);
}

.mobile-notification-error {
    background: var(--error);
}

.mobile-notification-info {
    background: var(--primary);
}

.mobile-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--mobile-space-3xl);
    font-size: var(--mobile-text-base);
    color: var(--text-secondary);
}

.mobile-error {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--mobile-space-3xl);
    font-size: var(--mobile-text-base);
    color: var(--error);
}
`;

// Inject notification styles
if (!document.getElementById('mobile-notification-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'mobile-notification-styles';
    styleSheet.textContent = notificationStyles;
    document.head.appendChild(styleSheet);
}

// Initialize mobile portfolio
document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth <= 768) {
        window.mobilePortfolio = new MobileFirstPortfolio();
        
        // Handle resize
        window.addEventListener('resize', () => {
            if (window.mobilePortfolio) {
                window.mobilePortfolio.handleResize();
            }
        });
    }
});

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileFirstPortfolio;
}

window.MobileFirstPortfolio = MobileFirstPortfolio;