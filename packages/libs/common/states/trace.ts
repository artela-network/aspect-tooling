export class State<T> {
  constructor(account: string, value: T) {
    this.account = account;
    this.value = value;
  }
  account: string;
  value: T;
}