import { bindable, inject } from "aurelia-framework";
import { RestService } from "../../lib/rest-service";
import { Router } from 'aurelia-router';
import parseLoopbackError from "../../lib/loopback-error-parser";

@inject(Router)
export class Create {
  @bindable data;
  @bindable error;

  constructor(router) {
    this.service = new RestService("core", "assignments");
    this.router = router;
  }

  created(owner, self) {
    this.data = {}
  }

  cancelCallback(event) {
    this.__goToList();
  }

  saveCallback(event) {
    this.service.post(this.data, "assignments/coba")
      .then(result => {
        this.__goToList();
      })
      .catch(parseLoopbackError)
      .then(error => {
        this.error = error;
      });
  }

  // Privates
  __goToList() {
    this.router.navigateToRoute('list');
  }
}
