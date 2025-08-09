export default function loadArticleDetail(article) {
    return `
        <section id="article-detail" class="section section-light">
            <div class="container">
                <div class="section-header text-center fade-in">
                    <h2>${article.title}</h2>
                    <p class="article-meta">
                        <span class="blog-date">${new Date(article.date).toLocaleDateString('fr-FR')}</span>
                        <span class="blog-read-time">${article.readTime}</span>
                        <span class="blog-author">Par ${article.author}</span>
                    </p>
                </div>
                
                <div class="article-content">
                    <div class="article-image fade-in">
                        <img src="${article.image}" alt="${article.title}" loading="lazy" />
                    </div>
                    <div class="article-body">
                        ${article.fullContent || article.excerpt}
                    </div>
                    <a href="#/blog" class="btn btn-primary mt-4">Retour au blog</a>
                </div>
            </div>
        </section>
    `;
}