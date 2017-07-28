







export class index {

  configureRouter(config, router) {
    config.map([ 
      { route: '/',             name: 'list',         moduleId: './list',         nav: true,        title: 'Task Log List' },
      { route: '/view/:id',     name: 'view',         moduleId: './view',         nav: false,       title: 'View' } ]);

    this.router = router;
  }
}