export const  ReadMeTmpl=`
# Against Reentrancy Attacks with Aspect

## Instruction
A reentrancy attack is a vulnerability in smart contracts where an external contract can maliciously call a target contract's function multiple times before the previous invocation completes.
This can lead to unexpected behavior or manipulation of contract state.
In this scenario, Aspect-Oriented Programming is employed to protect fund security without modifying the contract itself.

\`\`\`shell
.
├── app       // Node.js app,for Deployment, Binding , and Testing.
├── assembly  // wasm code 
│ ├── aspect  // Aspect File
├── contracts // contracts  file
├── scripts   // deploy script

\`\`\`

## Guide
This guide assumes that you have the necessary environments for Node development, protobuf, artela-network/Web3.js, and artela-network/artelasdk Git repository set up.
If you are not familiar with these environments, please refer to external resources such as Google for more information and instructions on how to set them up.

## build
1. deploy aspect
    \`\`\`shell
   npm run aspect:deploy -- --aspectAccount 0x9b79576f6ac97830f314c9d7a0edcb063832e816
    \`\`\`
   
2. deploy contract(Optional)
    \`\`\`shell
   npm run contract:deploy -- --account 0x9d7707cc7726b5b41cabb63c873dc5a9e4b8bfc0 --abi ./build/contract/Storage.abi --bytecode ./build/contract/Storage.bin
    \`\`\`

3. bind aspect
    \`\`\`shell
   npm run contract:bind -- --contractAccount 0x9d7707cc7726b5b41cabb63c873dc5a9e4b8bfc0  --contractAddress 0xeDC384B1486C06Ec941d0630a7CA125C9b90d639 --aspectId 0xa7E32493AFab141936540a48889e53c0e27D3d42 
    \`\`\`
`