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
  @bindable openElapsed;
  @bindable openBudget;
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
  
  this.openElapsed;
  this.openBudget;

  this.countAssignments = 0;
  this.countExceedDeadline = 0;
  this.exceededElapsed = 0;
}

  async activate(model) {
    this.data = model.datas;
      if(model.datas==null){
      }
      else{

        this.accountId = model.datas.accountId;

        this.assignmentService = new RestService("core", `accounts/${model.datas.accountId}/assignments`); 
        this.assignmentsData = await this.assignmentService.get({filter: { include: "task"}});

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
        this.refreshTables();
      }  
  }

  refreshTables(){
    this.assignmentTable.refresh();
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
        title: "Budget Time"
    },
    {
        field: "elapsed",
        title: "Elapsed"
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

  secondsToTime(secs)
  {
    secs = Math.round(secs);
    var hours = Math.floor(secs / (60 * 60));

    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);

    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);

    if (hours < 10) {hours = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}

    var time = hours+":"+minutes+":"+seconds

    var obj = {
        "h": hours,
        "m": minutes,
        "s": seconds
    };
    return time;
  }

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
    this.countAssignments = 0; 
    var fields = this.assignmentsColumns.map(col => {
      if (typeof col === "string")
        return col;
      else if (typeof col === "object" && col.field)
        return col.field;
    })
    var loopbackFilter = createLoopbackFilterObject(info, fields)
    loopbackFilter.filter.include = "task";
    return Promise
      .all([this.assignmentService.count(loopbackFilter.filter),this.assignmentService.list(loopbackFilter)])
      .then(results => {
        var count = results[0].count;
        var data = results[1];
        this.countAssignments = results[0].count;
        this.countClosedAssignmentsDetails(results[1]);


        console.log(this.secondsToTime(36666));
        return {
          total: count,
          data: data
        };
      });
    }
  };

  async getAssignmentByDate(){

      this.assignmentService = new RestService("core", `reports/account/${this.data.accountId}/${this.startDate}/to/${this.endDate}/assignments`);     
      this.assignmentsData = await this.assignmentService.get();

      this.assignmentTable.refresh();
  }

  countClosedAssignmentsDetails(array){
    if(array!=null)
      {this.closedElapsed = array.reduce(function(last, d) {
                return d.elapsed + last;
            }, 0);
      this.closedBudget = array.reduce(function(last, d) {
                return d.budget + last;
            }, 0); 
       this.exceededElapsed =(((this.closedElapsed - (this.closedBudget*3600))/(this.closedBudget*3600))*100);      
          }    
  }

  contextMenu = ["Detail"];

  __contextMenuCallback(event) {
        var arg = event.detail;
        var data = arg.data;
        switch (arg.name) {
            case "Detail":
                this.__view(data.id);
                break;    
        }
    }

  __view(id) {
      this.getAssignmentPerProject(id);
    }

  async getAssignmentPerProject(id){
    this.assignmentService = new RestService("core", `reports/account/${this.accountId}/${id}/assignments`);     
    this.assignmentsData = await this.assignmentService.get();

    this.efficiencyService = new RestService("core", `reports/account/${this.accountId}/${id}/efficiency`);     
    this.efficiencyData = await this.efficiencyService.get();

    this.assignmentTable.refresh();
  }  

  countOpenAssignmentsDetails(array){
    if(array!=null){
      this.openElapsed = array.reduce(function(last, d) {
                return d.elapsed + last;
            }, 0);
      this.openBudget = array.reduce(function(last, d) {
                return d.budget + last;
            }, 0); 

    }
    }
}
