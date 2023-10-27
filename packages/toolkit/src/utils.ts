import { StorageItem } from './generator';

export function isStringEmpty(str: string): boolean {
  return !str.trim();
}

export function getStrBetweenColon(str: string): string {
  const startIndex = str.indexOf('(');
  const endIndex = str.indexOf(')');

  if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) {
    return '';
  }

  return str.substring(startIndex + 1, endIndex);
}

export function getStrAfterLastColon(input: string): string {
  const lastColonIndex = input.lastIndexOf(':');
  if (lastColonIndex === -1) {
    return input;
  }
  return input.slice(lastColonIndex + 1).trim();
}

export function getStrBetLastCommaAndParen(input: string): string {
  if (!input.startsWith('t_mapping')) {
    return input;
  }
  const lastCommaIndex = input.lastIndexOf(',');
  const lastParenthesisIndex = input.lastIndexOf(')');

  if (
    lastCommaIndex === -1 ||
    lastParenthesisIndex === -1 ||
    lastCommaIndex >= lastParenthesisIndex
  ) {
    return '';
  }

  return input.slice(lastCommaIndex + 1, lastParenthesisIndex).trim();
}

export function getMapSecondParam(input: string): string {
  if (!input.startsWith('t_mapping')) {
    return input;
  }
  const i = input.indexOf(',');
  const j = input.lastIndexOf(')');

  if (i === -1 || j === -1 || i >= j) {
    return '';
  }

  return input.slice(i + 1, j).trim();
}

export function getMapFirstParam(input: string): string {
  if (!input.startsWith('t_mapping')) {
    return input;
  }
  const i = input.lastIndexOf('(');
  const j = input.lastIndexOf(',');

  if (i === -1 || j === -1 || i >= j) {
    return '';
  }

  return input.slice(i + 1, j).trim();
}

enum ASTTypeId {
  Number,
  BytesN,
  Address,
  Boolean,
  Array,
  Mapping,
  Tuple,
  Bytes,
  String,
}

export interface ASTType {
  typeId(): ASTTypeId;

  isComplexType(): boolean;

  asType(): string;

  classDef(prefix: string): string;

  generateClass(prefix: string, stateVarName: string): string;

  constructorFunc(stateVarName: string): string;

  getClassName(prefix: string): string;

  parseKeyFunc(): string;
}

abstract class BaseType implements ASTType {
  isComplexType(): boolean {
    const typeId = this.typeId();
    return typeId == ASTTypeId.Mapping || typeId == ASTTypeId.Array || typeId == ASTTypeId.Tuple;
  }

  asType(): string {
    return '';
  }

  abstract typeId(): ASTTypeId;

  abstract unmarshalStateFunc(): string;

  abstract parseKeyFunc(): string;

  getClassName(prefix: string): string {
    return prefix;
  }

  constructorFunc(stateVarName: string): string {
    return `
        constructor(ctx: TraceCtx, addr: string, indices: Uint8Array[] = []) {
            super(new StateChangeProperties(ctx, addr, '${stateVarName}', indices));
        }
        `;
  }

  classDef(prefix: string): string {
    return (
      'export class ' +
      this.getClassName(prefix) +
      ' extends StateChange<' +
      this.asType() +
      '> {\n'
    );
  }

  generateClass(prefix: string, stateVarName: string): string {
    let res = '';
    res += this.classDef(prefix);
    res += this.constructorFunc(stateVarName);
    res += this.unmarshalStateFunc();
    res += '}\n';
    return res;
  }
}

abstract class BaseComplexType extends BaseType {
  override unmarshalStateFunc(): string {
    return '';
  }

  abstract indexValue(): string;

  getClassName(prefix: string): string {
    return prefix;
  }

  classDef(prefix: string): string {
    return (
      'export class ' + this.getClassName(prefix) + ' extends StateKey<' + this.asType() + '> {\n'
    );
  }
}

export class ASTNumber extends BaseType {
  constructor(private bits: number, private signed = false) {
    super();

    if (bits % 8 != 0) {
      throw new Error('number bits must be multiple of 8');
    }
  }

  typeId(): ASTTypeId {
    return ASTTypeId.Number;
  }

  asType(): string {
    if (this.bits <= 64) {
      if (this.signed) {
        return 'i' + this.bits;
      }
      return 'u' + this.bits;
    }

    return 'BigInt';
  }

  unmarshalStateFunc(): string {
    if (this.bits > 64) {
      return `
            override unmarshalState(raw: EthStateChange) : State<BigInt> {
                let valueHex = sys.utils.uint8ArrayToHex(raw.value);
                let value = BigInt.fromString(valueHex, 16);
                return new State(raw.account, value, raw.callIndex);
            }
        `;
    }

    return `
        override unmarshalState(raw: EthStateChange) : State<${this.asType()}> {
            let valueHex = sys.utils.uint8ArrayToHex(raw.value);
            let value = BigInt.fromString(valueHex, 16);
            return new State(raw.account, <${this.asType()}>value.to${
      this.signed ? 'U' : ''
    }Int64(), raw.callIndex);
        }
        `;
  }

