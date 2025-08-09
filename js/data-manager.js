export class DataManager {
    constructor() {
        this.proData = null;
        this.labData = null;
        this.cache = new Map();
    }

    async init() {
        try {
            await Promise.all([
                this.loadProData(),
                this.loadLabData()
            ]);
        } catch (error) {
            console.error('Error initializing data manager:', error);
            throw error;
        }
    }

    async loadProData() {
        if (this.proData) return this.proData;
        
        try {
            const response = await fetch('./data/pro.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.proData = await response.json();
            return this.proData;
        } catch (error) {
            console.error('Error loading pro data:', error);
            // Fallback to default data
            this.proData = this.getDefaultProData();
            return this.proData;
        }
    }

    async loadLabData() {
        if (this.labData) return this.labData;
        
        try {
            const response = await fetch('./data/lab.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.labData = await response.json();
            return this.labData;
        } catch (error) {
            console.error('Error loading lab data:', error);
            // Fallback to default data
            this.labData = this.getDefaultLabData();
            return this.labData;
        }
    }

    async getProData(forceReload = false) {
        if (forceReload) {
            this.proData = null;
        }
        return this.proData || await this.loadProData();
    }

    async getLabData(forceReload = false) {
        if (forceReload) {
            this.labData = null;
        }
        return this.labData || await this.loadLabData();
    }

    // Méthode pour forcer le rechargement de toutes les données
    async reloadAllData() {
        this.proData = null;
        this.labData = null;
        this.cache.clear();
        await this.init();
    }

    getDefaultProData() {
        return {
            home: {
                greeting: "Bonjour, je suis",
                name: "Alex Développeur",
                title: "Développeur Full-Stack & Designer",
                subtitle: "Créateur de solutions digitales innovantes",
                description: "Je conçois et développe des applications web modernes, des sites WordPress sur-mesure et des solutions d'intelligence artificielle pour transformer vos idées en réalité digitale.",
                photo: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
                badges: ["UI/UX Designer", "Développeur", "Expert IA"],
                cta: {
                    primary: "Voir mon portfolio",
                    secondary: "Me contacter"
                }
            },
            stats: {
                title: "Mes réalisations en chiffres",
                items: [
                    { number: "50+", label: "Projets Complétés" },
                    { number: "5+", label: "Années d'Expérience" },
                    { number: "30+", label: "Clients Satisfaits" },
                    { number: "100%", label: "Projets Livrés" }
                ]
            },
            about: {
                title: "Qui suis-je ?",
                description: "Développeur passionné avec plus de 5 ans d'expérience dans la création d'expériences digitales exceptionnelles.",
                photo: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
                bio: "Ma passion pour le développement web a commencé il y a plus de 5 ans. Depuis, j'ai eu la chance de travailler sur des projets variés, des sites vitrines aux applications web complexes, en passant par des solutions d'intelligence artificielle.",
                timeline: [
                    { year: "2019", title: "Début en développement web", description: "Premiers pas avec HTML, CSS et JavaScript" },
                    { year: "2020", title: "Spécialisation WordPress", description: "Développement de thèmes et plugins sur-mesure" },
                    { year: "2022", title: "Expert React/Node.js", description: "Développement d'applications full-stack modernes" },
                    { year: "2024", title: "Intelligence Artificielle", description: "Intégration d'IA dans les projets web" }
                ],
                values: [
                    { title: "Qualité", description: "Code propre et maintenable" },
                    { title: "Performance", description: "Sites rapides et optimisés" },
                    { title: "Innovation", description: "Technologies de pointe" },
                    { title: "Collaboration", description: "Travail d'équipe efficace" }
                ]
            },
            services: {
                title: "Mes Services",
                description: "Des solutions complètes pour tous vos besoins digitaux",
                items: [
                    {
                        icon: "fab fa-wordpress",
                        title: "Développement WordPress",
                        description: "Sites WordPress sur-mesure, thèmes personnalisés et plugins spécialisés pour votre activité.",
                        features: [
                            "Thèmes sur-mesure",
                            "Plugins personnalisés",
                            "Optimisation SEO",
                            "Maintenance et support"
                        ]
                    },
                    {
                        icon: "fas fa-robot",
                        title: "Intelligence Artificielle",
                        description: "Intégration d'IA dans vos projets : chatbots, analyse de données, automatisation.",
                        features: [
                            "Chatbots intelligents",
                            "Analyse prédictive",
                            "Automatisation",
                            "API d'IA personnalisées"
                        ]
                    },
                    {
                        icon: "fas fa-shield-alt",
                        title: "Sécurité Web",
                        description: "Sécurisation complète de vos applications avec les meilleures pratiques du secteur.",
                        features: [
                            "Audit de sécurité",
                            "Chiffrement des données",
                            "Protection contre les attaques",
                            "Monitoring continu"
                        ]
                    }
                ]
            },
            projects: {
                title: "Mes Projets",
                description: "Découvrez une sélection de mes réalisations récentes",
                categories: ["Tous", "Web", "Mobile", "IA", "WordPress"],
                items: [
                    {
                        id: "ecommerce-modern",
                        title: "E-commerce Moderne",
                        category: "Web",
                        categories: ["web"],
                        description: "Plateforme e-commerce complète avec paiement sécurisé et gestion avancée des stocks.",
                        image: "https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=400",
                        tags: ["React", "Node.js", "MongoDB", "Stripe"],
                        demoUrl: "#",
                        githubUrl: "#",
                        featured: true
                    },
                    {
                        id: "ai-chatbot",
                        title: "Chatbot IA Avancé",
                        category: "IA",
                        categories: ["ia"],
                        description: "Assistant virtuel intelligent pour le service client avec compréhension du langage naturel.",
                        image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400",
                        tags: ["Python", "TensorFlow", "NLP", "API"],
                        demoUrl: "#",
                        githubUrl: "#",
                        featured: true
                    },
                    {
                        id: "portfolio-wordpress",
                        title: "Portfolio WordPress",
                        category: "WordPress",
                        categories: ["wordpress"],
                        description: "Site portfolio avec thème personnalisé et interface d'administration intuitive.",
                        image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400",
                        tags: ["WordPress", "PHP", "MySQL", "CSS3"],
                        demoUrl: "#",
                        githubUrl: "#",
                        featured: false
                    }
                ]
            },
            templates: {
                title: "Templates & Découvertes",
                description: "Collections de templates UI/UX et prototypes créatifs",
                items: [
                    {
                        id: "dashboard-admin",
                        title: "Dashboard Admin",
                        type: "Interface Admin",
                        description: "Interface d'administration moderne avec dark mode",
                        preview: "https://images.pexels.com/photos/669996/pexels-photo-669996.jpeg?auto=compress&cs=tinysrgb&w=400",
                        colors: ["#3498db", "#2c3e50", "#e74c3c"],
                        technologies: ["React", "Chart.js", "CSS Grid"]
                    },
                    {
                        id: "landing-saas",
                        title: "Landing SaaS",
                        type: "Page d'atterrissage",
                        description: "Template moderne pour applications SaaS",
                        preview: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400",
                        technologies: ["HTML5", "CSS3", "JavaScript"]
                    }
                ]
            },
            testimonials: {
                title: "Témoignages Clients",
                description: "Ce que mes clients pensent de mon travail",
                items: [
                    {
                        name: "Marie Dupont",
                        role: "Directrice Marketing",
                        company: "TechCorp",
                        content: "Alex a transformé notre vision en une réalité digitale exceptionnelle. Son expertise technique et sa créativité ont dépassé toutes nos attentes.",
                        rating: 5,
                        photo: "https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=150"
                    },
                    {
                        name: "Jean Martin",
                        role: "CEO",
                        company: "StartupInnovante",
                        content: "Travail de qualité exceptionnelle et respect des délais. Je recommande vivement Alex pour tout projet web.",
                        rating: 5,
                        photo: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=150"
                    }
                ]
            },
            blog: {
                title: "Blog & Actualités",
                description: "Mes réflexions sur le développement web et les nouvelles technologies",
                articles: [
                    {
                        id: "future-ai-web",
                        title: "L'avenir de l'IA dans le développement web",
                        excerpt: "Comment l'intelligence artificielle transforme notre façon de créer des sites web...",
                        date: "2025-01-15",
                        readTime: "5 min",
                        category: "IA",
                        image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400",
                        author: "Alex"
                    },
                    {
                        id: "wordpress-security",
                        title: "Sécuriser son site WordPress en 2025",
                        excerpt: "Les meilleures pratiques pour protéger votre site WordPress contre les menaces...",
                        date: "2025-01-10",
                        readTime: "7 min",
                        category: "Sécurité",
                        image: "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=400",
                        author: "Alex"
                    }
                ]
            },
            contact: {
                title: "Contactez-moi",
                description: "Prêt à donner vie à votre projet ? Discutons-en !",
                info: {
                    email: "alex@portfolio.dev",
                    phone: "+33 1 23 45 67 89",
                    location: "Paris, France",
                    availability: "Disponible pour nouveaux projets"
                },
                social: [
                    { platform: "LinkedIn", url: "https://linkedin.com", icon: "fab fa-linkedin" },
                    { platform: "GitHub", url: "https://github.com", icon: "fab fa-github" },
                    { platform: "Twitter", url: "https://twitter.com", icon: "fab fa-twitter" },
                    { platform: "Dribbble", url: "https://dribbble.com", icon: "fab fa-dribbble" }
                ]
            }
        };
    }

    getDefaultLabData() {
        return {
            home: {
                greeting: "BIENVENUE DANS MON LABO SECRET",
                title: "Mode_Lab.exe",
                description: "Ici, je partage mes expérimentations, mes passions geek et mes découvertes créatives. Un espace où code et créativité se rencontrent.",
                ascii: `
    ░██╗░░░░░░░██╗███████╗██╗░░░░░░█████╗░░█████╗░███╗░░░███╗███████╗
    ░██║░░██╗░░██║██╔════╝██║░░░░░██╔══██╗██╔══██╗████╗░████║██╔════╝
    ░╚██╗████╗██╔╝█████╗░░██║░░░░░██║░░╚═╝██║░░██║██╔████╔██║█████╗░░
    ░░████╔═████║░██╔══╝░░██║░░░░░██║░░██╗██║░░██║██║╚██╔╝██║██╔══╝░░
    ░░╚██╔╝░╚██╔╝░███████╗███████╗╚█████╔╝╚█████╔╝██║░╚═╝░██║███████╗
    ░░░╚═╝░░░╚═╝░░╚══════╝╚══════╝░╚════╝░░╚════╝░╚═╝░░░░░╚═╝╚══════╝
                `
            },
            passions: {
                title: "MES PASSIONS",
                items: [
                    {
                        title: "Jeux Rétro",
                        description: "Collectionneur de consoles vintage et créateur de jeux en pixel art",
                        icon: "fas fa-gamepad",
                        details: ["Nintendo NES", "Sega Mega Drive", "Game Boy", "Pixel Art"]
                    },
                    {
                        title: "Intelligence Artificielle",
                        description: "Exploration des limites de l'IA et développement d'algorithmes créatifs",
                        icon: "fas fa-brain",
                        details: ["Machine Learning", "Neural Networks", "Computer Vision", "NLP"]
                    },
                    {
                        title: "Hardware Hacking",
                        description: "Modification et customisation de matériel électronique",
                        icon: "fas fa-microchip",
                        details: ["Arduino", "Raspberry Pi", "Circuit Bending", "IoT"]
                    }
                ]
            },
            tools: {
                title: "MES OUTILS DE LAB",
                items: [
                    {
                        title: "Raspberry Pi 4",
                        description: "Serveur personnel et projets IoT",
                        icon: "fas fa-server",
                        specs: ["8GB RAM", "64GB SD", "Ubuntu Server", "Docker"]
                    },
                    {
                        title: "Unreal Engine 5",
                        description: "Création de mondes virtuels et prototypage 3D",
                        icon: "fas fa-cube",
                        specs: ["Blueprint", "C++", "Nanite", "Lumen"]
                    },
                    {
                        title: "ESP32 Dev Kit",
                        description: "Prototypage rapide et projets connectés",
                        icon: "fas fa-wifi",
                        specs: ["WiFi/Bluetooth", "240MHz", "520KB SRAM", "Arduino IDE"]
                    }
                ]
            },
            experiments: {
                title: "EXPÉRIMENTATIONS",
                items: [
                    {
                        id: "neural-art",
                        title: "Générateur d'Art Neural",
                        date: "2024-12-15",
                        description: "IA générative pour créer des œuvres d'art uniques à partir de prompts textuels",
                        technologies: ["Python", "TensorFlow", "DALL-E API"],
                        status: "En cours",
                        link: "#"
                    },
                    {
                        id: "retro-game",
                        title: "Jeu Rétro en WebGL",
                        date: "2024-11-20",
                        description: "Recréation d'un classique arcade avec des mécaniques modernes",
                        technologies: ["JavaScript", "WebGL", "Web Audio API"],
                        status: "Terminé",
                        link: "#"
                    },
                    {
                        id: "smart-mirror",
                        title: "Miroir Connecté DIY",
                        date: "2024-10-05",
                        description: "Affichage d'informations personnalisées sur miroir avec Raspberry Pi",
                        technologies: ["Python", "Raspberry Pi", "Electron"],
                        status: "Prototype",
                        link: "#"
                    }
                ]
            },
            templates: {
                title: "TEMPLATES LAB",
                description: "Mes créations UI/UX expérimentales avec variations aléatoires",
                items: [
                    {
                        id: "neon-dashboard",
                        title: "Neon Dashboard",
                        type: "Interface Cyberpunk",
                        description: "Dashboard futuriste avec effets néon et animations cyberpunk",
                        colors: ["#ff4081", "#00e676", "#ffab00"],
                        technologies: ["CSS Grid", "SVG Animations", "WebGL"]
                    },
                    {
                        id: "retro-terminal",
                        title: "Retro Terminal UI",
                        type: "Interface Vintage",
                        description: "Interface terminal style années 80 avec effets CRT",
                        colors: ["#00ff00", "#ffff00", "#ff00ff"],
                        technologies: ["CSS Filters", "Monospace", "Animations"]
                    },
                    {
                        id: "glitch-portfolio",
                        title: "Glitch Portfolio",
                        type: "Portfolio Artistique",
                        description: "Portfolio avec effets glitch et esthétique digitale",
                        colors: ["#ff0080", "#0080ff", "#80ff00"],
                        technologies: ["CSS Transforms", "JavaScript", "Canvas"]
                    }
                ]
            },
            guestbook: {
                title: "LIVRE D'OR",
                description: "Laissez un message dans mon labo !",
                placeholder: {
                    name: "Votre nom de code...",
                    message: "Votre message crypté..."
                }
            }
        };
    }

    // Cache management
    setCacheItem(key, data, ttl = 3600000) { // 1 hour default
        const item = {
            data,
            timestamp: Date.now(),
            ttl
        };
        this.cache.set(key, item);
    }

    getCacheItem(key) {
        const item = this.cache.get(key);
        if (!item) return null;
        
        if (Date.now() - item.timestamp > item.ttl) {
            this.cache.delete(key);
            return null;
        }
        
        return item.data;
    }

    clearCache() {
        this.cache.clear();
    }
}