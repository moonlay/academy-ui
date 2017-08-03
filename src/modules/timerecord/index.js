







export class index {

  configureRouter(config, router) {
    config.map([ 
      { route: '/',             name: 'list',         moduleId: './list',         nav: true,        title: 'Time Record List' },
      { route: '/view/:id',     name: 'view',         moduleId: './view',         nav: false,       title: 'View' },
  { route: '/edit/:id',     name: 'edit',         moduleId: './edit',         nav: false,       title: 'Edit' } ]);

    this.router = router;
  }
}