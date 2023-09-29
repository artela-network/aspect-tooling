import { UtilityProvider } from '@artela/aspect-libs/system';
import { ABool } from '@artela/aspect-libs/types';

export function TestSlog(): i32 {
  UtilityProvider.sLog('test');
  const aBool = new ABool(true);
  return aBool.store();
}
