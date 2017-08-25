import {bindable, inject} from 'aurelia-framework'

@inject(Element)
export class RedSquareCustomAttribute {
    @bindable sideLength;
    @bindable color;

    constructor(element) {
        console.log(element);
        this.element = element;
    }

    sideLengthChanged(newValue, oldValue) {
        this.element.style.width = this.element.style.height = `${newValue}px`;
    }

    colorChanged(newValue, oldValue) {
        this.element.style.backgroundColor = newValue;
    }

    // constructor(element) {
    //     this.element = element;
    //     this.element.style.width = this.element.style.height = '100px';
    // }

    // valueChanged(newValue, oldValue) {
    //     this.element.style.backgroundColor = newValue;
    // }
}