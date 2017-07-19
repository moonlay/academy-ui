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
    this.service = new RestService("core", "tasks");
    //this.service2 = new RestService("core", "assignment");
    
    this.router = router;
    this.dialog = dialog;
  }

  showDialog() {
    this.myDialog.open();
  }
  async activate(params) {
    var id = params.id;
    this.data = await this.service.get(id);
   // this.data2 = await this.service2.get(id);
  
}



}


