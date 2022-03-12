import { observable, action } from 'mobx';
import { getMessages } from 'api';
import { PushNotificationsStore } from 'stores';

export default class {
  constructor() {
    this.fetchMessages();
  }

  @observable
  messages;

  @action
  fetchMessages = () => {
    getMessages(PushNotificationsStore.deviceToken)
      .then((response) => { 
        this.messages = response.data; 
        PushNotificationsStore.setMessagesCounter(0);
      });
  }
}
