import {bindable, bindingMode } from 'aurelia-framework'

export class Pilihan {
    @bindable ({defaultBindingMode: bindingMode.twoWay}) selectedBangunRuang;
    kotaks = ["kotak","lingkaran", "collapse", "chart"];

}