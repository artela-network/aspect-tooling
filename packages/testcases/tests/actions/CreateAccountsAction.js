import { Action } from './Action.js';

export class CreateAccountsAction extends Action {
  async execute(testManager, context) {
    const { fundingAmount, accountNumber } = testManager.replaceVariables(
      this.action.options,
      context,
    );
    const accounts = [];

    const from = this.getAccount(testManager, context);

    for (let i = 0; i < accountNumber; i++) {
      const account = testManager.web3.eth.accounts.create();

      accounts.push(account);

      const fundAmount = Array.isArray(fundingAmount) ? fundingAmount[i] : fundingAmount;
      const tx = {
        from,
        to: account.address,
        value: testManager.web3.utils.toWei(fundAmount.toString(), 'ether'),
        gas: '21000',
      };

      await this.estimateGas(tx, testManager, context);
      await this.sendTransaction(tx, testManager, context);
    }

    testManager.storeAccounts(accounts);

    return { result: { accounts: accounts.map(acc => acc.address) } };
  }
}
