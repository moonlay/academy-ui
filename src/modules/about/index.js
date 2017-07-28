export class Index {
    configureRouter(config, router){
        config.map([
            { route: '/', name: 'list', moduleId: './list', nav: true, title: 'Dashboard List' },
            { route: '/project-chart', name: 'project-chart', moduleId: './project-chart', nav: true, title: 'Project Chart' },
            { route: '/view/:id', name: 'view', moduleId: './view', nav: false, title: 'View Project' }
        ])
        this.router = router;
    }

}