import { bindable, inject } from "aurelia-framework";
import { RestService } from "../../lib/rest-service";
import { Router } from 'aurelia-router';
import { Dialog } from '../../au-components/dialog/dialog';
import parseLoopbackError from "../../lib/loopback-error-parser";

@inject(Router, Dialog)
export class View {
  // @bindable data;
  // @bindable error;

  constructor(router, dialog) {
    this.service = new RestService("core", "accounts");
    this.router = router; 
    this.dialog = dialog;
  }

  showDialog() {
    this.myDialog.open();
  }
  async activate(params) {
    var id = params.id;
    this.data = await this.service.get(id, { filter: { include: "profile" } });
  }

  cancelCallback() {
    this.router.navigateToRoute('list');
  }

  editCallback() {
    this.router.navigateToRoute('edit', { id: this.data.id });
  }

  deleteCallback() {
    this.dialog.prompt("Delete this data?", "You are about to delete a data")
      .then(response => {
        if (response.ok) {
          this.service.delete(this.data.id)
            .then(result => {
              this.router.navigateToRoute('list');
            })
            .catch(parseLoopbackError)
            .then(error => {
              this.error = error;
            });
        }
      });
  }
}
