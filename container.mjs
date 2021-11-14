export class Container {
    services = {};
    register(name, instanceOrFactory) {
        if (!this.services.hasOwnProperty(name)) {
            this.services[name] = instanceOrFactory;
        }
    }
    resolve(name) {
        if (!this.services.hasOwnProperty(name)) {
            throw `Requested ${name} service is not registered!`;
        }
        // Lazy-loading
        if (typeof this.services[name] === 'function') {
            this.services[name] = this.services[name](this);
        }
        return this.services[name];
    }
}