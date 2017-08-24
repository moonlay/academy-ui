export class Index {

    configureRouter(config, router) {
        this.login;
        this.login = localStorage.userId
        if (this.login == null) {
            config.map([
                { route: ['', 'authentication'], moduleId: './authentication', name: 'authentication', nav: true, title: 'authentication' },

            ]);
        }
        else {
            config.map([
                { route: ['', 'list'], moduleId: './list', name: 'list', nav: true, title: 'List' },
                { route: 'view/:id', moduleId: './view', name: 'view', nav: false, title: 'View:Assignments' },
                { route: 'create', moduleId: './create', name: 'create', nav: false, title: 'Create:Assignments' },
            
            ]);

        }
        this.router = router;
    }

}
