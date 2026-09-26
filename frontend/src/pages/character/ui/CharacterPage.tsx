import { useCharacterProfile } from 'features/explore-character';
import { t } from 'shared/i18n';
import { Page, PageHeader, QueryState, Section, Skeleton } from 'shared/ui';
import {
  CharacterOverview,
  CharacterPalette,
  CharacterPrinciples,
  CharacterProportion,
  CharacterReference,
} from 'widgets/character-profile';
import { TraitSheet } from 'widgets/trait-sheet';

export function CharacterPage() {
  const profile = useCharacterProfile();
  return (
    <Page>
      <QueryState query={profile} fallback={<Skeleton height="18rem" count={3} />}>
        {(data) => (
          <>
            <PageHeader title={`${data.name} · ${data.nameNative}`} code="CHR-01" lead={data.summary} />
            <CharacterOverview profile={data} />
            <CharacterPrinciples profile={data} />
            <Section id="traits" title={t('character.traits')} code="CHR-01.3">
              <TraitSheet profile={data} />
            </Section>
            <CharacterPalette profile={data} />
            <CharacterProportion profile={data} />
            <CharacterReference profile={data} />
          </>
        )}
      </QueryState>
    </Page>
  );
}
