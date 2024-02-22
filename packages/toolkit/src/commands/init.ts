#!/usr/bin/env ts-node --dir ./
import * as fs from 'fs';
import path from 'path';
import { Command, Flags } from '@oclif/core';
import { WasmIndexTmpl } from '../tmpl/aspect/indextmpl';
import { ReadMeTmpl } from '../tmpl/readme';
import { DeployTmpl } from '../tmpl/scripts/aspect-deploy';
import { BindTmpl } from '../tmpl/scripts/bind';
import { ContractCallTmpl } from '../tmpl/scripts/contract-call';
import { ContractDeployTmpl } from '../tmpl/scripts/contract-deploy';
import { ContractSendTmpl } from '../tmpl/scripts/contract-send';
import { CreateAccountTmpl } from '../tmpl/scripts/create-account';
import { BoundAddressesOfTmpl } from '../tmpl/scripts/get-bound-account';
import { AspectsOfTmpl } from '../tmpl/scripts/get-bound-aspect';
import { OperationCallTmpl } from '../tmpl/scripts/operation';
import { UnbindTmpl } from '../tmpl/scripts/unbind';

const isWinOS = /^win/i.test(process.platform);

const toolVersion = '^0.0.58';
const libVersion = '^0.0.34';
const web3Version = '^1.9.22';

export default class Init extends Command {
  static description = 'init aspect project in a directory.';
  static flags = {
    dir: Flags.string({
      char: 'd',
      default: process.cwd(),
    }),
  };

  async run() {
    const { flags } = await this.parse(Init);
    this.ensureAssemblyDirectory(flags.dir);
    this.ensureProjectConfigJson(flags.dir);
    this.ensureTsconfigJson(flags.dir);
    this.ensureScriptDirectory(flags.dir);
    this.ensureContractDirectory(flags.dir);
    this.ensureTestsDirectory(flags.dir);
    this.ensureAsconfigJson(flags.dir);
    this.ensureGitIgnore(flags.dir);
    //package.json
    this.ensurePackageJson(flags.dir);
    //readme.md
    this.ensureReadme(flags.dir);
    this.log('=====Success=====');
  }

  ensureReadme(dir: string) {
    const readmePath = path.join(dir, 'README.md');
    if (!fs.existsSync(readmePath)) {
      fs.writeFileSync(readmePath, ReadMeTmpl);
    }
  }

  warpOsPath(dir: string) {
    if (isWinOS) {
      return dir.replace(/\\/g, '/');
    } else {
      return dir;
    }
  }

  ensureTestsDirectory(dir: string) {
    const projectDir = path.resolve(dir);
    const testDir = path.join(projectDir, 'tests');
    // this.log("- Making sure that the 'tests' directory exists...");
    if (fs.existsSync(testDir)) {
      this.log('  Exists: ' + testDir);
    } else {
      fs.mkdirSync(testDir);
      this.log('  Created: ' + testDir);
    }
  }

  ensureAsconfigJson(dir: string) {
    // this.log("- Making sure that 'asconfig.json' is set up...");
    const projectDir = path.resolve(dir);
    const asconfigFile = path.join(projectDir, 'asconfig.json');

    if (fs.existsSync(asconfigFile)) {
      this.log('  Exists: ' + asconfigFile);
    } else {
      fs.writeFileSync(
        asconfigFile,
        JSON.stringify(
          {
            targets: {
              debug: {
                // -o build/debug.wasm -t build/debug.wat --sourceMap --debug
                outFile: 'build/debug.wasm',
                textFile: 'build/debug.wat',
                sourceMap: true,
                debug: true,
              },
              release: {
                // -o build/release.wasm -t build/release.wat --sourceMap --optimize
                outFile: 'build/release.wasm',
                textFile: 'build/release.wat',
                sourceMap: true,
                optimizeLevel: 3,
                shrinkLevel: 0,
                converge: false,
                noAssert: false,
              },
            },
            options: {
              bindings: 'esm',
            },
          },
          null,
          2,
        ),
      );
      this.log('  Created: ' + asconfigFile);
    }
  }

  ensureProjectConfigJson(dir: string) {
    //  this.log("- Making sure that 'aspect.config.json' is set up...");
    const projectDir = path.resolve(dir);
    const projectConfig = path.join(projectDir, 'project.config.json');

    if (fs.existsSync(projectConfig)) {
      this.log('  Exists: ' + projectConfig);
    } else {
      fs.writeFileSync(
        projectConfig,
        JSON.stringify(
          {
            node: 'https://betanet-rpc1.artela.network',
          },
          null,
          2,
        ),
      );
      this.log('  Created: ' + projectConfig);
    }
  }

