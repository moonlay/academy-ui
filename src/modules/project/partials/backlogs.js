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

@inject(Router, Dialog)
export class Backlogs {
  // @bindable data;
  // @bindable error;
  __dateFormatter = function (value, row, index) {
    return value ? moment(value).format("DD-MM-YYYY") : "-";
  }
  @bindable activeBacklog;
  @bindable activeTask;

  activeBacklogChanged(newValue, oldValue) {
    this.taskService = new RestService("core", `backlogs/${this.activeBacklog.id}/tasks`);
    this.taskTable.refresh();
  }

  activeTaskChanged(newValue, oldValue) {
    this.assignmentService = new RestService("core", `tasks/${this.activeTask.id}/assignments`);
    this.assignmentTable.refresh();
  }

  constructor(router, dialog) {
    this.projectService = new RestService("core", "projects");
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

  backlogContextMenu = ["Edit","Check Employee"];
  __backlogContextMenuCallback(event) {
    var arg = event.detail;
    var data = arg.data;
    switch (arg.name) {
      case "Edit":
        this.__backlogShowEditorDialog(data);
        break;
    }
  }
  __backlogRowClickCallback(event) {
    var data = event.detail;
    this.activeBacklog = data;
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
        return {
          total: count,
          data: data
        };
      });
  };

  taskColumns = [
    "type",
    "code",
    "name",
    // {
    //   field: "date", title: "date",
    //   formatter: this.__dateFormatter
    // },
    // "budget",
    // "actual",
    {
      field: "open", title: "open",
      formatter: this.__dateFormatter
    },
    {
      field: "close", title: "close",
      formatter: this.__dateFormatter
    },
    "remark",
    "status"];

  taskContextMenu = ["Edit"];
  __taskContextMenuCallback(event) {
    var arg = event.detail;
    var data = arg.data;
    switch (arg.name) {
      case "Edit":
        this.__taskShowEditorDialog(data);
        break;
    }
  }
  
__taskRowClickCallback(event) {
    var data = event.detail;
    this.activeTask = data;
  }
  __taskCreateCallback() {
    this.__taskShowEditorDialog({ projectId: this.projectId, backlogId: this.activeBacklog.id })
  }

  __taskShowEditorDialog(data) {
    this.dialog.show(TaskEditor, data)
      .then(response => {
        if (!response.wasCancelled) {
          this.taskTable.refresh();
        }
      });
  }

  taskLoader = (info) => {
    if (!this.activeBacklog)
      return Promise.resolve({ total: 0, data: [] });
    else {
      var fields = this.taskColumns.map(col => {
        if (typeof col === "string")
          return col;
        else if (typeof col === "object" && col.field)
          return col.field;
      })
      var loopbackFilter = createLoopbackFilterObject(info, fields)
      return Promise
        .all([this.taskService.count(loopbackFilter.filter), this.taskService.list(loopbackFilter)])
        .then(results => {
          var count = results[0].count;
          var data = results[1];
          return {
            total: count,
            data: data
          };
        });
    }
  }

  assignmentColumns = ["code", "name", {
    field: "date", title: "date",
    formatter: function (value, row, index) {
      return value ? moment(value).format("DD-MMM-YYYY") : "-";
    }
  }, "remark"];

  assignmentStatusOptions = ["open", "closed"];

  assignmentContextMenu = ["Edit"];
  __assignmentContextMenuCallback(event) {
    var arg = event.detail;
    var data = arg.data;
    switch (arg.name) {
      case "Edit":
        data.projectId = this.projectId;
        this.__assignmentShowEditorDialog(data);
        break;
    }
  }

  __assignmentShowEditorDialog(data) {
    this.dialog.show(AssignmentEditor, data)
      .then(response => {
        if (!response.wasCancelled) {
          this.assignmentTable.refresh();
        }
      });
  }
  __assignmentRowClickCallback(event) {
    var data = event.detail;
    this.activeAssignment = data;
  }

  __assignmentCreateCallback() {
    this.__assignmentShowEditorDialog({ projectId: this.projectId, backlogId: this.activeBacklog.id, taskId: this.activeTask.id });
  }

  assignmentLoader = (info) => {
    if (!this.activeBacklog)
      return Promise.resolve({ total: 0, data: [] });
    else {
      var fields = this.assignmentColumns.map(col => {
        if (typeof col === "string")
          return col;
        else if (typeof col === "object" && col.field)
          return col.field;
      })
      var loopbackFilter = createLoopbackFilterObject(info, fields)
      return Promise
        .all([this.assignmentService.count(loopbackFilter.filter), this.assignmentService.list(loopbackFilter)])
        .then(results => {
          var count = results[0].count;
          var data = results[1];
          return {
            total: count,
            data: data
          };
        });
    }
  };
}
