import {bindable} from 'aurelia-framework'

export class CstButton {
    @bindable buttons;
    @bindable data = {};

    goButton(btn) {
        if(typeof btn.action === 'function'){
            btn.action(this.data);
        }
    }
}