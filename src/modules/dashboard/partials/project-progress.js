import { bindable, bindingMode } from 'aurelia-framework';

export class ProjectProgress {
    @bindable({ defaulBindingMode: bindingMode.twoWay }) datas;
    @bindable icon;
    @bindable buttons;
    @bindable footerButton;

    progressComplete = "progress-bar progress-bar-green progress-bar-striped";
    progressPrimary = "progress-bar progress-bar-primary progress-bar-striped";



}