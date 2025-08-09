export default function aboutTemplate(data) {
    // Fonction pour obtenir les initiales du nom
    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Fonction pour animer les éléments au scroll
    const observeElements = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observer tous les éléments avec animation
        document.querySelectorAll('.slide-up, .fade-in, .timeline-item, .value-card').forEach(el => {
            observer.observe(el);
        });
    };

    // Fonction pour ajouter des effets de particules sur les cartes de valeurs
    const addParticleEffect = () => {
        document.querySelectorAll('.value-card').forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                createParticles(e.currentTarget);
            });
        });
    };

    // Créer des particules animées
    const createParticles = (element) => {
        const particleCount = 6;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: var(--color-primary);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                opacity: 0;
            `;
            
            element.appendChild(particle);
            
            // Animation des particules
            const angle = (i / particleCount) * Math.PI * 2;
            const distance = 50 + Math.random() * 30;
            const duration = 800 + Math.random() * 400;
            
            particle.animate([
                {
                    opacity: 0,
                    transform: `translate(50%, 50%) translate(0px, 0px) scale(0)`
                },
                {
                    opacity: 1,
                    transform: `translate(50%, 50%) translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(1)`
                },
                {
                    opacity: 0,
                    transform: `translate(50%, 50%) translate(${Math.cos(angle) * distance * 1.5}px, ${Math.sin(angle) * distance * 1.5}px) scale(0)`
                }
            ], {
                duration: duration,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => particle.remove();
        }
    };

    // Fonction pour ajouter l'effet de typing sur le texte bio
    const addTypingEffect = () => {
        const bioElement = document.querySelector('.about-text p');
        if (!bioElement || !data.bio) return;

        const originalText = data.bio;
        bioElement.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < originalText.length) {
                bioElement.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 30);
            }
        };
        
        // Démarrer l'effet après un petit délai
        setTimeout(typeWriter, 500);
    };

    // Fonction pour ajouter des effets sur la timeline
    const enhanceTimeline = () => {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        timelineItems.forEach((item, index) => {
            // Ajouter un délai d'animation basé sur l'index
            item.style.setProperty('--animation-delay', `${index * 0.2}s`);
            
            // Ajouter un effet de survol avec des détails
            const content = item.querySelector('.timeline-content');
            if (content) {
                content.addEventListener('mouseenter', () => {
                    content.style.transform = 'translateY(-8px) scale(1.02)';
                });
                
                content.addEventListener('mouseleave', () => {
                    content.style.transform = 'translateY(0) scale(1)';
                });
            }
        });
    };

    // Fonction pour initialiser tous les effets
    const initializeEffects = () => {
        // Attendre que le DOM soit prêt
        setTimeout(() => {
            observeElements();
            addParticleEffect();
            addTypingEffect();
            enhanceTimeline();
            enhanceSkillTags();
            
            // Animer les statistiques quand elles deviennent visibles
            const statsObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateNumbers();
                        statsObserver.unobserve(entry.target);
                    }
                });
            });
            
            const statsSection = document.querySelector('.stats-section');
            if (statsSection) {
                statsObserver.observe(statsSection);
            }
            
            // Ajouter des classes CSS pour les animations
            const style = document.createElement('style');
            style.textContent = `
                .slide-up, .fade-in, .timeline-item, .value-card, .skill-category {
                    opacity: 0;
                    transform: translateY(30px);
                    transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }
                
                .animate-in {
                    opacity: 1 !important;
                    transform: translateY(0) !important;
                }
                
                .timeline-item {
                    animation-delay: var(--animation-delay, 0s);
                }
                
                .value-card, .skill-category {
                    position: relative;
                    overflow: hidden;
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
                
                .about-photo {
                    animation: pulse 2s ease-in-out infinite;
                }
                
                .about-photo:hover {
                    animation: none;
                }
                
                .stat-number {
                    transition: all 0.3s ease;
                }
            `;
            document.head.appendChild(style);
        }, 100);
    };

    return `
        <section id="about" class="section section-dark">
            <div class="container">
                <div class="section-header text-center fade-in">
                    <h2>${data.title || 'À Propos'}</h2>
                    <p>${data.description || 'Découvrez mon parcours et mes valeurs'}</p>
                </div>
                
                <div class="about-content">
                    <div class="about-intro grid grid-2">
                        <div class="about-text slide-up">
                            <p>${data.bio || 'Passionné par le développement et l\'innovation, je créé des solutions digitales qui font la différence.'}</p>
                        </div>
                        <div class="about-image slide-up">
                            <div class="about-photo">
                                ${getInitials(data.name || data.title || 'Dev')}
                            </div>
                        </div>
                    </div>
                    
                    ${data.timeline && data.timeline.length > 0 ? `
                    <div class="timeline">
                        <h3 class="text-center fade-in">Mon Parcours</h3>
                        <div class="timeline-items">
                            ${data.timeline.map((item, index) => `
                                <div class="timeline-item slide-up" style="--animation-delay: ${index * 0.2}s">
                                    <div class="timeline-content">
                                        <h4>${item.title}</h4>
                                        <p>${item.description}</p>
                                    </div>
                                    <div class="timeline-year">${item.year}</div>
                                    <div class="timeline-content" style="visibility: hidden;"></div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}
                    
                    ${data.values && data.values.length > 0 ? `
                    <div class="values">
                        <h3 class="text-center fade-in">Mes Valeurs</h3>
                        <div class="values-grid grid grid-4">
                            ${data.values.map((value, index) => `
                                <div class="value-card slide-up" style="--animation-delay: ${index * 0.1}s">
                                    <h4>${value.title}</h4>
                                    <p>${value.description}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}
                    
                    ${data.skills && data.skills.length > 0 ? `
                    <div class="skills-section">
                        <h3 class="text-center fade-in">Mes Compétences</h3>
                        <div class="skills-grid">
                            ${data.skills.map((skillGroup, index) => {
                                const icons = {
                                    'WordPress & CMS': '🎨',
                                    'Front-end': '💻', 
                                    'Automatisation / IA': '🤖',
                                    'Sécurité & DevOps': '🔒',
                                    'Backend': '⚙️',
                                    'Mobile': '📱',
                                    'Design': '🎭',
                                    'Database': '🗄️'
                                };
                                const icon = icons[skillGroup.category] || '⚡';
                                
                                return `
                                <div class="skill-category slide-up" style="--animation-delay: ${index * 0.1}s">
                                    <h4>${icon} ${skillGroup.category}</h4>
                                    <div class="skills-list">
                                        ${skillGroup.items.map(skill => `
                                            <span class="skill-tag">${skill}</span>
                                        `).join('')}
                                    </div>
                                </div>`;
                            }).join('')}
                        </div>
                    </div>
                    ` : ''}
                    
                </div>
            </div>
            <script>
                (${initializeEffects.toString()})();
            </script>
        </section>
    `;
}