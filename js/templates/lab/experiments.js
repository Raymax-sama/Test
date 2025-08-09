export default function labExperimentsTemplate(data) {
    return `
        <section id="lab-experiments" class="lab-section">
            <div class="container">
                <h2 class="lab-section-title">${data.title}</h2>
                
                <div class="experiments-timeline">
                    ${data.items.map((experiment, index) => `
                        <div class="experiment-item slide-up" style="animation-delay: ${index * 0.1}s">
                            <div class="experiment-date">${new Date(experiment.date).toLocaleDateString('fr-FR')}</div>
                            <div class="experiment-content">
                                <div class="experiment-status status-${experiment.status.toLowerCase()}">${experiment.status}</div>
                                <h3 class="experiment-title">${experiment.title}</h3>
                                <p class="experiment-description">${experiment.description}</p>
                                <div class="experiment-technologies">
                                    ${experiment.technologies.map(tech => `
                                        <span class="lab-tag">${tech}</span>
                                    `).join('')}
                                </div>
                                ${experiment.link ? `
                                    <a href="${experiment.link}" class="lab-btn lab-btn-sm">Voir le projet</a>
                                ` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
    `;
}