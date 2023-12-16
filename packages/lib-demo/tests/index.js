
import { DeployContract} from "./bese-test.js";


let result=await DeployContract({
    abiPath:"../build/contract/Storage.abi", bytePath:"../build/contract/Storage.bin"
})

console.log(result)