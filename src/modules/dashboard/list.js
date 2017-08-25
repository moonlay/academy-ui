import { bindable, inject } from "aurelia-framework";
import { RestService } from "../../lib/rest-service";
import moment from "moment";
import { Router } from 'aurelia-router';


@inject(Router)
export class List {
    loader = [];
    loaderDueTasks = [];
    constructor(router) {
        this.router = router;
        var projectService = new RestService("core", "projects");
        var dueTaskService = new RestService("core", "tasks/getDueTaskThisWeek")
        this.getDatas(projectService);
        this.getDueTasks(dueTaskService);
    }



    // buttons = [
    //     { icon: "fa-gear", buttonClass: "btn-box-tool", action: this.viewSetting.bind(this) }
    // ];

    footerButton = {title: "View Detail", action: this.__viewDetailProject.bind(this)}
    

    iconProject = "fa-folder-open-o";
    iconTask = "fa-tasks";


    __viewDetailProject(data) {
        if(data)
            this.router.navigateToRoute('view', { id: data });
    }

    getDueTasks(service) {
        service.get().then(results => {
            this.loaderDueTasks = results;
        })
    }

    getDatas(service) {
        var projectDetailsPromise = [];
        service.get({filter :{ order: 'createdDate DESC' }}).then(results => {
            var datasPromise = [];
            for (var item of results) {
                var promise = new RestService("core", `/Projects/${item.id}/projectProgressById`);
                datasPromise.push(promise.list());
            }

            Promise.all(datasPromise).then(results => {
                for(var item of results) {
                    if(item.progress != 100)
                        this.loader.push(item);                
                }         
            })
        }).catch(e => {
            console.log("error");
            console.log(e);
        })
    };


}


