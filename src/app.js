import "admin-lte"
import "admin-lte/bootstrap/css/bootstrap.min.css"
import "admin-lte/dist/css/AdminLTE.min.css"
import "admin-lte/dist/css/skins/_all-skins.min.css"
export class App {
  configureRouter(config, router) {
    config.title = 'Aurelia';
    config.map([
      { route: ['', 'welcome'], name: 'welcome',      moduleId: './welcome',      nav: true, title: 'Welcome' },
      { route: 'users',         name: 'users',        moduleId: './users',        nav: true, title: 'Github Users' },
      { route: 'login',  name: 'sign-in', moduleId: './modules/login/index', nav: true, title: 'Sign-In' },
      { route: 'users',  name: 'users', moduleId: './modules/user/index', nav: true, title: 'Users' },
      { route: 'samples',  name: 'samples', moduleId: './modules/sample/index', nav: true, title: 'Samples' },
      { route: 'projects',  name: 'projects', moduleId: './modules/project/index', nav: true, title: 'Project' },
      { route: 'backlogs',  name: 'backlogs', moduleId: './modules/backlog/index', nav: true, title: 'Backlog' },
      { route: 'iterations',  name: 'iterations', moduleId: './modules/iteration/index', nav: true, title: 'Iteration' },
      { route: 'assignments',  name: 'assignments', moduleId: './modules/assignment/index', nav: true, title: 'Assignment' },
      { route: 'tasks',  name: 'tasks', moduleId: './modules/task/index', nav: true, title: 'Task' },
      { route: 'dashboard',  name: 'dashboard', moduleId: './modules/dashboard/index', nav: true, title: 'Dashboard' },
      { route: 'developer', name: 'developer', moduleId: './modules/developer/index', nav: true, title: 'Developer' } 
    ]);

    this.router = router;
  }
}
