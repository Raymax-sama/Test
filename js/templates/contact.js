export default function contactTemplate(data) {
    return `
        <section id="contact" class="section contact-section">
            <div class="container">
                <div class="section-header text-center fade-in">
                    <h2>${data.title}</h2>
                    <p class="section-subtitle">${data.description}</p>
                </div>
                
                <div class="contact-wrapper">
                    <div class="contact-grid">
                        <!-- Informations de contact -->
                        <div class="contact-info-panel slide-up">
                            <div class="contact-info-header">
                                <h3>Restons en contact</h3>
                                <p>Discutons de votre projet ensemble</p>
                            </div>
                            
                            <div class="contact-details">
                                <div class="contact-item">
                                    <div class="contact-icon">
                                        <i class="fas fa-envelope"></i>
                                    </div>
                                    <div class="contact-content">
                                        <strong>Email</strong>
                                        <p>${data.info.email}</p>
                                    </div>
                                </div>
                                
                                <div class="contact-item">
                                    <div class="contact-icon">
                                        <i class="fas fa-phone"></i>
                                    </div>
                                    <div class="contact-content">
                                        <strong>Téléphone</strong>
                                        <p>${data.info.phone}</p>
                                    </div>
                                </div>
                                
                                <div class="contact-item">
                                    <div class="contact-icon">
                                        <i class="fas fa-map-marker-alt"></i>
                                    </div>
                                    <div class="contact-content">
                                        <strong>Localisation</strong>
                                        <p>${data.info.location}</p>
                                    </div>
                                </div>                   
                            </div>
                            
                            <div class="social-section">
                                <h4>Suivez-moi</h4>
                                <div class="social-links">
                                    ${data.social.map(social => `
                                        <a href="${social.url}" target="_blank" rel="noopener" 
                                           class="social-link" aria-label="${social.platform}">
                                            <i class="${social.icon}"></i>
                                            <span>${social.platform}</span>
                                        </a>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                        
                        <!-- Formulaire de contact -->
                        <div class="contact-form-panel slide-up">
                            <div class="form-header">
                                <h3>Envoyez-moi un message</h3>
                                <p>Je vous répondrai dans les plus brefs délais</p>
                            </div>
                            
                            <form class="contact-form" id="contact-form">
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="name">Nom complet</label>
                                        <input type="text" id="name" name="name" required 
                                               placeholder="Votre nom complet">
                                        <span class="form-highlight"></span>
                                    </div>
                                    <div class="form-group">
                                        <label for="email">Adresse email</label>
                                        <input type="email" id="email" name="email" required 
                                               placeholder="votre.email@exemple.com">
                                        <span class="form-highlight"></span>
                                    </div>
                                </div>
                                
                                <div class="form-group">
                                    <label for="subject">Sujet du message</label>
                                    <select id="subject" name="subject" required>
                                        <option value="">Sélectionnez un sujet</option>
                                        <option value="projet-web">Projet de développement web</option>
                                        <option value="consultation">Consultation technique</option>
                                        <option value="collaboration">Proposition de collaboration</option>
                                        <option value="support">Support technique</option>
                                        <option value="autre">Autre demande</option>
                                    </select>
                                    <span class="form-highlight"></span>
                                </div>
                                
                                <div class="form-group">
                                    <label for="message">Votre message</label>
                                    <textarea id="message" name="message" rows="5" required 
                                              placeholder="Décrivez votre projet ou votre demande en détail..."></textarea>
                                    <span class="form-highlight"></span>
                                </div>
                                
                                <div class="form-actions">
                                    <button type="submit" class="btn btn-primary btn-lg btn-submit">
                                        <span class="btn-text">Envoyer le message</span>
                                        <span class="btn-loading" style="display: none;">
                                            <i class="fas fa-spinner fa-spin"></i> Envoi en cours...
                                        </span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Décoration de fond -->
            <div class="contact-decoration">
                <div class="contact-circle contact-circle-1"></div>
                <div class="contact-circle contact-circle-2"></div>
                <div class="contact-circle contact-circle-3"></div>
            </div>
        </section>
    `;
}