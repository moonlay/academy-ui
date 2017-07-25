export class Index {
    configureRouter(config, router){
        this.router = router;

        config.map([
            { route: '/', name: 'list', moduleId: './list', nav: true, title: 'Dashboard List' },
            { route: '/view/:id', name: 'view', moduleId: './view', title: 'View Project' },
        ])
        
    }

}