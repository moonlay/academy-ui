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
    loaderCompleteBacklog = [];
    footerButtonBacklog = { title: "View Tasks", action: this.__viewDetailTask.bind(this) };

    // Untuk Task
    titleTask = "Task";
    loaderProgressTask = [];
    loaderCompleteTask = [];
    footerButtonTask = { title: "View Assignments", action: this.__viewDetailAssignment.bind(this) };


    // Untuk Project
    titleAssignment = "Assignments";
    loaderCompleteAssignments = [];
    loaderProgressAssignments = [];



    async activate(params) {
        var id = params.id;
        this.project = await this.projectService.get(id, { filter: { include: "backlogs" } });
        this.getBacklog();
        this.getProgressBacklogAndTask();
    }

    getProgressBacklogAndTask() {
        var backlogProgressService = new RestService("core", `projects/${this.project.id}/backlog/progress`);
        var taskProgressService = new RestService("core", `projects/${this.project.id}/tasks/progress`);
        Promise.all([backlogProgressService.list(), taskProgressService.list()]).then(results => {
            console.log("results");
            console.log(results);
            var backlogProgress = results[0];
            var taskProgress = results[1];

            this.backlogProgress = {
                id: "backlogProgress",
                labels: ['Completed', 'Planning', 'Overdue'],
                backgroundColor: ['rgb(39, 182, 186)', 'rgb(255, 148, 29)', 'rgb(233, 94, 81)'],
                data: [backlogProgress.completed, backlogProgress.planning, backlogProgress.overDue],
                title: "Backlogs"
            };
            this.taskProgress = {
                id: "taskProgress",
                labels: ['Completed', 'Planning', 'Overdue'],
                backgroundColor: ['rgb(39, 182, 186)', 'rgb(255, 148, 29)', 'rgb(233, 94, 81)'],
                data: [taskProgress.completed, taskProgress.planning, taskProgress.overDue],
                title: "Tasks"
            }
            //     configChart: {
            //         id: item.id,
            //         labels: ['Completed', 'Planning', 'Overdue'],
            //         backgroundColor: ['rgb(39, 182, 186)', 'rgb(255, 148, 29)', 'rgb(233, 94, 81)'],
            //         data: [item.completedBacklog, item.planningBacklog, item.overDueBacklog],
            //         title: "Backlogs"
            //     }

        })
    }
    __viewDetailAssignment(id) {
        console.log("id Task in view");
        console.log(id);
        var service = new RestService("core", `tasks/${id}/assignments`);
        this.getAssignments(service);
    }

    getAssignments(service) {
        service.get({ filter: { where: { status: "open" } } }).then(results => {
            console.log("Assignments open");
            console.log(results);
            this.loaderProgressAssignments = results;

        })
        service.get({ filter: { where: { status: "closed" } } }).then(results => {
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
        service.get({ filter: { where: { status: "open" } } }).then(results => {
            this.loaderProgressTask = results;
        })
        service.get({ filter: { where: { status: "closed" } } }).then(results => {
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
            for (var item of results) {
                if (item.status == 'open')
                    this.loaderProgressBacklog.push(item);
                else
                    this.loaderCompleteBacklog.push(item);
            }
        })
    }

}

    // var data = {
    //     title: item.name,
    //     deadline: item.deadline ? moment(item.deadline).format("DD-MMM-YYYY") : '-',
    //     configChart: {
    //         id: item.id,
    //         labels: ['Completed', 'Planning', 'Overdue'],
    //         backgroundColor: ['rgb(39, 182, 186)', 'rgb(255, 148, 29)', 'rgb(233, 94, 81)'],
    //         data: [item.completedBacklog, item.planningBacklog, item.overDueBacklog],
    //         title: "Backlogs"
    //     }
    // };