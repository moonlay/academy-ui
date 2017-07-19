import { bindable, inject } from "aurelia-framework";
import { RestService } from "../../lib/rest-service";
import { Router } from 'aurelia-router';
import { Dialog } from '../../au-components/dialog/dialog';
import parseLoopbackError from "../../lib/loopback-error-parser";
import moment from 'moment';

@inject(Router, Dialog)
export class View {
  totalSeconds=0;
  constructor(router, dialog, results) {
    this.service = new RestService("core", "tasks");
    this.router = router;
    this.dialog = dialog;
    this.results = results;
}

    showDialog() {
      this.myDialog.open();
    }
  async activate(params) {
    var id = params.id;
    this.data = await this.service.get(id);
  }

  cancelCallback() {
    this.router.navigateToRoute('list');
  }


start(item){

  //  if(this.currentItem)
  //    this.currentItem.isStart = false;
  //    item.isStart = true;
  //    item.isStop = true;
  //    this.currentItem = item;

    this.index = 0;
    for(var i in this.data) {
    var isHas = false;
    if(item.id == this.data[i].id){
      isHas = true;
    }
    if(isHas) {
      this.index = i;
      break;
    }
  }
  console.log(this.data[this.index]);
    var self = this;
    var c =  this.data[this.index].duration;
    this.interval = setInterval(function (){
    c +=1;
    console.log(c);
     },1000);
    
}
stop(item){
  document.getElementById("button").hidden = true
     clearInterval(this.interval);
        delete this.interval;  

}

pause(item){
  item.isStart =false;
     clearInterval(this.interval);
        delete this.interval;  

}
}
class Item {
    totalSeconds=0;
}

