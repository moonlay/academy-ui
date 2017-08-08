import { bindable, inject } from "aurelia-framework";
import { RestService } from "../../../lib/rest-service";
import { Router } from 'aurelia-router';
import { Dialog } from '../../../au-components/dialog/dialog';
import parseLoopbackError from "../../../lib/loopback-error-parser";
import createLoopbackFilterObject from "../../../lib/loopback-filter-factory";
import moment from "moment";
import { Assignments } from './assignments'



@inject(Router, Dialog)
export class reports{
    @bindable totalProjects;

    @bindable totalClosedAssignment;
    @bindable totalOpenAssignment;

    @bindable dataku;
    @bindable dob;

    constructor(router, dialog) {
        this.service = new RestService("core", "accounts");    
        this.router = router; 
        this.dialog = dialog;

        this.efficiencyCount = 0;
        this.totalClosedAssignment = 0;
        this.totalOpenAssignment = 0;
        this.totalWorkTime = 0;
        this.totalProjects = 0;

        this.accountId;
        this.dataku = {};
        this.dob;
    }

    async activate(params){
        var id = params.id;
        this.accountId = id;
        this.data = await this.service.get(id, { filter: { include: "profile" } });
        this.dob = this.GetFormattedDate(this.data.profile.dob);
         
    }  

    GetFormattedDate(date) {
        var todayTime = new Date(date).toUTCString();
        return todayTime ? moment(todayTime).format("DD-MMM-YYYY") : "-";
    }

    async countTotalEfficiency(){
        this.countEfficiency = new RestService("core",`reports/account/${this.accountId}/assignments/efficiency`)
        this.totalEfficiency = await this.countEfficiency.get();
    }

    async countClosedAssignment(){
        this.countClosed = new RestService("core", `reports/account/${this.accountId}/assignments/closed`)
        this.totalClosedAssignment = await this.countClosed.get();
    }

    async countOpenAssignment(){
        this.countOpen = new RestService("core", `reports/account/${this.accountId}/assignments/open`)
        this.totalOpenAssignment = await this.countOpen.get();
    }

    async countProjects(){
        this.countProject = new RestService("core", `reports/account/${this.accountId}/project/count`)
        this.totalProjects = await this.countProject.get();
    }

    showAssignments() {
        var data = {"accountId": this.accountId}
        this.dataku = {datas: data};
        console.log(this.dataku);
    }
}