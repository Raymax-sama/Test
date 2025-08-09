export default function projectsTemplate(data) {
    // Filtrer les projets pour n'afficher que ceux avec featured: true dans le carousel
    const featuredProjects = data.items.filter(project => project.featured === true);
    // Garder tous les projets pour la popup
    const allProjects = data.items;
    
    return `
        <section id="projects" class="section section-accent">
            <div class="container">
                <div class="section-header text-center fade-in">
                    <h2>${data.title}</h2>
                    <p>${data.description}</p>
                </div>
                
                <div class="carousel-container">
                    <div class="carousel-wrapper" id="projectsCarousel">
                        ${featuredProjects.map((project, index) => `
                            <article 
                                class="project-card ${index === 0 ? 'active' : ''}" 
                                data-index="${index}"
                                data-categories="${(project.categories || []).join(',')}"
                                role="tabpanel"
                                aria-label="Projet ${index + 1} sur ${featuredProjects.length}"
                            >
                                <div class="project-image-container">
                                    <img 
                                        src="${project.image}" 
                                        alt="${project.title}"
                                        class="project-image"
                                        loading="lazy"
                                        onerror="this.src='data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"350\" height=\"200\" viewBox=\"0 0 350 200\"><rect width=\"100%\" height=\"100%\" fill=\"%23f0f0f0\"/><text x=\"50%\" y=\"50%\" text-anchor=\"middle\" dy=\".3em\" fill=\"%23999\">Image non disponible</text></svg>'"
                                    />
                                    <div class="project-overlay">
                                        <div class="project-actions">
                                            ${project.demoUrl ? `
                                                <a href="${project.demoUrl}" class="btn btn-secondary btn-sm" target="_blank" rel="noopener noreferrer">
                                                    <span>Voir le site</span>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                                        <polyline points="15,3 21,3 21,9"/>
                                                        <line x1="10" y1="14" x2="21" y2="3"/>
                                                    </svg>
                                                </a>
                                            ` : ''}
                                            ${project.githubUrl ? `
                                                <a href="${project.githubUrl}" class="btn btn-outline btn-sm" target="_blank" rel="noopener noreferrer">
                                                    <span>Code</span>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                                                    </svg>
                                                </a>
                                            ` : ''}
                                        </div>
                                    </div>
                                </div>
                                <div class="project-content">
                                    <div class="project-category">${project.category}</div>
                                    <h3 class="project-title">${project.title}</h3>
                                    <p class="project-description">${project.description}</p>
                                    ${project.tags && project.tags.length > 0 ? `
                                        <div class="project-tags">
                                            ${project.tags.map(tag => `
                                                <span class="project-tag">
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 4px">
                                                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                                                        <line x1="7" y1="7" x2="7.01" y2="7"></line>
                                                    </svg>
                                                    ${tag}
                                                </span>
                                            `).join('')}
                                        </div>
                                    ` : ''}
                                    ${project.year ? `<div class="project-year">${project.year}</div>` : ''}
                                </div>
                            </article>
                        `).join('')}
                    </div>
                    
                    ${data.items.length > 1 ? `
                        <button class="carousel-button prev" aria-label="Projet précédent" type="button">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="15,18 9,12 15,6"/>
                            </svg>
                        </button>
                        <button class="carousel-button next" aria-label="Projet suivant" type="button">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9,18 15,12 9,6"/>
                            </svg>
                        </button>
                    ` : ''}
                </div>
                
                ${featuredProjects.length > 3 ? `
                    <div class="carousel-progress">
                        <div class="progress-bar"></div>
                    </div>
                ` : ''}
                
                <!-- Bouton pour voir tous les projets -->
                <div class="text-center mt-4">
                    <button id="view-all-projects" class="btn btn-primary">
                        Voir plus de projets
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-left: 8px">
                            <path d="M5 12h14"></path>
                            <path d="M12 5l7 7-7 7"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </section>
        
        <!-- Modal pour afficher tous les projets -->
        <div id="projects-modal" class="modal">
            <div class="modal-overlay"></div>
            <div class="modal-container">
                <div class="modal-header">
                    <h2>Tous mes projets</h2>
                    <button class="modal-close" aria-label="Fermer">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="modal-content">
                    <div class="projects-grid">
                        <div class="projects-list">
                            ${allProjects.map((project, index) => `
                                <div class="project-item ${index === 0 ? 'active' : ''}" data-project-id="${project.id}">
                                    <div class="project-item-inner">
                                        <div class="project-item-thumbnail">
                                            <img src="${project.image}" alt="${project.title}" loading="lazy" onerror="this.src='data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"60\" viewBox=\"0 0 100 60\"><rect width=\"100%\" height=\"100%\" fill=\"%23f0f0f0\"/><text x=\"50%\" y=\"50%\" text-anchor=\"middle\" dy=\".3em\" fill=\"%23999\" font-size=\"8\">Image non disponible</text></svg>'" />
                                        </div>
                                        <div class="project-item-title">${project.title}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="project-details">
                            ${allProjects.length > 0 ? `
                                <div class="project-detail active" data-project-id="${allProjects[0].id}">
                                    <div class="project-detail-header">
                                        <h3>${allProjects[0].title}</h3>
                                        <div class="project-detail-category">${allProjects[0].category}</div>
                                    </div>
                                    <div class="project-detail-content">
                                        <div class="project-detail-image">
                                            <img src="${allProjects[0].image}" alt="${allProjects[0].title}" />
                                        </div>
                                        <div class="project-detail-description">
                                            <p>${allProjects[0].description_complete || allProjects[0].description}</p>
                                            ${allProjects[0].tags && allProjects[0].tags.length > 0 ? `
                                                <div class="project-detail-tags">
                                                    ${allProjects[0].tags.map(tag => `
                                                        <span class="project-tag">
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 4px">
                                                                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                                                                <line x1="7" y1="7" x2="7.01" y2="7"></line>
                                                            </svg>
                                                            ${tag}
                                                        </span>
                                                    `).join('')}
                                                </div>
                                            ` : ''}
                                            <div class="project-detail-actions">
                                                ${allProjects[0].demoUrl ? `
                                                    <a href="${allProjects[0].demoUrl}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">
                                                        <span>Voir le site</span>
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                                            <polyline points="15,3 21,3 21,9"/>
                                                            <line x1="10" y1="14" x2="21" y2="3"/>
                                                        </svg>
                                                    </a>
                                                ` : ''}
                                                ${allProjects[0].githubUrl ? `
                                                    <a href="${allProjects[0].githubUrl}" class="btn btn-outline" target="_blank" rel="noopener noreferrer">
                                                        <span>Code</span>
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                                                        </svg>
                                                    </a>
                                                ` : ''}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ` : ''}
                            ${allProjects.slice(1).map(project => `
                                <div class="project-detail" data-project-id="${project.id}">
                                    <div class="project-detail-header">
                                        <h3>${project.title}</h3>
                                        <div class="project-detail-category">${project.category}</div>
                                    </div>
                                    <div class="project-detail-content">
                                        <div class="project-detail-image">
                                            <img src="${project.image}" alt="${project.title}" />
                                        </div>
                                        <div class="project-detail-description">
                                            <p>${project.description_complete || project.description}</p>
                                            ${project.tags && project.tags.length > 0 ? `
                                                <div class="project-detail-tags">
                                                    ${project.tags.map(tag => `
                                                        <span class="project-tag">
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 4px">
                                                                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                                                                <line x1="7" y1="7" x2="7.01" y2="7"></line>
                                                            </svg>
                                                            ${tag}
                                                        </span>
                                                    `).join('')}
                                                </div>
                                            ` : ''}
                                            <div class="project-detail-actions">
                                                ${project.demoUrl ? `
                                                    <a href="${project.demoUrl}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">
                                                        <span>Voir le site</span>
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                                            <polyline points="15,3 21,3 21,9"/>
                                                            <line x1="10" y1="14" x2="21" y2="3"/>
                                                        </svg>
                                                    </a>
                                                ` : ''}
                                                ${project.githubUrl ? `
                                                    <a href="${project.githubUrl}" class="btn btn-outline" target="_blank" rel="noopener noreferrer">
                                                        <span>Code</span>
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                                                        </svg>
                                                    </a>
                                                ` : ''}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}