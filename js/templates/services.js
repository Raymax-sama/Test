export default function servicesTemplate(data) {
    // Debug: vérifier si les données de pricing sont présentes
    console.log('Services data:', data);
    console.log('Pricing data:', data.pricing);
    
    return `
        <section id="services" class="section section-light">
            <div class="container">
                <div class="section-header text-center fade-in">
                    <h2>${data.title}</h2>
                    <p>${data.description}</p>
                </div>
                
                <div class="services-grid">
                    ${data.items.map((service, index) => `
                        <div class="service-card slide-up" style="animation-delay: ${index * 0.2}s">
                            <div class="service-icon">
                                <i class="${service.icon}"></i>
                            </div>
                            <h3 class="service-title">${service.title}</h3>
                            <p class="service-description">${service.description}</p>
                            <ul class="service-features">
                                ${service.features.map(feature => `
                                    <li>${feature}</li>
                                `).join('')}
                            </ul>
                        </div>
                    `).join('')}
                </div>
                
                ${data.pricing ? `
                <div class="pricing-section">
                    <div class="section-header text-center fade-in">
                        <h2>${data.pricing.title}</h2>
                        <p>${data.pricing.description}</p>
                    </div>
                    
                    <div class="pricing-grid">
                        ${data.pricing.items.map((plan, index) => `
                            <div class="pricing-card slide-up" style="animation-delay: ${index * 0.2}s">
                                <h3 class="pricing-title">${plan.name}</h3>
                                <div class="pricing-price">${plan.price}</div>
                                <ul class="pricing-features">
                                    ${plan.features.map(feature => `
                                        <li>${feature}</li>
                                    `).join('')}
                                </ul>
                                <a href="#contact" class="btn btn-primary pricing-cta">Me contacter</a>
                            </div>
                        `).join('')}
                    </div>
                    
                    ${data.pricing.note ? `
                    <div class="pricing-note text-center fade-in">
                        ${data.pricing.note}
                    </div>
                    ` : ''}
                </div>
                ` : ''}
            </div>
        </section>
    `;
}