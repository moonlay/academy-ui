import { bindable, inject, computedFrom } from "aurelia-framework";
import { RestService } from "../../lib/rest-service";
import { Backlogs } from './partials/backlogs';

export class View {
    constructor() {
        this.projectService = new RestService("core", "projects");
    }

    // Untuk Backlog
    titleBacklog = "Backlog";
    loaderProgressBacklog = [];
    loaderCompleteBacklog =[];
    footerButtonBacklog = {title: "View Task", action: this.__viewDetailTask.bind(this)};

    // Untuk Task
    titleTask = "Task";
    loaderProgressTask =[];
    loaderCompleteTask =[];
    footerButtonTask = {title: "View Assignmens", action: this.__viewDetailAssignment.bind(this)};


    // Untuk Project
    titleAssignment = "Assignments";
    loaderCompleteAssignments = [];
    loaderProgressAssignments = [];
    


    async activate(params) {
        var id = params.id;
        this.project = await this.projectService.get(id, { filter: { include: "backlogs" } });
        this.getBacklog();
    }

    __viewDetailAssignment(id) {
        console.log("id Task in view");
        console.log(id);
        var service = new RestService("core", `tasks/${id}/assignments`);
        this.getAssignments(service);
    }

    getAssignments(service) {
        service.get({filter: {where: {status:"open"}}}).then(results => {
            console.log("Assignments open");
            console.log(results);
            this.loaderProgressAssignments = results;
        })
        service.get({filter: {where: {status:"closed"}}}).then(results => {
            console.log("Assignments Closed");
            console.log(results);
            this.loaderCompleteAssignments = results;
        })
        
    }

    __viewDetailTask(id) {
        var service = new RestService("core", `backlogs/${id}/tasks`);
        this.getTasks(service);
    }



    getTasks(service) {
        service.get({filter: {where: {status:"open"}}}).then(results => {
            this.loaderProgressTask = results;
        })
        service.get({filter: {where: {status:"closed"}}}).then(results => {
            this.loaderCompleteTask = results;
        })
    }

    getBacklog() {
        var serviceBacklogDetail = [];
        for (let item of this.project.backlogs) {
            var service = new RestService("core", `backlogs/${item.id}/detailBacklog`)
            serviceBacklogDetail.push(service.get());
        }
        Promise.all(serviceBacklogDetail).then(results => {
            for(var item of results) {
                if(item.status == 'open')
                    this.loaderProgressBacklog.push(item);
                else
                    this.loaderCompleteBacklog.push(item);
            }
        })
    }

}