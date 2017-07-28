import { inject } from "aurelia-framework";
import { Router } from 'aurelia-router';
import { RestService } from "../../lib/rest-service";
import createLoopbackFilterObject from "../../lib/loopback-filter-factory";
import moment from "moment";

@inject(Router)
export class ProjectChart {
    constructor(router) {
        this.serviceProjects =  new RestService("core", "projects");
        this.router = router;
        this.getTask();
    }

    async getTask() {
        this.serviceProjects.get().then(resultProject => {
            var data = resultProject;

            var backlogs = [];

            for (var item of data) {
                var backlog = this.serviceProjects.get(item.id, { filter: { include: [ "backlogs", "tasks" ] } });
                backlogs.push(backlog);
            }

            Promise.all(backlogs).then(backlogResult => {
                this.projects = backlogResult;
                    var index = 0;
                    for (var p of this.projects) {
                        p.projectProgress = 0.0;
                        for(var i =0; i<p.backlogs.length; i++) {
                            // console.log(p.backlogs[i]);
                            p.backlogs[i].backlogProgress = 0;
                            p.backlogs[i].taskDone = 0;
                            p.backlogs[i].totTask = 0; 
                            for(var j = 0; j<p.tasks.length; j++) {
                                if(p.backlogs[i].id === p.tasks[j].backlogId) {
                                    if(p.tasks[j].status === "closed") {
                                        p.backlogs[i].taskDone +=1 ;
                                    }
                                    p.backlogs[i].totTask +=1 ;
                                }
                            }
                            var td = p.backlogs[i].taskDone;
                            var tt = p.backlogs[i].totTask;
                            p.backlogs[i].backlogProgress = (td/tt) * 100;
                        }
                         
                        for(var i =0; i< p.backlogs.length; i++) {
                            p.projectProgress += p.backlogs[i].backlogProgress;
                        }
                         p.projectProgress /= p.backlogs.length;
                         p.projectProgress = p.projectProgress.toFixed(2);
                        
                    }
            })
        });
    }

    __dialog(id) {
        this.router.navigateToRoute('view', { id: id });
    }

    
}