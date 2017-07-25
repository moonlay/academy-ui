import { bindable,inject } from "aurelia-framework";

import { Router } from 'aurelia-router';
import { RestService } from "../../lib/rest-service";
import createLoopbackFilterObject from "../../lib/loopback-filter-factory";
import moment from "moment";

@inject(Router)
export class ProjectChart {
    info = {};
    
    constructor(router) {
        this.router = router;
        this.setService();
        this.getProject();
        this.assignmentToday();
    }



    setService() {
        this.serviceProjects =  new RestService("core", "projects");
        this.serviceAssignment =  new RestService("core", "Assignment");
        this.servicebacklogs =  new RestService("core", "backlogs");
        this.serviceTask =  new RestService("core", "tasks");
    }

    assignmentToday() {
        var startDate = (new Date()).setHours(0,0,0,0);
        var endDate = (new Date()).setHours(23, 59, 59);
        var isoStartDate = new Date(startDate).toISOString();
        var isoEndDate = new Date(endDate).toISOString();
        console.log(isoStartDate);
        console.log(isoEndDate);
        this.serviceTask.list({filter : {where: {close: {between: [isoStartDate, isoEndDate]}}}}).then(results => {
            var tasks =  results;
            this.tasksToDay = tasks;
        })
    }


    async getProject() {
        this.projects = await this.serviceProjects.get();
        this.info.totBacklogs = (await this.servicebacklogs.count()).count;
        this.info.closedBacklogs = (await this.servicebacklogs.count({where: {status: 'closed'}})).count;
        this.info.totTasks = (await this.serviceTask.count()).count;
        this.info.closedTasks = (await this.serviceTask.count({where: {status: 'closed'}})).count;
        
        console.log(this.info);
        var progress = [];
        for(var item of this.projects) {
            var progressService = new RestService("core", `projects/${item.id}/progress`);
            progress.push(progressService.get());
        }
        
        Promise.all(progress).then(results => {
            for(var index in results) {
                this.projects[index].progress = results[index].progress;    
            }
        })
    }

    __viewBacklog(id) {
        this.router.navigateToRoute('view', { id: id });
    }
    
}