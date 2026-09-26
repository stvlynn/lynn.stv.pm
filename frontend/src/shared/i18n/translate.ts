import { en } from './en';

type Messages = typeof en;

type Leaves<T, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends string ? `${Prefix}${K}` : Leaves<T[K], `${Prefix}${K}.`>;
}[keyof T & string];

export type MessageKey = Leaves<Messages>;

/** Looks up an interface string and fills `{name}` placeholders. */
export function t(key: MessageKey, params?: Readonly<Record<string, string | number>>): string {
  const value = key.split('.').reduce<unknown>((node, part) => (node as Record<string, unknown>)[part], en);
  if (typeof value !== 'string') {
    throw new Error(`Missing message: ${key}`);
  }
  return params ? value.replace(/\{(\w+)\}/g, (match, name: string) => String(params[name] ?? match)) : value;
}
