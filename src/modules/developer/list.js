
import { bindable, inject } from "aurelia-framework";
import { Router } from 'aurelia-router';
import { RestService } from "../../lib/rest-service";
import createLoopbackFilterObject from "../../lib/loopback-filter-factory";
import moment from "moment";
import { AuthService } from "aurelia-authentication";

@inject(Router)
export class List {
    projects = [];
    info = {};
    constructor(router) {
        this.service = new RestService("core", `accounts/${localStorage.userId}/assignments`);
        this.account = new RestService("core", `accounts/${localStorage.userId}`);
        this.assignment = new RestService("core", `accounts/${localStorage.userId}/assignments/count`);
        var serviceTask = new RestService("core", "tasks/dueToDay");

        this.router = router;
        this.getDueToday(serviceTask);
        this.getInfo();
        this.getData();
        this.waktu = 0.0;

    }
    getData() {
        this.service.get({ filter: { include: 'task', where: { status: 'open' }, order: 'deadline ASC' } }).then(results => {
            this.data = results
            var persentasiService = [];
            for (var item of this.data) {
                var p = new RestService("core", `assignments/${item.id}/subtraction`);
                persentasiService.push(p.get())
            }
            Promise.all(persentasiService).then(results => {
                for (var index in this.data) {
                    this.data[index].subtraction = results[index].Subtraction;
                }
            })
        })
        this.assignment.get().then(results => {
            this.item = results;
        })
        this.account.get().then(results => {
            this.nama = results;
        })
    }

    async getInfo() {
        var serviceAssignment = new RestService("core", "assignments");
        var serviceTask = new RestService("core", "tasks");
        this.info.totAssignments = (await serviceAssignment.count()).count;
        this.info.totTasks = (await serviceTask.count()).count;
    }
    getDueToday(serviceTask) {
        serviceTask.get()
            .then(results => {
                this.tasksToDay = results;
            })
            .catch(err => {
                this.serviceTaskError = err;
            })
    }

    __view(id) {
        this.router.navigateToRoute('view', { id: id });
    }

    start(item) {
        if (this.currentItem)
            this.currentItem.isStart = false;

        item.isStart = true;
        item.isStop = true;
        this.currentItem = item;
        this.waktu = item.elapsed;
      
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

        var assignment =
            {
                "elapsed": this.data[this.index].elapsed,
                "date": this.data[this.index].date,
                "budget": this.data[this.index].budget,
                "remark": this.data[this.index].remark,
                "status": this.data[this.index].status,
                "id": this.data[this.index].id,
                "accountId": this.data[this.index].accountId,
                "taskId": this.data[this.index].taskId,
                "iterationId": this.data[this.index].iterationId,
                "assignmentId": this.data[this.index].assignmentId,
                "duration": this.data[this.index].elapsed,
                "deadline": this.data[this.index].deadline,
            };
        this.data[this.index].waktu=0.0;
        this.interval2 = setInterval(() =>
            this.data[this.index].waktu = parseInt(this.data[this.index].waktu) + 1,
            1000);
        if (this.data[this.index].elapsed == null) {
            this.data[this.index].elapsed = 0;
            this.interval = setInterval(() =>
                this.data[this.index].elapsed = parseInt(this.data[this.index].elapsed) + 1,
                1000);
        } else {
            this.interval = setInterval(() =>
                this.data[this.index].elapsed = parseInt(this.data[this.index].elapsed) + 1,
                1000);
        };
        setInterval(() =>
            this.service.put(this.data[this.index].id, this.data[this.index], `assignments/${this.data[this.index].id}`),
            1000);
    };

    stop(item) {
        item.isStop = false;
        item.isStart = false;
        clearInterval(this.interval);
        clearInterval(this.interval2);
        this.data[this.index].status = 'closed';
        var assignment =
            {

                "elapsed": this.data[this.index].elapsed,
                "date": this.data[this.index].date,
                "budget": this.data[this.index].budget,
                "remark": this.data[this.index].remark,
                "status": this.data[this.index].status,
                "id": this.data[this.index].id,
                "accountId": this.data[this.index].accountId,
                "taskId": this.data[this.index].taskId,
                "iterationId": this.data[this.index].iterationId,
                "assignmentId": this.data[this.index].assignmentId,
                "duration": this.data[this.index].elapsed,
                "deadline": this.data[this.index].deadline

            };
            var timerRecord =
            {
                "date": new Date(),
                "name": this.data[this.index].task.name,
                "duration": this.data[this.index].elapsed,
                "description": this.data[this.index].task.description,
                "remark": this.data[this.index].task.remark,
                "projectId": this.data[this.index].task.projectId,
                "assignmentId": this.data[this.index].task.id,
                "waktu": this.data[this.index].assignment.waktu
            }

        delete this.interval;
        this.service.post(timerRecord, `assignments/${this.data[this.index].id}/timerecords`)
        this.service.put(this.data[this.index].id, assignment, `assignments/${this.data[this.index].id}`)
    }
    __goToView() {
        this.router.navigateToRoute('list');
    }

    pause(item) {
        item.isStop = false;
        item.isStart = false;
        clearInterval(this.interval);
        clearInterval(this.interval2);
        console.log(localStorage.waktu)

        var assignment =
            {
                "elapsed": this.data[this.index].elapsed,
                "date": this.data[this.index].date,
                "budget": this.data[this.index].budget,
                "remark": this.data[this.index].remark,
                "status": this.data[this.index].status,
                "id": this.data[this.index].id,
                "accountId": this.data[this.index].accountId,
                "taskId": this.data[this.index].taskId,
                "iterationId": this.data[this.index].iterationId,
                "assignmentId": this.data[this.index].assignmentId,
                "duration": this.data[this.index].elapsed,
                "deadline": this.data[this.index].deadline

            };
            var timerRecord =
            {
                "date": new Date(),
                "name": this.data[this.index].task.name,
                "duration": this.data[this.index].elapsed,
                "description": this.data[this.index].task.description,
                "remark": this.data[this.index].task.remark,
                "projectId": this.data[this.index].task.projectId,
                "assignmentId": this.data[this.index].task.id,
                "waktu": this.data[this.index].assignment.waktu
            }

        delete this.interval;
        this.service.post(timerRecord, `assignments/${this.data[this.index].id}/timerecords`)
        this.service.put(this.data[this.index].id, assignment, `assignments/${this.data[this.index].id}`)
    }
}
