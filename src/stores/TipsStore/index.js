import { observable, action } from 'mobx';

export default class TipsStore {
  @observable
  firstPageTip = 1;

  @observable
  secondPageTip = 1;

  @action
  setFirstPageTip = (firstPageTip) => {
    this.firstPageTip = firstPageTip;
  }

  @action
  setSecondPageTip = (secondPageTip) => {
    this.secondPageTip = secondPageTip;
  }
}
