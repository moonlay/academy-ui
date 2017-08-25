
import {bindable, bindingMode} from 'aurelia-framework';
import moment from 'moment';
export class BoxHeader {
    @bindable title ="";
    @bindable deadline ="";
    @bindable icon;

    get convertDate() {
        return this.deadline ? moment(this.deadline).format('DD-MMM-YYYY') : "-";
    }
}