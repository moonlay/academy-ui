import { inject, useView, computedFrom } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';
import { RestService } from "../../../lib/rest-service";
import parseLoopbackError from "../../../lib/loopback-error-parser";

@inject(DialogController)
@useView("modules/project/dialogs/backlog-editor.html")
export class BacklogEditor {
    constructor(dialogController) {
        this.dialogController = dialogController;
    }

    backlogStatusOptions = ["open", "closed"];
    activate(data) {
        this.data = data;
        this.backlogService = new RestService("core", `projects/${this.data.projectId}/backlogs`);
    }

    @computedFrom("data.id")
    get isEdit() {
        return (this.data.id || '').toString() !== '';
    }

    saveCallback() {
        var action = this.isEdit ? this.backlogService.put(this.data.id, this.data) : this.backlogService.post(this.data);

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