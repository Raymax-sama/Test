export default function testimonialsTemplate(data) {
    return `
        <section id="testimonials" class="section section-dark">
            <div class="container">
                <div class="section-header text-center fade-in">
                    <h2>${data.title}</h2>
                    <p>${data.description}</p>
                </div>
                
                <div class="testimonials-carousel">
                    <div class="testimonials-track">
                        ${data.items.map((testimonial, index) => `
                            <div class="testimonial-card slide-up" style="animation-delay: ${index * 0.2}s">
                                <div class="testimonial-content">
                                    <div class="testimonial-rating">
                                        ${Array.from({length: testimonial.rating}, () => '★').join('')}
                                    </div>
                                    <blockquote class="testimonial-quote">
                                        "${testimonial.content}"
                                    </blockquote>
                                </div>
                                <div class="testimonial-author">
                                    <img 
                                        src="${testimonial.photo}" 
                                        alt="${testimonial.name}"
                                        class="author-photo"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </section>
    `;
}