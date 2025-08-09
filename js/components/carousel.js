export class Carousel {
    constructor(containerSelector) {
        // Accept both DOM element and selector string
        if (typeof containerSelector === 'string') {
            this.container = document.querySelector(containerSelector);
        } else if (containerSelector instanceof HTMLElement) {
            this.container = containerSelector;
        } else {
            console.error('Carousel container must be a string selector or DOM element:', containerSelector);
            return;
        }
        
        if (!this.container) {
            console.error('Carousel container not found:', containerSelector);
            return;
        }
        
        // Find the wrapper - it could be the element with ID 'projectsCarousel'
        this.wrapper = this.container.querySelector('.carousel-wrapper') || document.getElementById('projectsCarousel');
        if (!this.wrapper) {
            console.warn('Carousel wrapper not found');
            return;
        }
        
        console.log('Carousel wrapper found:', this.wrapper);
        
        this.cards = Array.from(this.wrapper.querySelectorAll('.project-card'));
        console.log('Found', this.cards.length, 'project cards');
        
        // Find navigation buttons - they should be in the container
        this.prevButton = this.container.querySelector('.carousel-button.prev');
        this.nextButton = this.container.querySelector('.carousel-button.next');
        
        console.log('Navigation buttons found:', !!this.prevButton, !!this.nextButton);
        
        this.indicators = Array.from(this.container.querySelectorAll('.carousel-indicator'));
        console.log('Found', this.indicators.length, 'indicators');
        
        this.currentIndex = 0;
        this.totalCards = this.cards.length;
        this.isAnimating = false;
        this.autoplayInterval = null;
        
        // Touch/Swipe properties
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.touchStartY = 0;
        this.touchEndY = 0;
        this.isDragging = false;
        this.minSwipeDistance = 50;
        
        // Device detection
        this.isMobile = window.innerWidth <= 768;
        this.isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
        this.isDesktop = window.innerWidth > 1024;
        
        this.init();
    }
    
    init() {
        console.log('Initializing carousel');
        
        if (!this.container || this.totalCards === 0) return;
        
        // Vérifier et initialiser les boutons de navigation avant de configurer les écouteurs d'événements
        if (!this.prevButton || !this.nextButton) {
            console.log('Navigation buttons not found during init, searching for them');
            this.prevButton = this.container.querySelector('.carousel-button.prev');
            this.nextButton = this.container.querySelector('.carousel-button.next');
            
            // Si toujours pas trouvés, chercher dans le document entier
            if (!this.prevButton || !this.nextButton) {
                console.log('Creating navigation buttons as they were not found');
                
                // Créer les boutons s'ils n'existent pas
                if (!this.prevButton) {
                    this.prevButton = document.createElement('button');
                    this.prevButton.className = 'carousel-button prev';
                    this.prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
                    this.prevButton.setAttribute('aria-label', 'Projet précédent');
                    this.container.appendChild(this.prevButton);
                }
                
                if (!this.nextButton) {
                    this.nextButton = document.createElement('button');
                    this.nextButton.className = 'carousel-button next';
                    this.nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
                    this.nextButton.setAttribute('aria-label', 'Projet suivant');
                    this.container.appendChild(this.nextButton);
                }
            }
        }
        
        this.setupEventListeners();
        this.updateCarousel();
        
        // Assurer la visibilité des boutons plusieurs fois avec des délais différents
        this.ensureNavigationButtonsVisible();
        
        // Vérifier à nouveau après un court délai pour s'assurer que le DOM est mis à jour
        setTimeout(() => {
            this.ensureNavigationButtonsVisible();
        }, 100);
        
        setTimeout(() => {
            this.ensureNavigationButtonsVisible();
        }, 500);
        
        // Démarrer l'autoplay après un court délai pour s'assurer que tout est initialisé
        setTimeout(() => {
            this.startAutoplay();
        }, 500);
        
        // Handle resize
        window.addEventListener('resize', () => {
            this.handleResize();
            // Réappliquer la visibilité des boutons après redimensionnement
            this.ensureNavigationButtonsVisible();
        });
    }
    
    setupEventListeners() {
        console.log('Setting up event listeners for carousel');
        
        // Navigation buttons - with improved event handling
        if (this.prevButton) {
            console.log('Adding click listener to previous button');
            
            // Remove any existing listeners to prevent duplicates
            const newPrevButton = this.prevButton.cloneNode(true);
            this.prevButton.parentNode.replaceChild(newPrevButton, this.prevButton);
            this.prevButton = newPrevButton;
            
            // Add new listener with event prevention
            this.prevButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Previous button clicked');
                this.prevCard();
                this.stopAutoplay();
                // Longer pause after manual navigation
                setTimeout(() => this.startAutoplay(), 10000);
                
                // Force buttons visibility after click
                this.forceButtonsVisibility();
            });
        } else {
            console.warn('Previous button not available for event listener setup');
        }
        
        if (this.nextButton) {
            console.log('Adding click listener to next button');
            
            // Remove any existing listeners to prevent duplicates
            const newNextButton = this.nextButton.cloneNode(true);
            this.nextButton.parentNode.replaceChild(newNextButton, this.nextButton);
            this.nextButton = newNextButton;
            
            // Add new listener with event prevention
            this.nextButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Next button clicked');
                this.nextCard();
                this.stopAutoplay();
                // Longer pause after manual navigation
                setTimeout(() => this.startAutoplay(), 10000);
                
                // Force buttons visibility after click
                this.forceButtonsVisibility();
            });
        } else {
            console.warn('Next button not available for event listener setup');
        }
        
        // Indicators
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.goToSlide(index);
                this.stopAutoplay();
            });
        });
        
        // Touch/Swipe events for mobile and tablet
        this.setupTouchEvents();
        
        // Keyboard navigation
        this.container.addEventListener('keydown', (e) => {
            this.handleKeydown(e);
        });
        
        // Autoplay pause on hover/focus
        this.container.addEventListener('mouseenter', () => this.stopAutoplay());
        this.container.addEventListener('mouseleave', () => this.startAutoplay());
        this.container.addEventListener('focusin', () => this.stopAutoplay());
        this.container.addEventListener('focusout', () => this.startAutoplay());
        
        // Intersection Observer for autoplay
        this.setupIntersectionObserver();
    }
    
    setupTouchEvents() {
        // Touch start
        this.wrapper.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
            this.isDragging = true;
            this.stopAutoplay();
        }, { passive: true });
        
        // Touch move
        this.wrapper.addEventListener('touchmove', (e) => {
            if (!this.isDragging) return;
            
            const touchX = e.touches[0].clientX;
            const touchY = e.touches[0].clientY;
            const deltaX = Math.abs(touchX - this.touchStartX);
            const deltaY = Math.abs(touchY - this.touchStartY);
            
            // Prevent vertical scrolling if horizontal swipe is detected
            if (deltaX > deltaY && deltaX > 10) {
                e.preventDefault();
            }
        }, { passive: false });
        
        // Touch end
        this.wrapper.addEventListener('touchend', (e) => {
            if (!this.isDragging) return;
            
            this.touchEndX = e.changedTouches[0].clientX;
            this.touchEndY = e.changedTouches[0].clientY;
            this.handleSwipe();
            this.isDragging = false;
        }, { passive: true });
        
        // Mouse events for desktop drag (optional)
        if (this.isDesktop) {
            this.setupMouseDrag();
        }
    }
    
    setupMouseDrag() {
        let isMouseDown = false;
        let startX = 0;
        
        this.wrapper.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            startX = e.clientX;
            this.wrapper.style.cursor = 'grabbing';
            e.preventDefault();
        });
        
        this.wrapper.addEventListener('mousemove', (e) => {
            if (!isMouseDown) return;
            e.preventDefault();
        });
        
        this.wrapper.addEventListener('mouseup', (e) => {
            if (!isMouseDown) return;
            
            const endX = e.clientX;
            const deltaX = startX - endX;
            
            if (Math.abs(deltaX) > this.minSwipeDistance) {
                if (deltaX > 0) {
                    this.nextCard();
                } else {
                    this.prevCard();
                }
            }
            
            isMouseDown = false;
            this.wrapper.style.cursor = 'grab';
        });
        
        this.wrapper.addEventListener('mouseleave', () => {
            isMouseDown = false;
            this.wrapper.style.cursor = 'grab';
        });
    }
    
    handleSwipe() {
        const deltaX = this.touchStartX - this.touchEndX;
        const deltaY = Math.abs(this.touchStartY - this.touchEndY);
        
        // Only process horizontal swipes
        if (Math.abs(deltaX) > this.minSwipeDistance && Math.abs(deltaX) > deltaY) {
            if (deltaX > 0) {
                // Swipe left - next card
                this.nextCard();
            } else {
                // Swipe right - previous card
                this.prevCard();
            }
        }
    }
    
    handleKeydown(e) {
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.prevCard();
                this.stopAutoplay();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.nextCard();
                this.stopAutoplay();
                break;
            case 'Home':
                e.preventDefault();
                this.goToSlide(0);
                break;
            case 'End':
                e.preventDefault();
                this.goToSlide(this.totalCards - 1);
                break;
        }
    }
    
    handleResize() {
        const oldIsMobile = this.isMobile;
        const oldIsTablet = this.isTablet;
        const oldIsDesktop = this.isDesktop;
        
        this.isMobile = window.innerWidth <= 768;
        this.isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
        this.isDesktop = window.innerWidth > 1024;
        
        // Re-setup touch events if device type changed
        if ((oldIsMobile !== this.isMobile) || (oldIsTablet !== this.isTablet) || (oldIsDesktop !== this.isDesktop)) {
            this.updateCarousel();
        }
    }
    
    updateCarousel() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        
        console.log('Updating carousel to index:', this.currentIndex);
        
        this.cards.forEach((card, index) => {
            // Remove all position classes
            card.classList.remove('active', 'next', 'prev', 'next-2', 'prev-2', 'hidden');
            
            const position = this.getRelativePosition(index, this.currentIndex, this.totalCards);
            card.classList.add(position);
            
            // Update accessibility
            card.setAttribute('aria-hidden', position !== 'active');
            card.setAttribute('tabindex', position === 'active' ? '0' : '-1');
        });
        
        // Update indicators
        this.indicators.forEach((indicator, index) => {
            const isActive = index === this.currentIndex;
            indicator.classList.toggle('active', isActive);
            indicator.setAttribute('aria-selected', isActive);
        });
        
        // Ensure navigation buttons remain visible during and after transition
        this.ensureNavigationButtonsVisible();
        
        // Set multiple timeouts to ensure buttons remain visible after transition
        const visibilityChecks = [100, 300, 600, 800];
        visibilityChecks.forEach(delay => {
            setTimeout(() => {
                this.ensureNavigationButtonsVisible();
            }, delay);
        });
        
        // Reset animation flag after transition
        setTimeout(() => {
            this.isAnimating = false;
            // Final check after animation completes
            this.ensureNavigationButtonsVisible();
        }, 800);
    }
    
    getRelativePosition(index, currentIndex, totalCards) {
        const diff = (index - currentIndex + totalCards) % totalCards;
        
        if (diff === 0) return 'active';
        if (diff === 1) return 'next';
        if (diff === totalCards - 1) return 'prev';
        if (diff === 2) return 'next-2';
        if (diff === totalCards - 2) return 'prev-2';
        return 'hidden';
    }
    
    nextCard() {
        if (this.isAnimating) return;
        this.currentIndex = (this.currentIndex + 1) % this.totalCards;
        this.updateCarousel();
    }
    
    prevCard() {
        if (this.isAnimating) return;
        this.currentIndex = (this.currentIndex - 1 + this.totalCards) % this.totalCards;
        this.updateCarousel();
    }
    
    goToSlide(index) {
        if (this.isAnimating || index === this.currentIndex) return;
        this.currentIndex = index;
        this.updateCarousel();
    }
    
    startAutoplay() {
        this.stopAutoplay();
        // Autoplay on all devices but with different intervals
        const autoplayDelay = this.isDesktop ? 5000 : 7000;
        
        console.log('Starting autoplay with delay:', autoplayDelay);
        
        // Force button visibility with our enhanced method
        this.forceButtonsVisibility();
        
        this.autoplayInterval = setInterval(() => {
            this.nextCard();
            console.log('Carousel advanced to next card');
            
            // Force buttons visibility during autoplay
            this.forceButtonsVisibility();
        }, autoplayDelay);
    }
    
    // Method to force buttons visibility with multiple approaches
    forceButtonsVisibility() {
        console.log('Forcing buttons visibility with multiple approaches');
        
        // First approach: use our existing method
        this.ensureNavigationButtonsVisible();
        
        // Second approach: check if buttons are in DOM and visible
        const checkAndFixButtons = () => {
            // Check if buttons exist in DOM
            const prevInDOM = document.body.contains(this.prevButton);
            const nextInDOM = document.body.contains(this.nextButton);
            
            console.log(`Buttons in DOM: prev=${prevInDOM}, next=${nextInDOM}`);
            
            if (!prevInDOM || !nextInDOM) {
                console.log('Some buttons are not in DOM, recreating them');
                
                // Recreate buttons if necessary
                if (!prevInDOM) {
                    this.prevButton = document.createElement('button');
                    this.prevButton.className = 'carousel-button prev';
                    this.prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
                    this.prevButton.setAttribute('aria-label', 'Projet précédent');
                    this.container.appendChild(this.prevButton);
                    
                    // Reattach event listeners
                    this.prevButton.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.prevCard();
                        this.stopAutoplay();
                        setTimeout(() => this.startAutoplay(), 10000);
                    });
                }
                
                if (!nextInDOM) {
                    this.nextButton = document.createElement('button');
                    this.nextButton.className = 'carousel-button next';
                    this.nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
                    this.nextButton.setAttribute('aria-label', 'Projet suivant');
                    this.container.appendChild(this.nextButton);
                    
                    // Reattach event listeners
                    this.nextButton.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.nextCard();
                        this.stopAutoplay();
                        setTimeout(() => this.startAutoplay(), 10000);
                    });
                }
            }
            
            // Apply strong inline styles to ensure visibility
            if (this.prevButton) {
                Object.assign(this.prevButton.style, {
                    display: 'flex',
                    visibility: 'visible',
                    opacity: '1',
                    zIndex: '9999',
                    pointerEvents: 'auto',
                    position: 'absolute',
                    left: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer'
                });
            }
            
            if (this.nextButton) {
                Object.assign(this.nextButton.style, {
                    display: 'flex',
                    visibility: 'visible',
                    opacity: '1',
                    zIndex: '9999',
                    pointerEvents: 'auto',
                    position: 'absolute',
                    right: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer'
                });
            }
        };
        
        // Execute immediately
        checkAndFixButtons();
        
        // Then check again after short delays
        [100, 300, 500].forEach(delay => {
            setTimeout(checkAndFixButtons, delay);
        });
    }
    
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
    
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.startAutoplay();
                } else {
                    this.stopAutoplay();
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(this.container);
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            this.stopAutoplay();
            observer.disconnect();
        });
    }
    
    // Méthode pour s'assurer que les boutons de navigation sont visibles
    ensureNavigationButtonsVisible() {
        console.log('Ensuring navigation buttons are visible');
        
        // Vérifier si les boutons existent
        if (!this.prevButton || !this.nextButton) {
            console.log('Buttons not found, trying to find them again');
            this.prevButton = this.container.querySelector('.carousel-button.prev');
            this.nextButton = this.container.querySelector('.carousel-button.next');
            
            // Si toujours pas trouvés, chercher dans le document entier
            if (!this.prevButton || !this.nextButton) {
                console.log('Buttons still not found, searching in entire document');
                const carouselId = this.wrapper.id;
                const containerSelector = `.carousel-container:has(#${carouselId})`;
                
                // Chercher les boutons près du carousel
                const containers = document.querySelectorAll('.carousel-container');
                containers.forEach(container => {
                    if (container.contains(this.wrapper)) {
                        if (!this.prevButton) {
                            this.prevButton = container.querySelector('.carousel-button.prev');
                        }
                        if (!this.nextButton) {
                            this.nextButton = container.querySelector('.carousel-button.next');
                        }
                    }
                });
            }
        }
        
        if (this.prevButton) {
            // Appliquer plusieurs styles pour garantir la visibilité
            this.prevButton.style.display = 'flex';
            this.prevButton.style.visibility = 'visible';
            this.prevButton.style.zIndex = '9999'; // Valeur plus élevée
            this.prevButton.style.opacity = '1';
            this.prevButton.style.pointerEvents = 'auto';
            this.prevButton.style.position = 'absolute'; // Assurer le positionnement
            this.prevButton.style.transform = 'translateY(-50%)'; // Maintenir le centrage vertical
            this.prevButton.style.left = '20px'; // Position explicite
            
            // Supprimer les classes qui pourraient cacher le bouton
            this.prevButton.classList.remove('hidden', 'invisible');
            
            console.log('Previous button is now visible:', this.prevButton);
        } else {
            console.warn('Previous button not found after multiple attempts');
        }
        
        if (this.nextButton) {
            // Appliquer plusieurs styles pour garantir la visibilité
            this.nextButton.style.display = 'flex';
            this.nextButton.style.visibility = 'visible';
            this.nextButton.style.zIndex = '9999'; // Valeur plus élevée
            this.nextButton.style.opacity = '1';
            this.nextButton.style.pointerEvents = 'auto';
            this.nextButton.style.position = 'absolute'; // Assurer le positionnement
            this.nextButton.style.transform = 'translateY(-50%)'; // Maintenir le centrage vertical
            this.nextButton.style.right = '20px'; // Position explicite
            
            // Supprimer les classes qui pourraient cacher le bouton
            this.nextButton.classList.remove('hidden', 'invisible');
            
            console.log('Next button is now visible:', this.nextButton);
        } else {
            console.warn('Next button not found after multiple attempts');
        }
    }
    
    // Public method to destroy the carousel
    destroy() {
        this.stopAutoplay();
        // Remove event listeners if needed
    }
}