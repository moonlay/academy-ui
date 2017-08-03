import { inject } from "aurelia-framework";
import { Router } from 'aurelia-router';
import { RestService } from "../../lib/rest-service";
import createLoopbackFilterObject from "../../lib/loopback-filter-factory";

@inject(Router)
export class List {
  constructor(router) {
    this.service = new RestService("core", "projects");
    this.router = router;
  }

  async activate() {
    // this.data = await this.load();
  }

  columns = ["code", "name"];
  contextMenu = ["Detail", "Manage","Test"];

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
      case "Manage":
        this.router.navigateToRoute('manage', { id: data.id });
        break;
    }
  }
}
