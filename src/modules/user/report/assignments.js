import { bindable,bindingMode, inject } from "aurelia-framework";
import { RestService } from "../../../lib/rest-service";
import { Router } from 'aurelia-router';
import { Dialog } from '../../../au-components/dialog/dialog';
import chart from './chart';
import parseLoopbackError from "../../../lib/loopback-error-parser";
import createLoopbackFilterObject from "../../../lib/loopback-filter-factory";
import moment from "moment";

export class assignments {

    @bindable assignmentsData;
    @bindable efficiencyCount;   
    @bindable startDate;
    @bindable endDate;
    @bindable closedElapsed;
    @bindable closedBudget;
    @bindable efficiencyData;
    @bindable countAssignments;
    @bindable countExceeded;
    @bindable totalProjects;
    @bindable totalElapsed;
    @bindable totalBudget;
    @bindable countClosedAssignmentsByDate;
    @bindable countOpenAssignmentsByDate;
    @bindable countBudgetByDate;
    @bindable countElapsedByDate;
    @bindable efficiencyByDateCount;
    @bindable searchFlag;

    // @bindable({ defaultBindingMode: bindingMode.twoWay }) dropDownvalue;
        
    constructor() {
        
        this.SimpleLineData = {};
        this.accountId;
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
        this.countExceeded;
        this.countAssignmentsbyDate = 0;
        this.countClosedAssignmentsByDate = 0;
        this.countOpenAssignmentsByDate = 0;
        this.countBudgetByDate = 0;
        this.countElapsedByDate = 0;
        this.efficiencyByDateCount = 0;
    }

    async activate(model) {
            if(model.datas==null){
            }
            else
                {
                this.accountId = model.datas.accountId;
                this.assignmentService = new RestService("core", `accounts/${model.datas.accountId}/assignments`); 
                this.assignmentsData = await this.assignmentService.get({filter: { include: "task", order:'date DESC'}});
                this.countAssignmentsService = new RestService("core", `reports/account/${model.datas.accountId}/assignments/count`);
                // this.countAssignments = await this.countAssignmentsService.get();

                this.countTotalElapsed = new RestService("core",`reports/account/${model.datas.accountId}/assignments/elapsed`)
                this.totalElapsed = await this.countTotalElapsed.get();

                this.countTotalBudget = new RestService("core",`reports/account/${model.datas.accountId}/assignments/budget`)
                this.totalBudget = await this.countTotalBudget.get();

                this.countProject = new RestService("core", `reports/account/${model.datas.accountId}/project/count`)
                this.totalProjects = await this.countProject.get();

                this.efficiencyService = new RestService("core",`reports/account/${model.datas.accountId}/assignments/efficiency`)
                this.efficiencyCount = await this.efficiencyService.get();

                this.countExceededService = new RestService("core",`reports/account/${model.datas.accountId}/assignments/exceeded/count`)
                this.countExceeded = await this.countExceededService.get();

                this.closedAssignmentsService = new RestService("core", `reports/account/${model.datas.accountId}/assignments/closed/count`)
                this.countClosed = await this.closedAssignmentsService.get();

                this.closedAssignmentsService = new RestService("core", `reports/account/${model.datas.accountId}/assignments/open/count`)
                this.countOpen = await this.closedAssignmentsService.get();

                this.getChartDataService = new RestService("core",`reports/account/${model.datas.accountId}/${new Date()}/data/sixmonths`);
                this.chartData = await this.getChartDataService.get();

                this.resetLineData();
                
                // this.projectService = new RestService("core",`reports/account/${model.datas.accountId}/project`)
                // this.projectData = await this.projectService.get();        
                }  
    }

    assignmentsColumns = [
        {
            field: "status",
            title: "Status"
        },
        {
            field: "task.name",
            title: "Nama Tugas"
        },
        {
            field: "task.project.name",
            title: "Projek"
        },
        {
            field: "task.type",
            title: "Tipe"
        },  
        {
            field: "budget",
            title: "Waktu yang Diberikan",
            formatter: function (value, row, index) {
            var decimalTime = value * 60 * 60;
            var n = new Date(0,0);
            n.setSeconds(+decimalTime)
            return value ? n.toTimeString().slice(0, 8) : "-";}
        },
        {
            field: "elapsed",
            title: "Waktu yang Terpakai",
            formatter: function (value, row, index) {
            var n = new Date(0,0);
            n.setSeconds(+value)
            return value ? n.toTimeString().slice(0, 8) : "-";}
        },
        {
            field: "date", 
            title: "Tanggal Ditugaskan",
            formatter: function (value, row, index) {
            return value ? moment(value).format("DD-MMM-YYYY") : "-";}
        },
        {
            field: "deadline", 
            title: "Deadline",
            formatter: function (value, row, index) {
            return value ? moment(value).format("DD-MMM-YYYY") : "-";}
        },
        {
            field: "remark",
            title: "Remark"
        }
    ];

