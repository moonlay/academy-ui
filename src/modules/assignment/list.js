import { Aurelia, inject } from "aurelia-framework";
import { Router } from 'aurelia-router';
import { RestService } from "../../lib/rest-service";
import createLoopbackFilterObject from "../../lib/loopback-filter-factory";
import moment from "moment";

@inject(Router)
export class List {
  constructor(router) {
    this.service = new RestService("core", `accounts/${localStorage.userId}/assignments`);
    // this.accountService = new RestService("core", `accounts/${item.id}/assignments`);
    this.router = router;
    this.getData();
    console.log(localStorage.userId);
    // console.log(response);
    // console.log("success logged " + response);

  //  this.authService = authService;
    // console.log(this.authService);
    // console.log(this.authService.authentication.accessToken);
  }

  async bind(context) {
    this.context = context;
    this.data = this.context.data;

  }


getData() {
    this.service.get().then(results => {
      this.data = results;
      var elapsedService = [];
      for (var item of this.data) {
        var e = new RestService("core", `assignments/${item.id}/elapsed`);
        elapsedService.push(e.get());
      }
      Promise.all(elapsedService).then(result => {
        for (var index in this.data) {
          console.log("result");
          console.log(result[index].Elapsed);
          this.data[index].elapsed = result[index].Elapsed;

        }
        console.log(this.data);
      })
    })
  }
  contextMenu = ["Detail"];

  loader = (info) => {
    var fields = this.columns.map(col => {
      if (typeof col === "string")
        return col;
      else if (typeof col === "object" && col.field)
        return col.field;
    })

    var loopbackFilter = createLoopbackFilterObject(info, fields)
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

  __contextMenuCallback(event) {
    var arg = event.detail;
    var data = arg.data;
    switch (arg.name) {
      case "Detail":
        this.__view(data.id);
        break;
    }
  }
}
