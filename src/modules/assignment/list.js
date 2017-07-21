import { inject } from "aurelia-framework";
import { Router } from 'aurelia-router';
import { RestService } from "../../lib/rest-service";
import createLoopbackFilterObject from "../../lib/loopback-filter-factory";
import moment from "moment";

@inject(Router)
export class List {

  constructor(router) {
    this.service = new RestService("core", "assignments");
    // this.service2 = new RestService("core", "timerecord");
    
    this.router = router;
    this.getData();
    
    
  }
  
async bind(context) {
    this.context = context;
    this.data = this.context.data;
    this.error = this.context.error;

    //this.cancelCallback = this.context.cancelCallback;
    // this.editCallback = this.context.editCallback;
    // this.selectedBacklog = await this.backlogService.get(backlogId, { filter: { include: "project" } });
  }

getData(){
  this.service.get().then(results => {
    this.data = results;
    var persentasiService = [];
    for(var item of this.data){
      var p = new RestService("core", `assignments/${item.id}/persentasi`);
      persentasiService.push(p.get());
    }
    Promise.all(persentasiService).then(result => {
      for(var index in this.data) {
      console.log("result");        
        console.log(result[index].Persentasi);        
        this.data[index].persentasi = result[index].Persentasi;
      }
      console.log(this.data);
    })
  })
}

}

