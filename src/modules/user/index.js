export class Index {
    configureRouter(config, router) {
        config.map([
            { route: ['', 'list'], moduleId: './list', name: 'list', nav: true, title: 'List' },
            { route: 'view/:id', moduleId: './view', name: 'view', nav: false, title: 'Detail Report' },
            { route: 'report', moduleId: './report/index', name: 'report', nav: false, title: 'Report' },
            { route: 'project/:id', moduleId: './projects/projects', name: 'project', nav: false, title: 'Project' }
        ]);

        this.router = router;
    }
}
