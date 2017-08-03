import { inject } from "aurelia-framework";
import { Router } from 'aurelia-router';
import { RestService } from "../../lib/rest-service";
import createLoopbackFilterObject from "../../lib/loopback-filter-factory";
import moment from "moment";
import './simple.css';


@inject(Router)
export class List {

    constructor(router) {
        this.service = new RestService("core", "accounts");
        this.router = router;
    }

    __dateFormatter = function (value, row, index) {
        return value ? moment(value).format("DD-MMM-YYYY") : "-";
    }

    columns = [
        "username",
        "email",
        {
            field: "profile.firstname", title: "first name"
        },
        {
            field: "profile.lastname", title: "last name"
        }, 
        {
            field: "profile.dob", title: "dob",
            formatter: this.__dateFormatter
        },
        {
            field: "profile.gender", title: "gender"
        }];
    contextMenu = ["Detail","Projects","Report"];

    loader = (info) => {
        var fields = this.columns.map(col => {
            if (typeof col === "string")
                return col;
            else if (typeof col === "object" && col.field)
                return col.field;
        })

        var loopbackFilter = createLoopbackFilterObject(info, fields)
        loopbackFilter.filter.include = "profile";
        return Promise
            .all([this.service.count(loopbackFilter.filter), this.service.list(loopbackFilter)])
            .then(results => {
                var count = results[0].count;
                var data = results[1];
                return {
                    total: count,
                    data: data
                };
            });
    };

    __view(id) {
        this.router.navigateToRoute('view', { id: id });
    }

    __viewReport(id) {
        this.router.navigateToRoute('report', { id: id });
    }

    __viewProjects(id){
        this.router.navigateToRoute('project', { id: id });
    }

    create() {
        this.router.navigateToRoute('create');
    }

    __contextMenuCallback(event) {
        var arg = event.detail;
        var data = arg.data;
        switch (arg.name) {
            case "Detail":
                this.__view(data.id);
                break;
            case "Projects":
                this.__viewProjects(data.id);
                break;  
            case "Report":
                this.__viewReport(data.id);
                break;    
        }
    }
}
