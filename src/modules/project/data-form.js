import { bindable, containerless, computedFrom } from "aurelia-framework";

@containerless()
export class DataForm {
  @bindable title;
  @bindable readOnly;

  bind(context) {
    this.context = context;
    this.data = this.context.data;
    this.error = this.context.error;

    this.cancelCallback = this.context.cancelCallback;
    this.deleteCallback = this.context.deleteCallback;
    this.editCallback   = this.context.editCallback;
    this.saveCallback   = this.context.saveCallback;
  }

  @computedFrom("data.id")
  get isEdit() {
    return (this.data.id || '').toString() !== '';
  }
}
