export default function labHomeTemplate(data) {
    return `
        <section id="lab-home" class="lab-section lab-hero">
            <div class="container">
                <div class="lab-intro">
                    <div class="lab-greeting terminal-text">${data.greeting}</div>
                    <h1 class="lab-title">${data.title}</h1>
                    <p class="lab-description">${data.description}</p>
                    <pre class="lab-ascii">${data.ascii}</pre>
                    <div class="lab-actions">
                        <a href="#lab-passions" class="lab-btn">Explorer mes passions</a>
                        <a href="#lab-experiments" class="lab-btn lab-btn-secondary">Voir les expériences</a>
                    </div>
                </div>
            </div>
        </section>
    `;
}