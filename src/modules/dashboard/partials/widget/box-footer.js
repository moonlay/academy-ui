import {bindable} from 'aurelia-framework';
export class BoxFooter {
    @bindable clickCustom;
    @bindable id;
    @bindable title;

    onClick() {
        if(typeof this.clickCustom === 'function') {
            this.clickCustom(this.id);
        }
    }
}