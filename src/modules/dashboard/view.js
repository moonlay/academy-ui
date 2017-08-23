import { bindable, inject, computedFrom } from "aurelia-framework";
import { RestService } from "../../lib/rest-service";
import { Backlogs } from './partials/backlogs'
export class View 
{
  constructor() {
    this.projectService = new RestService("core", "projects");
  }
  backlogs = {};
  async activate (params) {
    var id = params.id;
    this.project = await this.projectService.get(id, { filter: {include : "backlogs"} });
    var serviceBacklogDetail = [];
    for(let item of this.project.backlogs) {
      var service = new RestService("core", `backlogs/${item.id}/detailBacklog`)
      serviceBacklogDetail.push(service.get());
    }
    Promise.all(serviceBacklogDetail).then(results => {
      this.backlogs = {datas: results};
    })
  }

}