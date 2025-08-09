export default function blogTemplate(data) {
    return `
        <section id="blog" class="section section-light">
            <div class="container">
                <div class="section-header text-center fade-in">
                    <h2>${data.title}</h2>
                    <p>${data.description}</p>
                </div>
                
                <div class="blog-grid grid grid-2">
                    ${data.articles.map((article, index) => `
                        <article class="blog-card slide-up" style="animation-delay: ${index * 0.1}s">
                            <div class="blog-image">
                                <img 
                                    src="${article.image}" 
                                    alt="${article.title}"
                                    class="article-image"
                                    loading="lazy"
                                />
                                <div class="blog-category">${article.category}</div>
                            </div>
                            <div class="blog-content">
                                <div class="blog-meta">
                                    <span class="blog-date">${new Date(article.date).toLocaleDateString('fr-FR')}</span>
                                    <span class="blog-read-time">${article.readTime}</span>
                                </div>
                                <h3 class="blog-title">
                                    <a href="#article/${article.id}">${article.title}</a>
                                </h3>
                                <p class="blog-excerpt">${article.excerpt}</p>
                                <div class="blog-footer">
                                    <span class="blog-author">Par ${article.author}</span>
                                    <a href="#article/${article.id}" class="read-more">Lire la suite →</a>
                                </div>
                            </div>
                        </article>
                    `).join('')}
                </div>
            </div>
        </section>
    `;
}