  parseKeyFunc(): string {
    if (this.bits <= 64) {
      return `
                protected parseKey(key: ${this.asType()}): Uint8Array {
                    return ethereum.Number.from${this.asType().toUpperCase()}(key).encodeUint8Array();
                }
            `;
    }

    return `
            protected parseKey(key: ${this.asType()}): Uint8Array {
                return ethereum.Number.fromHexString(key.toString(16), ${
                  this.signed
                }).encodeUint8Array();
            }
        `;
  }
}

export class ASTBoolean extends BaseType {
  asType(): string {
    return 'bool';
  }

  typeId(): ASTTypeId {
    return ASTTypeId.Boolean;
  }

  unmarshalStateFunc(): string {
    return `
        override unmarshalState(raw: EthStateChange) : State<${this.asType()}> {
            return new State(raw.account, raw.value[0] > 0, raw.callIndex);
        }
        `;
  }

  parseKeyFunc(): string {
    return `
            protected parseKey(key: ${this.asType()}): Uint8Array {
                return ethereum.Boolean.fromBoolean(key).encodeUint8Array();
            }
        `;
  }
}

export class ASTAddress extends BaseType {
  asType(): string {
    return 'string';
  }

  typeId(): ASTTypeId {
    return ASTTypeId.Address;
  }

  unmarshalStateFunc(): string {
    return `
        override unmarshalState(raw: EthStateChange) : State<${this.asType()}> {
            return new State(raw.account, sys.utils.uint8ArrayToHex(raw.value), raw.callIndex);
        }
        `;
  }

  parseKeyFunc(): string {
    return `
            protected parseKey(key: ${this.asType()}): Uint8Array {
                return ethereum.Address.fromHexString(key).encodeUint8Array();
            }
        `;
  }
}

export class ASTBytes extends BaseType {
  asType(): string {
    return 'Uint8Array';
  }

  typeId(): ASTTypeId {
    return ASTTypeId.Bytes;
  }

  unmarshalStateFunc(): string {
    return `
        override unmarshalState(raw: EthStateChange) : State<${this.asType()}> {
            return new State(raw.account, raw.value, raw.callIndex);
        }
        `;
  }

  parseKeyFunc(): string {
    return `
            protected parseKey(key: ${this.asType()}): Uint8Array {
                return key;
            }
        `;
  }
}

export class ASTBytesN extends ASTBytes {
  typeId(): ASTTypeId {
    return ASTTypeId.BytesN;
  }

  asType(): string {
    return 'string';
  }

  parseKeyFunc(): string {
    return `
            protected parseKey(key: ${this.asType()}): Uint8Array {
                return ethereum.BytesN.fromHexString(key).encodeUint8Array();
            }
        `;
  }
}

export class ASTString extends BaseType {
  asType(): string {
    return 'string';
  }

  typeId(): ASTTypeId {
    return ASTTypeId.String;
  }

  unmarshalStateFunc(): string {
    return `
        override unmarshalState(raw: EthStateChange) : State<${this.asType()}> {
            return new State(raw.account, sys.utils.uint8ArrayToString(raw.value), raw.callIndex);
        }
        `;
  }

  parseKeyFunc(): string {
    return `
            protected parseKey(key: ${this.asType()}): Uint8Array {
                return sys.utils.stringToUint8Array(key);
            }
        `;
  }
}

export class ASTArray extends BaseComplexType {
  constructor(private elemType: ASTType) {
    super();
  }

  asType(): string {
    return 'u64';
  }

  typeId(): ASTTypeId {
    return ASTTypeId.Array;
  }

  accessOperator(childClass: string): string {
    return `
            @operator("[]")
            get(index: u64): ${childClass} {
                return new ${childClass}(this.__properties__.ctx, this.__properties__.account, 
                                         sys.utils.arrayCopyPush(this.__properties__.indices, this.parseKey(index)));
            }
        `;
  }

  parseKeyFunc(): string {
    return `
        protected parseKey(key: u64): Uint8Array {
            return ethereum.Number.fromU64(key).encodeUint8Array();
        }
        `;
  }

  indexValue(): string {
    return `childrenIndexValue(index: u64): ethereum.Number {
      return ethereum.Number.fromUint8Array(this.__children__[index]);
    }`;
  }

  indexAccess(childClass: string): string {
    return `
            childChangeAt(index: u64): ${childClass} {
                // @ts-ignore
                return new ${childClass}(this.__properties__.ctx, this.__properties__.account, 
                                         sys.utils.arrayCopyPush(this.__properties__.indices, this.__children__[index]));
            }
        `;
  }

  generateClass(prefix: string, stateVarName: string): string {
    let res = '';
    const childClassName = this.elemType.getClassName(prefix + '_ArrayElement');
    res += this.elemType.generateClass(childClassName, stateVarName);
    res += this.classDef(prefix);
    res += this.constructorFunc(stateVarName);
    res += this.accessOperator(childClassName);
    res += this.parseKeyFunc();
    res += this.indexValue();
    res += this.indexAccess(childClassName);
    res += '}\n';
    return res;
  }
}

