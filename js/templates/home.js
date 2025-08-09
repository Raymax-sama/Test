export default function homeTemplate(data) {
    return `
        <section id="home" class="section hero section-light">
            <div class="container">
                <div class="hero-content">
                    <div class="hero-text">
                        <div class="hero-greeting fade-in">${data.home.greeting}</div>
                        <h1 class="hero-title fade-in">${data.home.name}</h1>
                        <h2 class="hero-subtitle fade-in">${data.home.title}</h2>
                        <p class="hero-description fade-in">${data.home.description}</p>
                        <div class="hero-actions fade-in">
                            <a href="#projects" class="btn btn-primary btn-lg">${data.home.cta.primary}</a>
                            <a href="#contact" class="btn btn-secondary btn-lg">${data.home.cta.secondary}</a>
                        </div>
                    </div>
                    <div class="hero-image">
                        <img 
                            src="${data.home.photo}" 
                            alt="${data.home.name}" 
                            class="hero-photo"
                            loading="lazy"
                        />
                        <div class="hero-badges">
                            ${data.home.badges.map((badge, index) => `
                                <div class="badge" style="animation-delay: ${index * 0.5}s">${badge}</div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section id="stats" class="section stats-section section-dark">
            <div class="container">
                <h2 class="section-title text-center">${data.stats.title}</h2>
                <div class="stats-grid">
                    ${data.stats.items.map(item => `
                        <div class="stat-item">
                            <div class="stat-number">${item.number}</div>
                            <div class="stat-label">${item.label}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
    `;
}