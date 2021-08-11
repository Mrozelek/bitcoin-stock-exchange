export class NotEnoughFundsError extends Error {
  constructor() {
    super('User do not have enough funds');
    this.name = this.constructor.name;
  }
}
