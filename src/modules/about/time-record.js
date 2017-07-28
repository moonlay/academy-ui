import { inject } from "aurelia-framework";
import { Router } from 'aurelia-router';
import { RestService } from "../../lib/rest-service";
import createLoopbackFilterObject from "../../lib/loopback-filter-factory";
import moment from "moment";

@inject(Router)
export class TimeRecord {
    constructor() {
        this.serviceTimeRecord = new RestService("core", "timerecords");
        // console.log(this.serviceTimeRecord);
        this.getTimeRecords();
        this.waktu = 0;
        this.index = 0;
    }

    getTimeRecords() {
        this.serviceTimeRecord.get().then(result => {
            this.data = result;
            // console.log(result);
        })
    }

    start(item) {
        this.waktu = item.duration;
        for(var i in this.data) {
            var isHas = false
            if (this.data[i].id == item.id ) {
                isHas = true;
            }
            if(isHas) {
                this.index = i;
                break;
            }
        }

        console.log(this.data[this.index]);

        setInterval(() => 
         this.data[this.index].duration = parseInt(this.data[this.index].duration) + 1,
         1000);
    }
}


