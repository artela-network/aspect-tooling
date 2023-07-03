#!/usr/bin/env ts-node


import {Command} from "@oclif/core";
import * as fs from "fs";
import path from "path";
import { fileURLToPath } from "url";


export default class Init extends Command {
    static description = 'describe the command here'
     args = [{name: 'dir'}]


    async run() {
        const { args } = this.parse(Init)
        console.log(`--file is: ${args.dir}`)
    }
}