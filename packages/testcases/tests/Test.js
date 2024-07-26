import { TestManager } from './utils/TestManager.js'

// Init TestManager
const testManager = new TestManager();

let name;
const args = process.argv.slice(2);
console.log("args: ", args)
if (args.length > 1) {
    const [key, value] = args[1].split('=');
    if (key == "case") {
        name = value;
    }
}

// Run Tests
testManager.runTestCases(name);
