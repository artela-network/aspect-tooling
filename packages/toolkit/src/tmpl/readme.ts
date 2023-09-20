export const ReadMeTmpl = `
# Sample Aspect

## Instruction

This is a sample project of Artela Aspect.

## Files

\`\`\`bash
.
├── build               // artifacts
├── assembly  
│ ├── aspect            // Aspect source files
├── contracts           // contract source files
├── scripts             // helper scripts
├── project.config.js   // configuration file of the project

\`\`\`

## Commands
1. Build contract

    \`\`\`bash
   npm run contract:build
    \`\`\`

2. Build Aspect

    \`\`\`bash
   npm run aspect:build
    \`\`\`

3. Deploy contract (Optional)

    \`\`\`bash
   npm run contract:deploy -- --sender {account-address} --abi {path/to/abi} --args '[1, "param2", true]'
    \`\`\`
    
    > --args is optional, it is only needed if you are deploying a smart contract with constructor

4. Deploy Aspect

    \`\`\`bash
   npm run aspect:deploy -- --sender {account address}
    \`\`\`

5. Bind Aspect
    \`\`\`shell
   npm run contract:bind -- --sender {account address}  --contractAddress {account address} --aspectId {aspect address} 
    \`\`\`

5. Call contract
    \`\`\`shell
   npm run contract:call -- --sender {account address}  \\
                            --contract {contract address} \\
                            --method {method name} \\
                            --abi {path/to/abi} \\
                            --inputs '["a", 1, true]' 
    \`\`\`
 
`;
