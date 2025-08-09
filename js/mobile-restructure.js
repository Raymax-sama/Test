// ===== GESTIONNAIRE DE RESTRUCTURATION MOBILE =====

class MobileRestructure {
  constructor() {
    this.isMobile = window.innerWidth <= 768;
    this.currentSection = 'home';
    this.scrollProgress = 0;
    this.isMenuOpen = false;
    
    if (this.isMobile) {
      this.init();
    }
  }

  init() {
    this.setupMobileStructure();
    this.setupMobileNavigation();
    this.setupScrollEffects();
    this.setupSectionBackgrounds();
    this.setupFloatingElements();
    this.setupTouchGestures();
    this.setupPerformanceOptimizations();
    
    // Écouteurs d'événements
    window.addEventListener('scroll', this.handleScroll.bind(this));
    window.addEventListener('resize', this.handleResize.bind(this));
    
    console.log('🎨 Mobile Restructure initialized');
  }

  // ===== STRUCTURE MOBILE =====
  setupMobileStructure() {
    // Ajouter les classes nécessaires au body
    document.body.classList.add('mobile-restructured', 'smooth-scroll');
    
    // Restructurer les sections
    this.restructureSections();
    
    // Ajouter les éléments flottants
    this.addFloatingElements();
    
    // Créer l'indicateur de scroll
    this.createScrollIndicator();
  }
  
  restructureSections() {
    const sections = document.querySelectorAll('.section');
    
    sections.forEach((section, index) => {
      // Ajouter des classes spécifiques selon le type de section
      const sectionId = section.id || section.className;
      
      if (sectionId.includes('hero')) {
        section.classList.add('hero-section');
      } else if (sectionId.includes('about')) {
        section.classList.add('about-section');
      } else if (sectionId.includes('services')) {
        section.classList.add('services-section');
      } else if (sectionId.includes('projects')) {
        section.classList.add('projects-section');
      } else if (sectionId.includes('testimonials')) {
        section.classList.add('testimonials-section');
      } else if (sectionId.includes('contact')) {
        section.classList.add('contact-section');
      }
      
      // Ajouter des éléments flottants à certaines sections
      if (index % 2 === 0) {
        const floatingElements = document.createElement('div');
        floatingElements.className = 'floating-elements';
        section.appendChild(floatingElements);
      }
    });
  }
  
  addFloatingElements() {
    // Ajouter des éléments décoratifs flottants
    const floatingContainer = document.createElement('div');
    floatingContainer.className = 'floating-decorations';
    floatingContainer.innerHTML = `
      <div class="floating-shape shape-1"></div>
      <div class="floating-shape shape-2"></div>
      <div class="floating-shape shape-3"></div>
    `;
    
    document.body.appendChild(floatingContainer);
    
    // Styles pour les formes flottantes
    const style = document.createElement('style');
    style.textContent = `
      .floating-decorations {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        z-index: -1;
      }
      
      .floating-shape {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.05);
        animation: floatShape 20s ease-in-out infinite;
      }
      
      .shape-1 {
        width: 150px;
        height: 150px;
        top: 20%;
        left: -75px;
        animation-delay: 0s;
      }
      
      .shape-2 {
        width: 100px;
        height: 100px;
        top: 60%;
        right: -50px;
        animation-delay: 7s;
      }
      
      .shape-3 {
        width: 200px;
        height: 200px;
        bottom: 10%;
        left: 50%;
        transform: translateX(-50%);
        animation-delay: 14s;
      }
      
      @keyframes floatShape {
        0%, 100% {
          transform: translate(0, 0) rotate(0deg);
          opacity: 0.3;
        }
        33% {
          transform: translate(100px, -100px) rotate(120deg);
          opacity: 0.1;
        }
        66% {
          transform: translate(-50px, 50px) rotate(240deg);
          opacity: 0.2;
        }
      }
    `;
    
    document.head.appendChild(style);
  }

