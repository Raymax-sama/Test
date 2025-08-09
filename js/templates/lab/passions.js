export default function labPassionsTemplate(data) {
    return `
        <section id="lab-passions" class="lab-section">
            <div class="container">
                <h2 class="lab-section-title">${data.title}</h2>
                
                <div class="lab-grid">
                    ${data.items.map((passion, index) => `
                        <div class="lab-card slide-up" style="animation-delay: ${index * 0.2}s">
                            <div class="lab-card-icon">
                                <i class="${passion.icon}"></i>
                            </div>
                            <h3 class="lab-card-title">${passion.title}</h3>
                            <p class="lab-card-description">${passion.description}</p>
                            <div class="lab-card-tags">
                                ${passion.details.map(detail => `
                                    <span class="lab-tag">${detail}</span>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
    `;
}