import { inject, useView, computedFrom } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';
import { RestService } from "../../../lib/rest-service";
import parseLoopbackError from "../../../lib/loopback-error-parser";

@inject(DialogController)
@useView("modules/project/dialogs/iteration-editor.html")
export class BacklogEditor {
    constructor(dialogController) {
        this.dialogController = dialogController;
    }

    iterationStatusOptions = ["open", "closed"];
    activate(data) {
        this.data = data;
        this.iterationService = new RestService("core", `projects/${this.data.projectId}/iterations`);
    }

    @computedFrom("data.id")
    get isEdit() {
        return (this.data.id || '').toString() !== '';
    }

    saveCallback() {
        var action = this.isEdit ? this.iterationService.put(this.data.id, this.data) : this.iterationService.post(this.data);

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