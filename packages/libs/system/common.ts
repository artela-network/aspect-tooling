export interface ImmutableAspectValue<T> {
  unwrap(): T | null;
}

export interface MutableAspectValue<T> extends ImmutableAspectValue<T> {
  set<T>(value: T): void;
}
