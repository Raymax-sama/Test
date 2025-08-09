export default function labGuestbookTemplate(data) {
    return `
        <section id="lab-guestbook" class="lab-section">
            <div class="container">
                <h2 class="lab-section-title">${data.title}</h2>
                <p class="lab-description text-center">${data.description}</p>
                
                <div class="guestbook">
                    <h3 class="guestbook-title">Laisser un message</h3>
                    <form class="guestbook-form" id="guestbook-form">
                        <input 
                            type="text" 
                            name="name" 
                            placeholder="${data.placeholder.name}" 
                            class="guestbook-input"
                            required
                        >
                        <textarea 
                            name="message" 
                            placeholder="${data.placeholder.message}" 
                            class="guestbook-textarea"
                            rows="3"
                            required
                        ></textarea>
                        <button type="submit" class="lab-btn">Envoyer message</button>
                    </form>
                    
                    <div class="guestbook-messages" id="guestbook-messages">
                        <!-- Messages will be loaded here -->
                    </div>
                </div>
            </div>
        </section>
    `;
}