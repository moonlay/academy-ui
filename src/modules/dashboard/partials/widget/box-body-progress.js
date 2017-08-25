
import {bindable, bindingMode} from 'aurelia-framework';
import moment from 'moment';
export class BoxBodyProgress {
    @bindable completeWork;
    @bindable progressWork;
    @bindable title;
    @bindable footerButton;

    onClick(id) {
        if(typeof this.footerButton.action === 'function') {
            this.footerButton.action(id);
        }
    }

    convertDate(value) {
        return value ? moment(value).format('DD-MMM-YYYY') : "-";
    }
}