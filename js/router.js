export class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
    }

    addRoute(path, handler) {
        this.routes.set(path, handler);
    }

    navigate(path, params = {}) {
        const hash = `#${path}`;
        if (window.location.hash !== hash) {
            window.location.hash = hash;
        }
    }

    handleRoute() {

        const hash = window.location.hash.slice(1) || 'home';
        const [path, ...params] = hash.split('/');
        
        // Check for parameterized routes
        const route = this.findMatchingRoute(path, params);
        
        if (route) {
            this.currentRoute = hash;
            route.handler(...route.params);
        } else {
            console.warn(`Route not found: ${hash}`);
            // Fallback to home
            this.navigate('home');
        }
    }

    findMatchingRoute(path, params) {
        // First try exact match
        if (this.routes.has(path)) {
            return { handler: this.routes.get(path), params: [] };
        }

        // Then try parameterized routes
        for (const [routePath, handler] of this.routes.entries()) {
            if (routePath.includes(':')) {
                const routeParts = routePath.split('/');
                const pathParts = [path, ...params];

                if (routeParts.length === pathParts.length) {
                    const routeParams = [];
                    let matches = true;

                    for (let i = 0; i < routeParts.length; i++) {
                        if (routeParts[i].startsWith(':')) {
                            routeParams.push(pathParts[i]);
                        } else if (routeParts[i] !== pathParts[i]) {
                            matches = false;
                            break;
                        }
                    }

                    if (matches) {
                        return { handler, params: routeParams };
                    }
                }
            }
        }

        return null;
    }

    getCurrentRoute() {
        return this.currentRoute;
    }
}