import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { compress } from 'brotli';
import { describe, it } from 'mocha';
import solc from 'solc';
import Web3 from '@artela/web3';
import { keccak256 } from '@ethersproject/keccak256';
import { AspectVersionAction } from '../actions/AspectVersionAction.js';
import { BindAspectAction } from '../actions/BindAspectAction.js';
import { CallContractAction } from '../actions/CallContractAction.js';
import { ChangeVersionAction } from '../actions/ChangeVersionAction.js';
import { CreateAccountsAction } from '../actions/CreateAccountsAction.js';
import { DeployAspectAction } from '../actions/DeployAspectAction.js';
import { DeployContractAction } from '../actions/DeployContractAction.js';
import { QueryAspectBindingsAction } from '../actions/QueryAspectBindingsAction.js';
import { QueryContractBindingsAction } from '../actions/QueryContractBindingsAction.js';
import { UnbindAspectAction } from '../actions/UnbindAspectAction.js';
import { UpgradeAspectAction } from '../actions/UpgradeAspectAction.js';
import { BindMultiAspectsAction } from '../actions/BindMultiAspectsAction.js';
import { DeployMultiAspectsAction } from '../actions/DeployMultiAspectsAction.js';
import { CallOperationAction } from '../actions/CallOperationAction.js';
import { QueryBasicAction } from '../actions/QueryBasicAction.js';
import { TransferAction } from '../actions/TransferAction.js';
import { GetSessionKeyCallDataAction } from '../actions/GetSessionKeyCallDataAction.js';
import { DeployMultiContractsAction } from '../actions/DeployMultiContractsAction.js';
import { BindMultiContractsAction } from '../actions/BindMultiContractsAction.js';

const listeners = process.listeners('unhandledRejection');
process.removeListener('unhandledRejection', listeners[listeners.length - 1]);

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

// Recursively look up until you find a directory that contains package.json
const findRootDirectory = dir => {
  if (fs.existsSync(path.join(dir, 'package.json'))) {
    return dir;
  }

  // If the root directory of the file system has been reached, the search is stopped
  const parentDir = path.resolve(dir, '..');
  if (parentDir === dir) {
    throw new Error('the root of the project could not be found');
  }

  // keep looking up
  return findRootDirectory(parentDir);
};

export class TestManager {
  constructor() {
    this.rootDir = findRootDirectory(__dirname);
    this.testCaseDir = path.join(this.rootDir, 'tests/testcases');
    this.aspectPath = path.join(this.rootDir, 'aspect');
    this.contractPath = path.join(this.rootDir, 'contracts');
    this.configPath = path.join(this.rootDir, 'project.config.json');
    this.privateKeyPath = path.join(this.rootDir, 'privateKey.txt');
    this.sourcesPath = path.join(this.rootDir, 'tests/testcases/sources.json');

    this.web3 = this.connectToNode();
    this.account = this.addAccount(this.web3, this.readPrivateKey());
    this.actionRegistry = {};
    this.context = {};
    this.ARTELA_ADDRESS = '0x0000000000000000000000000000000000A27E14';

    // Register all action handlers
    this.registerAction('deployAspect', DeployAspectAction);
    this.registerAction('deployContract', DeployContractAction);
    this.registerAction('upgradeAspect', UpgradeAspectAction);
    this.registerAction('bind', BindAspectAction);
    this.registerAction('unbind', UnbindAspectAction);
    this.registerAction('queryContractBindings', QueryContractBindingsAction);
    this.registerAction('queryAspectBindings', QueryAspectBindingsAction);
    this.registerAction('callContract', CallContractAction);
    this.registerAction('aspectVersion', AspectVersionAction);
    this.registerAction('createAccounts', CreateAccountsAction);
    this.registerAction('changeVersion', ChangeVersionAction);
    this.registerAction('bindMultiAspects', BindMultiAspectsAction);
    this.registerAction('deployMultiAspects', DeployMultiAspectsAction);
    this.registerAction('callOperation', CallOperationAction);
    this.registerAction('queryBasic', QueryBasicAction);
    this.registerAction('transfer', TransferAction);
    this.registerAction("getSessionKeyCallData", GetSessionKeyCallDataAction);
    this.registerAction('deployMultiContracts', DeployMultiContractsAction);
    this.registerAction('bindMultiContracts', BindMultiContractsAction);
  }

