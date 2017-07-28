import { bindable, inject, computedFrom } from "aurelia-framework";
import { RestService } from "../../../lib/rest-service";
import { Router } from 'aurelia-router';
import { Dialog } from '../../../au-components/dialog/dialog';
import parseLoopbackError from "../../../lib/loopback-error-parser";
import createLoopbackFilterObject from "../../../lib/loopback-filter-factory";
import moment from "moment";

import { BacklogEditor } from '../dialogs/backlog-editor';
import { TaskEditor } from '../dialogs/task-editor';
import { AssignmentEditor } from '../dialogs/assignment-editor';

@inject(Router)
export class Backlogs {

    constructor(router, dialog) {
    this.backlogTaskService = new RestService("core", "backlogs");
    this.router = router;
    this.dialog = dialog;

  }

  async activate(params) {
    var id = params.id;
    this.projectId = id;
    this.backlogService = new RestService("core", `projects/${id}/backlogs`);
  }
  backlogColumns = [
    "code",
    "name",
    "description",
    // {
    //   field: "date", title: "date",
    //   formatter: this.__dateFormatter
    // }
  ];

  backlogContextMenu = ["Edit"];
  __backlogContextMenuCallback(event) {
    var arg = event.detail;
    var data = arg.data;
    switch (arg.name) {
      case "Edit":
        this.__backlogShowEditorDialog(data);
        break;
    }
  }
  async __backlogRowClickCallback(event) {
    var data = event.detail;
    // this.activeBacklog = data;
    this.backlogTasks = await this.backlogTaskService.get(data.id, { filter: { include: "tasks" } });
    console.log(this.backlogTasks);
  }

  __backlogCreateCallback() {
    this.__backlogShowEditorDialog({ projectId: this.projectId })
  }

  __backlogShowEditorDialog(data) {
    this.dialog.show(BacklogEditor, data)
      .then(response => {
        if (!response.wasCancelled) {
          this.backlogTable.refresh();
        }
      });
  }

  backlogLoader = (info) => {
    var fields = this.backlogColumns.map(col => {
      if (typeof col === "string")
        return col;
      else if (typeof col === "object" && col.field)
        return col.field;
    })
    var loopbackFilter = createLoopbackFilterObject(info, fields)
    return Promise
      .all([this.backlogService.count(loopbackFilter.filter), this.backlogService.list(loopbackFilter)])
      .then(results => {
        var count = results[0].count;
        var data = results[1];
        console.log(data);
        return {
          total: count,
          data: data
        };
      });
  };
}