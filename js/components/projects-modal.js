/**
 * Projects Modal Component
 * Gère l'affichage de la modal pour tous les projets
 */

class ProjectsModal {
    constructor() {
        this.modal = null;
        this.projectsList = null;
        this.projectDetails = null;
        this.projects = [];
        this.activeProjectId = null;
        this.initialized = false;
    }

    /**
     * Initialise la modal des projets
     * @param {Array} projects - Liste complète des projets
     */
    init(projects) {
        console.log('Initializing projects modal with', projects.length, 'projects');
        this.projects = projects;
        
        if (!this.initialized) {
            this.createModal();
            this.setupEventListeners();
            this.initialized = true;
        }
        
        this.renderProjectsList();
        
        // Activer le premier projet par défaut
        if (this.projects.length > 0) {
            this.setActiveProject(this.projects[0].id);
        }
    }

    /**
     * Crée la structure DOM de la modal si elle n'existe pas déjà
     */
    createModal() {
        // Vérifier si la modal existe déjà
        const existingModal = document.getElementById('projects-modal');
        if (existingModal) {
            this.modal = existingModal;
            this.projectsList = document.querySelector('.projects-list');
            this.projectDetails = document.querySelector('.project-details');
            return;
        }

        // Créer la structure de la modal
        const modalHTML = `
            <div id="projects-modal" class="modal">
                <div class="modal-overlay"></div>
                <div class="modal-container">
                    <div class="modal-header">
                        <h2>Tous mes projets</h2>
                        <button class="modal-close">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    <div class="modal-content">
                        <div class="projects-grid">
                            <div class="projects-list"></div>
                            <div class="project-details"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Ajouter la modal au body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Stocker les références aux éléments
        this.modal = document.getElementById('projects-modal');
        this.projectsList = document.querySelector('.projects-list');
        this.projectDetails = document.querySelector('.project-details');
    }

    /**
     * Configure les écouteurs d'événements pour la modal
     */
    setupEventListeners() {
        // Fermer la modal en cliquant sur le bouton de fermeture
        const closeButton = this.modal.querySelector('.modal-close');
        closeButton.addEventListener('click', () => this.close());

        // Fermer la modal en cliquant sur l'overlay
        const overlay = this.modal.querySelector('.modal-overlay');
        overlay.addEventListener('click', () => this.close());

        // Empêcher la fermeture en cliquant sur le contenu de la modal
        const container = this.modal.querySelector('.modal-container');
        container.addEventListener('click', (e) => e.stopPropagation());

        // Fermer la modal avec la touche Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });

        // Écouteur pour le bouton "Voir plus de projets"
        const viewAllButton = document.getElementById('view-all-projects');
        if (viewAllButton) {
            viewAllButton.addEventListener('click', () => this.open());
        }
    }

    /**
     * Génère la liste des projets dans la sidebar
     */
    renderProjectsList() {
        if (!this.projectsList) return;
        
        this.projectsList.innerHTML = '';
        
        this.projects.forEach(project => {
            const projectItem = document.createElement('div');
            projectItem.className = 'project-item';
            projectItem.dataset.id = project.id;
            projectItem.innerHTML = `
                <div class="project-item-inner">
                    <div class="project-item-thumbnail">
                        <img src="${project.image}" alt="${project.title}">
                    </div>
                    <div class="project-item-title">${project.title}</div>
                </div>
            `;
            
            projectItem.addEventListener('click', () => {
                this.setActiveProject(project.id);
            });
            
            this.projectsList.appendChild(projectItem);
        });
    }

    /**
     * Génère les détails d'un projet
     */
    renderProjectDetails() {
        if (!this.projectDetails || !this.activeProjectId) return;
        
        this.projectDetails.innerHTML = '';
        
        const project = this.projects.find(p => p.id === this.activeProjectId);
        if (!project) return;
        
        const detailElement = document.createElement('div');
        detailElement.className = 'project-detail active';
        detailElement.dataset.id = project.id;
        
        const description = project.description_complete || project.description;
        
        detailElement.innerHTML = `
            <div class="project-detail-header">
                <h3>${project.title}</h3>
                <div class="project-detail-category">${project.category}</div>
            </div>
            <div class="project-detail-content">
                <div class="project-detail-image">
                    <img src="${project.image}" alt="${project.title}">
                </div>
                <div class="project-detail-description">
                    <p>${description}</p>
                    <div class="project-detail-tags">
                        ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                    </div>
                    <div class="project-detail-actions">
                        ${project.demoUrl ? `<a href="${project.demoUrl}" target="_blank" class="btn btn-primary">Voir la démo</a>` : ''}
                        ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" class="btn btn-outline">Code source</a>` : ''}
                    </div>
                </div>
            </div>
        `;
        
        this.projectDetails.appendChild(detailElement);
    }

    /**
     * Définit le projet actif et met à jour l'affichage
     * @param {string} projectId - ID du projet à activer
     */
    setActiveProject(projectId) {
        this.activeProjectId = projectId;
        
        // Mettre à jour la classe active dans la liste
        const projectItems = this.projectsList.querySelectorAll('.project-item');
        projectItems.forEach(item => {
            if (item.dataset.id === projectId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // Mettre à jour les détails du projet
        this.renderProjectDetails();
    }

    /**
     * Ouvre la modal
     */
    open() {
        if (!this.modal) return;
        
        // Ajouter la classe active pour afficher la modal
        this.modal.classList.add('active');
        
        // Empêcher le défilement du body
        document.body.style.overflow = 'hidden';
        
        // Effet 3D au survol
        this.setupMouseMoveEffect();
    }

    /**
     * Ferme la modal
     */
    close() {
        if (!this.modal) return;
        
        // Retirer la classe active pour masquer la modal
        this.modal.classList.remove('active');
        
        // Réactiver le défilement du body
        document.body.style.overflow = '';
        
        // Supprimer l'effet 3D
        this.removeMouseMoveEffect();
    }

    /**
     * Vérifie si la modal est ouverte
     * @returns {boolean} - true si la modal est ouverte, false sinon
     */
    isOpen() {
        return this.modal && this.modal.classList.contains('active');
    }

    /**
     * Configure l'effet 3D au survol de la souris
     */
    setupMouseMoveEffect() {
        const container = this.modal.querySelector('.modal-container');
        const content = this.modal.querySelector('.modal-content');
        
        this.mouseMoveHandler = (e) => {
            if (!this.isOpen()) return;
            
            // Réduire la sensibilité en augmentant le diviseur (de 25 à 60)
            const xAxis = (window.innerWidth / 2 - e.pageX) / 60;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 60;
            
            // Limiter l'angle de rotation à ±3 degrés maximum
            const limitedXAxis = Math.max(-3, Math.min(3, xAxis));
            const limitedYAxis = Math.max(-3, Math.min(3, yAxis));
            
            container.style.transform = `translate(-50%, -50%) perspective(1000px) rotateY(${limitedXAxis}deg) rotateX(${-limitedYAxis}deg)`;
        };
        
        document.addEventListener('mousemove', this.mouseMoveHandler);
    }

    /**
     * Supprime l'effet 3D au survol de la souris
     */
    removeMouseMoveEffect() {
        if (this.mouseMoveHandler) {
            document.removeEventListener('mousemove', this.mouseMoveHandler);
        }
    }
}

// Exporter la classe
export default ProjectsModal;