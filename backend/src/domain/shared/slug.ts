import { invariant } from './domain-error';

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Kebab-case identifier used in URLs. */
export class Slug {
  private constructor(public readonly value: string) {}

  static of(value: string): Slug {
    invariant(SLUG_PATTERN.test(value), 'INVALID_SLUG', `Not a kebab-case slug: "${value}"`);
    return new Slug(value);
  }

  equals(other: Slug): boolean {
    return this.value === other.value;
  }
}
