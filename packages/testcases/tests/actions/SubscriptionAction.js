import { Action } from './Action.js';

export class SubscriptionAction extends Action {
    constructor(action) {
        super(action);
        this.stopped = true;
    }

    async execute(testManager, context) {
        const { contract, abi, method, event, args, gas, loop, duration } = testManager.replaceVariables(this.action.options, context);
        const from = this.getAccount(testManager, context);

        this.stopped = false;
        // (async () => {
        //     await this.sendTxs(testManager, contract, abi, method, args, gas, from);
        // })();
        this.sendTxs(testManager, contract, abi, method, args, gas, from);

        const errors = [];
        const testNewBlockHeaders = await this.subNewBlockHeaders(testManager, duration, loop);
        if (!testNewBlockHeaders) {
            const err = "failed to test subscribe newBlockHeaders;"
            errors.push(err);
        }

        const testPendingTransactions = await this.subPendingTransactions(testManager, duration, loop);
        if (!testPendingTransactions) {
            const err = "failed to test subscribe pendingTransactions;"
            errors.push(err);
        }

        const testLogs = await this.subLogs(testManager, duration, loop, contract);
        if (!testLogs) {
            const err = "failed to test subscribe logs;"
            errors.push(err);
        }

        const testContractEvents = await this.subContractEvents(testManager, duration, loop, contract, abi, event);
        if (!testContractEvents) {
            const err = "failed to test subscribe contract events;"
            errors.push(err);
        }

        // syncing is not implemented
        // const testSyncing = await this.subSyncing();
        // if (!testContractEvents) {
        //     err = "failed to test subscribe syncing;"
        //     ret.push(err);
        // }
        this.stopped = true;

        return { result: { errors }, receipt: null, tx: null };
    }

    async sendTxs(testManager, contract, abi, method, args, gas, from) {
        // Get contract ABI
        const instance = new testManager.web3.eth.Contract(abi, contract);
        const data = instance.methods[method](...args).encodeABI()

        for (; !this.stopped;) {
            const tx = {
                gas,
                from,
                to: contract,
                data: data
            };

            await this.estimateGas(tx, testManager, context);
            const { signedTx, receipt } = await this.sendTransaction(tx, testManager);
            if (!receipt || !receipt.status) {
                console.log("sending tx failed", receipt)
                throw new Error("failed to send tx", signedTx.transactionHash)
            }
        }
    }

    async subNewBlockHeaders(testManager, duration, loop) {
        for (let i = 0; i < loop; i++) {
            let passed = false;
            console.log('subscribe newBlockHeaders', i);
            const subscription = testManager.ws.eth.subscribe('newBlockHeaders', (error, blockHeader) => {
                if (!error) {
                    console.log('New Block Received:', blockHeader.number);
                    passed = true;
                } else {
                    console.error('Error:', error);
                    throw error;
                }
            });

            await new Promise(r => setTimeout(r, duration));

            subscription.unsubscribe((error, success) => {
                if (success) {
                    console.log('unsubscribed from newBlockHeaders', i, "!\n");
                } else {
                    console.error('Unsubscribe newBlockHeaders error:', error);
                    throw error;
                }
            });

            if (!passed) {
                return false;
            }
        }
        return true;
    }

    async subPendingTransactions(testManager, duration, loop) {
        for (let i = 0; i < loop; i++) {
            let passed = false;
            console.log('subscribe pendingTransactions', i);
            const subscription = testManager.ws.eth.subscribe('pendingTransactions', (error, transactionHash) => {
                if (!error) {
                    passed = true;
                    console.log('Pending Transaction:', transactionHash);
                } else {
                    console.error('Error:', error);
                }
            });

            await new Promise(r => setTimeout(r, duration));

            subscription.unsubscribe((error, success) => {
                if (success) {
                    console.log('unsubscribed from pendingTransactions', i, "!\n");
                } else {
                    console.error('Unsubscribe pendingTransactions error:', error);
                    throw error;
                }
            });

            if (!passed) {
                return false;
            }
        }
        return true;
    }

    async subLogs(testManager, duration, loop, contractAddress) {
        for (let i = 0; i < loop; i++) {
            let passed = false;
            console.log('subscribe logs');
            const subscription = testManager.ws.eth.subscribe('logs', {
                address: contractAddress
            }, (error, log) => {
                if (!error) {
                    passed = true;
                    console.log('Log received:', log.id);
                } else {
                    console.error('Error:', error);
                }
            });

            await new Promise(r => setTimeout(r, duration));

            subscription.unsubscribe((error, success) => {
                if (success) {
                    console.log('unsubscribed from logs!', i, "\n");
                } else {
                    console.error('Unsubscribe logs error:', error);
                    throw error;
                }
            });

            if (!passed) {
                return false;
            }
        }
        return true;
    }

    async subContractEvents(testManager, duration, loop, contractAddress, abi, event) {
        const contract = new testManager.ws.eth.Contract(abi, contractAddress);

        for (let i = 0; i < loop; i++) {
            let passed = false;
            console.log('subscribe specified contact event', i);
            const subscription = contract.events[event]({
                filter: { /* otpion: filter option */ },
                fromBlock: 'latest'
            }, (error, event) => {
                if (!error) {
                    passed = true;
                    console.log('Event received:', event.id);
                } else {
                    console.error('Error:', error);
                }
            });

            await new Promise(r => setTimeout(r, duration));

            subscription.unsubscribe((error, success) => {
                if (success) {
                    console.log('unsubscribed specified contact event', i, '!\n');
                } else {
                    console.error('Unsubscribe specified contact event error:', error);
                    throw error;
                }
            });

            if (!passed) {
                return false;
            }
        }
        return true;
    }

    async subSyncing(testManager, duration, loop) {
        for (let i = 0; i < loop; i++) {
            let passed = false;
            console.log('subscribe syncing', i);
            const subscription = testManager.ws.eth.subscribe('syncing', (error, syncStatus) => {
                if (!error) {
                    if (syncStatus) {
                        console.log('Node is syncing:', syncStatus);
                    } else {
                        console.log('Node is synced and not syncing.');
                    }
                } else {
                    console.error('Error:', error);
                }
            });

            await new Promise(r => setTimeout(r, duration));

            subscription.unsubscribe((error, success) => {
                if (success) {
                    console.log('unsubscribed from syncing', i, '!\n');
                } else {
                    console.error('Unsubscribe syncing error:', error);
                    throw error;
                }
            });

            if (!passed) {
                return false;
            }
        }
        return true;
    }
}