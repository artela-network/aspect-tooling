export const TransformTmpl = `
import { keccak256 } from "@ethersproject/keccak256";
import { Transform } from "assemblyscript/transform";
import { compress } from "brotli";
import fs from "fs";

class CompressionTransform extends Transform {
  afterCompile(asModule) {
    console.log("Applying bytecode compression...");

    const options = this.program.options;
    const optimizeLevel = options.optimizeLevelHint;
    const isRelease = optimizeLevel> 0;
    // get wasm bytecode
    const wasmData = Buffer.from(asModule.emitBinary());

    // compress with brotli
    const compressedData = compress(wasmData, {
      mode: 0, // Generic mode
      quality: 11, // Highest quality compression
      lgwin: 22 // Default window size
    });

    // calculate checksum
    const checkSum = keccak256(compressedData).slice(2, 10);
    const checkSumBuffer = Buffer.from(checkSum, "hex");

    // create header
    const header = Buffer.from([ 0x00, 0x00, 0x00, 0x01 ]);

    // build the final bytes
    const outputData = Buffer.concat([ header, checkSumBuffer, compressedData ]);

    // save it
    const outputFile = isRelease ? 'build/release.wasm' : 'build/debug.wasm';
    if (!fs.existsSync("build")) {
      fs.mkdirSync("build");
    }
    fs.writeFileSync(outputFile, outputData);

    console.log(\`Compressed bytecode, from \${wasmData.length} to \${outputData.length} bytes. Checksum: 0x\${checkSum}\`);
  }
}

export default CompressionTransform;

`
