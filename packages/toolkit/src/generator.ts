import * as fs from 'fs';
import {
  ASTAddress,
  ASTArray,
  ASTBoolean,
  ASTBytes,
  ASTBytesN,
  ASTMapping,
  ASTNumber,
  ASTString,
  ASTStruct,
  ASTType,
  getParamPrefix,
  getStrAfterLastColon,
} from './utils';

export type StorageItem = {
  astId: number;
  contract: string;
  label: string;
  offset: number;
  slot: string;
  type: string;
};

export type StorageType = {
  encoding: string;
  label: string;
  numberOfBytes: string;
  members?: StorageItem[];
  key?: string;
  value?: string;
  base?: string;
};

export type StorageLayout = {
  storage: StorageItem[];
  types: Record<string, StorageType>;
};
export default class Generator {
  private readonly endBracket = '}\n';
  private readonly storageLayout: StorageLayout;
  private readonly imports = `
        import {
            BigInt,
            ethereum,
            EthStateChange,
            State,
            StateChange,
            StateKey,
            StateChangeProperties,
            stringToUint8Array,
            arrayCopyPush,
            uint8ArrayToHex
        } from "@artela-next/aspect-libs";
    `;

  constructor(private readonly layoutPath: string, private readonly tsPath: string) {
    this.storageLayout = this.getStorage();
  }

  getStorage(): StorageLayout {
    const jsonStr = this.getLayoutJson();
    const storageLayout = JSON.parse(jsonStr) as StorageLayout;
    let contract = 'defaultContract';
    if (storageLayout.storage.length > 0) {
      contract = storageLayout.storage[0].contract;
    }

    // append balance as a storage variable
    storageLayout.storage.push({
      astId: 0,
      contract,
      label: '_balance_',
      offset: 0,
      slot: '0x0',
      type: 't_uint256',
    });

    // append u256 type if missing
    storageLayout.types['t_uint256'] ||= {
      encoding: 'inplace',
      label: 'uint256',
      numberOfBytes: '32',
    };

    return storageLayout;
  }

  getLayoutJson(): string {
    if (fs.existsSync(this.layoutPath)) {
      return fs.readFileSync(this.layoutPath, 'utf-8');
    }

    throw new Error(`unable to load storage layout json from ${this.layoutPath}`);
  }

  append(str: string): boolean {
    fs.writeFileSync(this.tsPath, str, { flag: 'a' });
    return true;
  }

  write(str: string): boolean {
    fs.writeFileSync(this.tsPath, str);
    return true;
  }

  getNameSpace(): string {
    let contract = getStrAfterLastColon(this.storageLayout.storage[0].contract);
    contract ||= 'DefaultContract';
    return `export namespace ${contract}State {\n`;
  }

  parseType(typeName: string): ASTType {
    const typeItem = this.storageLayout.types[typeName];
    if (typeName.startsWith('t_array')) {
      if (!typeItem.base) {
        throw new Error(`invalid array type ${typeName}`);
      }

      const base = this.parseType(typeItem.base);
      return new ASTArray(base);
    }

    if (typeName.startsWith('t_mapping')) {
      if (!typeItem.key || !typeItem.value) {
        throw new Error(`invalid mapping type ${typeName}`);
      }

      const key = this.parseType(typeItem.key);
      const value = this.parseType(typeItem.value);

      return new ASTMapping(key, value);
    }

    if (typeName.startsWith('t_struct')) {
      if (!typeItem.members) {
        throw new Error(`invalid struct type ${typeName}`);
      }
      const members: [string, ASTType][] = [];
      for (const member of typeItem.members) {
        members.push([member.label, this.parseType(member.type)]);
      }

      return new ASTStruct(members);
    }

    if (typeName.startsWith('t_string')) {
      return new ASTString();
    }

    if (typeName.startsWith('t_bytes')) {
      return new ASTBytes();
    }

    switch (typeName) {
      // list all solidity number and byte types cases
      case 't_bool':
        return new ASTBoolean();
      case 't_bytes1':
      case 't_bytes2':
      case 't_bytes3':
      case 't_bytes4':
      case 't_bytes5':
      case 't_bytes6':
      case 't_bytes7':
      case 't_bytes8':
      case 't_bytes9':
      case 't_bytes10':
      case 't_bytes11':
      case 't_bytes12':
      case 't_bytes13':
      case 't_bytes14':
      case 't_bytes15':
      case 't_bytes16':
      case 't_bytes17':
      case 't_bytes18':
      case 't_bytes19':
      case 't_bytes20':
      case 't_bytes21':
      case 't_bytes22':
      case 't_bytes23':
      case 't_bytes24':
      case 't_bytes25':
      case 't_bytes26':
      case 't_bytes27':
      case 't_bytes28':
      case 't_bytes29':
      case 't_bytes30':
      case 't_bytes31':
      case 't_bytes32':
        return new ASTBytesN();
      case 't_uint8':
        return new ASTNumber(8, false);
      case 't_uint16':
        return new ASTNumber(16, false);
      case 't_uint32':
        return new ASTNumber(32, false);
      case 't_uint64':
        return new ASTNumber(64, false);
      case 't_uint128':
        return new ASTNumber(128, false);
      case 't_uint160':
        return new ASTNumber(160, false);
      case 't_uint192':
        return new ASTNumber(192, false);
      case 't_uint256':
        return new ASTNumber(256, false);
      case 't_int8':
        return new ASTNumber(8, true);
      case 't_int16':
        return new ASTNumber(16, true);
      case 't_int32':
        return new ASTNumber(32, true);
      case 't_int64':
        return new ASTNumber(64, true);
      case 't_int128':
        return new ASTNumber(128, true);
      case 't_int160':
        return new ASTNumber(160, true);
      case 't_int192':
        return new ASTNumber(192, true);
      case 't_int256':
        return new ASTNumber(256, true);
      case 't_address':
        return new ASTAddress();
    }

    throw new Error(`unknown type ${typeName}`);
  }

  generate() {
    // 1. append reference
    this.write(this.imports);
    // 2.1 append namespace start
    this.append(this.getNameSpace());

    // ----- 3.1 Loop to handle multi params start ------
    for (const item of this.storageLayout.storage) {
      const astType = this.parseType(item.type);
      this.append(
        astType.generateClass(
          item.label,
          item.label === '_balance_' ? '.balance' : getParamPrefix(item),
        ),
      );
    }
    // ----- 3.2 Loop to handle multi params end ------

    // 2.2 append namespace end
    this.append(this.endBracket);
  }
}
