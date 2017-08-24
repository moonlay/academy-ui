export class index {

  configureRouter(config, router) {
    config.map([ 
      { route: '/',             name: 'list',         moduleId: './list',         nav: true,        title: 'Project List' },
      { route: '/create',       name: 'create',       moduleId: './create',       nav: true,        title: 'Create Project' },
      { route: '/view/:id',     name: 'view',         moduleId: './view',         nav: false,       title: 'View Project' },
      { route: '/edit/:id',     name: 'edit',         moduleId: './edit',         nav: false,       title: 'Edit Project' },

    
    ]);

    this.router = router;
  }
}