    assignmentLoader = (info) => {
        var fields = this.assignmentsColumns.map(col => {
            if (typeof col === "string")
            return col;
            else if (typeof col === "object" && col.field)
            return col.field;
        })
            var loopbackFilter = createLoopbackFilterObject(info, fields);
            loopbackFilter.filter.include={relation:"task",scope:{include:"project"}};
            loopbackFilter.filter.order ='date DESC';

            return Promise
                .all([this.assignmentService.count(loopbackFilter.filter),this.assignmentService.count(),this.assignmentService.list(loopbackFilter)])
                .then(results => {
                var data = results[2];
                if(this.searchFlag==0){
                    this.countAssignments = results[0].count;
                    var count = this.countAssignments;
                }else{
                    var count = results[1];
                    this.countAssignmentsbyDate = count;
                }
                return {
                    total: count,
                    data: data
                };
            });
    };


    async getAssignmentByDate(){
        this.searchFlag = 1;
        
        this.assignmentService = new RestService("core", `reports/account/${this.accountId}/${this.startDate}/to/${this.endDate}/assignments`);     
        this.assignmentsData = await this.assignmentService.get();
        this.assignmentTable.refresh();

        this.efficiencyByDateService = new RestService("core",`reports/account/${this.accountId}/${this.startDate}/to/${this.endDate}/efficiency`);
        this.efficiencyByDateCount = await this.efficiencyByDateService.get();

        this.countClosedAssignmentsService = new RestService("core", `reports/account/${this.accountId}/${this.startDate}/to/${this.endDate}/assignments/closed/count`);
        this.countClosedAssignmentsByDate = await this.countClosedAssignmentsService.get();

        this.countOpenAssignmentsService = new RestService("core", `reports/account/${this.accountId}/${this.startDate}/to/${this.endDate}/assignments/open/count`);
        this.countOpenAssignmentsByDate = await this.countOpenAssignmentsService.get();

        this.countBudgetByDateService = new RestService("core", `reports/account/${this.accountId}/${this.startDate}/to/${this.endDate}/assignments/budget`);
        this.countBudgetByDate = await this.countBudgetByDateService.get();

        this.countElapsedByDateService = new RestService("core", `reports/account/${this.accountId}/${this.startDate}/to/${this.endDate}/assignments/elapsed`);
        this.countElapsedByDate = await this.countElapsedByDateService.get();

        this.searchFlag = 0;
    }
        
    resetLineData(months) {
        if(this.chartData){months=this.chartData.months}
        console.log(this.chartData.value.budget)
        console.log(this.chartData.value.elapsed)
        
        this.SimpleLineData = {
            labels: months,
            datasets: [
                {
                    label: "Alokasi Waktu",
                    backgroundColor: "rgba(220,220,220,0.2)",
                    borderColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: this.chartData.value.budget
                },
                {
                    label: "Penggunaan Waktu",
                    backgroundColor: "rgba(151,187,205,0.2)",
                    borderColor: "rgba(151,187,205,1)",
                    pointColor: "rgba(151,187,205,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: this.chartData.value.elapsed
                },
                {
                    label: "Jumlah Tugas",
                    borderColor: "rgba(255,160,122,1)",
                    pointColor: "rgba(255,160,122,1)",
                    pointStrokeColor: "#000",
                    pointHighlightFill: "#000",
                    pointHighlightStroke: "rgba(255,160,122,1)",
                    data: this.chartData.totalAssignment
                },
                {
                    label: "Efisiensi",
                    borderColor: "rgba(0,0,255,1)",
                    pointColor: "rgba(0,0,255,1)",
                    pointStrokeColor: "#000",
                    pointHighlightFill: "blue",
                    pointHighlightStroke: "rgba(0,0,255,1)",
                    data: this.chartData.value.efficiency
                }
            ]
        };
    }



}
