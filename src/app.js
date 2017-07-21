




export class App {
  
  
  
  configureRouter(config, router) {
   
   
   
    config.title = 'Aurelia';
    config.map([
      { route: ['', 'welcome'], name: 'welcome',      moduleId: './welcome',      nav: true, title: 'Welcome' },
      { route: 'login',  name: 'sign-in', moduleId: './modules/login/index', nav: true, title: 'Sign-In' },
      // { route: 'developer',  name: 'developer', moduleId: './modules/developer/index', nav: true, title: 'Developer' },
      { route: 'timerecord',  name: 'timerecord', moduleId: './modules/timerecord/index', nav: true, title: 'Time Record' },
      { route: 'assignment',  name: 'assignment', moduleId: './modules/assignment/index', nav: true, title: 'Assignments' },
      { route: 'task',  name: 'task', moduleId: './modules/task/index', nav: true, title: 'Task' },
      { route: 'cantik',  name: 'cantik', moduleId: './modules/cantik/index', nav: true, title: 'cantik' }
  
    ]);
  

    this.router = router;
  }
}
