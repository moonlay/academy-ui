export class App {
  configureRouter(config, router) {
    config.title = 'Aurelia';
    config.map([
      { route: ['', 'welcome'], name: 'welcome', moduleId: './welcome', nav: true, title: 'Welcome' },
      { route: 'login', name: 'sign-in', moduleId: './modules/login/index', nav: true, title: 'Sign-In' },
      { route: 'assignments', name: 'assignments', moduleId: './modules/assignment/index', nav: true, title: 'Assignment' },
      { route: 'user', name: 'user', moduleId: './modules/user/index', nav: true, title: 'User' },
      { route: 'timerecord', name: 'timerecord', moduleId: './modules/timerecord/index', nav: true, title: 'Time Record' },
      { route: 'about', name: 'about', moduleId: './modules/about/index', nav: true, title: 'About' },
      { route: 'project', name: 'project', moduleId: './modules/project/index', nav: true, title: 'project' },
      { route: 'developer', name: 'developer', moduleId: './modules/developer/index', nav: true, title: 'Developer' },      
      { route: 'task', name: 'task', moduleId: './modules/task/index', nav: true, title: 'Task' }

    ]);


    this.router = router;
  }
}
