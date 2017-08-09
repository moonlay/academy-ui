import { bindable, inject } from "aurelia-framework";
import { RestService } from "../../../lib/rest-service";
import { Router } from 'aurelia-router';
import { Dialog } from '../../../au-components/dialog/dialog';
import parseLoopbackError from "../../../lib/loopback-error-parser";
import createLoopbackFilterObject from "../../../lib/loopback-filter-factory";
import moment from "moment";


export class assignments {

    @bindable assignmentsData;
    @bindable assignmentEfficiency;
    @bindable totalWorkTime;
    @bindable totalBudget;
    @bindable startDate;
    @bindable endDate;
    @bindable closedElapsed;
    @bindable closedBudget;
    @bindable efficiencyData;

    @bindable countAssignments;
    @bindable countExceedDeadline;
    @bindable exceededElapsed;
    @bindable totalProjects;
  
    constructor() {
        this.accountId;
        this.data=[];

        this.startDate;
        this.endDate;

        this.totalWorkTime;
        this.totalBudget;
        this.totalProjects;

        this.closedElapsed;
        this.closedBudget;

        this.countAssignments = 0;
        this.countExceedDeadline = 0;
        this.exceededElapsed = 0;

        this.searchFlag = 0;
    }

    async activate(model) {
        this.data = model.datas;
            if(model.datas==null){
            }
            else{
            this.accountId = model.datas.accountId;
            this.assignmentService = new RestService("core", `accounts/${model.datas.accountId}/assignments`); 
            this.assignmentsData = await this.assignmentService.get({filter: { include: "task", order:'date DESC'}});

            this.countAssignmentsService = new RestService("core", `reports/account/${model.datas.accountId}/assignments/count`);
            this.countAssignments = await this.countAssignmentsService.get();

            this.countProject = new RestService("core", `reports/account/${model.datas.accountId}/project/count`)
            this.totalProjects = await this.countProject.get();

            this.projectService = new RestService("core",`reports/account/${model.datas.accountId}/project`)
            this.projectData = await this.projectService.get();

            this.countWorkTimeService = new RestService("core",`reports/account/${model.datas.accountId}/assignments/elapsed`)
            this.totalWorkTime = await this.countWorkTimeService.get();

            this.countBudgetTime = new RestService("core",`reports/account/${model.datas.accountId}/assignments/budget`)
            this.totalBudget = await this.countBudgetTime.get();

            this.efficiencyService = new RestService("core",`reports/account/${model.datas.accountId}/assignments/efficiency`)
            this.efficiencyData = await this.efficiencyService.get();

        }  
    }

    assignmentsColumns = [
        {
            field: "status",
            title: "Status"
        },
        {
            field: "task.name",
            title: "Task Name"
        },
        {
            field: "task.type",
            title: "Task Type"
        },  
        {
            field: "budget",
            title: "Budget Time",
            formatter: function (value, row, index) {
            var decimalTime = value * 60 * 60;
            var n = new Date(0,0);
            n.setSeconds(+decimalTime)
            return value ? n.toTimeString().slice(0, 8) : "-";}
        },
        {
            field: "elapsed",
            title: "Elapsed",
            formatter: function (value, row, index) {
            var n = new Date(0,0);
            n.setSeconds(+value)
            return value ? n.toTimeString().slice(0, 8) : "-";}
        },
        {
            field: "date", 
            title: "Date Assigned",
            formatter: function (value, row, index) {
            return value ? moment(value).format("DD-MMM-YYYY") : "-";}
        },
        {
            field: "deadline", 
            title: "Deadline Date",
            formatter: function (value, row, index) {
            return value ? moment(value).format("DD-MMM-YYYY") : "-";}
        },
        {
            field: "remark",
            title: "Remark"
        }
    ];

  __dateFormatter = function (value, row, index) {
    return value ? moment(value).format("DD-MMM-YYYY") : "-";
  };

  assignmentLoader = (info) => {
    if(!this.assignmentsData) {
      return {
        data: []
      }
    }
    else {
      var fields = this.assignmentsColumns.map(col => {
        if (typeof col === "string")
          return col;
        else if (typeof col === "object" && col.field)
          return col.field;
      })
    var loopbackFilter = createLoopbackFilterObject(info, fields)
    if(this.searchFlag == 0){
        loopbackFilter.filter.include='task';
        loopbackFilter.filter.order = 'DESC';
    
      return Promise
        .all([this.assignmentService.count(loopbackFilter.filter),this.assignmentService.list(loopbackFilter)])
        .then(results => {
          var data = results[1];
          this.countAssignments = results[0].count;
          var count = this.countAssignments;
          this.countClosedAssignmentsDetails(results[1])
          return {
            total: count,
            data: data
          };
        });
      }else{
        return Promise
        .all([null,this.assignmentService.list(loopbackFilter)])
        .then(results => {
          var data = results[1];
          this.countAssignments = results[0];
          var count = this.countAssignments;
          this.countClosedAssignmentsDetails(results[1])
          return {
            total: count,
            data: data
          };
        });
      }
    }
  };

  //projek
  projectColumns = ["code", "name"];
   projectLoader = (info) => {
    var fields = this.projectColumns.map(col => {
      if (typeof col === "string")
        return col;
      else if (typeof col === "object" && col.field)
        return col.field;
    })

    var loopbackFilter = createLoopbackFilterObject(info, fields)
    return Promise
      .all([this.projectService.count(loopbackFilter.filter), this.projectService.list(loopbackFilter)])
      .then(results => {
        var count = results[0].count;
        var data = results[1];
        return {
          total: count,
          data: data
        };
      });
  };


    async getAssignmentByDate(){
        this.searchFlag=1;
        this.assignmentService = new RestService("core", `reports/account/${this.data.accountId}/${this.startDate}/to/${this.endDate}/assignments`);     
        this.assignmentsData = await this.assignmentService.get();

        this.assignmentTable.refresh();
    }

    countClosedAssignmentsDetails(array){
        if(array!=null)
        {
            this.closedElapsed = array.reduce(function(last, d) {
                return d.elapsed + last;
            }, 0);
            this.closedBudget = array.reduce(function(last, d) {
                return d.budget + last;
            }, 0);
            this.closedElapsed = (this.closedElapsed/3600).toFixed(5);         
            this.exceededElapsed =(((this.closedElapsed - (this.closedBudget))/(this.closedBudget))*100).toFixed(2);      
        }    
    }

    contextMenu = ["Detail"];
  
    __contextMenuCallback(event) {
        var arg = event.detail;
        var data = arg.data;
        switch (arg.name) {
            case "Detail":
                this.searchFlag = 1;
                this.__view(data.id);
                break;    
        }
    }

    __view(projectId) {
        this.getAssignmentPerProject(projectId);
    }

    async getAssignmentPerProject(projectId){
        this.assignmentService = new RestService("core", `reports/account/${this.accountId}/${projectId}/assignments`);     
        this.assignmentsData = await this.assignmentService.get();

        this.efficiencyService = new RestService("core", `reports/account/${this.accountId}/${projectId}/efficiency`);     
        this.efficiencyData = await this.efficiencyService.get();

        this.assignmentTable.refresh(); 
    }  

}
