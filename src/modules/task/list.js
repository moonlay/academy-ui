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

  async bind(context){
    this.context = context;
    this.data = this.context.data;
    this.error = this.context.error;
  }

  getData(){
      this.service.get().then(results => {
        this.data = results;
        var actualService = [];
        for(var item of this.data){
            var a = new RestService("core", `tasks/${item.id}/actual`);
            actualService.push(a.get());
          }
          Promise.all(actualService).then(result => {
            for (var index in this.data){
                console.log("result");
                console.log(result[index].Actual);
                this.data[index].actual = result[index].Actual;

              }
              console.log(this.data);
          })
      })
  }
}
