import { invariant, type MediaAsset, type Slug, type Swatch } from '../shared';

export interface Credit {
  readonly role: string;
  readonly name: string;
  readonly url: string | null;
}

export interface Fact {
  readonly label: string;
  readonly value: string;
}

export interface Pillar {
  readonly id: Slug;
  readonly title: string;
  readonly body: string;
}

/** A visual feature that must stay stable across every depiction. */
export interface Trait {
  readonly id: Slug;
  readonly part: string;
  readonly label: string;
  readonly detail: string;
  readonly swatch: Swatch | null;
}

export interface Proportion {
  readonly headsTall: number;
  readonly note: string;
}

export interface CharacterProps {
  readonly name: string;
  readonly nameNative: string;
  readonly tagline: string;
  readonly summary: string;
  readonly credits: readonly Credit[];
  readonly facts: readonly Fact[];
  readonly pillars: readonly Pillar[];
  readonly traits: readonly Trait[];
  readonly palette: readonly Swatch[];
  readonly proportion: Proportion;
  readonly referenceSheet: MediaAsset;
  readonly doNot: readonly string[];
}

/** Aggregate root: the canonical definition of Lynn. */
export class Character {
  private constructor(private readonly props: CharacterProps) {}

  static create(props: CharacterProps): Character {
    invariant(props.name.trim().length > 0, 'CHARACTER_NAME_REQUIRED', 'A character needs a name');
    invariant(props.traits.length > 0, 'CHARACTER_TRAITS_REQUIRED', 'A character needs identity traits');
    const traitIds = props.traits.map((trait) => trait.id.value);
    invariant(new Set(traitIds).size === traitIds.length, 'CHARACTER_TRAIT_DUPLICATE', 'Trait ids must be unique');
    invariant(
      props.proportion.headsTall >= 2 && props.proportion.headsTall <= 9,
      'CHARACTER_PROPORTION_RANGE',
      'Head-to-body proportion must be between 2 and 9 heads',
    );
    return new Character(props);
  }

  get name(): string {
    return this.props.name;
  }

  get nameNative(): string {
    return this.props.nameNative;
  }

  get tagline(): string {
    return this.props.tagline;
  }

  get summary(): string {
    return this.props.summary;
  }

  get credits(): readonly Credit[] {
    return this.props.credits;
  }

  get facts(): readonly Fact[] {
    return this.props.facts;
  }

  get pillars(): readonly Pillar[] {
    return this.props.pillars;
  }

  get traits(): readonly Trait[] {
    return this.props.traits;
  }

  get palette(): readonly Swatch[] {
    return this.props.palette;
  }

  get proportion(): Proportion {
    return this.props.proportion;
  }

  get referenceSheet(): MediaAsset {
    return this.props.referenceSheet;
  }

  get doNot(): readonly string[] {
    return this.props.doNot;
  }

  trait(id: string): Trait | undefined {
    return this.props.traits.find((trait) => trait.id.value === id);
  }
}
