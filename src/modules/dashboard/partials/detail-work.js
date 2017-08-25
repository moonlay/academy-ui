import {bindable, bindingMode} from 'aurelia-framework'

export class DetailWork {
    @bindable({ defaulBindingMode: bindingMode.twoWay }) completeWork;
    @bindable({ defaulBindingMode: bindingMode.twoWay }) progressWork;
    @bindable icon;
    @bindable buttons;
    @bindable title;
    @bindable footerButton;

}