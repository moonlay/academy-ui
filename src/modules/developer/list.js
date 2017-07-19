import { inject } from "aurelia-framework";
import { Router } from 'aurelia-router';
import { RestService } from "../../lib/rest-service";
import createLoopbackFilterObject from "../../lib/loopback-filter-factory";
import moment from "moment";
import { bindable, containerless, computedFrom } from "aurelia-framework";

@inject(Router)
export class List {
  totalSeconds=0;
  
    @bindable selectedProject;// required. for initial variable reference.
  constructor(router) {
    // this.service = new RestService("core", "tasks");
    this.service = new RestService("core", "timerecords");
    this.router = router;
    this.getData();
    var currentItem;
  }
start(item){

   if(this.currentItem)
     this.currentItem.isStart = false;
     item.isStart = true;
     item.isStop = true;
     this.currentItem = item;

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
    setInterval(() => this.data [this.index].duration = parseInt (this.data[this.index].duration) + 1,1000);
  
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

async bind(context) {
    this.context = context;
    this.data = this.context.data;
  }

getData(){
    this.service.get().then(results => {
      this.data = results;
      console.log(this.data);
      var getTasks;
      var getTime;
      for(var item of this.data){
        item.isStart = false;
        // var tasksService = new RestService("core", `/tasks/${item.id}/tasks`);
        var timeService = new RestService("core", `/timerecord/${item.id}/timerecord`);
        getTime.push(timeService.get());
        // getTasks.push(tasksService.get());
  }
    })
  }

loader = (info) => {
    var fields = this.columns.map(col => {
      if (typeof col === "string")
        return col;
      else if (typeof col === "object" && col.field)
        return col.field;
    })

    var loopbackFilter = createLoopbackFilterObject(info, fields)
  };

  __view(id) {
    this.router.navigateToRoute('view', { id: id });
  }

}
