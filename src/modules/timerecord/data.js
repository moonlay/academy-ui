
import { bindable, containerless, computedFrom } from "aurelia-framework";
import { RestService } from "../../lib/rest-service";
import createLoopbackFilterObject from "../../lib/loopback-filter-factory";

@containerless()
export class Data {
  @bindable title;
  @bindable readOnly;

  //taskTypeOptions = ["bug", "development"];
  //taskStatusOptions = ["open", "closed"];

  @bindable selectedProject;// required. for initial variable reference.
  //@bindable selectedBacklog;// required. for initial variable reference.

 // constructor() {
  //  this.backlogService = new RestService("core", "backlogs");
 // }

async bind(context) {
    this.context = context;
    this.data = this.context.data;
    this.error = this.context.error;

    //this.cancelCallback = this.context.cancelCallback;
    this.editCallback = this.context.editCallback;
    

    var backlogId = this.data.backlogId;
    this.selectedBacklog = await this.backlogService.get(backlogId, { filter: { include: "project" } });
  }

  //selectedBacklogChanged(newValue, oldValue) {
    //this.data.backlogId = this.selectedBacklog ? this.selectedBacklog.id : this.data.backlogId;
    //this.selectedProject = this.selectedBacklog ? this.selectedBacklog.project : null;
  //}

  @computedFrom("data.id")
  get isEdit() {
    return (this.data.id || '').toString() !== '';
  }

  // get backlogLoader() {
  //   return (keyword) => {
  //     var info = { search: keyword };
  //     var loopbackFilter = createLoopbackFilterObject(info, ["code", "name"])
  //     loopbackFilter.filter.include = "project"
  //     return this.backlogService.list(loopbackFilter)
  //   }
  // }

  //__goToList() {
    //this.router.navigateToRoute('list');
  //}
}