export class ASTMapping extends BaseComplexType {
  constructor(private keyType: ASTType, private valueType: ASTType) {
    super();
  }

  asType(): string {
    return this.keyType.asType();
  }

  typeId(): ASTTypeId {
    return ASTTypeId.Mapping;
  }

  accessOperator(childClass: string): string {
    return `
            @operator("[]")
            get(key: ${this.asType()}): ${childClass} {
                // @ts-ignore
                return new ${childClass}(this.__properties__.ctx, this.__properties__.account, 
                                         sys.utils.arrayCopyPush(this.__properties__.indices, this.parseKey(key)));
            }
        `;
  }

  indexAccess(childClass: string): string {
    return `
            childChangeAt(index: u64): ${childClass} {
                // @ts-ignore
                return new ${childClass}(this.__properties__.ctx, this.__properties__.account, 
                                         sys.utils.arrayCopyPush(this.__properties__.indices, this.__children__[index]));
            }
        `;
  }

  indexValue(): string {
    switch (this.keyType.typeId()) {
      case ASTTypeId.Number:
        return `childrenIndexValue(index: u64): ethereum.Number {
          return ethereum.Number.fromUint8Array(this.__children__[index]);
        }`;
      case ASTTypeId.BytesN:
        return `childrenIndexValue(index: u64): ethereum.BytesN {
          return ethereum.BytesN.fromUint8Array(this.__children__[index]);
        }`;
      case ASTTypeId.Address:
        return `childrenIndexValue(index: u64): ethereum.Address {
          return ethereum.Address.fromUint8Array(this.__children__[index]);
        }`;
      case ASTTypeId.Boolean:
        return `childrenIndexValue(index: u64): ethereum.Boolean {
          return ethereum.Boolean.fromUint8Array(this.__children__[index]);
        }`;
      case ASTTypeId.Bytes:
        return `childrenIndexValue(index: u64): ethereum.Bytes {
          return ethereum.Bytes.fromUint8Array(this.__children__[index]);
        }`;
      case ASTTypeId.String:
        return `childrenIndexValue(index: u64): ethereum.String {
          return ethereum.String.fromUint8Array(this.__children__[index]);
        }`;
      default:
        throw new Error('invalid mapping key type');
    }
  }

  parseKeyFunc(): string {
    return this.keyType.parseKeyFunc();
  }

  generateClass(prefix: string, stateVarName: string): string {
    let res = '';
    const valueClass = this.valueType.getClassName(prefix + '_MappingValue');
    res += this.valueType.generateClass(valueClass, stateVarName);
    res += this.classDef(prefix);
    res += this.constructorFunc(stateVarName);
    res += this.accessOperator(valueClass);
    res += this.parseKeyFunc();
    res += this.indexValue();
    res += this.indexAccess(valueClass);
    res += '}\n';
    return res;
  }
}

export class ASTStruct extends BaseComplexType {
  constructor(private members: [string, ASTType][]) {
    super();
  }

  asType(): string {
    return 'void';
  }

  typeId(): ASTTypeId {
    return ASTTypeId.Tuple;
  }

  generateProperties(propertyClasses: string[]): string {
    let res = '';
    for (let i = 0; i < this.members.length; i++) {
      res += `
            public readonly ${this.members[i][0]}: ${propertyClasses[i]};
            `;
    }

    return res;
  }

  structConstructor(stateVarName: string, properties: [string, string][]): string {
    let res = `
        constructor(ctx: TraceCtx, addr: string, indices: Uint8Array[] = []) {
        `;

    for (let i = 0; i < properties.length; i++) {
      res += `
            this.${properties[i][0]} = new ${properties[i][1]}(ctx, addr,
             sys.utils.arrayCopyPush(indices, sys.utils.stringToUint8Array('${properties[i][0]}')));
            `;
    }

    return res + '}\n';
  }

  classDef(prefix: string): string {
    return `export class ${this.getClassName(prefix)} {\n`;
  }

  indexValue(): string {
    throw new Error('Method not implemented.');
  }

  generateClass(prefix: string, stateVarName: string): string {
    let res = '';
    const memberClassNames: string[] = [];
    for (let i = 0; i < this.members.length; i++) {
      const propertyClass = this.members[i][1].getClassName(
        prefix + '_StructField_' + this.members[i][0],
      );
      memberClassNames.push(propertyClass);
      res += this.members[i][1].generateClass(propertyClass, stateVarName);
    }
    res += this.classDef(prefix);
    res += this.generateProperties(memberClassNames);
    res += this.structConstructor(
      stateVarName,
      this.members.map((m, i) => [m[0], memberClassNames[i]]),
    );
    res += '}\n';
    return res;
  }

  parseKeyFunc(): string {
    return `
        protected parseKey(key: void): Uint8Array {
            return new Uint8Array(0);
        }
        `;
  }
}

export function getParamPrefix(item: StorageItem): string {
  const contractName = getStrAfterLastColon(item.contract);
  if (isStringEmpty(contractName)) return '';
  return contractName + '.' + item.label;
}
