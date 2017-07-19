export class index {

  configureRouter(config, router) {
    config.map([ 
      { route: '/',             name: 'list',         moduleId: './list',         nav: true,        title: 'Project List' },
      { route: '/view/:id',     name: 'view',         moduleId: './view',         nav: false,       title: 'View Project' } ]);

    this.router = router;
  }
}
