export const ErrLoadRuntimeCtxValue = new Error('load runtime context value failed');
export const ErrLoadAspectProperty = new Error('failed to load aspect property');
export const ErrLoadAspectContext = new Error('failed to load aspect context');
export const ErrLoadAspectState = new Error('failed to read aspect state value');
export const ErrUpdateAspectState = new Error('failed to update aspect state value');

export const ErrParseValueFail = new Error('unable to parse aspect value');
export const NotAuthorizedFail = new Error('unknowable context, not authorized to initialize');

export function NewMessageError(msg: string): Error {
  return new Error(msg);
}
