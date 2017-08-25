import { RestService } from "../../../lib/rest-service";
import { Assignments } from './assignments';
export class Tasks {
  tasks = [];
  assignments = {};  
  activate(model) {
    this.service = new RestService("core", `assignments`);
    if(model.datas) this.tasks = model.datas;    
  }
  __viewAssignments(taskId) {
    console.log("this task id = "+ taskId);
    this.service.list({filter: {include : 'account', where: {taskId: taskId}}}).then(result => {
      this.assignments = {datas: result};
      console.log("this.assignments");
      console.log(this.assignments);
    })
  }
}