  ensureGitIgnore(rootDir: string) {
    const tsconfigFile = path.join(rootDir, '.gitignore');
    const tsconfigBase = 'node_modules\n' + 'build\n' + '*.txt\n';

    //  this.log("- Making sure that 'tsconfigs.json' is set up...");
    if (fs.existsSync(tsconfigFile)) {
    } else {
      fs.writeFileSync(tsconfigFile, tsconfigBase);
      this.log('  Created: ' + tsconfigFile);
    }
  }

  ensureTsconfigJson(rootDir: string) {
    const tsconfigFile = path.join(rootDir + '/aspect/', 'tsconfig.json');
    const tsconfigBase = 'assemblyscript/std/assembly.json';

    //  this.log("- Making sure that 'tsconfig.json' is set up...");
    if (fs.existsSync(tsconfigFile)) {
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigFile, 'utf8'));
      tsconfig['extends'] = tsconfigBase;
      fs.writeFileSync(tsconfigFile, JSON.stringify(tsconfig, null, 2));
      this.log('  Updated: ' + tsconfigFile);
    } else {
      fs.writeFileSync(
        tsconfigFile,
        JSON.stringify(
          {
            extends: tsconfigBase,
            include: ['./**/*.ts'],
          },
          null,
          2,
        ),
      );
      this.log('  Created: ' + tsconfigFile);
    }
  }

  ensureContractDirectory(dir: string) {
    const projectDir = path.resolve(dir);
    const contractsDir = path.join(projectDir, 'contracts');
    // this.log("- Making sure that the 'contracts' directory exists...");
    if (fs.existsSync(contractsDir)) {
      this.log('  Exists: ' + contractsDir);
    } else {
      fs.mkdirSync(contractsDir);
      this.log('  Created: ' + contractsDir);
    }
  }

  ensureAssemblyDirectory(dir: string) {
    const projectDir = path.resolve(dir);
    const assemblyDir = path.join(projectDir, 'aspect');
    //  this.log("- Making sure that the 'assembly' directory exists...");
    if (fs.existsSync(assemblyDir)) {
      this.log('  Exists: ' + assemblyDir);
    } else {
      fs.mkdirSync(assemblyDir);
      this.log('  Created: ' + assemblyDir);
    }
    const aspectIndexPath = path.join(assemblyDir, 'index.ts');
    if (!fs.existsSync(aspectIndexPath)) {
      fs.writeFileSync(aspectIndexPath, WasmIndexTmpl);
    }
  }

  ensureScriptDirectory(dir: string) {
    const projectDir = path.resolve(dir);
    const scriptDir = path.join(projectDir, 'scripts');
    //  this.log("- Making sure that the 'scripts' directory exists...");
    if (fs.existsSync(scriptDir)) {
      this.log('  Exists: ' + scriptDir);
    } else {
      fs.mkdirSync(scriptDir);
      this.log('  Created: ' + scriptDir);
    }

    const aspectDeploy = path.join(scriptDir, 'aspect-deploy.cjs');
    if (!fs.existsSync(aspectDeploy)) {
      fs.writeFileSync(aspectDeploy, DeployTmpl);
    }

    const contractDeploy = path.join(scriptDir, 'contract-deploy.cjs');
    if (!fs.existsSync(contractDeploy)) {
      fs.writeFileSync(contractDeploy, ContractDeployTmpl);
    }

    const bindPath = path.join(scriptDir, 'bind.cjs');
    if (!fs.existsSync(bindPath)) {
      fs.writeFileSync(bindPath, BindTmpl);
    }

    const callPath = path.join(scriptDir, 'contract-call.cjs');
    if (!fs.existsSync(callPath)) {
      fs.writeFileSync(callPath, ContractCallTmpl);
    }
    const contractSend = path.join(scriptDir, 'contract-send.cjs');
    if (!fs.existsSync(contractSend)) {
      fs.writeFileSync(contractSend, ContractSendTmpl);
    }
    const createAccount = path.join(scriptDir, 'create-account.cjs');
    if (!fs.existsSync(createAccount)) {
      fs.writeFileSync(createAccount, CreateAccountTmpl);
    }
    const getBoundAccount = path.join(scriptDir, 'get-bound-account.cjs');
    if (!fs.existsSync(getBoundAccount)) {
      fs.writeFileSync(getBoundAccount, BoundAddressesOfTmpl);
    }
    const getAspect = path.join(scriptDir, 'get-bound-aspect.cjs');
    if (!fs.existsSync(getAspect)) {
      fs.writeFileSync(getAspect, AspectsOfTmpl);
    }
    const operation = path.join(scriptDir, 'operation.cjs');
    if (!fs.existsSync(operation)) {
      fs.writeFileSync(operation, OperationCallTmpl);
    }
    const unbind = path.join(scriptDir, 'unbind.cjs');
    if (!fs.existsSync(unbind)) {
      fs.writeFileSync(unbind, UnbindTmpl);
    }
  }

  ensurePackageJson(dir: string) {
    const packageFile = path.join(dir, 'package.json');

    if (fs.existsSync(packageFile)) {
      const pkgFile = fs.readFileSync(packageFile, 'utf-8');
      const pkg = JSON.parse(pkgFile);

      const scripts = pkg.scripts || {};
      let updated = false;
      if (!pkg['type']) {
        pkg['type'] = 'module';
        updated = true;
      }
      pkg['exports'] ||= {
        '.': {
          import: './build/release.js',
          types: './build/release.d.ts',
        },
      };

      if (!scripts['aspect:build']) {
        scripts['asbuild:debug'] = 'asc aspect/index.ts --target debug';
        scripts['asbuild:release'] = 'asc aspect/index.ts --target release';
        scripts['aspect:build'] = 'npm run asbuild:debug && npm run asbuild:release';
        pkg['scripts'] = scripts;
        updated = true;
      }
      const npmDefaultTest = 'echo "Error: no test specified" && exit 1';
      if (!scripts['test'] || scripts['test'] == npmDefaultTest) {
        scripts['test'] = 'node tests';
        pkg['scripts'] = scripts;
        updated = true;
      }

      if (!scripts['contract:bind']) {
        scripts['contract:bind'] = 'node scripts/bind.cjs';
        pkg['scripts'] = scripts;
        updated = true;
      }
      if (!scripts['contract:unbind']) {
        scripts['contract:unbind'] = 'node scripts/unbind.cjs';
        pkg['scripts'] = scripts;
        updated = true;
      }
      if (!scripts['operation:call']) {
        scripts['operation:call'] = 'node scripts/operation.cjs --isCall true';
        pkg['scripts'] = scripts;
        updated = true;
      }
      if (!scripts['operation:send']) {
        scripts['operation:send'] = 'node scripts/operation.cjs --isCall false';
        pkg['scripts'] = scripts;
        updated = true;
      }
      if (!scripts['bound:aspect']) {
        scripts['bound:aspect'] = 'node scripts/get-bound-aspect.cjs';
        pkg['scripts'] = scripts;
        updated = true;
      }
      if (!scripts['bound:account']) {
        scripts['bound:account'] = 'node scripts/get-bound-account.cjs';
        pkg['scripts'] = scripts;
        updated = true;
      }

      if (!scripts['contract:deploy']) {
        scripts['contract:deploy'] = 'node scripts/contract-deploy.cjs';
        pkg['scripts'] = scripts;
        updated = true;
      }
      if (!scripts['contract:call']) {
        scripts['contract:call'] = 'node scripts/contract-call.cjs';
        pkg['scripts'] = scripts;
        updated = true;
      }
      if (!scripts['contract:send']) {
        scripts['contract:send'] = 'node scripts/contract-send.cjs';
        pkg['scripts'] = scripts;
        updated = true;
      }
      if (!scripts['account:create']) {
        scripts['account:create'] = 'node scripts/create-account.cjs';
        pkg['scripts'] = scripts;
        updated = true;
      }

      if (!scripts['aspect:deploy']) {
        scripts['aspect:deploy'] = 'npm run aspect:build && node scripts/aspect-deploy.cjs';
        pkg['scripts'] = scripts;
        updated = true;
      }
      if (!scripts['contract:build']) {
        let cmd =
          'solc -o ./build/contract/ --abi --storage-layout --bin ./contracts/*.sol  --overwrite';
        if (isWinOS) {
          cmd =
            'for %f in (./contracts/*.sol) do solc -o ./build/contract --via-ir --abi --storage-layout --bin ./contracts/%f --overwrite';
        }
        scripts['contract:build'] = cmd;
        pkg['scripts'] = scripts;
        updated = true;
      }

      if (!scripts['build']) {
        scripts['build'] = 'npm run contract:build && npm run aspect:build';
        pkg['scripts'] = scripts;
        updated = true;
      }
      if (!scripts['aspect:gen']) {
        scripts['aspect:gen'] = 'aspect-tool generate -i ./build/contract -o ./aspect';
        pkg['scripts'] = scripts;
        updated = true;
      }

      const devDependencies = pkg['devDependencies'] || {};
      if (!devDependencies['assemblyscript']) {
        devDependencies['assemblyscript'] = '^0.27.23';
        pkg['devDependencies'] = devDependencies;
        updated = true;
      }
      if (!devDependencies['as-proto-gen']) {
        devDependencies['as-proto-gen'] = '^1.3.0';
        pkg['devDependencies'] = devDependencies;
        updated = true;
      }
      if (!devDependencies['@artela/aspect-tool']) {
        devDependencies['@artela/aspect-tool'] = toolVersion;
        pkg['devDependencies'] = devDependencies;
        updated = true;
      }
      if (!devDependencies['yargs']) {
        devDependencies['yargs'] = '^17.7.2';
        pkg['devDependencies'] = devDependencies;
        updated = true;
      }
      const dependencies = pkg['dependencies'] || {};
      if (!dependencies['@artela/aspect-libs']) {
        dependencies['@artela/aspect-libs'] = libVersion;
        pkg['dependencies'] = dependencies;
        updated = true;
      }
      if (!dependencies['@artela/web3']) {
        dependencies['@artela/web3'] = web3Version;
        pkg['dependencies'] = dependencies;
        updated = true;
      }
      if (!dependencies['@assemblyscript/loader']) {
        dependencies['@assemblyscript/loader'] = '^0.27.5';
        pkg['dependencies'] = dependencies;
        updated = true;
      }
      if (!dependencies['as-proto']) {
        dependencies['as-proto'] = '^1.3.0';
        pkg['dependencies'] = dependencies;
        updated = true;
      }

      if (updated) {
        fs.writeFileSync(packageFile, JSON.stringify(pkg, null, 2));
        this.log('  Updated: ' + packageFile);
      } else {
        this.log('  Exists: ' + packageFile);
      }
    } else {
      let buildCmd =
        'solc -o ./build/contract/ --abi --storage-layout --bin ./contracts/*.sol  --overwrite';
      if (isWinOS) {
        buildCmd =
          'for %f in (./contracts/*.sol) do solc -o ./build/contract --via-ir --abi --storage-layout --bin ./contracts/%f --overwrite';
      }
      fs.writeFileSync(
        packageFile,
        JSON.stringify(
          {
            version: '1.0.0',
            main: 'index.js',
            scripts: {
              'account:create': 'node scripts/create-account.cjs',
              'contract:send': 'node scripts/contract-send.cjs',
              'contract:call': 'node scripts/contract-call.cjs',
              'aspect:deploy': 'npm run aspect:build && node scripts/aspect-deploy.cjs',
              'aspect:build': 'npm run asbuild:debug && npm run asbuild:release',
              'aspect:gen': 'aspect-tool generate -i ./build/contract -o ./aspect/contract',
              'asbuild:debug': 'asc aspect/index.ts --target debug',
              'asbuild:release': 'asc aspect/index.ts --target release',
              'operation:call': 'node scripts/operation.cjs --isCall true',
              'operation:send': 'node scripts/operation.cjs --isCall false',
              'bound:aspect': 'node scripts/get-bound-aspect.cjs',
              'bound:account': 'node scripts/get-bound-account.cjs',
              'contract:bind': 'node scripts/bind.cjs',
              'contract:unbind': 'node scripts/unbind.cjs',
              'contract:deploy': 'node scripts/contract-deploy.cjs',
              'contract:build': buildCmd,
              build: 'npm run contract:build && npm run aspect:gen && npm run aspect:build',
            },
            keywords: [],
            author: '',
            license: 'ISC',
            dependencies: {
              '@artela/aspect-libs': libVersion,
              '@artela/web3': web3Version,
              '@assemblyscript/loader': '^0.27.23',
              'as-proto': '^1.3.0',
            },
            devDependencies: {
              '@artela/aspect-tool': toolVersion,
              'as-proto-gen': '^1.3.0',
              assemblyscript: '^0.27.23',
              yargs: '^17.7.2',
            },
            type: 'module',
            exports: {
              '.': {
                import: './build/release.js',
                types: './build/release.d.ts',
              },
            },
          },
          null,
          2,
        ),
      );
      this.log('  Created: ' + packageFile);
    }
  }
}
