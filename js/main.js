import { Router } from './router.js';
 import { Terminal } from './components/terminal.js';
 import { Navigation } from './components/navigation.js';
 import { Animations } from './animations.js';
 import { DataManager } from './data-manager.js';
 import { ModeManager } from './mode-manager.js';
 import { GuestbookManager } from './guestbook-manager.js';
 import { UIManager } from './ui-manager.js';
 import { Carousel } from './components/carousel.js';
 import { EventHandler } from './event-handler.js';
 import ProjectsModal from './components/projects-modal.js';
 
 class App {
    constructor() {
        this.router = new Router();
        this.terminal = new Terminal();
        this.navigation = new Navigation();
        this.animations = new Animations();
        this.dataManager = new DataManager();
        this.modeManager = new ModeManager(this.router, this.navigation, this.animations);
        this.guestbookManager = new GuestbookManager(this.escapeHTML);
        this.uiManager = new UIManager();
        this.eventHandler = new EventHandler(this.animations, this.uiManager);
        this.projectsModal = new ProjectsModal();
        
        this.isInitialized = false;
        
        this.init();
    }
 
     // Utilitaire pour échapper le HTML
     escapeHTML(str) {
         if (!str) return '';
         const div = document.createElement('div');
         div.appendChild(document.createTextNode(str));
         return div.innerHTML;
     }
 
     async init() {
         console.log('VERSION TEST OK');
 
         try {
             if (this.isInitialized) return;
             
             // Appliquer le mode restauré dès l'initialisation
             this.modeManager.applyMode(this.modeManager.currentMode);
             
             // Initialiser les composants
             await this.dataManager.init();
             this.setupEventListeners();
             this.setupRouter();
             // Guestbook messages are loaded by GuestbookManager constructor
             
             // Supprimer le loader
             
             // Supprimer le loader
             this.hideLoader();
             
             // Initialiser les animations
             this.animations.init();
             
             // Gérer la route initiale (en tenant compte du mode actuel)
             this.modeManager.handleInitialRoute();
             
             this.isInitialized = true;
             
         } catch (error) {
             console.error('Erreur lors de l\'initialisation de l\'app:', error);
             this.showError('Erreur lors du chargement de l\'application');
         }
     }
 

 
     setupEventListeners() {
         // Événements du terminal
         this.terminal.on('modeChange', (mode) => {
             this.modeManager.switchMode(mode);
         });
 
         // Événements de navigation
         this.navigation.on('navigate', (path) => {
             this.router.navigate(path);
         });
 
         // Événements de la fenêtre
         window.addEventListener('scroll', this.throttle(() => {
             this.eventHandler.handleScroll();
         }, 16));
 
         window.addEventListener('resize', this.debounce(() => {
             this.eventHandler.handleResize();
         }, 250));
 
         // Changement de hash pour le routing
         window.addEventListener('hashchange', () => {
             this.router.handleRoute();
         });
     }
 
     setupRouter() {
         // Routes mode pro
         const proRoutes = {
             'home': () => this.loadSection('home'),
             'about': () => this.loadSection('about'),
             'services': () => this.loadSection('services'),
             'projects': () => this.loadSection('projects'),
             'testimonials': () => this.loadSection('testimonials'),
             'contact': () => this.loadSection('contact'),
         };
 
         // Routes mode lab
         const labRoutes = {
             'lab-home': () => this.loadLabSection('home'),
             'lab-passions': () => this.loadLabSection('passions'),
             'lab-tools': () => this.loadLabSection('tools'),
             'lab-experiments': () => this.loadLabSection('experiments'),
             'lab-templates': () => this.loadLabSection('templates'),
             'lab-guestbook': () => this.loadLabSection('guestbook'),
         };
 
         // Routes de détail
         const detailRoutes = {
             'article/:id': (id) => this.loadArticleDetail(id),
         };
 
         // Ajouter toutes les routes
         Object.entries({...proRoutes, ...labRoutes, ...detailRoutes}).forEach(([route, handler]) => {
             this.router.addRoute(route, handler);
         });
     }
 
     async loadSection(section) {
         try {
             // Forcer le rechargement des données pour la section services ou la page d'accueil
             const forceReload = section === 'services' || section === 'home';
             const data = await this.dataManager.getProData(forceReload);
             if (!data) throw new Error('Données pro non disponibles');

             let content = '';
             
             if (section === 'home') {
                 // Charger toutes les sections pour la page d'accueil
                 content += await this.renderSection('home', data);
                 const sectionsToLoad = ['about', 'services', 'projects', 'testimonials', 'contact'];
                 
                 for (const sec of sectionsToLoad) {
                     if (data[sec]) {
                         content += await this.renderSection(sec, data[sec]);
                     }
                 }
             } else {
                 const sectionData = data[section];
                 if (!sectionData) {
                     throw new Error(`Section '${section}' non trouvée`);
                 }
                 content = await this.renderSection(section, sectionData);
             }
 
             this.updateMainContent(content);
            this.animations.animateSection();
             
         } catch (error) {
             console.error(`Erreur lors du chargement de la section ${section}:`, error);
             this.showError(`Erreur lors du chargement de la section ${section}`);
         }
     }
 
     async loadLabSection(section) {
         try {
             const data = await this.dataManager.getLabData();
             if (!data) throw new Error('Données lab non disponibles');
 
             const sectionData = data[section];
             if (!sectionData) {
                 throw new Error(`Section lab '${section}' non trouvée`);
             }
 
             const content = await this.renderLabSection(section, sectionData);
             this.updateMainContent(content);
             this.animations.animateSection();
             
         } catch (error) {
             console.error(`Erreur lors du chargement de la section lab ${section}:`, error);
             this.showError(`Erreur lors du chargement de la section lab ${section}`);
         }
     }
 
     async renderSection(section, data) {
         try {
             const { default: template } = await import(`./templates/${section}.js`);
             return template(data);
         } catch (error) {
             console.error(`Erreur lors du rendu de la section ${section}:`, error);
             return `<div class="error">Erreur lors du chargement du template ${section}</div>`;
         }
     }
 
     async renderLabSection(section, data) {
         try {
             const { default: template } = await import(`./templates/lab/${section}.js`);
             return template(data);
         } catch (error) {
             console.error(`Erreur lors du rendu de la section lab ${section}:`, error);
             return `<div class="error">Erreur lors du chargement du template lab/${section}</div>`;
         }
     }
 

 
     async loadArticleDetail(id) {
         try {
             const data = await this.dataManager.getProData();
             if (!data?.blog?.articles) {
                 throw new Error('Données des articles non disponibles');
             }
 
             const article = data.blog.articles.find(a => a.id === id);
             if (!article) {
                 throw new Error(`Article avec l\'id '${id}' non trouvé`);
             }
 
             const { default: template } = await import('./templates/article-detail.js');
             const content = template(article);
             this.updateMainContent(content);
             this.animations.animateSection();
             
         } catch (error) {
             console.error(`Erreur lors du chargement de l\'article ${id}:`, error);
             this.showError('Article non trouvé');
         }
     }
 
     updateMainContent(content) {
         const mainContent = document.getElementById('main-content');
         if (mainContent) {
             mainContent.innerHTML = content;
             // Attacher les event listeners après la mise à jour du contenu avec un délai
             setTimeout(() => {
                 this.attachDynamicEventListeners();
             }, 100);
         }
     }
 
     attachDynamicEventListeners() {
        // Filtres de projets
        this.setupProjectFilters();
        
        // Formulaires
        this.setupContactForm();
        this.setupGuestbookForm();
        
        // Randomiseur de couleurs pour les templates
        this.setupTemplateColorRandomizer();
        
        // Lazy loading des images
        this.setupLazyLoading();
        
        // Initialisation du carousel pour les projets
        this.setupCarousel();
        
        // Initialisation de la modal des projets
        this.setupProjectsModal();
    }
 
     setupProjectFilters() {
        if (!document || !document.querySelectorAll) return;
        
        const filterButtons = document.querySelectorAll('.filter-btn');
        if (!filterButtons || filterButtons.length === 0) return;
        
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.uiManager.handleProjectFilter(btn.dataset.filter);
            });
        });
    }

    setupCarousel() {
        console.log('Initialisation du carousel...');
        // Attendre que le DOM soit complètement chargé
        setTimeout(() => {
            const carouselElement = document.getElementById('projectsCarousel');
            console.log('Élément carousel:', carouselElement);
            
            if (carouselElement) {
                // S'assurer que les boutons de navigation sont présents
                const carouselContainer = carouselElement.closest('.carousel-container');
                console.log('Container carousel:', carouselContainer);
                
                if (carouselContainer) {
                    // Vérifier si les boutons existent déjà
                    let prevButton = carouselContainer.querySelector('.carousel-button.prev');
                    let nextButton = carouselContainer.querySelector('.carousel-button.next');
                    
                    // Créer les boutons s'ils n'existent pas
                    if (!prevButton) {
                        prevButton = document.createElement('button');
                        prevButton.className = 'carousel-button prev';
                        prevButton.setAttribute('aria-label', 'Projet précédent');
                        prevButton.setAttribute('type', 'button');
                        prevButton.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="15,18 9,12 15,6"/>
                        </svg>`;
                        carouselContainer.appendChild(prevButton);
                        console.log('Bouton précédent créé');
                    }
                    
                    if (!nextButton) {
                        nextButton = document.createElement('button');
                        nextButton.className = 'carousel-button next';
                        nextButton.setAttribute('aria-label', 'Projet suivant');
                        nextButton.setAttribute('type', 'button');
                        nextButton.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="9,18 15,12 9,6"/>
                        </svg>`;
                        carouselContainer.appendChild(nextButton);
                        console.log('Bouton suivant créé');
                    }
                    
                    // S'assurer que les boutons sont visibles
                    if (prevButton) {
                        prevButton.style.display = 'flex';
                        prevButton.style.visibility = 'visible';
                        prevButton.style.zIndex = '1000';
                        console.log('Bouton précédent configuré');
                    }
                    
                    if (nextButton) {
                        nextButton.style.display = 'flex';
                        nextButton.style.visibility = 'visible';
                        nextButton.style.zIndex = '1000';
                        console.log('Bouton suivant configuré');
                    }
                    
                    // Initialiser le carousel avec le composant amélioré
                    try {
                        console.log('Tentative d\'initialisation du carousel...');
                        // Passer le container au lieu du wrapper pour l'initialisation du carousel
                        const carousel = new Carousel(carouselContainer);
                        
                        // Vérifier que le carousel a été correctement initialisé
                        if (carousel && carousel.totalCards > 0) {
                            console.log(`Carousel initialisé avec ${carousel.totalCards} projets`);
                            // Forcer le démarrage de l'autoplay
                            carousel.startAutoplay();
                            
                            // Ajouter un délai pour s'assurer que tout est bien initialisé
                            setTimeout(() => {
                                // Forcer une mise à jour du carousel
                                carousel.updateCarousel();
                                // Réinitialiser l'autoplay
                                carousel.stopAutoplay();
                                carousel.startAutoplay();
                            }, 1000);
                        } else {
                            console.warn('Le carousel a été initialisé mais ne contient pas de cartes');
                        }
                    } catch (error) {
                        console.error('Erreur lors de l\'initialisation du carousel:', error);
                    }
                } else {
                    console.error('Container du carousel non trouvé');
                }
            } else {
                console.error('Élément carousel non trouvé dans le DOM');
            }
        }, 500); // Attendre 500ms pour s'assurer que le DOM est chargé
    }
    
    async setupProjectsModal() {
        try {
            // Récupérer les données des projets
            const data = await this.dataManager.getProData();
            if (!data || !data.projects || !data.projects.items) {
                console.error('Données des projets non disponibles');
                return;
            }
            
            // Initialiser la modal avec tous les projets
            this.projectsModal.init(data.projects.items);
            
            console.log('Modal des projets initialisée avec', data.projects.items.length, 'projets');
            
            // Ajouter un écouteur d'événement sur le bouton "Voir plus de projets"
            const viewAllButton = document.getElementById('view-all-projects');
            if (viewAllButton) {
                viewAllButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.projectsModal.open();
                });
            }
        } catch (error) {
            console.error('Erreur lors de l\'initialisation de la modal des projets:', error);
        }
    }
 
     setupContactForm() {
         const contactForm = document.getElementById('contact-form');
         if (!contactForm) return;
 
         contactForm.addEventListener('submit', async (event) => {
             event.preventDefault();
             
             const formData = new FormData(contactForm);
             const data = Object.fromEntries(formData.entries());
 
             // Validation
             const requiredFields = ['name', 'email', 'subject', 'message'];
             const missingFields = requiredFields.filter(field => !data[field]?.trim());
             
             if (missingFields.length > 0) {
                 this.showError('Veuillez remplir tous les champs obligatoires.');
                 return;
             }
 
             if (!this.isValidEmail(data.email)) {
                 this.showError('Veuillez entrer une adresse email valide.');
                 return;
             }
 
             try {
                 // Simuler l\'envoi du formulaire
                 await this.submitContactForm(data);
                 this.showSuccess('Message envoyé avec succès !');
                 contactForm.reset();
             } catch (error) {
                 console.error('Erreur lors de l\'envoi du formulaire:', error);
                 this.showError('Erreur lors de l\'envoi du message.');
             }
         });
     }
 
     setupGuestbookForm() {
         const guestbookForm = document.getElementById('guestbook-form');
         if (!guestbookForm) return;
 
         // Afficher les messages existants via GuestbookManager
         this.guestbookManager.renderGuestbookMessages();
 
         guestbookForm.addEventListener('submit', (event) => {
             event.preventDefault();
 
             const formData = new FormData(guestbookForm);
             const newMessage = {
                 id: Date.now().toString(),
                 name: formData.get('name')?.trim(),
                 message: formData.get('message')?.trim(),
                 timestamp: new Date().toISOString()
             };
 
             if (!newMessage.name || !newMessage.message) {
                 this.showError('Veuillez remplir tous les champs du livre d\'or.');
                 return;
             }
 
             try {
                 this.guestbookManager.addGuestbookMessage(newMessage);
                 this.guestbookManager.renderGuestbookMessages();
                 guestbookForm.reset();
                 this.showSuccess('Message ajouté au livre d\'or !');
             } catch (error) {
                 console.error('Erreur lors de l\'ajout du message:', error);
                 this.showError('Erreur lors de l\'ajout du message.');
             }
         });
     }
 
     setupTemplateColorRandomizer() {
         const randomizeButtons = document.querySelectorAll('.randomize-colors');
         randomizeButtons.forEach(btn => {
             btn.addEventListener('click', () => {
                 this.uiManager.randomizeTemplateColors(btn.closest('.template-card'));
             });
         });
     }
 
     setupLazyLoading() {
         if (!document || !document.querySelectorAll) return;
         
         const images = document.querySelectorAll('img[data-src]');
         if (!images || images.length === 0) return;
 
         const imageObserver = new IntersectionObserver((entries) => {
             entries.forEach(entry => {
                 if (entry.isIntersecting) {
                     const img = entry.target;
                     img.src = img.dataset.src;
                     img.classList.remove('lazy');
                     imageObserver.unobserve(img);
                 }
             });
         }, {
             rootMargin: '50px'
         });
         
         images.forEach(img => imageObserver.observe(img));
     }
 
     // Interface utilisateur
     hideLoader() {
         const loader = document.getElementById('loader');
         if (loader) {
             loader.classList.add('hidden');
             setTimeout(() => {
                 if (loader.parentNode) {
                     loader.remove();
                 }
             }, 300);
         }
     }
 
     showError(message) {
         this.showNotification(message, 'error');
     }
 
     showSuccess(message) {
         this.showNotification(message, 'success');
     }
 
     showNotification(message, type = 'info') {
         // Supprimer les notifications existantes du même type
         const existingNotifications = document.querySelectorAll(`.notification-${type}`);
         existingNotifications.forEach(notification => notification.remove());
 
         const notification = document.createElement('div');
         notification.className = `notification notification-${type}`;
         
         const messageSpan = document.createElement('span');
         messageSpan.textContent = message;
         notification.appendChild(messageSpan);
 
         const closeButton = document.createElement('button');
         closeButton.className = 'notification-close';
         closeButton.innerHTML = '&times;';
         closeButton.setAttribute('aria-label', 'Fermer la notification');
         notification.appendChild(closeButton);
         
         document.body.appendChild(notification);
         
         // Suppression automatique après 5 secondes
         const autoRemoveTimeout = setTimeout(() => {
             if (notification.parentNode) {
                 notification.remove();
             }
         }, 5000);
         
         // Fermeture manuelle
         closeButton.addEventListener('click', () => {
             clearTimeout(autoRemoveTimeout);
             notification.remove();
         });
     }
 
     // Utilitaires
     isValidEmail(email) {
         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
         return emailRegex.test(email);
     }
 
     async submitContactForm(data) {
         // Simuler un délai d\'envoi
         return new Promise((resolve) => {
             setTimeout(() => {
                 console.log('Données du formulaire de contact:', data);
                 resolve();
             }, 1000);
         });
     }
 
     // Fonctions utilitaires pour la performance
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
 }
 
 // Initialiser l\'application quand le DOM est chargé
 document.addEventListener('DOMContentLoaded', () => {
     // Créer l\'instance globale pour le debug
     window.app = new App();
 });
 
 // Ajouter les styles des notifications
 const notificationStyles = `
 .notification {
     position: fixed;
     top: 20px;
     right: 20px;
     padding: 16px 20px;
     border-radius: 8px;
     color: white;
     font-weight: 500;
     z-index: 10000;
     display: flex;
     align-items: center;
     gap: 12px;
     max-width: 350px;
     box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
     animation: slideInRight 0.3s ease;
     font-family: inherit;
 }
 
 .notification-success {
     background: #27ae60;
 }
 
 .notification-error {
     background: #e74c3c;
 }
 
 .notification-info {
     background: #3498db;
 }
 
 .notification-close {
     background: none;
     border: none;
     color: white;
     font-size: 18px;
     cursor: pointer;
     padding: 0;
     width: 20px;
     height: 20px;
     display: flex;
     align-items: center;
     justify-content: center;
     opacity: 0.8;
     transition: opacity 0.2s ease;
 }
 
 .notification-close:hover {
     opacity: 1;
 }
 
 .hidden {
     opacity: 0;
     transition: opacity 0.3s ease;
 }
 
 .fade-in {
     animation: fadeIn 0.3s ease;
 }
 
 .fade-out {
     animation: fadeOut 0.3s ease;
 }
 
 .no-messages {
     text-align: center;
     color: #666;
     font-style: italic;
     padding: 20px;
 }
 
 @keyframes slideInRight {
     from {
         transform: translateX(100%);
         opacity: 0;
     }
     to {
         transform: translateX(0);
         opacity: 1;
     }
 }
 
 @keyframes fadeIn {
     from { opacity: 0; transform: translateY(20px); }
     to { opacity: 1; transform: translateY(0); }
 }
 
 @keyframes fadeOut {
     from { opacity: 1; transform: translateY(0); }
     to { opacity: 0; transform: translateY(-20px); }
 }
 `;
 
 // Injecter les styles des notifications
 if (!document.getElementById('app-notification-styles')) {
     const styleSheet = document.createElement('style');
     styleSheet.id = 'app-notification-styles';
     styleSheet.textContent = notificationStyles;
     document.head.appendChild(styleSheet);
 };