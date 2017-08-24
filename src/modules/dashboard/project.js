import { bindable,inject,containerless } from "aurelia-framework";

import { Router } from 'aurelia-router';
import { RestService } from "../../lib/rest-service";
import createLoopbackFilterObject from "../../lib/loopback-filter-factory";
import parseLoopbackError from "../../lib/loopback-error-parser";
import moment from "moment";

@containerless()
@inject(Router)
export class Project {
    @bindable data;
    @bindable error;

    constructor(router) {
        this.serviceProjects =  new RestService("core", "projects");
        this.router = router;
    }

  
    async getProject() {
        this.projects = await this.serviceProjects.get();
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

    created(owner, self) {
    this.data = {}
  }

  cancelCallback(event) {
    this.__goToList();
  }

  saveCallback(event) {
    this.serviceProjects.post(this.data)
      .then(result => {
        this.__goToList();
      })
      .catch(parseLoopbackError)
      .then(error => { 
        this.error = error;
      });
  }

  // Privates
  __goToList() {
    this.router.navigateToRoute('list');
  }
    
}