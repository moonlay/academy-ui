
import { inject } from "aurelia-framework";
import { Router } from 'aurelia-router';
import { RestService } from "../../../lib/rest-service";
import createLoopbackFilterObject from "../../../lib/loopback-filter-factory";
import moment from "moment";

@inject(Router)
export class Task 
{
    constructor(router) {
        this.serviceProject = new RestService("core", "projects");
        this.serviceTask = new RestService("core", "task");
        this.router = router;
    }

    async activate(params) {
        var id = params.id;
        var serviceProjectTask = await this.serviceProject.get(id, { filter: { include: "tasks"} });
        console.log(serviceProjectTask);
        this.projectTask = serviceProjectTask;
        // for(var i in this.projectTask.tasks)
        //     this.getAssignments(this.projectTask.tasks[i].id);
    }

    getAssignments(taskId) {
        var taskAssignment =  this.serviceTask.get(taskId, { filter: { include: "assignments" } } );

    }

}