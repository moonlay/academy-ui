import { bindable, inject } from "aurelia-framework";
import { RestService } from "../../../lib/rest-service";
import { Router } from 'aurelia-router';
import { Dialog } from '../../../au-components/dialog/dialog';
import parseLoopbackError from "../../../lib/loopback-error-parser";
import createLoopbackFilterObject from "../../../lib/loopback-filter-factory";
import moment from "moment";


@inject(Router, Dialog)
export class projects{

    @bindable dataProject;
    @bindable dataAssignment;
    dataTaskPerAccount;
    @bindable dataProjectPerAccount;
    @bindable date;
    @bindable assignmentEfficiency;

        

    constructor(router, dialog) {
        this.service = new RestService("core", "accounts");    
        this.router = router; 
        this.dialog = dialog;
        this.efficiencyCount = 0;
        this.accountId;
        this.date;
        
    }

    async activate(params){
        var id = params.id;
        this.accountId = id;
        this.data = await this.service.get(id, { filter: { include: "profile" } }); 
        
        this.assignmentService = new RestService("core", `accounts/${id}/assignments`);
        this.assignmentsData = await this.assignmentService.get({ filter: { include: "task" } }); 
        
        this.assignmentServ = new RestService("core", `reports/account/${id}/assignments`);
        this.totalAssignment = new RestService("core", `accounts/${id}/count/closedAssignment`);

        this.accountEfficiency = new RestService ("core", `reports/account/${id}/assignments/efficiency`)
        this.assignmentEfficiency = await this.accountEfficiency.get();

       // this.viewAssignment = new RestService("core",`accounts/${id}/count/efficiency/${this.date}`);
        //this.viewAssignmentReport = await this.viewAssignment.get();
        
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
        title: "Elapsed Time"
    },
    {
        field: "date", 
        title: "Date",
        formatter: function (value, row, index) {
        return value ? moment(value).format("DD-MMM-YYYY") : "-";}
    },
    {
        field: "remark",
        title: "Remark"
    }];

    __dateFormatter = function (value, row, index) {
    return value ? moment(value).format("DD-MMM-YYYY") : "-";
    }

    taskColumns = [
    "code",
    "name",
    {
      field: "date", title: "Date",
      formatter: this.__dateFormatter
    },
    "budget",
    "actual",
    {
      field: "open", title: "Open",
      formatter: this.__dateFormatter
    },
    {
      field: "close", title: "Close",
      formatter: this.__dateFormatter
    },
    "remark",
    "status"];


  assignmentLoader = (info) => {
    var fields = this.assignmentsColumns.map(col => {
      if (typeof col === "string")
        return col;
      else if (typeof col === "object" && col.field)
        return col.field;
    })
    var loopbackFilter = createLoopbackFilterObject(info, fields)
    return Promise
      .all([this.assignmentService.count(loopbackFilter.filter),this.assignmentsData])
      .then(results => {
        var count = results[0].count;
        var data = results[1];
        console.log(data);

        this.getEfficiency();
        return {
          total: count,
          data: data
        };
      });
    };

  getEfficiency(){
    this.efficiencyCount = this.assignmentEfficiency.efficiency;
    //nilai efficiencyCount adalah array yang memiliki [nilai elapsed, nilai budget, nilai efisiensi]
  }

  // changeCallback(){
  //   var date = this.date;
  //   var arg = arg.data;

  // }

  // viewReportAssignment(){
  //   var date = this.date;
  //   console.log();
  //   viewAssignment;
  //   console.log("lihat assignment");
  //   this.assignmentTable.refresh();

  // }

  // async getEfficiencyByDate(date){
  //   this.accountEfficiencyByDate = new RestService ("core", `accounts/${id}/count/efficiency/${date}`)
  //   this.efficiencyByDate = await this.accountEfficiencyByDate.get();
  // }

  changeCallback($event) {
    console.log(this.date)
    this.getEfficiencyByDate(this.date)
  }


}