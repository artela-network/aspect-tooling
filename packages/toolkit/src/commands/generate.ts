import fs from 'fs';
import path from 'path';
import { Command, Flags } from '@oclif/core';
import Generator from '../generator';
import * as util from '../utils';

export default class Generate extends Command {
  static description = 'Generate state tracing code for Aspect.';
  static flags = {
    in: Flags.string({
      char: 'i',
      default: '',
    }),
    out: Flags.string({
      char: 'o',
      default: '',
    }),
  };

  toHyphenCase(str: string): string {
    return (
      str
        // insert a hyphen between lower and upper case letters, or between letters and numbers
        .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2')
        // convert above comment to english: replace all underscores with hyphens
        .replace(/_/g, '-')
        // convert above comment to english: convert to lowercase
        .toLowerCase()
        // remove leading hyphens (if any)
        .replace(/^-/, '')
    );
  }

  async run() {
    let sourceFilePath = '';
    let targetFilePath = '';

    //get sourceFilePath and targetFilePath
    const { flags } = await this.parse(Generate);

    if (flags.in == '') {
      this.log('Input your storage layout json file path like ` -i storage_layout.json`');
      process.exit(0);
    } else {
      sourceFilePath = path.resolve(flags.in);
    }
    if (flags.out == '') {
      this.log('Input your target generated ts file path like `-o xx.ts`');
      process.exit(0);
    } else {
      targetFilePath = path.resolve(flags.out);
    }

    if (util.isStringEmpty(sourceFilePath) || util.isStringEmpty(targetFilePath)) {
      this.log('Illegal input!');
      process.exit(0);
    }

    const inputAndOutputs: [string, string][] = [];
    if (
      fs.statSync(sourceFilePath).isFile() &&
      (!fs.existsSync(targetFilePath) || fs.statSync(targetFilePath).isFile())
    ) {
      if (!sourceFilePath.endsWith('.json') || !targetFilePath.endsWith('.ts')) {
        this.log('Illegal input!');
        process.exit(0);
      } else {
        const parentFolderPath = path.dirname(targetFilePath);
        if (!fs.existsSync(parentFolderPath)) {
          fs.mkdirSync(parentFolderPath, { recursive: true });
        }
        inputAndOutputs.push([sourceFilePath, targetFilePath]);
      }
    } else if (
      fs.statSync(sourceFilePath).isDirectory() &&
      (!fs.existsSync(targetFilePath) || fs.statSync(targetFilePath).isDirectory())
    ) {
      if (!fs.existsSync(targetFilePath)) {
        fs.mkdirSync(targetFilePath, { recursive: true });
      }

      for (const file of fs.readdirSync(sourceFilePath)) {
        if (!file.endsWith('_storage.json')) {
          continue;
        }

        const inputFile = path.join(sourceFilePath, file);
        const inputFileName = path.basename(inputFile, path.extname(inputFile));
        inputAndOutputs.push([
          inputFile,
          path.join(targetFilePath, this.toHyphenCase(inputFileName)) + '.ts',
        ]);
      }
    } else {
      this.log('Illegal input!');
      process.exit(0);
    }

    for (const inputAndOutput of inputAndOutputs) {
      const tracer: Generator = new Generator(inputAndOutput[0], inputAndOutput[1]);
      tracer.generate();
    }
  }
}
