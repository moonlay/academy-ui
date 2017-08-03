import { inject, useView, computedFrom } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';
import { RestService } from "../../../lib/rest-service";
import parseLoopbackError from "../../../lib/loopback-error-parser";

@inject(DialogController)
@useView("modules/project/dialogs/task-editor.html")
export class TaskEditor {
    constructor(dialogController) {
        this.dialogController = dialogController;
    }

    taskTypeOptions = ["bug", "development"];
    taskStatusOptions = ["open", "closed"];
    
    activate(data) {
        this.data = data;
        this.taskService = new RestService("core", `backlogs/${this.data.backlogId}/tasks`);
    }

    @computedFrom("data.id")
    get isEdit() {
        return (this.data.id || '').toString() !== '';
    }

    saveCallback() {
        var action = this.isEdit ? this.taskService.put(this.data.id, this.data) : this.taskService.post(this.data);

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