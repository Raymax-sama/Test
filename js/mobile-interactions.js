// ===== GESTIONNAIRE D'INTERACTIONS MOBILES =====

class MobileInteractions {
  constructor() {
    this.init();
    this.setupIntersectionObserver();
    this.setupTouchFeedback();
    this.setupScrollProgress();
    this.setupPullToRefresh();
    this.setupImageLoading();
    this.setupSmoothScrolling();
  }

  init() {
    // Détection mobile
    this.isMobile = window.innerWidth <= 768;
    this.isTouch = 'ontouchstart' in window;
    
    // Variables pour les interactions
    this.scrollProgress = 0;
    this.lastScrollY = 0;
    this.ticking = false;
    
    // Écouteurs d'événements
    window.addEventListener('resize', this.handleResize.bind(this));
    window.addEventListener('scroll', this.handleScroll.bind(this));
    
    // Optimisation des performances
    this.setupPerformanceOptimizations();
  }

  // ===== INTERSECTION OBSERVER POUR ANIMATIONS =====
  setupIntersectionObserver() {
    if (!this.isMobile) return;
    
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
        }
      });
    }, observerOptions);
    
    // Observer les éléments à animer
    this.observeElements();
  }
  
  observeElements() {
    const elementsToAnimate = [
      '.service-card',
      '.project-card',
      '.pricing-card',
      '.stat-item',
      '.contact-form',
      '.hero-content',
      '.section-title'
    ];
    
    elementsToAnimate.forEach(selector => {
      document.querySelectorAll(selector).forEach((el, index) => {
        el.classList.add('fade-in-up', `delay-${Math.min(index * 100 + 100, 500)}`);
        this.observer.observe(el);
      });
    });
  }
  
  animateElement(element) {
    element.style.animationPlayState = 'running';
    this.observer.unobserve(element);
  }

  // ===== FEEDBACK TACTILE =====
  setupTouchFeedback() {
    if (!this.isTouch) return;
    
    const touchElements = document.querySelectorAll('button, .btn, .card, .nav-link');
    
    touchElements.forEach(element => {
      element.classList.add('touch-feedback');
      
      element.addEventListener('touchstart', (e) => {
        this.createRipple(e, element);
      });
    });
  }
  
  createRipple(event, element) {
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.touches[0].clientX - rect.left - size / 2;
    const y = event.touches[0].clientY - rect.top - size / 2;
    
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: scale(0);
      animation: ripple 0.6s linear;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      pointer-events: none;
    `;
    
    element.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  // ===== INDICATEUR DE PROGRESSION DE SCROLL =====
  setupScrollProgress() {
    if (!this.isMobile) return;
    
    // Créer l'indicateur
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-indicator';
    progressBar.innerHTML = '<div class="scroll-progress"></div>';
    document.body.appendChild(progressBar);
    
    this.progressFill = progressBar.querySelector('.scroll-progress');
  }
  
  updateScrollProgress() {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / scrollHeight) * 100;
    
    if (this.progressFill) {
      this.progressFill.style.width = `${Math.min(scrolled, 100)}%`;
    }
  }

  // ===== PULL TO REFRESH =====
  setupPullToRefresh() {
    if (!this.isTouch) return;
    
    let startY = 0;
    let currentY = 0;
    let pullDistance = 0;
    let isPulling = false;
    
    const pullIndicator = document.createElement('div');
    pullIndicator.className = 'pull-indicator';
    pullIndicator.innerHTML = '<i class="fas fa-sync-alt"></i>';
    document.body.appendChild(pullIndicator);
    
    document.addEventListener('touchstart', (e) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
        isPulling = true;
      }
    });
    
    document.addEventListener('touchmove', (e) => {
      if (!isPulling) return;
      
      currentY = e.touches[0].clientY;
      pullDistance = currentY - startY;
      
      if (pullDistance > 0 && pullDistance < 100) {
        e.preventDefault();
        pullIndicator.style.transform = `translateX(-50%) translateY(${pullDistance - 60}px)`;
        pullIndicator.style.opacity = pullDistance / 100;
      }
    });
    
    document.addEventListener('touchend', () => {
      if (isPulling && pullDistance > 60) {
        this.triggerRefresh(pullIndicator);
      } else {
        this.resetPullIndicator(pullIndicator);
      }
      
      isPulling = false;
      pullDistance = 0;
    });
  }
  
  triggerRefresh(indicator) {
    indicator.classList.add('active');
    
    // Simuler un refresh
    setTimeout(() => {
      this.resetPullIndicator(indicator);
      this.showToast('Page actualisée !', 'success');
    }, 1500);
  }
  
  resetPullIndicator(indicator) {
    indicator.classList.remove('active');
    indicator.style.transform = 'translateX(-50%) translateY(-60px)';
    indicator.style.opacity = '0';
  }

  // ===== CHARGEMENT D'IMAGES OPTIMISÉ =====
  setupImageLoading() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      const wrapper = document.createElement('div');
      wrapper.className = 'image-loader';
      img.parentNode.insertBefore(wrapper, img);
      wrapper.appendChild(img);
      
      img.addEventListener('load', () => {
        img.classList.add('loaded');
        setTimeout(() => {
          wrapper.classList.remove('image-loader');
        }, 300);
      });
    });
  }

  // ===== SCROLL FLUIDE =====
  setupSmoothScrolling() {
    document.documentElement.classList.add('smooth-scroll');
    
    // Gestion des liens d'ancrage
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        
        if (target) {
          const offsetTop = target.offsetTop - 80; // Compensation pour header fixe
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ===== GESTION DU SCROLL =====
  handleScroll() {
    if (!this.ticking) {
      requestAnimationFrame(() => {
        this.updateScrollProgress();
        this.handleScrollDirection();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }
  
  handleScrollDirection() {
    const currentScrollY = window.scrollY;
    const header = document.querySelector('.header');
    
    if (header) {
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

  // ===== NOTIFICATIONS TOAST =====
  showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <p>${message}</p>
      </div>
    `;
    
    document.body.appendChild(toast);
    
    // Animer l'entrée
    setTimeout(() => {
      toast.classList.add('show');
    }, 100);
    
    // Supprimer après 3 secondes
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }

  // ===== MODAL MOBILE =====
  createMobileModal(content, title = '') {
    const modal = document.createElement('div');
    modal.className = 'modal-mobile';
    modal.innerHTML = `
      <div class="modal-content-mobile">
        <div class="modal-handle"></div>
        ${title ? `<h3>${title}</h3>` : ''}
        <div class="modal-body">${content}</div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Animer l'ouverture
    setTimeout(() => {
      modal.classList.add('active');
    }, 100);
    
    // Fermeture au clic sur le fond
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeMobileModal(modal);
      }
    });
    
    return modal;
  }
  
  closeMobileModal(modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.remove();
    }, 300);
  }

  // ===== OPTIMISATIONS PERFORMANCE =====
  setupPerformanceOptimizations() {
    // Préchargement des images critiques
    const criticalImages = document.querySelectorAll('img[data-critical]');
    criticalImages.forEach(img => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = img.src;
      document.head.appendChild(link);
    });
    
    // Lazy loading pour les images non critiques
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

  // ===== GESTION DU REDIMENSIONNEMENT =====
  handleResize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 768;
    
    // Réinitialiser si changement mobile/desktop
    if (wasMobile !== this.isMobile) {
      this.init();
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

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', () => {
  // Vérifier si on est sur mobile
  if (window.innerWidth <= 768) {
    new MobileInteractions();
  }
});

// ===== STYLES CSS DYNAMIQUES =====
const addDynamicStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
};

addDynamicStyles();

// ===== EXPORT POUR UTILISATION EXTERNE =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MobileInteractions;
}

window.MobileInteractions = MobileInteractions;