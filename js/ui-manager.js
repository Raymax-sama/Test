export class UIManager {
    constructor() {
        // No specific constructor logic needed for now
    }

    handleProjectFilter(filter) {
        const projects = document.querySelectorAll('.project-card');
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        // Mettre à jour le bouton actif
        filterButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        
        // Filtrer les projets avec animation
        projects.forEach(project => {
            const categories = project.dataset.categories?.split(',').map(c => c.trim()) || [];
            const shouldShow = filter === 'all' || categories.includes(filter);
            
            if (shouldShow) {
                project.style.display = 'block';
                project.classList.add('fade-in');
                project.classList.remove('fade-out');
            } else {
                project.classList.add('fade-out');
                project.classList.remove('fade-in');
                setTimeout(() => {
                    if (project.classList.contains('fade-out')) {
                        project.style.display = 'none';
                    }
                }, 300);
            }
        });
    }

    updateActiveNavigation(activeSectionId) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${activeSectionId}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    randomizeTemplateColors(templateCard) {
        if (!templateCard) return;

        const colors = [
            '#ff4081', '#00e676', '#ffab00', '#3498db', 
            '#e74c3c', '#9b59b6', '#1abc9c', '#f39c12'
        ];
        
        const colorDots = templateCard.querySelectorAll('.color-dot');
        colorDots.forEach(dot => {
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            dot.style.backgroundColor = randomColor;
        });
        
        // Animer l'aperçu du template
        const preview = templateCard.querySelector('.lab-template-preview');
        if (preview) {
            const color1 = colors[Math.floor(Math.random() * colors.length)];
            const color2 = colors[Math.floor(Math.random() * colors.length)];
            const randomGradient = `linear-gradient(135deg, ${color1}, ${color2})`;
            preview.style.background = randomGradient;
        }
    }
}