export class EventHandler {
    constructor(animationsInstance, uiManagerInstance) {
        this.animations = animationsInstance;
        this.uiManager = uiManagerInstance;
    }

    handleScroll() {
        const header = document.getElementById('header');
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > 100);
        }
        
        this.updateActiveSection();
    }

    updateActiveSection() {
        const sections = document.querySelectorAll('.section');
        const scrollPos = window.scrollY + 200;
        
        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            
            if (scrollPos >= top && scrollPos < bottom) {
                this.uiManager.updateActiveNavigation(section.id);
            }
        });
    }

    handleResize() {
        if (this.animations?.handleResize) {
            this.animations.handleResize();
        }
    }
}