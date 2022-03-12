import { observable, action, computed } from 'mobx';
import { sendContactForm } from 'api';

export default class {

  @observable
  email;

  @observable
  message = '';

  @observable
  emailValidation;

  @action
  setEmail = email => {
    this.email = email;
  }

  @action
  setMessage = message => {
    this.message = message;
  }

  @action
  contactSupport = () => {
    return sendContactForm(this.email, this.message);
  }
  
  @action
  validateEmail = () => {
    this.emailValidation = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
  }

  @computed
  get disabledButton() {
    return (
      !this.email ||
      this.email === '' ||
      !this.message ||
      this.message === '' ||
      !this.message.trim());
  }

  get validateMessage() {
    return this.message.trim().length > 5;
  }
}
