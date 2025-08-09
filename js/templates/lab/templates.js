export default function labTemplatesTemplate(data) {
    return `
        <section id="lab-templates" class="lab-section">
            <div class="container">
                <h2 class="lab-section-title">${data.title}</h2>
                <p class="lab-description text-center">${data.description}</p>
                
                <div class="lab-templates-grid lab-grid">
                    ${data.items.map((template, index) => `
                        <div class="lab-template-card slide-up" style="animation-delay: ${index * 0.1}s">
                            <div class="lab-template-preview" style="background: linear-gradient(135deg, ${template.colors[0]}, ${template.colors[1] || template.colors[0]});">
                            </div>
                            <div class="lab-template-content">
                                <h3 class="lab-template-title">${template.title}</h3>
                                <div class="lab-template-type">${template.type}</div>
                                <p class="template-description">${template.description}</p>
                                <div class="lab-template-colors">
                                    ${template.colors.map(color => `
                                        <div class="color-dot" style="background-color: ${color}"></div>
                                    `).join('')}
                                </div>
                                <div class="template-technologies">
                                    ${template.technologies.map(tech => `
                                        <span class="lab-tag">${tech}</span>
                                    `).join('')}
                                </div>
                                <div class="template-actions">
                                    <a href="#template/${template.id}" class="lab-btn">Voir démo</a>
                                    <button class="lab-btn lab-btn-secondary randomize-colors">Randomize</button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
    `;
}