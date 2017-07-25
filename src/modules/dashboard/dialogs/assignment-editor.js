import { inject, bindable, useView, computedFrom } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';
import { RestService } from "../../../lib/rest-service";
import parseLoopbackError from "../../../lib/loopback-error-parser";
import createLoopbackFilterObject from "../../../lib/loopback-filter-factory";
import moment from "moment";

@inject(DialogController)
@useView("modules/project/dialogs/assignment-editor.html")
export class AssignmentEditor {
    @bindable selectedIteration = {};// required. for initial variable reference. 
    @bindable selectedAccount = {};// required. for initial variable reference.

    constructor(dialogController) {
        this.dialogController = dialogController;
    }

    __dateFormatter = function (value, row, index) {
        return value ? moment(value).format("DD-MMM-YYYY") : "-";
    }
    assignmentColumns = ["code", "name", {
        field: "date", title: "date",
        formatter: function (value, row, index) {
            return value ? moment(value).format("DD-MMM-YYYY") : "-";
        }
    }, "remark"];

    assignmentStatusOptions = ["open", "closed"];
    async activate(data) {
        this.data = data;
        this.assignmentService = new RestService("core", `tasks/${this.data.taskId}/assignments`);
        this.iterationService = new RestService("core", `iterations`);
        this.accountService = new RestService("core", "accounts");
        this.projectService = new RestService("core", `projects`);

        var iterationId = this.data.iterationId;
        var accountId = this.data.accountId;
        this.selectedIteration = await this.iterationService.get(iterationId, { filter: { include: "project" } });
        this.selectedAccount = await this.accountService.get(accountId);
    }
    selectedIterationChanged(newValue, oldValue) {
        this.data.iterationId = this.selectedIteration ? this.selectedIteration.id : this.data.iterationId;
    }

    selectedAccountChanged(newValue, oldValue) {
        this.data.accountId = this.selectedAccount ? this.selectedAccount.id : this.data.accountId;
    }

    @computedFrom("data.id")
    get isEdit() {
        return (this.data.id || '').toString() !== '';
    }
    get iterationLoader() {
        return (keyword) => {
            var info = { search: keyword };
            var loopbackFilter = createLoopbackFilterObject(info, ["code", "name"]);
            loopbackFilter.filter.where = { and: [{ projectId: this.data.projectId }] }
            console.log(loopbackFilter.filter.where)
            loopbackFilter.filter.include = {
                relation: "project"
            }
            return this.iterationService
                .list(loopbackFilter);
        }
    }
    get accountLoader() {
        return (keyword) => {
            var info = { search: keyword };
            var loopbackFilter = createLoopbackFilterObject(info, ["username", "email"])
            return this.accountService.list(loopbackFilter)
        }
    }

    iterationFormatter(iteration) {
        if (!iteration || !iteration.project)
            return '';
        return `${iteration.project.name}/iteration:${iteration.no}`
    }
    taskFormatter(task) {
        if (!task || !task.backlog || !task.project)
            return '';
        return `${task.project.name}/${task.backlog.name}/task: ${task.name}`
    }

    saveCallback() {
        var action = this.isEdit ? this.assignmentService.put(this.data.id, this.data) : this.assignmentService.post(this.data);

        action
            .then(result => {
                this.dialogController.ok(this.data);
            })
            .catch(parseLoopbackError)
            .then(error => {
                this.error = error;
            });
    }
}