import { bindable, inject } from "aurelia-framework";
import { RestService } from "../../lib/rest-service";
import { Router } from 'aurelia-router';
import { Dialog } from '../../au-components/dialog/dialog';
import parseLoopbackError from "../../lib/loopback-error-parser";

@inject(Router, Dialog)
export class View {

  constructor(router, dialog) {
    this.service = new RestService("core", "assignments");
    this.router = router;
    this.dialog = dialog;
    this.getData();
  }

  showDialog() {
    this.myDialog.open();
  }
  async activate(params) {
    var id = params.id;
    this.item = await this.service.get(id, { filter: { include: "timerecords"} });
    
    var p = new RestService("core", `assignments/${this.item.id}/persentasi`);
    p.get().then(results => {
      this.item.persentasi = results.Persentasi;
    })
}
  cancelCallback() {
    this.router.navigateToRoute('list');
  }

getData(){
    this.service.get().then(results => {
      this.data = results;
    
      var persentasiService = [];
      for(var item of this.data){
        var p = new RestService("core", `assignments/${item.id}/persentasi`);
        persentasiService.push(p.get());
    
  }
Promise.all(persentasiService).then(results =>{
 for(var index in this.data){
   console.log("result");
   console.log(results[index].Persentasi);
   this.data[index].persentasi = results[index].Persentasi;
 }
   console.log(this.data);
})
    })
  }


}
