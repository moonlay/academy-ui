import {bindable, bindingMode, decorators} from 'aurelia-framework';

export class SecretMessage {
    @bindable({ defaultBindingMode: bindingMode.twoWay}) message;
    @bindable allowDestruction = false;
    waktu = 1000;
    waktu2 = 0;
    constructor () {
        console.log("hello");
        setInterval(() => this.deleteMessage(), this.waktu);
    }

    deleteMessage() {
        this.waktu2 += 1;
        console.log(this.waktu2);
        if(this.allowDestruction === true) {
            this.message = '';
        }
    }
}