  async compileAspect(source) {
    console.log(`⤷ 🔨 Compiling aspect ${source.name}...`);

    const results = {};
    const memoryFS = {
      writeFile(filename, contents, baseDir) {
        results[filename] = contents;
      },
    };

    const entryFile = path.join(this.aspectPath, source.src);
    const compileArgs = [
      entryFile,
      '--lib',
      path.join(this.rootDir, 'node_modules'),
      '--outFile',
      'output.wasm',
    ];

    if (source.compileOptions.args) {
      compileArgs.push(...source.compileOptions.args);
    } else {
      // default compile options
      compileArgs.push(
        "--disable",
        "bulk-memory",
        "--runtime",
        "stub",
        "--exportRuntime",
        "--exportStart",
        "__aspect_start__",
        "-O3",
        "--noAssert"
      );
    }

    // console.log(`🔨 Compiling aspect ${source.name} with args:`, compileArgs);

    const nullWriteStream = {
      write: () => { },
    };

    const asc = await import('assemblyscript/asc');
    await asc
      .main(compileArgs, {
        writeFile: memoryFS.writeFile,
        stdout: nullWriteStream,
        stderr: nullWriteStream,
      })
      .then(() => {
        const wasmBinary = results['output.wasm'];

        if (source.compileOptions.compress) {
          console.log('  ⤷ 📦 Applying bytecode compression...');

          // compress with brotli
          const compressedData = compress(wasmBinary, {
            mode: 0, // Generic mode
            quality: 11, // Highest quality compression
            lgwin: 22, // Default window size
          });

          // calculate checksum
          const checkSum = keccak256(compressedData).slice(2, 10);
          const checkSumBuffer = Buffer.from(checkSum, 'hex');

          // create header
          const header = Buffer.from([0x00, 0x00, 0x00, 0x01]);

          // build the final bytes
          const outputData = Buffer.concat([header, checkSumBuffer, compressedData]);
          source.bytecode = '0x' + outputData.toString('hex');
        } else {
          source.bytecode = '0x' + Buffer.from(wasmBinary).toString('hex');
        }

        fs.writeFileSync(source.name + '.wasm', wasmBinary);

        console.log('  ⤷ ✅ Compilation succeeded!');
      })
      .catch(err => {
        if (err) {
          console.error('  ⤷ ❌ Compilation failed:', err);
          return;
        }
      });
  }

  compileContract(source) {
    console.log(`⤷ 🔨 Compiling contract ${source.name}...`);
    const filePath = path.join(this.contractPath, source.src);
    const sourceFile = fs.readFileSync(filePath, 'utf8');

    const input = {
      language: 'Solidity',
      sources: {
        'contract.sol': {
          content: sourceFile,
        },
      },
      settings: {
        outputSelection: {
          '*': {
            '*': ['abi', 'evm.bytecode.object'],
          },
        },
      },
    };

    const output = JSON.parse(solc.compile(JSON.stringify(input)));

    if (output.errors) {
      output.errors.forEach(err => {
        console.error(err.formattedMessage);
      });
    }

    for (const contractName in output.contracts['contract.sol']) {
      if (contractName === source.contractName) {
        source.bytecode = output.contracts['contract.sol'][contractName].evm.bytecode.object;
        source.abi = output.contracts['contract.sol'][contractName].abi;
      }
    }

    console.log(`  ⤷ ✅ Contract ${source.name} compiled successfully!`);
  }

  connectToNode() {
    let nodeUrl;
    if (this.configPath.startsWith('http')) {
      nodeUrl = this.configPath;
    } else {
      const config = JSON.parse(fs.readFileSync(this.configPath, 'utf-8'));
      nodeUrl = config.node;
    }

    if (!nodeUrl) {
      throw new Error('Node URL cannot be empty. Please provide a valid configuration.');
    }
    return new Web3(nodeUrl);
  }

  readPrivateKey() {
    return fs.readFileSync(this.privateKeyPath, 'utf-8').trim();
  }

  addAccount(web3, privateKey) {
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(account);
    return account;
  }

  async loadSources() {
    console.log('🚗 Initializing sources...');
    const sources = JSON.parse(fs.readFileSync(this.sourcesPath, 'utf-8'));

    for (const source of sources) {
      if (source.type === 'aspect') {
        await this.compileAspect(source);
      } else if (source.type === 'contract') {
        this.compileContract(source);
      } else {
        throw new Error(`Unsupported source type ${source.type}`);
      }
    }

    this.sources = sources;
    console.log('✅ All sources loaded');
  }

  getSource(name) {
    return this.sources.find(src => src.name === name);
  }

  async getGasPrice() {
    return await this.web3.eth.getGasPrice();
  }

  replaceNestedVariables(str, context, trimPrefix = '') {
    if (str && str.trim() != "") {
      const regex = /\$[a-zA-Z0-9_]+/g;
      const data = str.replace(regex, (match) => {
        const key = match.slice(1);
        const value = this.replaceVariables(
          '$' + key,
          context,
        );
        if (trimPrefix && trimPrefix != '' && value.startsWith(trimPrefix)) {
          return value.slice(trimPrefix.length);
        }
        return value;
      });
      return data;
    }
  }

