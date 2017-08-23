import { inject, bindable, computedFrom } from 'aurelia-framework';
import { Container } from 'aurelia-dependency-injection';
import { Config } from "aurelia-api"
import './simple.css';


export class DataForm {
  @bindable title;
  @bindable readOnly;

  roleColumns = [
    { header: "Code", value: "code" },
    { header: "Name", value: "name" },
    { header: "Description", value: "description" },
  ]
  genderOptions = ["male", "female"];

  constructor() {
    // this.backlogService = new RestService("core", "backlogs");
  }

  async activate(params) {
    var id = params.id;
    this.data = await this.service.get(id, { filter: { include: "profile" } });
     this.assignmentService = new RestService("core", `accounts/${id}/assignments`);

  }

  async bind(context) {
    this.context = context;
    this.data = this.context.data;
    this.data.profile = this.data.profile || {};
    this.error = this.context.error;

    this.cancelCallback = this.context.cancelCallback;
    this.deleteCallback = this.context.deleteCallback;
    this.editCallback = this.context.editCallback;
    this.saveCallback = this.context.saveCallback;
  }

   assignmentsColumns = ["status","budget","elapsed",
    {
        field: "date", 
        title: "date",
        formatter: function (value, row, index) {
        return value ? moment(value).format("DD-MMM-YYYY") : "-";
    }}, 
    "remark"];

     __dateFormatter = function (value, row, index) {
    return value ? moment(value).format("DD-MMM-YYYY") : "-";
    }

    assignmentLoader = (info) => {
    var fields = this.assignmentsColumns.map(col => {
      if (typeof col === "string")
        return col;
      else if (typeof col === "object" && col.field)
        return col.field;
    })
    var loopbackFilter = createLoopbackFilterObject(info, fields)

    return Promise
      .all([this.assignmentService.count(loopbackFilter.filter), this.assignmentService.list(loopbackFilter)])
      .then(results => {
        var count = results[0].count;
        var data = results[1];

        this.getEfficiency();
        return {
          total: count,
          data: data
        };
      });
    };

  @computedFrom("data.id")
  get isEdit() {
    return (this.data.id || '').toString() !== '';
  }
} 
