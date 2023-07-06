import {Command, Flags} from "@oclif/core";
import readline from "readline";
import * as util from "../utils";
import Generator, {StorageItem} from "../generator";
import path from "path";

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

    async run() {
        let sourceFilePath: string = "";
        let targetFilePath: string = "";

        //get sourceFilePath and targetFilePath
        const {flags} = await this.parse(Generate)

        if (flags.in == "") {
            this.log('Input your storage layout json file path like ` -i xx_layout.json`');
            process.exit(0);
        } else{
            sourceFilePath = path.resolve(flags.in);
        }
        if (flags.out == "") {
            this.log('Input your target generated ts file path like `-o xx.ts`');
            process.exit(0)
        } else {
            targetFilePath =  path.resolve(flags.out);
        }
        if (util.isStringEmpty(sourceFilePath) || util.isStringEmpty(targetFilePath) ||
            !sourceFilePath.endsWith(".json") || !targetFilePath.endsWith(".ts")) {
            console.log('Illegal input!');
            process.exit(0);
        }


        const tracer: Generator = new Generator(sourceFilePath, targetFilePath);
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
        items.forEach(function (item) {
            let structName = util.getStructName(item.type);
            if (structName.startsWith("t_mapping")) {
                util.handleMapping(item, tracer, structNameSet, obj);
            } else if (!util.isStringEmpty(structName)) {
                if (!structNameSet.has(structName)) {
                    let members = obj.types[item.type].members as StorageItem[];
                    structNameSet.add(structName);
                    util.handleStruct(item, tracer, structName, members);
                }
            } else {
                util.handleBasic(item.label, item, tracer, false, 0);
            }
        });
        // ----- 3.2 Loop to handle multi params end ------


        // 2.2 append namespace end
        tracer.append(tracer.endBracket, 0);

    }
}