  replaceVariables(obj, context) {
    if (typeof obj === 'string') {
      if (obj.startsWith('$')) {
        const variableName = obj.substring(1);
        const parts = variableName.split('.');
        let value = context;
        parts.forEach(part => {
          value = value[part];
          if (value === undefined) {
            throw new Error(`Variable ${variableName} not found in context`);
          }
        });
        return value;
      } else if (obj.startsWith('#')) {
        const splits = obj.substring(1).split('.');
        const sourceName = splits[0];
        const property = splits[1];
        const source = this.getSource(sourceName);
        if (!source) {
          throw new Error(`Source ${sourceName} not found`);
        }

        return source[property];
      }
    } else if (Array.isArray(obj)) {
      const testManager = this;
      return obj.map(item => testManager.replaceVariables(item, context));
    } else if (typeof obj === 'object') {
      for (const key in obj) {
        obj[key] = this.replaceVariables(obj[key], context);
      }
    }
    return obj;
  }

  registerAction(actionType, actionClass) {
    this.actionRegistry[actionType] = actionClass;
  }

  getAction(actionType) {
    return this.actionRegistry[actionType];
  }

  storeAccounts(accounts) {
    accounts.forEach(account => {
      this.web3.eth.accounts.wallet.add(account);
    });
  }

  async executeAction(action, context) {
    const ActionClass = this.getAction(action.type);
    if (!ActionClass) {
      throw new Error(`No action registered for type: ${action.type}`);
    }
    const actionInstance = new ActionClass(action);
    let result, receipt, tx, err;
    try {
      action.repeat = action.repeat || 1;
      for (let i = 0; i < action.repeat; ++i) {
        const res = await actionInstance.execute(this, context);
        result = res.result;
        receipt = res.receipt;
        tx = res.tx;
      }
    } catch (e) {
      err = e;
    }

    if (err) {
      console.error('  ⤷ ❌ Execution error:', err);
    } else {
      console.log('  ⤷ ✅ Execution result:', result);
    }

    actionInstance.validate(result, receipt, tx, err, context, this);

    // Update context
    if (action.output) {
      Object.keys(action.output).forEach(key => {
        const sourcePath = action.output[key].split('.');
        const sourceType = sourcePath.shift();
        const sourceField = sourcePath.join('.');
        let sourceValue;

        if (sourceType === 'result') {
          sourceValue = sourceField
            ? sourceField.split('.').reduce((obj, part) => obj && obj[part], result)
            : result;
        } else if (sourceType === 'receipt') {
          sourceValue = sourceField
            ? sourceField.split('.').reduce((obj, part) => obj && obj[part], receipt)
            : receipt;
        } else if (sourceType === 'tx') {
          sourceValue = sourceField
            ? sourceField.split('.').reduce((obj, part) => obj && obj[part], tx)
            : tx;
        } else {
          throw new Error(`Unknown source type: ${sourceType}`);
        }

        context[key] = sourceValue;
      });
    }

    return { result, receipt, tx };
  }

  loadTestCases(name) {
    const testCases = [];
    const files = fs.readdirSync(this.testCaseDir);
    const testCaseDir = this.testCaseDir;

    const traverseDir = (dir) => {
      const files = fs.readdirSync(dir);

      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          traverseDir(filePath);
        } else if (file.endsWith('-test.json') && (!name || file.includes(name))) {
          const testCase = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          testCases.push(testCase);
        }
      });
    };

    traverseDir(this.testCaseDir);
    return testCases;
  }

  expectFail(action) {
    const expect = action.expect;
    if (!expect) {
      return false;
    }

    const error = expect.error;
    if (!error) {
      return false;
    }

    for (let k of Object.keys(error)) {
      const condition = error[k];
      return k.startsWith('not') ? !condition : !!condition
    }
  }

  async runTestCases(name) {
    const loadSources = this.loadSources.bind(this);
    const testCases = this.loadTestCases(name);
    const expectFail = this.expectFail;
    const execute = this.executeAction.bind(this); // Ensure executeAction is bound correctly

    describe('⌚️ Start executing test cases', function () {
      this.timeout(1800000);

      before(async function () {
        await loadSources();
      });

      for (const testCase of testCases) {
        it(`👉 ${testCase.description}`, async function () {
          console.log(`👉 Start test case: ${testCase.description}`);
          const context = {};
          for (let i = 0; i < testCase.actions.length; ++i) {
            const action = testCase.actions[i];
            console.log(`⤷ ${expectFail(action) ? '🔴' : '🟢'} Executing step ${i + 1}: ${action.description}`);
            await execute(action, context);
            console.log('');
          }
        });
      }
    });
  }
}
