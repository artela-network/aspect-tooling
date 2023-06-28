export class Opts {
  value: u64;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  broker: string;

  constructor(
    value: u64 = 0,
    maxFeePerGas: string = '',
    maxPriorityFeePerGas: string = '',
    broker: string = '',
  ) {
    this.value = value;
    this.maxFeePerGas = maxFeePerGas;
    this.maxPriorityFeePerGas = maxPriorityFeePerGas;
    this.broker = broker;
  }
}
