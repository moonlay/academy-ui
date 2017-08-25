import {bindable, bindingMode} from 'aurelia-framework';

export class DueTask {
    @bindable ({defaulBindingMode: bindingMode.twoWay}) datas;
    @bindable icon;
    @bindable buttons;

    progressComplete = "progress-bar progress-bar-green progress-bar-striped";
    progressPrimary = "progress-bar progress-bar-primary progress-bar-striped";
}