# Aspect TypeScript Library (aspect-libs)

TypeScript/AssemblyScript library for writing aspect to be deployed to
[Artela](https://github.com/artela-network/artelamint).

## Usage

For a detailed guide on how to create an Aspect, please see the
[Aspect Dev Book]().

One step of creating the subgraph is writing mappings that will process blockchain events and will
write entities into the store. These mappings are written in TypeScript/AssemblyScript.

The `aspect-libs` provides Host APIs to interact with the Aspect runtime, with this set of APIs, you can access blockchain data, smart
contracts, cryptographic functions, invoking system calls and more. To use it, all you have to do is add a
dependency on it:

```sh
npm install --dev @artela/aspect-libs # NPM
yarn add --dev @artela/aspect-libs    # Yarn
```

! code example to be added:

```typescript

```

## License

Copyright &copy; 2023 Artela Network, Inc. and contributors.

The Aspect TypeScript library is dual-licensed under the [MIT license](LICENSE-MIT) and the
[Apache License, Version 2.0](LICENSE-APACHE).


