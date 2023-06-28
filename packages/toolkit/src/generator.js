"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var Generator = /** @class */ (function () {
    function Generator(layoutPath, tsPath) {
        this.refLib = "import { Protobuf } from 'as-proto/assembly';\nimport { Abi } from \"../lib/host\";\nimport { State } from \"../lib/states\";\nimport { utils } from \"../lib/utils\";\nimport { BigInt } from \"../lib/types\";\nimport { TraceCtx } from \"../lib/context\";\nimport { ethereum } from \"../lib/abi/ethereum/coders\";\n";
        this.endBracket = "}\n";
        this.argsTemplage = "ctx: TraceCtx;\n    addr: string;\n    prefix: Uint8Array;\n";
        this.argsTemplageStruct = "ctx: TraceCtx;\n    addr: string;\n    variable: string;\n    prefix: Uint8Array;\n";
        this.constructorTemplate = "constructor(ctx: TraceCtx, addr: string, prefix: Uint8Array = new Uint8Array(0)) {\n      this.ctx = ctx;\n      this.addr = addr;\n      this.prefix = prefix;\n    }\n";
        this.constructorTemplateStruct = "constructor(ctx: TraceCtx, addr: string, varibale: string, prefix: Uint8Array = new Uint8Array(0)) {\n      this.ctx = ctx;\n      this.addr = addr;\n      this.variable = varibale;\n      this.prefix = prefix;\n    }\n";
        this.layoutPath = layoutPath;
        this.tsPath = tsPath;
    }
    Generator.prototype.getStorage = function (loadJson) {
        var storageLayout = JSON.parse(loadJson);
        return storageLayout;
    };
    Generator.prototype.getLayoutJson = function () {
        if (fs.existsSync(this.layoutPath)) {
            var loadJson = fs.readFileSync(this.layoutPath, "utf-8");
            return loadJson;
        }
        return "";
    };
    Generator.prototype.append = function (str, space) {
        if (space > 0) {
            fs.writeFileSync(this.tsPath, "  ".repeat(space), { flag: 'a' });
        }
        fs.writeFileSync(this.tsPath, str, { flag: 'a' });
        return true;
    };
    Generator.prototype.getNameSpace = function (contract) {
        var contractName = contract;
        return "export namespace ".concat(contractName, " {\n");
    };
    Generator.prototype.getClass = function (arg) {
        var argName = arg;
        return "export class ".concat(argName, " {\n");
    };
    Generator.prototype.getBeforeFunc = function (typeTag, paramPrefix, valueFunc, isStruct, isNumber) {
        var param1 = typeTag;
        var param2 = "\"" + paramPrefix + "\"";
        if (isStruct) {
            param2 = "this.variable";
        }
        var param3 = valueFunc;
        var param4 = "let value = utils.uint8ArrayTo".concat(param3, "(changes.all[0].value);");
        if (isNumber) {
            var param5 = "";
            if ("BigInt" != typeTag) {
                param5 = ".to" + valueFunc + "()";
            }
            param4 = "let valueHex = utils.uint8ArrayToHex(changes.all[0].value);\n          let value = BigInt.fromString(valueHex, 16)".concat(param5, ";");
        }
        var message = "public before(): State<".concat(param1, "> | null {\n      let changes = this.ctx.getStateChanges(this.addr, ").concat(param2, ", this.prefix);\n      if (changes.all.length == 0) {\n          return null;\n      }\n\n      let account = changes.all[0].account;\n      ").concat(param4, "\n      return new State(account, value);\n    }\n");
        return message;
    };
    Generator.prototype.getChangesFunc = function (typeTag, paramPrefix, valueFunc, isStruct, isNumber) {
        var param1 = typeTag;
        var param2 = "\"" + paramPrefix + "\"";
        if (isStruct) {
            param2 = "this.variable";
        }
        var param3 = valueFunc;
        var param4 = "let value = utils.uint8ArrayTo".concat(param3, "(changes.all[i].value);");
        if (isNumber) {
            var param5 = "";
            if ("BigInt" != typeTag) {
                param5 = ".to" + valueFunc + "()";
            }
            param4 = "let valueHex = utils.uint8ArrayToHex(changes.all[0].value);\n          let value = BigInt.fromString(valueHex, 16)".concat(param5, ";");
        }
        var message = "public changes(): Array<State<".concat(param1, ">> | null {\n      let changes = this.ctx.getStateChanges(this.addr, ").concat(param2, ", this.prefix);\n      if (changes.all.length == 0) {\n          return null;\n      }\n\n      let res = new Array<State<").concat(param1, ">>(changes.all.length);\n      for (let i = 0; i < changes.all.length; i++) {\n          let account = changes.all[i].account;\n          ").concat(param4, "\n          res[i] = new State(account, value)\n      }\n      return res;\n    }\n");
        return message;
    };
    Generator.prototype.getLatestFunc = function (typeTag, paramPrefix, valueFunc, isStruct, isNumber) {
        var param1 = typeTag;
        var param2 = "\"" + paramPrefix + "\"";
        if (isStruct) {
            param2 = "this.variable";
        }
        var param3 = valueFunc;
        var param4 = "let value = utils.uint8ArrayTo".concat(param3, "(changes.all[index].value);");
        if (isNumber) {
            var param5 = "";
            if ("BigInt" != typeTag) {
                param5 = ".to" + valueFunc + "()";
            }
            param4 = "let valueHex = utils.uint8ArrayToHex(changes.all[index].value);\n          let value = BigInt.fromString(valueHex, 16)".concat(param5, ";");
        }
        var message = "public latest(): State<".concat(param1, "> | null {\n      let changes = this.ctx.getStateChanges(this.addr, ").concat(param2, ", this.prefix);\n      if (changes.all.length == 0) {\n          return null;\n      }\n\n      let index = changes.all.length - 1;\n      let account = changes.all[index].account;\n      ").concat(param4, "\n      return new State(account, value);\n    }\n");
        return message;
    };
    Generator.prototype.getDiffFunc = function (typeTag, paramPrefix, valueFunc, isStruct, isNumber) {
        var param1 = typeTag;
        var param2 = "\"" + paramPrefix + "\"";
        var forNumber = "after - before";
        if ("BigInt" == typeTag) {
            forNumber = "after.sub(before)";
        }
        if (isStruct) {
            param2 = "this.variable";
        }
        var param3 = valueFunc;
        var param4 = "let before = utils.uint8ArrayTo".concat(param3, "(changes.all[0].value);");
        var param5 = "let after = utils.uint8ArrayTo".concat(param3, "(changes.all[changes.all.length - 1].value);");
        if (isNumber) {
            var param6 = "";
            if ("BigInt" != typeTag) {
                param6 = ".to" + valueFunc + "()";
            }
            param4 = "let beforeHex = utils.uint8ArrayToHex(changes.all[0].value);\n          let before = BigInt.fromString(beforeHex, 16)".concat(param6, ";");
            param5 = "let afterHex = utils.uint8ArrayToHex(changes.all[changes.all.length - 1].value);\n          let after = BigInt.fromString(afterHex, 16)".concat(param6, ";");
        }
        var message = "public diff(): ".concat(param1, "  | null {\n      let changes = this.ctx.getStateChanges(this.addr, ").concat(param2, ", this.prefix);\n      if (changes.all.length < 2) {\n          return null;\n      }\n\n      ").concat(param4, "\n      ").concat(param5, "\n      \n      return ").concat(forNumber, ";\n    }\n");
        return message;
    };
    Generator.prototype.getBeforeFuncMap = function (ft, ff, typeTag, paramPrefix, valueFunc, isNumber) {
        var param1 = typeTag;
        var param2 = paramPrefix;
        var param3 = valueFunc;
        var param4 = "let value = utils.uint8ArrayTo".concat(param3, "(changes.all[0].value);");
        if (isNumber) {
            var param5 = "";
            if ("BigInt" != typeTag) {
                param5 = ".to" + valueFunc + "()";
            }
            param4 = "let valueHex = utils.uint8ArrayToHex(changes.all[0].value);\n        let value = BigInt.fromString(valueHex, 16)".concat(param5, ";");
        }
        var message = "public before(key: ".concat(ft, "): State<").concat(param1, "> | null {\n    let encoded = Abi.encode").concat(ff, "(key);\n    let changes = this.ctx.getStateChanges(this.addr, ").concat(param2, ", utils.concatUint8Arrays(this.prefix, encoded));\n    if (changes.all.length == 0) {\n        return null;\n    }\n\n    let account = changes.all[0].account;\n    ").concat(param4, "\n    return new State(account, value);\n  }\n");
        return message;
    };
    Generator.prototype.getChangesFuncMap = function (ft, ff, typeTag, paramPrefix, valueFunc, isNumber) {
        var param1 = typeTag;
        var param2 = paramPrefix;
        var param3 = valueFunc;
        var param4 = "let value = utils.uint8ArrayTo".concat(param3, "(changes.all[i].value);");
        if (isNumber) {
            var param5 = "";
            if ("BigInt" != typeTag) {
                param5 = ".to" + valueFunc + "()";
            }
            param4 = "let valueHex = utils.uint8ArrayToHex(changes.all[0].value);\n        let value = BigInt.fromString(valueHex, 16)".concat(param5, ";");
        }
        var message = "public changes(key: ".concat(ft, "): Array<State<").concat(param1, ">> | null {\n    let encoded = Abi.encode").concat(ff, "(key);\n    let changes = this.ctx.getStateChanges(this.addr, ").concat(param2, ", utils.concatUint8Arrays(this.prefix, encoded));\n    if (changes.all.length == 0) {\n        return null;\n    }\n\n    let res = new Array<State<").concat(param1, ">>(changes.all.length);\n    for (let i = 0; i < changes.all.length; i++) {\n        let account = changes.all[i].account;\n        ").concat(param4, "\n        res[i] = new State(account, value)\n    }\n    return res;\n  }\n");
        return message;
    };
    Generator.prototype.getLatestFuncMap = function (ft, ff, typeTag, paramPrefix, valueFunc, isNumber) {
        var param1 = typeTag;
        var param2 = paramPrefix;
        var param3 = valueFunc;
        var param4 = "let value = utils.uint8ArrayTo".concat(param3, "(changes.all[index].value);");
        if (isNumber) {
            var param5 = "";
            if ("BigInt" != typeTag) {
                param5 = ".to" + valueFunc + "()";
            }
            param4 = "let valueHex = utils.uint8ArrayToHex(changes.all[index].value);\n        let value = BigInt.fromString(valueHex, 16)".concat(param5, ";");
        }
        var message = "public latest(key: ".concat(ft, "): State<").concat(param1, "> | null {\n    let encoded = Abi.encode").concat(ff, "(key);\n    let changes = this.ctx.getStateChanges(this.addr, ").concat(param2, ", utils.concatUint8Arrays(this.prefix, encoded));\n    if (changes.all.length == 0) {\n        return null;\n    }\n\n    let index = changes.all.length - 1;\n    let account = changes.all[index].account;\n    ").concat(param4, "\n    return new State(account, value);\n  }\n");
        return message;
    };
    Generator.prototype.getDiffFuncMap = function (ft, ff, typeTag, paramPrefix, valueFunc, isNumber) {
        var param1 = typeTag;
        var param2 = paramPrefix;
        var param3 = valueFunc;
        var param4 = "let before = utils.uint8ArrayTo".concat(param3, "(changes.all[0].value);");
        var param5 = "let after = utils.uint8ArrayTo".concat(param3, "(changes.all[changes.all.length - 1].value);");
        var forNumber = "after - before";
        if ("BigInt" == typeTag) {
            forNumber = "after.sub(before)";
        }
        if (isNumber) {
            var param6 = "";
            if ("BigInt" != typeTag) {
                param6 = ".to" + valueFunc + "()";
            }
            param4 = "let beforeHex = utils.uint8ArrayToHex(changes.all[0].value);\n        let before = BigInt.fromString(beforeHex, 16)".concat(param6, ";");
            param5 = "let afterHex = utils.uint8ArrayToHex(changes.all[changes.all.length - 1].value);\n        let after = BigInt.fromString(afterHex, 16)".concat(param6, ";");
        }
        var message = "public diff(key: ".concat(ft, "): ").concat(param1, "  | null {\n    let encoded = Abi.encode").concat(ff, "(key);\n    let changes = this.ctx.getStateChanges(this.addr, ").concat(param2, ", utils.concatUint8Arrays(this.prefix, encoded));\n    if (changes.all.length < 2) {\n        return null;\n    }\n\n    ").concat(param4, "\n    ").concat(param5, "\n\n    return ").concat(forNumber, ";\n  }\n");
        return message;
    };
    Generator.prototype.getStructParam = function (name, wrapName) {
        var param1 = name;
        var param2 = wrapName;
        var message = "public ".concat(param1, "(): ").concat(param2, " {\n        let encoded = Abi.encodeString(\"").concat(param1, "\");\n        return new ").concat(param2, "(this.ctx, this.addr, this.variable, utils.concatUint8Arrays(this.prefix, encoded));\n    }\n");
        return message;
    };
    Generator.prototype.getMappintSecondParam = function (name, type, prefix) {
        var param1 = name;
        var param2 = type;
        var param3 = prefix; //ContractName.ParamNameInContract
        var message = "public ".concat(param1, "(key: string): ").concat(param2, " {\n        let encoded = Abi.encodeString(key);\n        return new ").concat(param2, "(this.ctx, this.addr, \"").concat(param3, "\", utils.concatUint8Arrays(this.prefix, encoded))\n    }\n");
        return message;
    };
    Generator.prototype.getNestedMappingValue = function (npStr, prefix) {
        var param2 = npStr;
        var param3 = prefix; //ContractName.ParamNameInContract
        var message = "public value(key: string): ".concat(param2, ".Value {\n        let encoded = Abi.encodeAddress(key);\n        return new ").concat(param2, ".Value(this.ctx, this.addr, \"").concat(param3, "\", utils.concatUint8Arrays(this.prefix, encoded));\n    }\n");
        return message;
    };
    return Generator;
}());
exports.default = Generator;
