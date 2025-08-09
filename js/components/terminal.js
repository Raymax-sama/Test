export class Terminal {
    constructor() {
        this.eventListeners = new Map();
        this.isOpen = false;
        this.commands = {
            'raymaxsama': () => this.activateLabMode(),
            'help': () => this.showHelp(),
            'clear': () => this.clearOutput(),
            'pro': () => this.activateProMode(),
            'status': () => this.showStatus()
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        const trigger = document.getElementById('terminal-trigger');
        const closeBtn = document.getElementById('close-terminal');
        const input = document.getElementById('terminal-input');

        if (trigger) {
            trigger.addEventListener('click', () => this.toggle());
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        if (input) {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.processCommand(input.value.trim());
                    input.value = '';
                }
            });
        }

        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        const terminal = document.getElementById('mini-terminal');
        const input = document.getElementById('terminal-input');
        
        if (terminal) {
            terminal.classList.remove('hidden');
            this.isOpen = true;
            
            // Focus input after animation
            setTimeout(() => {
                if (input) input.focus();
            }, 100);
        }
    }

    close() {
        const terminal = document.getElementById('mini-terminal');
        
        if (terminal) {
            terminal.classList.add('hidden');
            this.isOpen = false;
        }
    }

    processCommand(command) {
        const output = document.getElementById('terminal-output');
        
        // Add command to output
        this.addToOutput(`$ ${command}`);
        
        // Process command
        const cmd = command.toLowerCase();
        if (this.commands[cmd]) {
            this.commands[cmd]();
        } else {
            this.addToOutput(`Commande inconnue: ${command}`);
            this.addToOutput(`Tapez 'help' pour voir les commandes disponibles.`);
        }
    }

    addToOutput(text) {
        const output = document.getElementById('terminal-output');
        if (output) {
            output.textContent += text + '\n';
            output.scrollTop = output.scrollHeight;
        }
    }

    clearOutput() {
        const output = document.getElementById('terminal-output');
        if (output) {
            output.textContent = '';
        }
    }

    activateLabMode() {
        this.addToOutput('🚀 Activation du mode LAB...');
        this.addToOutput('Bienvenue dans mon laboratoire secret !');
        
        setTimeout(() => {
            this.emit('modeChange', 'lab');
            this.close();
        }, 1000);
    }

    activateProMode() {
        this.addToOutput('💼 Retour au mode professionnel...');
        
        setTimeout(() => {
            this.emit('modeChange', 'pro');
            this.close();
        }, 1000);
    }

    showHelp() {
        const help = [
            'Commandes disponibles:',
            '  raymaxsama - Accéder au mode LAB',
            '  pro       - Retour au mode professionnel',
            '  help      - Afficher cette aide',
            '  clear     - Effacer l\'écran',
            '  status    - Afficher le statut actuel'
        ];
        
        help.forEach(line => this.addToOutput(line));
    }

    showStatus() {
        const mode = document.body.classList.contains('mode-lab') ? 'LAB' : 'PRO';
        this.addToOutput(`Mode actuel: ${mode}`);
        this.addToOutput(`Terminal version: 1.0.0`);
        this.addToOutput(`Statut: Opérationnel ✓`);
    }

    // Event system
    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }

    emit(event, data) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => {
                callback(data);
            });
        }
    }
}