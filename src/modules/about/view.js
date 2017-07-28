export class View 
{
    configureRouter(config, router) {
    config.map([
      { route: '/', name: 'view', nav: false, viewPorts: { backlogs: 
        { moduleId: "./partials/backlogs" }, 
        iterations: { moduleId: "./partials/iterations" }, 
        tasks: { moduleId: "./partials/tasks" }
      } }
    ]);
    this.router = router;
  }

}