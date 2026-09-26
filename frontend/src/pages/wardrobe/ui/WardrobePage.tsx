import { useOutfits } from 'features/explore-wardrobe';
import { t } from 'shared/i18n';
import { Page, PageHeader, QueryState, Skeleton } from 'shared/ui';
import { OutfitShowcase } from 'widgets/outfit-showcase';

export function WardrobePage() {
  const outfits = useOutfits();
  return (
    <Page>
      <PageHeader title={t('wardrobe.title')} code="WRD-02" lead={t('wardrobe.lead')} />
      <QueryState query={outfits} fallback={<Skeleton height="36rem" />}>
        {(data) => <OutfitShowcase outfits={data} />}
      </QueryState>
    </Page>
  );
}
