import { bindable, inject, computedFrom } from "aurelia-framework";
import { RestService } from "../../../lib/rest-service";
import { Router } from 'aurelia-router';
import { Dialog } from '../../../au-components/dialog/dialog';
import parseLoopbackError from "../../../lib/loopback-error-parser";
import createLoopbackFilterObject from "../../../lib/loopback-filter-factory";
import moment from "moment";

import { BacklogEditor  } from '../dialogs/iteration-editor';
import { TaskEditor } from '../dialogs/task-editor';

@inject(Router, Dialog)
export class Iterations {
    // @bindable data;
    // @bindable error;
    
    __dateFormatter = function (value, row, index) {
        return value ? moment(value).format("DD-MMM-YYYY") : "-";
    }

    constructor(router, dialog) {
        this.projectService = new RestService("core", "projects");
        this.router = router;
        this.dialog = dialog;
    }

    async activate(params) {
        var id = params.id;
        this.projectId = id;
        this.iterationService = new RestService("core", `projects/${id}/iterations`);
    }

    iterationColumns = ["no",
        {
            field: "start", title: "start",
            formatter: function (value, row, index) {
                return value ? moment(value).format("DD-MMM-YYYY") : "-";
            }
        },
        {
            field: "end", title: "end",
            formatter: function (value, row, index) {
                return value ? moment(value).format("DD-MMM-YYYY") : "-";
            }
        }, "remark"];

    iterationContextMenu = ["Edit"];
    __iterationContextMenuCallback(event) {
        var arg = event.detail;
        var data = arg.data;
        switch (arg.name) {
            case "Edit":
                this.__iterationShowEditorDialog(data);
                break;
        }
    }
    __iterationRowClickCallback(event) {
        var data = event.detail;
        this.activeBacklog = data;
    }

    __iterationCreateCallback() {
        this.__iterationShowEditorDialog({ projectId: this.projectId })
    }

    __iterationShowEditorDialog(data) {
        this.dialog.show(BacklogEditor, data)
            .then(response => {
                if (!response.wasCancelled) {
                    this.iterationTable.refresh();
                }
            });
    }

    iterationLoader = (info) => {
        var fields = this.iterationColumns.map(col => {
            if (typeof col === "string")
                return col;
            else if (typeof col === "object" && col.field)
                return col.field;
        })
        var loopbackFilter = createLoopbackFilterObject(info, fields)
        return Promise
            .all([this.iterationService.count(loopbackFilter.filter), this.iterationService.list(loopbackFilter)])
            .then(results => {
                var count = results[0].count;
                var data = results[1];
                return {
                    total: count,
                    data: data
                };
            });
    };
}
