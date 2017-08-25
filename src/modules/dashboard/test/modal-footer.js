import {bindable} from 'aurelia-framework';

export class ModalFooter {  
  @bindable buttons = [];
  constructor () {
    this.buttons = ['asdfsa', 'asdfaf']
  }
}