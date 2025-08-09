export class GuestbookManager {
    constructor(escapeHTMLCallback) {
        this.guestbookMessages = [];
        this.escapeHTML = escapeHTMLCallback; // Callback to use the App's escapeHTML utility
        this.loadGuestbookMessages();
    }

    loadGuestbookMessages() {
        try {
            this.guestbookMessages = JSON.parse(localStorage.getItem('guestbook') || '[]');
        } catch (error) {
            console.error('Erreur lors du chargement des messages:', error);
            this.guestbookMessages = [];
        }
    }

    addGuestbookMessage(message) {
        this.guestbookMessages.unshift(message);
        // Garder seulement les 50 derniers messages
        this.guestbookMessages = this.guestbookMessages.slice(0, 50);
        localStorage.setItem('guestbook', JSON.stringify(this.guestbookMessages));
    }

    renderGuestbookMessages() {
        const container = document.getElementById('guestbook-messages');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (this.guestbookMessages.length === 0) {
            container.innerHTML = '<p class="no-messages">Aucun message pour le moment.</p>';
            return;
        }

        this.guestbookMessages.forEach(msg => {
            const messageDiv = this.createGuestbookMessageElement(msg);
            container.appendChild(messageDiv);
        });
    }

    createGuestbookMessageElement(msg) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'guestbook-message';

        const headerDiv = document.createElement('div');
        headerDiv.className = 'message-header';

        const authorSpan = document.createElement('span');
        authorSpan.className = 'message-author';
        authorSpan.textContent = this.escapeHTML(msg.name);

        const dateSpan = document.createElement('span');
        dateSpan.className = 'message-date';
        dateSpan.textContent = new Date(msg.timestamp).toLocaleDateString('fr-FR');

        headerDiv.appendChild(authorSpan);
        headerDiv.appendChild(dateSpan);

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = this.escapeHTML(msg.message);

        messageDiv.appendChild(headerDiv);
        messageDiv.appendChild(contentDiv);

        return messageDiv;
    }
}