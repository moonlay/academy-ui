import { inject } from "aurelia-framework";
import { Router } from 'aurelia-router';
import { RestService } from "../../lib/rest-service";
import createLoopbackFilterObject from "../../lib/loopback-filter-factory";
import moment from "moment";


@inject(Router)
export class List {

    constructor(router) {
        this.service = new RestService("core", "assignments");
        this.router = router;
        this.getData();
      
}


getData(){
    this.service.get().then(results => {
      this.data = results;
      console.log(this.data);
      var getTasks;
      for(var item of this.data){
        var tasksService = new RestService("core", `/assignments/`);
        getTasks.push(tasksService.get());
  }
    })
  }

    // columns = [
    //     "id",
    //     "accountId",
    //     {
    //         field: "timerecords.name", title: "name"
    //     }];
    // contextMenu = ["Detail"];

    loader = (info) => {
        var fields = this.columns.map(col => {
            if (typeof col === "string")
                return col;
            else if (typeof col === "object" && col.field)
                return col.field;
        })

        var loopbackFilter = createLoopbackFilterObject(info, fields)
        loopbackFilter.filter.include = "timerecords";
        return Promise
            .all([this.service.count(loopbackFilter.filter), this.service.list(loopbackFilter)])
            .then(results => {
                var count = results[0].count;
                var data = results[1];
                return {
                    total: count,
                    data: data
                };
            });
    };

    __view(id) {
        this.router.navigateToRoute('view', { id: id });
    }

    create() {
        this.router.navigateToRoute('create');
    }


}
