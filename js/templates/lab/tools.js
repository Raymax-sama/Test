export default function labToolsTemplate(data) {
    return `
        <section id="lab-tools" class="lab-section">
            <div class="container">
                <h2 class="lab-section-title">${data.title}</h2>
                
                <div class="lab-grid">
                    ${data.items.map((tool, index) => `
                        <div class="lab-card slide-up" style="animation-delay: ${index * 0.2}s">
                            <div class="lab-card-icon">
                                <i class="${tool.icon}"></i>
                            </div>
                            <h3 class="lab-card-title">${tool.title}</h3>
                            <p class="lab-card-description">${tool.description}</p>
                            <div class="tool-specs">
                                ${tool.specs.map(spec => `
                                    <div class="spec-item">${spec}</div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
    `;
}