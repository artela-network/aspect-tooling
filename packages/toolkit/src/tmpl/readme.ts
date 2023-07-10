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
   npm run aspect:deploy -- --aspectAccount {account address}  --args '{"gasPrice":1000000010,"gas":4000000}'
    \`\`\`
    --args is optional
      
2. deploy contract(Optional)
    \`\`\`shell
    # build contract by asolc
   npm run contract:build
   npm run contract:deploy -- --account {account address}  --abi ./build/contract/xxx.abi --bytecode ./build/contract/xxx.bin  --args '{"gasPrice":1000000010,"gas":4000000}'
    \`\`\`
   --args is optional

3. bind aspect
    \`\`\`shell
   npm run contract:bind -- --contractAccount {account address}  --contractAddress {account address} --aspectId {aspect address} 
    \`\`\`
 
`