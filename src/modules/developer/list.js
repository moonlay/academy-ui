import { inject } from "aurelia-framework";
import { Router } from 'aurelia-router';
import { RestService } from "../../lib/rest-service";
import createLoopbackFilterObject from "../../lib/loopback-filter-factory";
import moment from "moment";

@inject(Router)
export class List {
    constructor(router) {
        this.service = new RestService("core", "assignments");
        this.router = router;
        this.getData();
        this.waktu = 0.0;
    }
    getData() {
        this.service.get({ filter: { include: 'task', where:{status: 'open'} }  }).then(results => {
            this.data = results;
            console.log(this.data);
            var getTasks;
            for (var item of this.data) {
                var tasksService = new RestService("core", `/assignments/`);
                getTasks.push(tasksService.get());
            }

        })
        this.service.get({ filter: { include: 'task', where:{status: 'closed'} }  }).then(results => {
            this.dataClosed = results;
            console.log(this.dataClosed);
            var getTasks;
            for (var item of this.dataClosed) {
                var tasksService = new RestService("core", `/assignments/`);
                getTasks.push(tasksService.get());
            }

        })
    }
    __view(id) {
        this.router.navigateToRoute('view', { id: id });
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    start(item) {
        if (this.currentItem)
            this.currentItem.isStart = false;
        item.isStart = true;
        item.isStop = true;
        this.currentItem = item;
        this.waktu = item.duration;
        for (var i in this.data) {
            var isHas = false
            if (this.data[i].id == item.id) {
                isHas = true;
            }
            if (isHas) {
                this.index = i;
                break;
            }
        }

        if (this.data[this.index].duration == null) {
            this.data[this.index].duration = 0;
            this.interval = setInterval(() =>
                this.data[this.index].duration = parseInt(this.data[this.index].duration) + 1,
                1000);

            this.data[this.index].waktu = 0.0;
            this.interval = setInterval(() =>
                this.data[this.index].waktu = parseInt(this.data[this.index].waktu) + 1,
                1000);

            console.log(this.data[this.index].waktu);
            console.log(this.data[this.index].duration);

        } else {
            this.data[this.index].waktu = 0.0;
            this.interval = setInterval(() =>
                this.data[this.index].waktu = parseInt(this.data[this.index].waktu) + 1,
                1000);
            console.log(this.data[this.index].waktu);
            console.log(this.data[this.index].duration);

            this.interval = setInterval(() =>
                this.data[this.index].duration = parseInt(this.data[this.index].duration) + 1,
                1000);

        }

        setInterval(() =>
            this.service.post(timerRecord, `assignments/${this.data[this.index].id}/timerecords`),
            this.service.put(this.data[this.index].id, this.data[this.index]), 60000);

        // if(this.data[this.index].duration >= 10){
        //     stop(item);
        // }
    }
    stop(item) {
        document.getElementById("button").hidden = true

        clearInterval(this.interval);
        delete this.interval;
        var assignment =
            {
                "elapsed": this.data[this.index].duration,
                "date": this.data[this.index].date,
                "budget": this.data[this.index].budget,
                "remark": this.data[this.index].remark,
                "status": this.data[this.index].status,
                "id": this.data[this.index].id,
                "accountId": this.data[this.index].accountId,
                "taskId": this.data[this.index].taskId,
                "iterationId": this.data[this.index].iterationId,
                "assignmentId": this.data[this.index].assignmentId,
                "duration": this.data[this.index].duration
            };
        var timerRecord =
            {
                "date": moment(value).format("DD-MMM-YYYY"),
                "name": this.data[this.index].task.name,
                "duration": this.data[this.index].duration,
                "description": this.data[this.index].task.description,
                "remark": this.data[this.index].task.remark,
                "projectId": this.data[this.index].task.projectId,
                "assignmentId": this.data[this.index].task.id,
                "waktu": this.data[this.index].waktu,
            }

        this.service.post(timerRecord, `assignments/${this.data[this.index].id}/timerecords`)
        this.service.put(this.data[this.index].id, assignment, `assignments/${this.data[this.index].id}`)

            .then(result => {
                this.__goToView();
            })
            .catch(parseLoopbackError)
            .then(error => {
                this.error = error;
            });


    }

    __goToView() {
        this.router.navigateToRoute('list');
    }
    pause(item) {
        item.isStop = false;
        item.isStart = false;
        clearInterval(this.interval);
        var assignment =
            {
                "elapsed": this.data[this.index].duration,
                "date": this.data[this.index].date,
                "budget": this.data[this.index].budget,
                "remark": this.data[this.index].remark,
                "status": this.data[this.index].status,
                "id": this.data[this.index].id,
                "accountId": this.data[this.index].accountId,
                "taskId": this.data[this.index].taskId,
                "iterationId": this.data[this.index].iterationId,
                "assignmentId": this.data[this.index].assignmentId,
                "duration": this.data[this.index].duration
            };
        var timerRecord =
            {
                "date": new Date(),
                "name": this.data[this.index].task.name,
                "duration": this.data[this.index].duration,
                "description": this.data[this.index].task.description,
                "remark": this.data[this.index].task.remark,
                "projectId": this.data[this.index].task.projectId,
                "assignmentId": this.data[this.index].task.id,
                "waktu": this.data[this.index].waktu,
            }

        delete this.interval;
        this.service.post(timerRecord, `assignments/${this.data[this.index].id}/timerecords`)
        this.service.put(this.data[this.index].id, assignment, `assignments/${this.data[this.index].id}`)

    }
}
