import {Command, Flags} from "@oclif/core";
import * as util from "../utils";
import Generator, {StorageItem} from "../generator";
import path from "path";
import fs from 'fs';

export default class Generate extends Command {
    static description = 'Generate state tracing code for Aspect.';
    static flags = {
        in: Flags.string({
            char: 'i',
            default: "",
        }),
        out: Flags.string({
            char: 'o',
            default: "",
        }),
    }

    toHyphenCase(str: string): string {
        return str
            // 插入一个连字符在小写和大写字母之间，或在字母和数字之间
            .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2')
            // 替换所有的下划线为连字符
            .replace(/_/g, '-')
            // 转换为小写
            .toLowerCase()
            // 移除开头的连字符（如果有）
            .replace(/^-/, '');
    }

    async run() {
        let sourceFilePath = "";
        let targetFilePath = "";

        //get sourceFilePath and targetFilePath
        const {flags} = await this.parse(Generate)

        if (flags.in == "") {
            this.log('Input your storage layout json file path like ` -i xx_layout.json`');
            process.exit(0);
        } else {
            sourceFilePath = path.resolve(flags.in);
        }
        if (flags.out == "") {
            this.log('Input your target generated ts file path like `-o xx.ts`');
            process.exit(0)
        } else {
            targetFilePath = path.resolve(flags.out);
        }

        if (util.isStringEmpty(sourceFilePath) || util.isStringEmpty(targetFilePath)) {
            console.log('Illegal input!');
            process.exit(0);
        }

        const inputAndOutputs: [string, string][] = [];
        if (fs.statSync(sourceFilePath).isDirectory() && fs.statSync(targetFilePath).isDirectory()) {
            for (const file of fs.readdirSync(sourceFilePath)) {
                if (!file.endsWith('_storage.json')) {
                    continue
                }

                const inputFile = path.join(sourceFilePath, file);
                const inputFileName = path.basename(inputFile, path.extname(inputFile));
                inputAndOutputs.push([inputFile, path.join(targetFilePath, this.toHyphenCase(inputFileName)) + '.ts']);
            }
        } else if (fs.statSync(sourceFilePath).isFile() && fs.statSync(targetFilePath).isFile()) {
            if (!sourceFilePath.endsWith(".json") || !targetFilePath.endsWith(".ts")) {
                console.log('Illegal input!');
                process.exit(0);
            } else {
                inputAndOutputs.push([sourceFilePath, targetFilePath]);
            }
        } else {
            console.log('Illegal input!');
            process.exit(0);
        }

        for (const inputAndOutput of inputAndOutputs) {
            const tracer: Generator = new Generator(inputAndOutput[0], inputAndOutput[1]);
            const structNameSet: Set<string> = new Set();
            const jsonStr = tracer.getLayoutJson();
            const obj = tracer.getStorage(jsonStr);
            const items = obj.storage;

            // 1. append reference
            tracer.append(tracer.refLib, 0);
            // 2.1 append namespace start
            tracer.append(tracer.getNameSpace(util.getStrAfterLastColon(items[0].contract)), 0);
            tracer.append(tracer.getSysBalanceClass(), 1);

            // ----- 3.1 Loop to handle multi params start ------
            for (const item of items) {
                const structName = util.getStructName(item.type);
                if (structName.startsWith("t_mapping")) {
                    util.handleMapping(item, tracer, structNameSet, obj);
                } else if (util.isStringEmpty(structName)) {
                    util.handleBasic(item.label, item, tracer, false, 0);
                } else if (!structNameSet.has(structName)) {
                    const members = obj.types[item.type].members as StorageItem[];
                    structNameSet.add(structName);
                    util.handleStruct(item, tracer, structName, members);
                }
            }
            // ----- 3.2 Loop to handle multi params end ------


            // 2.2 append namespace end
            tracer.append(tracer.endBracket, 0);
        }
    }
}