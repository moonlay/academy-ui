import { bindable,inject } from "aurelia-framework";

import { Router } from 'aurelia-router';
import { RestService } from "../../lib/rest-service";
import createLoopbackFilterObject from "../../lib/loopback-filter-factory";
import moment from "moment";

@inject(Router)
export class ProjectChart {
    projects = [];
    info = {};
    constructor(router) {
        this.router = router;
        var serviceProject = new RestService("core", "projects");
        var serviceTask = new RestService("core", "tasks/dueToDay");
        this.getProjects(serviceProject);
        this.getDueToday(serviceTask);
        this.getInfo();
        
    }

    getProjects(serviceProject) {
        serviceProject.get()
        .then(results => {
            for(var item of results) {
                var serviceDueToDay = new RestService("core", `/Projects/${item.id}/projectWithProgress`);
                serviceDueToDay.get().then(results => {
                    this.projects.push(results);
                })
            }
        })
        .catch(err => {
            this.serviceProjectError = err;
        });
    }

    async getInfo() {
        var servicebacklogs =  new RestService("core", "backlogs");
        var serviceTask =  new RestService("core", "tasks");
        this.info.totBacklogs = (await servicebacklogs.count()).count;
        this.info.closedBacklogs = (await servicebacklogs.count({where: {status: 'closed'}})).count;
        this.info.totTasks = (await serviceTask.count()).count;
        this.info.closedTasks = (await serviceTask.count({where: {status: 'closed'}})).count;
    }

    getDueToday(serviceTask) {
        serviceTask.get()
        .then(results => {
            this.tasksToDay = results;
        })
        .catch(err => {
            this.serviceTaskError = err;
        })
    }

    __viewBacklog(id) {
        this.router.navigateToRoute('view', { id: id });
    }
    
}