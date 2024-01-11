<div align="center">
  <h1> Aspect Tooling </h1>
</div>

<div align="center">
  <a href="https://discord.gg/artela">
   <img src="https://img.shields.io/badge/chat-discord-green?logo=discord&chat" alt="Discord">
  </a>
  <a href="https://www.artela.network/">
   <img src="https://img.shields.io/badge/Artela%20Network-3282f8" alt="Artela Network">
  </a>
  <a href="https://github.com/cosmos/cosmos-sdk/blob/main/LICENSE">
    <img alt="License: Apache-2.0" src="https://img.shields.io/github/license/cosmos/cosmos-sdk.svg" />
  </a>
  <a href="https://goreportcard.com/report/github.com/cosmos/cosmos-sdk">
    <img alt="Go report card" src="https://goreportcard.com/badge/github.com/cosmos/cosmos-sdk" />
  </a>
  <a href="https://codecov.io/gh/cosmos/cosmos-sdk">
    <img alt="Code Coverage" src="https://codecov.io/gh/cosmos/cosmos-sdk/branch/main/graph/badge.svg" />
  </a>
</div>

---

This repo is consists of two parts:

- `packages/toolkit`: Toolkit for Aspect development 
- `packages/libs`: Assembly Script Libraries used for interacting with Host APIs within Aspect Runtime
- `packages/testcases`:Test cases and usage demonstration for the aspect library.

# Installation
You can install the package either using [NPM](https://www.npmjs.com/package/@artela/aspect-libs)
```shell

npm install  @artela/aspect-libs

npm install --save-dev @artela/aspect-tool
```
# Useful links

* [@artela/aspect-libs](https://docs.artela.network/develop/reference/aspect-lib/overview)
* [@artela/aspect-tools](https://docs.artela.network/develop/reference/aspect-tool/overview)

# Package.json Scripts

## packages/libs
| Script | Description |
| :-----| ---- | 
| build | Uses tsc to build all packages | 
| lint |performs type checking, syntax checking, etc |
| format |Uses prettier to format the code |

## packages/toolkit
| Script | Description |
| :-----| ---- | 
| build | Uses tsc to build all packages | 
| oclif:pack |  Package the CLI application into a standalone executable binary for easy distribution and installation.
| format |Uses prettier to format the code |
| type-check | performs type checking, syntax checking, etc|



## License
Copyright &copy; 2023 Artela Network, Inc. and contributors.

Licensed under the [Apache v2](LICENSE) License.