import {inject} from 'aurelia-framework';
import $ from 'jquery';

@inject(Element)
export class Modal {
  constructor (element) {
    this.element = element;
    // console.log("this.element");
    // console.log(this.element);
  }  
  attached(){
    $(this.element).find('.modal').modal();
  }
}