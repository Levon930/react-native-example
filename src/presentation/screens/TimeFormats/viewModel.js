import { observable, action } from 'mobx';
import { AllRoutesStore } from '../../../stores';

export default class {
  @observable
  activeFormat;

  constructor() {
    this.getCurrentFormat();
  }

  @action
  getCurrentFormat() {
    this.activeFormat = AllRoutesStore.getRoutesDateFormat();
  }

  @action
  setFormat(format) {
    this.activeFormat = format;
    AllRoutesStore.setRoutesDateFormat(format);
  }
}
