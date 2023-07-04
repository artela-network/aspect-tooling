#!/usr/bin/env ts-node --dir ./


import {Command, Flags} from "@oclif/core";

import * as fs from "fs";
import path from "path";
import {AttackSolTmpl} from "../tmpl/contracts/attack";
import {HoneyPotSolTmpl} from "../tmpl/contracts/honeypot";
import {HoneyPotStorageTmpl} from "../tmpl/contracts/honeypot_layout";
import {WasmIndexTmpl} from "../tmpl/assembly/indextmpl";
import {AspectTmpl} from "../tmpl/assembly/aspect/aspect";
import {HoneyPotStoreTmpl} from "../tmpl/assembly/aspect/honeypot";
import {DeployTmpl} from "../tmpl/scripts/deploy";
import {ReadMeTmpl} from "../tmpl/readme";


export default class Init extends Command {

    static description = 'init aspect project in a directory.'
    static flags = {
        dir: Flags.string({
            char: 'd',
            default: process.cwd(),
        }),
    }

    async run() {
        const {flags} = await this.parse(Init)
        this.ensureAssemblyDirectory(flags.dir);
        this.ensureScriptDirectory(flags.dir);
        this.ensureContractDirectory(flags.dir);
        this.ensureTestsDirectory(flags.dir);
        this.ensureAsconfigJson(flags.dir)
        //package.json
        this.ensurePackageJson(flags.dir);
        //readme.md
        this.ensureReadme(flags.dir)
    }
    ensureReadme(dir: string) {
        const readmePath = path.join(dir, "README.md");
        if (!fs.existsSync(readmePath)) {
            fs.writeFileSync(readmePath, ReadMeTmpl)
        }
    }

    ensureTestsDirectory(dir: string) {
        const projectDir = path.resolve(dir);
        const testDir = path.join(projectDir, "tests");
        this.log("- Making sure that the 'tests' directory exists...");
        if (fs.existsSync(testDir)) {
            this.log("  Exists: " + testDir);
        } else {
            fs.mkdirSync(testDir);
            this.log("  Created: " + testDir);
        }

    }

    ensureAsconfigJson(dir: string) {
        this.log("- Making sure that 'asconfig.json' is set up...");
        const projectDir = path.resolve(dir);
        const asconfigFile = path.join(projectDir, "asconfig.json");

        if (fs.existsSync(asconfigFile)) {
            this.log("  Exists: " + asconfigFile);
        } else {
            fs.writeFileSync(asconfigFile, JSON.stringify({
                targets: {
                    debug: {
                        // -o build/debug.wasm -t build/debug.wat --sourceMap --debug
                        outFile: "build/debug.wasm",
                        textFile: "build/debug.wat",
                        sourceMap: true,
                        debug: true
                    },
                    release: {
                        // -o build/release.wasm -t build/release.wat --sourceMap --optimize
                        outFile: "build/release.wasm",
                        textFile: "build/release.wat",
                        sourceMap: true,
                        optimizeLevel: 3,
                        shrinkLevel: 0,
                        converge: false,
                        noAssert: false
                    }
                },
                options: {
                    bindings: "esm"
                }
            }, null, 2));
            this.log("  Created: " + asconfigFile);
        }
    }

    ensureTsconfigJson(dir: string, assemblyDir: string) {
        const projectDir = path.resolve(assemblyDir);
        const tsconfigFile = path.join(projectDir, "assembly.json");
        let tsconfigBase = path.relative(projectDir, path.join(dir, "std", "assembly.json"));
        if (/^(\.\.[/\\])*node_modules[/\\]assemblyscript[/\\]/.test(tsconfigBase)) {
            // Use node resolution if the compiler is a normal dependency
            tsconfigBase = "assemblyscript/std/assembly.json";
        }

        const base = tsconfigBase.replace(/\\/g, "/");

        this.log("- Making sure that 'assembly/tsconfig.json' is set up...");
        if (fs.existsSync(tsconfigFile)) {
            const tsconfig = JSON.parse(fs.readFileSync(tsconfigFile, "utf8"));
            tsconfig["extends"] = base;
            fs.writeFileSync(tsconfigFile, JSON.stringify(tsconfig, null, 2));
            this.log("  Updated: " + tsconfigFile);
        } else {
            fs.writeFileSync(tsconfigFile, JSON.stringify({
                "extends": base,
                "include": [
                    "./**/*.ts"
                ]
            }, null, 2));
            this.log("  Created: " + tsconfigFile);
        }
    }

