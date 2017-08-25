import {bindable} from 'aurelia-framework';

export class ModalHeader {
  times = new Date();
  @bindable title = '';
}