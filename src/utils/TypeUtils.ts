/**
 * All optional keys in T
 */
export type OptionalKeys<T> = {
  [K in keyof T]-?: Record<string, never> extends Pick<T, K> ? K : never;
}[keyof T];

/**
 * Pick all optional properties from T
 */
export type Optional<T> = Pick<T, OptionalKeys<T>>;
