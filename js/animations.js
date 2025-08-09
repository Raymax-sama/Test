export class Animations {
    constructor() {
        this.observers = [];
        this.animationQueue = [];
    }

    init() {
        this.setupIntersectionObserver();
        this.setupScrollAnimations();
        this.setupMicroInteractions();
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerAnimation(entry.target);
                }
            });
        }, options);

        this.observers.push(observer);
    }

    animateSection() {
        // Check if document is ready
        if (!document || !document.querySelectorAll) {
            console.warn('Document not ready for animations');
            return;
        }
        
        // Animate elements that need animation
        const animationElements = document.querySelectorAll('.fade-in, .slide-up, .slide-in-left, .slide-in-right');
        
        if (animationElements && animationElements.length > 0) {
            animationElements.forEach((element, index) => {
                // Reset animation classes
                element.classList.remove('visible', 'animated');
                
                // Apply animation with delay
                setTimeout(() => {
                    element.classList.add('visible');
                }, index * 100);
            });
        }

        // Setup intersection observer for new elements
        this.setupNewObservers();
    }

    setupNewObservers() {
        if (!document || !document.querySelectorAll || !this.observers[0]) {
            return;
        }
        
        const newElements = document.querySelectorAll('.fade-in:not(.observed), .slide-up:not(.observed)');
        
        if (newElements && newElements.length > 0) {
            newElements.forEach(element => {
                element.classList.add('observed');
                this.observers[0].observe(element);
            });
        }
    }

    triggerAnimation(element) {
        if (element.classList.contains('fade-in')) {
            element.classList.add('visible');
        }
        
        if (element.classList.contains('slide-up')) {
            element.classList.add('visible');
        }

        // Add staggered animation for groups
        if (element.classList.contains('stagger-children')) {
            const children = element.querySelectorAll('.stagger-item');
            children.forEach((child, index) => {
                setTimeout(() => {
                    child.classList.add('visible');
                }, index * 150);
            });
        }
    }

    setupScrollAnimations() {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateScrollAnimations();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll);
    }

    updateScrollAnimations() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });

        // Progress bars
        const progressBars = document.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
            const rect = bar.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            if (rect.top < windowHeight && rect.bottom > 0) {
                const progress = bar.dataset.progress || 0;
                bar.style.setProperty('--progress', `${progress}%`);
                bar.classList.add('animated');
            }
        });
    }

    setupMicroInteractions() {
        // Button hover effects
        document.addEventListener('mouseover', (e) => {
            if (e.target.classList.contains('btn')) {
                this.animateButton(e.target, 'hover');
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.classList.contains('btn')) {
                this.animateButton(e.target, 'out');
            }
        });

        // Card hover effects
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('.project-card, .service-card, .lab-card')) {
                const card = e.target.closest('.project-card, .service-card, .lab-card');
                this.animateCard(card, 'hover');
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest('.project-card, .service-card, .lab-card')) {
                const card = e.target.closest('.project-card, .service-card, .lab-card');
                this.animateCard(card, 'out');
            }
        });
    }

    animateButton(button, state) {
        if (state === 'hover') {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
        } else {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '';
        }
    }

    animateCard(card, state) {
        if (state === 'hover') {
            card.style.transform = 'translateY(-5px)';
            
            // Animate image if present
            const image = card.querySelector('img');
            if (image) {
                image.style.transform = 'scale(1.05)';
            }
        } else {
            card.style.transform = '';
            
            const image = card.querySelector('img');
            if (image) {
                image.style.transform = '';
            }
        }
    }

    triggerModeTransition(mode) {
        // Create transition overlay
        const overlay = document.createElement('div');
        overlay.className = 'mode-transition-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: ${mode === 'lab' ? '#121212' : '#ffffff'};
            z-index: 9999;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.5s ease;
        `;
        
        document.body.appendChild(overlay);
        
        // Animate transition
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
            
            setTimeout(() => {
                overlay.style.opacity = '0';
                setTimeout(() => {
                    overlay.remove();
                }, 500);
            }, 200);
        });

        // Add glitch effect for lab mode
        if (mode === 'lab') {
            this.addGlitchEffect();
        }
    }

    addGlitchEffect() {
        const glitchOverlay = document.createElement('div');
        glitchOverlay.className = 'glitch-overlay';
        glitchOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(255, 64, 129, 0.1) 2px,
                rgba(255, 64, 129, 0.1) 4px
            );
            z-index: 9998;
            pointer-events: none;
            opacity: 1;
            animation: glitchAnimation 0.3s ease;
        `;
        
        document.body.appendChild(glitchOverlay);
        
        setTimeout(() => {
            glitchOverlay.remove();
        }, 300);
    }

    // Type writer effect
    typeWriter(element, text, speed = 50) {
        element.textContent = '';
        let i = 0;
        
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);
    }

    // Count up animation
    countUp(element, start, end, duration = 2000) {
        const increment = (end - start) / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }

    // Progress bar animation
    animateProgressBar(element, targetWidth, duration = 1000) {
        element.style.width = '0%';
        element.style.transition = `width ${duration}ms ease`;
        
        setTimeout(() => {
            element.style.width = `${targetWidth}%`;
        }, 50);
    }

    // Cleanup
    destroy() {
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        this.observers = [];
    }

    handleResize() {
        // Recalculate animations on resize
        this.setupScrollAnimations();
    }
}

// Add glitch animation CSS
const glitchStyles = `
@keyframes glitchAnimation {
    0% { transform: translateX(0); }
    10% { transform: translateX(-2px); }
    20% { transform: translateX(2px); }
    30% { transform: translateX(-2px); }
    40% { transform: translateX(2px); }
    50% { transform: translateX(0); }
    100% { transform: translateX(0); }
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = glitchStyles;
document.head.appendChild(styleSheet);