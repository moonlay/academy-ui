import { bindable, inject } from "aurelia-framework";
import { RestService } from "../../lib/rest-service";
import { Router } from 'aurelia-router';
import parseLoopbackError from "../../lib/loopback-error-parser";

@inject(Router)
export class Edit {
  constructor(router) {
    this.service = new RestService("core", "tasks");
    this.router = router;
  }

  async activate(params) {
    var id = params.id;
    this.data = await this.service.get(id);
  }

  cancelCallback() {
    this.__goToView();
  }

  saveCallback() {
    this.service.put(this.data.id, this.data)
      .then(result => {
        this.__goToView();
      })
      .catch(parseLoopbackError)
      .then(error => {
        this.error = error;
      });
  }

  __goToView() {
    this.router.navigateToRoute('view', { id: this.data.id });
  }
}
