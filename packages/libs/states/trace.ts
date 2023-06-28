export class State<T> {
  constructor(account: string, change: T) {
    this.account = account;
    this.change = change;
  }
  account: string;
  change: T;
}
