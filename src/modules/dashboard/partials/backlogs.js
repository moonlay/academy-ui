import { RestService } from "../../../lib/rest-service";
import { Tasks } from './tasks';
export class Backlogs {
  datas = [];
  tasks = {};
  activate(model) {
    if(model.datas) this.datas = model.datas;    
  }
  __viewTasks(idBacklog) {
    var service = new RestService("core", `backlogs/${idBacklog}/tasks`);
    console.log("service");
    console.log(service);
    service.list().then(result => {
      this.tasks = {datas: result};
      console.log("this.tasks");
      console.log(this.tasks);
    })
  }
}  
  