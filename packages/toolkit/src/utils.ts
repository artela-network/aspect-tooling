import Generator from './generator';
import { StorageItem, StorageLayout } from './generator';

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
    return '';
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

export function getTypeTag(itemType: string): string {
  const paramType = getStrBetLastCommaAndParen(itemType);
  switch (paramType) {
    case 't_int32':
      return 'i32';
    case 't_int64':
      return 'i64';
    case 't_int256':
      return 'BigInt';
    case 't_uint32':
      return 'u32';
    case 't_uint64':
      return 'u64';
    case 't_uint256':
      return 'BigInt';
    case 't_string_storage':
      return 'string';
    case 't_bool':
      return 'bool';
    case 't_address':
      return 'ethereum.Address';
    default:
      return '';
  }
}

export function getParamPrefix(item: StorageItem): string {
  let contractName = getStrAfterLastColon(item.contract);
  if (isStringEmpty(contractName)) return '';
  return contractName + '.' + item.label;
}

export function getStructName(typeStr: string): string {
  if (typeStr.startsWith('t_mapping')) {
    return typeStr;
  }
  const paramType = getStrBetLastCommaAndParen(typeStr);
  if (paramType.startsWith('t_struct')) {
    const structName = getStrBetweenColon(paramType);
    return structName;
  }
  return '';
}

export function getValueFunc(itemType: string): string {
  const paramType = getStrBetLastCommaAndParen(itemType);
  switch (paramType) {
    case 't_int32':
      return 'Int32';
    case 't_int64':
      return 'Int64';
    case 't_int256':
      return 'Int256';
    case 't_uint32':
      return 'UInt32';
    case 't_uint64':
      return 'UInt64';
    case 't_uint256':
      return 'UInt256';
    case 't_string_storage':
      return 'String';
    case 't_bool':
      return 'Bool';
    case 't_address':
      return 'Address';
    default:
      return '';
  }
}

export function isNumber(itemType: string): boolean {
  const paramType = getStrBetLastCommaAndParen(itemType);
  switch (paramType) {
    case 't_int32':
      return true;
    case 't_int64':
      return true;
    case 't_int256':
      return true;
    case 't_uint32':
      return true;
    case 't_uint64':
      return true;
    case 't_uint256':
      return true;
    default:
      return false;
  }
}

export function handleBasic(
  className: string,
  item: StorageItem,
  tracer: Generator,
  isStruct: boolean,
  n: number,
) {
  // 1 append class start
  tracer.append(tracer.getClass(className), 1 + n);
  // 2 append addr and prefix
  if (isStruct) {
    tracer.append(tracer.argsTemplageStruct, 2 + n);
  } else {
    tracer.append(tracer.argsTemplage, 2 + n);
  }
  // 3 append constructor
  if (isStruct) {
    tracer.append(tracer.constructorTemplateStruct, 2 + n);
  } else {
    tracer.append(tracer.constructorTemplate, 2 + n);
  }
  // 4 append before func
  tracer.append(
    tracer.getBeforeFunc(
      getTypeTag(item.type),
      getParamPrefix(item),
      getValueFunc(item.type),
      isStruct,
      isNumber(item.type),
    ),
    2 + n,
  );
  // 5 append changes func
  tracer.append(
    tracer.getChangesFunc(
      getTypeTag(item.type),
      getParamPrefix(item),
      getValueFunc(item.type),
      isStruct,
      isNumber(item.type),
    ),
    2 + n,
  );
  // 6 append lastest func
  tracer.append(
    tracer.getLatestFunc(
      getTypeTag(item.type),
      getParamPrefix(item),
      getValueFunc(item.type),
      isStruct,
      isNumber(item.type),
    ),
    2 + n,
  );
  // 7 append diff func (only for number type)
  if (isNumber(item.type)) {
    tracer.append(
      tracer.getDiffFunc(
        getTypeTag(item.type),
        getParamPrefix(item),
        getValueFunc(item.type),
        isStruct,
        isNumber(item.type),
      ),
      2 + n,
    );
  }

  // 1' append class end
  tracer.append(tracer.endBracket, 1 + n);
}

export function handleStruct(
  item: StorageItem,
  tracer: Generator,
  structName: string,
  members: StorageItem[],
) {
  // 1 append class start
  tracer.append(tracer.getClass(structName), 1);
  // 2 append addr and variable and prefix
  tracer.append(tracer.argsTemplageStruct, 2);
  // 3 append constructor
  tracer.append(tracer.constructorTemplateStruct, 2);
  // 4 handle params
  members.forEach(function (item) {
    tracer.append(tracer.getStructParam(item.label, structName + '.' + item.label), 2);
  });
  // 1' append class end
  tracer.append(tracer.endBracket, 1);

  // 5 handle struct params to class
  tracer.append(`export namespace ${structName} {`, 1);
  members.forEach(function (item) {
    handleBasic(item.label, item, tracer, true, 1);
  });
  tracer.append(tracer.endBracket, 1);
}

