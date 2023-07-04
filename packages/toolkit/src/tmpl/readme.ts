export const  ReadMeTmpl=`
# Against Reentrancy Attacks with Aspect

## Instruction
A reentrancy attack is a vulnerability in smart contracts where an external contract can maliciously call a target contract's function multiple times before the previous invocation completes.
This can lead to unexpected behavior or manipulation of contract state.
In this scenario, Aspect-Oriented Programming is employed to protect fund security without modifying the contract itself.
\`\`\`shell
.
├── app  // Node.js app,for Deployment, Binding , and Testing.
├── assembly // wasm code 
│ ├── aspect // Aspect File
├── contracts // contracts  file
├── scripts   // deploy script

\`\`\`
## Guide
This guide assumes that you have the necessary environments for Node development, protobuf, artela-network/Web3.js, and artela-network/artelasdk Git repository set up.
If you are not familiar with these environments, please refer to external resources such as Google for more information and instructions on how to set them up.

## build
1. build smart contract and aspect
  \`\`\`shell
   cd .     
   npm run build-all
   \`\`\`
2.  deploy
   \`\`\`shell
   cd app
   npm run deploy
   \`\`\`
`