    ensureContractDirectory(dir: string) {
        const projectDir = path.resolve(dir);
        const contractsDir = path.join(projectDir, "contracts");
        this.log("- Making sure that the 'contracts' directory exists...");
        if (fs.existsSync(contractsDir)) {
            this.log("  Exists: " + contractsDir);
        } else {
            fs.mkdirSync(contractsDir);
            this.log("  Created: " + contractsDir);
        }
        const attackPath = path.join(contractsDir, "attack.sol");
        if (!fs.existsSync(attackPath)) {
            fs.writeFileSync(attackPath, AttackSolTmpl)
        }
        const honeypotPath = path.join(contractsDir, "honeypot.sol");
        if (!fs.existsSync(honeypotPath)) {
            fs.writeFileSync(honeypotPath, HoneyPotSolTmpl)
        }
        const honeypotJsonPath = path.join(contractsDir, "honeypot_layout.json");
        if (!fs.existsSync(honeypotJsonPath)) {
            fs.writeFileSync(honeypotJsonPath, HoneyPotStorageTmpl)
        }
    }

    ensureAssemblyDirectory(dir: string) {
        const projectDir = path.resolve(dir);
        const assemblyDir = path.join(projectDir, "assembly");
        this.log("- Making sure that the 'assembly' directory exists...");
        if (fs.existsSync(assemblyDir)) {
            this.log("  Exists: " + assemblyDir);
        } else {
            fs.mkdirSync(assemblyDir);
            this.log("  Created: " + assemblyDir);
        }

        this.ensureTsconfigJson(dir, assemblyDir);
        this.ensureAspectDirectory(assemblyDir);
        const aspectIndexPath = path.join(assemblyDir, "index.ts");
        if (!fs.existsSync(aspectIndexPath)) {
            fs.writeFileSync(aspectIndexPath, WasmIndexTmpl)
        }

    }
    ensureAspectDirectory(dir: string){
        const projectDir = path.resolve(dir);
        const aspectDir = path.join(projectDir, "aspect");

        this.log("- Making sure that the 'aspect' directory exists...");
        if (fs.existsSync(aspectDir)) {
            this.log("  Exists: " + aspectDir);
        } else {
            fs.mkdirSync(aspectDir);
            this.log("  Created: " + aspectDir);
        }

        const aspectPath = path.join(aspectDir, "aspect.ts");
        if (!fs.existsSync(aspectPath)) {
            fs.writeFileSync(aspectPath, AspectTmpl)
        }
        const honeypotPath = path.join(aspectDir, "honeypot.ts");
        if (!fs.existsSync(honeypotPath)) {
            fs.writeFileSync(honeypotPath, HoneyPotStoreTmpl)
        }
    }

    ensureScriptDirectory(dir: string) {
        const projectDir = path.resolve(dir);
        const scriptDir = path.join(projectDir, "scripts");
        this.log("- Making sure that the 'scripts' directory exists...");
        if (fs.existsSync(scriptDir)) {
            this.log("  Exists: " + scriptDir);
        } else {
            fs.mkdirSync(scriptDir);
            this.log("  Created: " + scriptDir);
        }

        const deployPath = path.join(scriptDir, "deploy.cjs");
        if (!fs.existsSync(deployPath)) {
            fs.writeFileSync(deployPath, DeployTmpl)
        }
    }

