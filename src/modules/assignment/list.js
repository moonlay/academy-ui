import { inject } from "aurelia-framework";
import { Router } from 'aurelia-router';
import { RestService } from "../../lib/rest-service";
import createLoopbackFilterObject from "../../lib/loopback-filter-factory";
import moment from "moment";

@inject(Router)
export class List {

  constructor(router) {
    this.service = new RestService("core", "tasks");
    this.router = router;
    this.getData();
    
  }
  
async bind(context) {
    this.context = context;
    this.data = this.context.data;

  }

getData(){
    this.service.get().then(results => {
      this.data = results;
      console.log(this.data);
      var getTasks;
      
      for(var item of this.data){
        var tasksService = new RestService("core", `/tasks/${item.id}/tasks`);
        getTasks.push(tasksService.get());
    }
    })
  }

    async activate(params){
        var id = params.id;
        this.persen = new RestService ("core", `tasks/${item.id}/persentasi/`)
        //this.accountEfficiency = new RestService ("core", `accounts/${id}/count/efficiency`)
        this.efficiency = await this.persen.get();
        }


    __view(id) {
    this.router.navigateToRoute('view', { id: id });
  }
  
  create() {
    this.router.navigateToRoute('create');
  }

}

