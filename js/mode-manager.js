class ModeManager {
    constructor(router, navigation, animations) {
        this.router = router;
        this.navigation = navigation;
        this.animations = animations;
        this.currentMode = this.getSavedMode() || 'pro';
    }

    getSavedMode() {
        try {
            const savedMode = localStorage.getItem('portfolioMode');
            console.log(`📖 Mode récupéré du localStorage: ${savedMode}`);
            return (savedMode === 'pro' || savedMode === 'lab') ? savedMode : null;
        } catch (error) {
            console.warn('⚠️ Impossible de récupérer le mode sauvegardé:', error);
            return null;
        }
    }

    saveMode(mode) {
        try {
            localStorage.setItem('portfolioMode', mode);
            console.log(`💾 Mode sauvegardé avec succès: ${mode}`);
        } catch (error) {
            console.warn('⚠️ Impossible de sauvegarder le mode:', error);
        }
    }

    applyMode(mode) {
        document.body.className = `mode-${mode}`;
        this.updateHeaderForMode(mode);
        this.updateFooterForMode(mode);
        if (this.navigation?.updateForMode) {
            this.navigation.updateForMode(mode);
        }
        if (this.animations?.triggerModeTransition) {
            this.animations.triggerModeTransition(mode);
        }
    }

    updateHeaderForMode(mode) {
        const logoSpan = document.querySelector('.logo span');
        const navMenu = document.getElementById('nav-menu');
        
        if (mode === 'lab') {
            if (logoSpan) {
                logoSpan.textContent = 'RayMax Lab';
            }
            if (navMenu) {
                navMenu.innerHTML = `
                    <li><a href="#lab-home" class="nav-link active">Accueil</a></li>
                    <li><a href="#lab-passions" class="nav-link">Passions</a></li>
                    <li><a href="#lab-tools" class="nav-link">Outils</a></li>
                    <li><a href="#lab-experiments" class="nav-link">Expériences</a></li>
                    <li><a href="#lab-templates" class="nav-link">Templates</a></li>
                    <li><a href="#lab-guestbook" class="nav-link">Livre d'or</a></li>
                `;
            }
        } else {
            if (logoSpan) {
                logoSpan.textContent = 'Portfolio';
            }
            if (navMenu) {
                navMenu.innerHTML = `
                    <li><a href="#home" class="nav-link active">Accueil</a></li>
                    <li><a href="#about" class="nav-link">À propos</a></li>
                    <li><a href="#services" class="nav-link">Services</a></li>
                    <li><a href="#projects" class="nav-link">Projets</a></li>
                    <li><a href="#testimonials" class="nav-link">Témoignages</a></li>
                    <li><a href="#contact" class="nav-link">Contact</a></li>
                `;
            }
        }
        // Re-attach navigation listeners after updating the menu
        this.navigation.setupEventListeners();
    }

    updateFooterForMode(mode) {
        const footerTitle = document.querySelector('.footer-section h3');
        const footerDescription = document.querySelector('.footer-section p');
        const quickLinksSection = document.querySelector('.footer-section:nth-child(2) ul');
        
        if (mode === 'lab') {
            if (footerTitle) {
                footerTitle.textContent = 'RayMax Lab';
            }
            if (footerDescription) {
                footerDescription.textContent = 'Créativité et expérimentation sans limites';
            }
            if (quickLinksSection) {
                quickLinksSection.innerHTML = `
                    <li><a href="#lab-home">Accueil</a></li>
                    <li><a href="#lab-passions">Passions</a></li>
                    <li><a href="#lab-experiments">Expériences</a></li>
                    <li><a href="#lab-guestbook">Livre d'or</a></li>
                `;
            }
        } else {
            if (footerTitle) {
                footerTitle.textContent = 'Portfolio Pro';
            }
            if (footerDescription) {
                footerDescription.textContent = 'Solutions créatives et techniques innovantes';
            }
            if (quickLinksSection) {
                quickLinksSection.innerHTML = `
                    <li><a href="#home">Accueil</a></li>
                    <li><a href="#services">Services</a></li>
                    <li><a href="#projects">Projets</a></li>
                `;
            }
        }
    }

    handleInitialRoute() {
        const currentHash = window.location.hash.slice(1);
        
        if (this.currentMode === 'lab' && (!currentHash || !currentHash.startsWith('lab-'))) {
            this.router.navigate('lab-home');
        } else if (this.currentMode === 'pro' && currentHash && currentHash.startsWith('lab-')) {
            this.router.navigate('home');
        } else {
            this.router.handleRoute();
        }
    }

    switchMode(mode) {
        if (this.currentMode === mode) return;

        this.currentMode = mode;
        this.saveMode(mode);
        this.applyMode(mode);
        this.router.navigate(mode === 'lab' ? 'lab-home' : 'home');
    }
}

export { ModeManager };