    ensurePackageJson(dir: string) {

        const packageFile = path.join(dir, "package.json");

        if (fs.existsSync(packageFile)) {
            const pkgFile = fs.readFileSync(packageFile, "utf-8")
            const pkg = JSON.parse(pkgFile);

            const scripts = pkg.scripts || {};
            let updated = false;
            if (!pkg["type"]) {
                pkg["type"] = "module";
                updated = true;
            }
            pkg["exports"] ||= {
                ".": {
                    "import": "./build/release.js",
                    "types": "./build/release.d.ts"
                }
            };
            if (!scripts["asbuild"]) {
                scripts["asbuild:debug"] = "asc assembly/index.ts --target debug";
                scripts["asbuild:release"] = "asc assembly/index.ts --target release";
                scripts["asbuild"] = "npm run asbuild:debug && npm run asbuild:release";
                pkg["scripts"] = scripts;
                updated = true;
            }
            const npmDefaultTest = "echo \"Error: no test specified\" && exit 1";
            if (!scripts["test"] || scripts["test"] == npmDefaultTest) {
                scripts["test"] = "node tests";
                pkg["scripts"] = scripts;
                updated = true;
            }
            if (!scripts["start"]) {
                scripts["start"] = "npx serve .";
                pkg["scripts"] = scripts;
                updated = true;
            }
            if (!scripts["deploy"]) {
                scripts["deploy"] = "npm run build-all && node scripts/deploy.cjs";
                pkg["scripts"] = scripts;
                updated = true;
            }
            if (!scripts["build-contract"]) {
                scripts["build-contract"] = "solc -o ./build/contract/ --via-ir --abi --bin ./contracts/*.sol  --overwrite";
                pkg["scripts"] = scripts;
                updated = true;
            }
            if (!scripts["build-all"]) {
                scripts["build-all"] = "npm install && npm run build-contract && npm run asbuild:release";
                pkg["scripts"] = scripts;
                updated = true;
            }
            const devDependencies = pkg["devDependencies"] || {};
            if (!devDependencies["assemblyscript"]) {
                devDependencies["assemblyscript"] = "^0.27.5";
                pkg["devDependencies"] = devDependencies;
                updated = true;
            }
            if (!devDependencies["as-proto-gen"]) {
                devDependencies["as-proto-gen"] = "^1.3.0";
                pkg["devDependencies"] = devDependencies;
                updated = true;
            }
            if (!devDependencies["@artela/aspect-tool"]) {
                devDependencies["@artela/aspect-tool"] = "^0.0.7";
                pkg["devDependencies"] = devDependencies;
                updated = true;
            }
            const dependencies = pkg["dependencies"] || {};
            if (!dependencies["@artela/aspect-libs"]) {
                dependencies["@artela/aspect-libs"] = "^0.0.7";
                pkg["dependencies"] = dependencies;
                updated = true;
            }
            if (!dependencies["@artela/web3"]) {
                dependencies["@artela/web3"] = "^1.9.2";
                pkg["dependencies"] = dependencies;
                updated = true;
            }
            if (!dependencies["@artela/web3-atl-aspect"]) {
                dependencies["@artela/web3-atl-aspect"] = "^1.9.2";
                pkg["dependencies"] = dependencies;
                updated = true;
            }
            if (!dependencies["@artela/web3-eth-contract"]) {
                dependencies["@artela/web3-eth-contract"] = "^1.9.2";
                pkg["dependencies"] = dependencies;
                updated = true;
            }
            if (!dependencies["@artela/web3-utils"]) {
                dependencies["@artela/web3-utils"] = "^1.9.1";
                pkg["dependencies"] = dependencies;
                updated = true;
            }
            if (!dependencies["@assemblyscript/loader"]) {
                dependencies["@assemblyscript/loader"] = "^0.27.5";
                pkg["dependencies"] = dependencies;
                updated = true;
            }
            if (!dependencies["@openzeppelin/contracts"]) {
                dependencies["@openzeppelin/contracts"] = "^4.9.2";
                pkg["dependencies"] = dependencies;
                updated = true;
            }
            if (!dependencies["as-proto"]) {
                dependencies["as-proto"] = "^1.3.0";
                pkg["dependencies"] = dependencies;
                updated = true;
            }
            if (updated) {
                fs.writeFileSync(packageFile, JSON.stringify(pkg, null, 2));
                this.log("  Updated: " + packageFile);
            } else {
                this.log("  Exists: " + packageFile);
            }
        } else {
            fs.writeFileSync(packageFile, JSON.stringify({
                "version": "1.0.0",
                "main": "index.js",
                "scripts": {
                    "deploy": "npm run build-all && node scripts/deploy.cjs",
                    "test": "node tests",
                    "asbuild:debug": "asc assembly/index.ts --target debug",
                    "asbuild:release": "asc assembly/index.ts --target release",
                    "asbuild": "npm run asbuild:debug && npm run asbuild:release",
                    "start": "npx serve .",
                    "build-contract": "solc -o ./build/contract/ --via-ir --abi --bin ./contracts/*.sol  --overwrite",
                    "build-all": "npm install && npm run build-contract && npm run asbuild:release"
                },
                "keywords": [],
                "author": "",
                "license": "ISC",
                "dependencies": {
                    "@artela/aspect-libs": "^0.0.7",
                    "@artela/web3": "^1.9.2",
                    "@artela/web3-atl-aspect": "^1.9.2",
                    "@artela/web3-eth-contract": "^1.9.2",
                    "@artela/web3-utils": "^1.9.1",
                    "@assemblyscript/loader": "^0.27.5",
                    "@openzeppelin/contracts": "^4.9.2",
                    "as-proto": "^1.3.0"
                },
                "devDependencies": {
                    "@artela/aspect-tool": "^0.0.7",
                    "as-proto-gen": "^1.3.0",
                    "assemblyscript": "^0.27.5"
                },
                "type": "module",
                "exports": {
                    ".": {
                        "import": "./build/release.js",
                        "types": "./build/release.d.ts"
                    }
                }
            }, null, 2));
            this.log("  Created: " + packageFile);
        }
    }
}