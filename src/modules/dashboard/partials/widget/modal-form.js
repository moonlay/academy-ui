import { bindable, bindingMode, noView, inject, computedFrom, customElement, containerless } from "aurelia-framework";

export class ModalForm {

	@bindable({ defaultBindingMode: bindingMode.twoWay }) title;
	@bindable options;



	onCancel() {
		$(".modal").modal('hide');
	}

	defaultOptions = {
    builtInActions: true,
    saveText: "Save",
    deleteText: "Delete",
	}
	
	bind(context) {
    this.context = context;
    this.options = this.options || {};
    this.__currentOptions = Object.assign({}, this.defaultOptions, this.options);
	}

	ondelete(event) {
    if (this.__currentOptions.builtInActions && this.hasDelete) {
      var args = { event: event };
      var callback = this.context.deleteCallback;
      callback = callback.bind(this.context);
      callback(args);
    }
	}
	
	onsave(event) {
    if (this.__currentOptions.builtInActions && this.hasSave) {
      var args = { event: event };
      var callback = this.context.saveCallback;
      callback = callback.bind(this.context);
      callback(args);
    }
  }
}


