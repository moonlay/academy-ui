export class Index {
    configureRouter(config, router) {
        config.map([
            { route: [''], moduleId: './reports', name: 'reports', nav: true, title: 'User Report' }
        ]);
        this.router = router;
    }
}