export function handleMapping(
  item: StorageItem,
  tracer: Generator,
  structNameSet: Set<string>,
  obj: StorageLayout,
) {
  let firstParamType = getMapFirstParam(item.type);
  let secondParamType = getMapSecondParam(item.type);
  let ft = getTypeTag(firstParamType);
  let ff = getValueFunc(firstParamType);
  if (secondParamType.startsWith('t_mapping')) {
    firstParamType = getMapFirstParam(secondParamType);
    secondParamType = getMapSecondParam(secondParamType);
    ft = getTypeTag(firstParamType);
    ff = getValueFunc(firstParamType);

    let prefix = getStrAfterLastColon(item.contract) + '.' + item.label;
    tracer.append(tracer.getClass(item.label), 1);
    tracer.append(tracer.argsTemplage, 2);
    tracer.append(tracer.constructorTemplate, 2);
    tracer.append(tracer.getNestedMappingValue(item.label, prefix), 2);
    tracer.append(tracer.endBracket, 1);

    tracer.append(`export namespace ${item.label} {\n`, 1);
    tracer.append(`export class Value {\n`, 2);
    tracer.append(tracer.argsTemplageStruct, 2);
    tracer.append(tracer.constructorTemplateStruct, 2);

    tracer.append(
      tracer.getBeforeFuncMap(
        ft,
        ff,
        getTypeTag(secondParamType),
        'this.variable',
        getValueFunc(secondParamType),
        isNumber(secondParamType),
      ),
      2,
    );
    tracer.append(
      tracer.getChangesFuncMap(
        ft,
        ff,
        getTypeTag(secondParamType),
        'this.variable',
        getValueFunc(secondParamType),
        isNumber(secondParamType),
      ),
      2,
    );
    tracer.append(
      tracer.getLatestFuncMap(
        ft,
        ff,
        getTypeTag(secondParamType),
        'this.variable',
        getValueFunc(secondParamType),
        isNumber(secondParamType),
      ),
      2,
    );
    if (isNumber(secondParamType)) {
      tracer.append(
        tracer.getDiffFuncMap(
          ft,
          ff,
          getTypeTag(secondParamType),
          'this.variable',
          getValueFunc(secondParamType),
          isNumber(secondParamType),
        ),
        2,
      );
    }

    tracer.append(tracer.endBracket, 2);
    tracer.append(tracer.endBracket, 1);
    return;
  }
  // 1 append class start
  tracer.append(tracer.getClass(item.label), 1);
  // 2 append addr and prefix
  tracer.append(tracer.argsTemplage, 2);
  // 3 append constructor
  tracer.append(tracer.constructorTemplate, 2);
  // 4 handle map second param
  let secondParamIsStruct = false;
  if (secondParamType.startsWith('t_struct')) {
    secondParamIsStruct = true;
  }
  if (secondParamIsStruct) {
    let structName = getStructName(secondParamType);
    let prefix = getStrAfterLastColon(item.contract) + '.' + item.label;
    tracer.append(tracer.getMappintSecondParam(structName.toLowerCase(), structName, prefix), 2);
    // if struct has not been hadle
    if (!structNameSet.has(structName)) {
      let members = obj.types[getStrBetLastCommaAndParen(item.type)].members as StorageItem[];
      structNameSet.add(structName);
      handleStruct(item, tracer, structName, members);
    }
  } else {
    // 4.1 append before func
    tracer.append(
      tracer.getBeforeFuncMap(
        ft,
        ff,
        getTypeTag(secondParamType),
        '"' + getParamPrefix(item) + '"',
        getValueFunc(secondParamType),
        isNumber(secondParamType),
      ),
      2,
    );
    // 4.2 append changes func
    tracer.append(
      tracer.getChangesFuncMap(
        ft,
        ff,
        getTypeTag(secondParamType),
        '"' + getParamPrefix(item) + '"',
        getValueFunc(secondParamType),
        isNumber(secondParamType),
      ),
      2,
    );
    // 4.3 append lastest func
    tracer.append(
      tracer.getLatestFuncMap(
        ft,
        ff,
        getTypeTag(secondParamType),
        '"' + getParamPrefix(item) + '"',
        getValueFunc(secondParamType),
        isNumber(secondParamType),
      ),
      2,
    );
    // 4.4 append diff func (only for number type)
    if (isNumber(secondParamType)) {
      tracer.append(
        tracer.getDiffFuncMap(
          ft,
          ff,
          getTypeTag(secondParamType),
          '"' + getParamPrefix(item) + '"',
          getValueFunc(secondParamType),
          isNumber(secondParamType),
        ),
        2,
      );
    }
  }

  // 1' append class end
  tracer.append(tracer.endBracket, 1);
}