  // ===== NAVIGATION MOBILE =====
  setupMobileNavigation() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (mobileToggle && navMenu) {
      mobileToggle.addEventListener('click', () => {
        this.toggleMobileMenu();
      });
      
      // Fermer le menu lors du clic sur un lien
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          this.closeMobileMenu();
        });
      });
      
      // Fermer le menu lors du clic en dehors
      document.addEventListener('click', (e) => {
        if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
          this.closeMobileMenu();
        }
      });
    }
  }
  
  toggleMobileMenu() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    this.isMenuOpen = !this.isMenuOpen;
    
    mobileToggle.classList.toggle('active', this.isMenuOpen);
    navMenu.classList.toggle('active', this.isMenuOpen);
    
    // Empêcher le scroll du body quand le menu est ouvert
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
  }
  
  closeMobileMenu() {
    if (this.isMenuOpen) {
      this.toggleMobileMenu();
    }
  }

  // ===== EFFETS DE SCROLL =====
  setupScrollEffects() {
    // Intersection Observer pour les animations
    this.setupIntersectionObserver();
    
    // Parallax léger pour certains éléments
    this.setupParallax();
  }
  
  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          this.currentSection = entry.target.id || 'unknown';
        }
      });
    }, observerOptions);
    
    // Observer toutes les sections
    document.querySelectorAll('.section').forEach(section => {
      this.observer.observe(section);
    });
  }
  
  setupParallax() {
    const parallaxElements = document.querySelectorAll('.floating-elements');
    
    parallaxElements.forEach(element => {
      element.style.transform = 'translateZ(0)';
      element.style.willChange = 'transform';
    });
  }

  // ===== BACKGROUNDS DYNAMIQUES =====
  setupSectionBackgrounds() {
    const sections = document.querySelectorAll('.section');
    
    sections.forEach((section, index) => {
      // Ajouter des patterns de background variés
      const pattern = this.createBackgroundPattern(index);
      if (pattern) {
        section.appendChild(pattern);
      }
    });
  }
  
  createBackgroundPattern(index) {
    const patterns = [
      'dots',
      'grid',
      'waves',
      'geometric'
    ];
    
    const patternType = patterns[index % patterns.length];
    const patternElement = document.createElement('div');
    patternElement.className = `bg-pattern bg-pattern-${patternType}`;
    
    // Styles pour les différents patterns
    const style = document.createElement('style');
    style.textContent = `
      .bg-pattern {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 0.1;
        pointer-events: none;
        z-index: 0;
      }
      
      .bg-pattern-dots {
        background: radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px);
        background-size: 20px 20px;
      }
      
      .bg-pattern-grid {
        background: 
          linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px);
        background-size: 30px 30px;
      }
      
      .bg-pattern-waves {
        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 20"><path d="M0 10 Q25 0 50 10 T100 10 V20 H0 Z" fill="rgba(255,255,255,0.1)"/></svg>');
        background-size: 100px 20px;
      }
      
      .bg-pattern-geometric {
        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><polygon points="30,0 60,30 30,60 0,30" fill="rgba(255,255,255,0.05)"/></svg>');
        background-size: 60px 60px;
      }
    `;
    
    if (!document.querySelector(`style[data-pattern="${patternType}"]`)) {
      style.setAttribute('data-pattern', patternType);
      document.head.appendChild(style);
    }
    
    return patternElement;
  }

  // ===== GESTES TACTILES =====
  setupTouchGestures() {
    let startY = 0;
    let currentY = 0;
    let isScrolling = false;
    
    document.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY;
      isScrolling = true;
    }, { passive: true });
    
    document.addEventListener('touchmove', (e) => {
      if (!isScrolling) return;
      
      currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;
      
      // Effet de parallax léger pendant le scroll
      this.updateParallaxOnScroll(deltaY);
    }, { passive: true });
    
    document.addEventListener('touchend', () => {
      isScrolling = false;
    }, { passive: true });
  }
  
  updateParallaxOnScroll(deltaY) {
    const parallaxElements = document.querySelectorAll('.floating-elements');
    
    parallaxElements.forEach((element, index) => {
      const speed = (index + 1) * 0.1;
      const translateY = deltaY * speed;
      element.style.transform = `translateY(${translateY}px) translateZ(0)`;
    });
  }

  // ===== SCROLL PROGRESS =====
  createScrollIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'scroll-indicator';
    indicator.innerHTML = '<div class="scroll-progress"></div>';
    
    document.body.appendChild(indicator);
    this.scrollProgressBar = indicator.querySelector('.scroll-progress');
  }
  
  updateScrollProgress() {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / scrollHeight) * 100;
    
    if (this.scrollProgressBar) {
      this.scrollProgressBar.style.width = `${Math.min(scrolled, 100)}%`;
    }
  }

  // ===== GESTION DU SCROLL =====
  handleScroll() {
    if (!this.isMobile) return;
    
    // Throttle pour les performances
    if (!this.scrollTicking) {
      requestAnimationFrame(() => {
        this.updateScrollProgress();
        this.updateHeaderVisibility();
        this.updateParallaxElements();
        this.scrollTicking = false;
      });
      this.scrollTicking = true;
    }
  }
  
  updateHeaderVisibility() {
    const header = document.querySelector('.header');
    const currentScrollY = window.scrollY;
    
    if (header && !this.isMenuOpen) {
      if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
        // Scroll vers le bas - cacher le header
        header.style.transform = 'translateY(-100%)';
      } else {
        // Scroll vers le haut - montrer le header
        header.style.transform = 'translateY(0)';
      }
    }
    
    this.lastScrollY = currentScrollY;
  }
  
  updateParallaxElements() {
    const scrollY = window.scrollY;
    const parallaxElements = document.querySelectorAll('.floating-elements');
    
    parallaxElements.forEach((element, index) => {
      const speed = (index + 1) * 0.05;
      const translateY = scrollY * speed;
      element.style.transform = `translateY(${translateY}px) translateZ(0)`;
    });
  }

  // ===== OPTIMISATIONS PERFORMANCE =====
  setupPerformanceOptimizations() {
    // Préchargement des images critiques
    this.preloadCriticalImages();
    
    // Lazy loading pour les images non critiques
    this.setupLazyLoading();
    
    // Optimisation des animations
    this.optimizeAnimations();
  }
  
  preloadCriticalImages() {
    const criticalImages = document.querySelectorAll('img[data-critical]');
    
    criticalImages.forEach(img => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = img.src || img.dataset.src;
      document.head.appendChild(link);
    });
  }
  
  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const lazyImages = document.querySelectorAll('img[data-lazy]');
      
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.lazy;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });
      
      lazyImages.forEach(img => imageObserver.observe(img));
    }
  }
  
  optimizeAnimations() {
    // Ajouter will-change aux éléments animés
    const animatedElements = document.querySelectorAll('.floating-elements, .card, .btn');
    
    animatedElements.forEach(element => {
      element.style.willChange = 'transform';
      element.classList.add('gpu-accelerated');
    });
  }

  // ===== GESTION DU REDIMENSIONNEMENT =====
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
    // Nettoyer les écouteurs et éléments ajoutés
    document.body.classList.remove('mobile-restructured');
    
    const floatingDecorations = document.querySelector('.floating-decorations');
    if (floatingDecorations) {
      floatingDecorations.remove();
    }
    
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
      scrollIndicator.remove();
    }
  }

  // ===== MÉTHODES UTILITAIRES =====
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}

// ===== STYLES CSS DYNAMIQUES =====
const addMobileRestructureStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    .animate-in {
      animation: slideInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    }
    
    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .mobile-restructured {
      overflow-x: hidden;
    }
    
    .mobile-restructured .section {
      position: relative;
      z-index: 1;
    }
  `;
  document.head.appendChild(style);
};

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', () => {
  addMobileRestructureStyles();
  
  // Attendre un peu pour que les autres scripts se chargent
  setTimeout(() => {
    window.mobileRestructure = new MobileRestructure();
  }, 100);
});

// ===== EXPORT =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MobileRestructure;
}

window.MobileRestructure = MobileRestructure;