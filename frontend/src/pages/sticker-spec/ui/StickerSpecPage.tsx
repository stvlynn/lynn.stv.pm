import { useStickerSpec } from 'features/browse-stickers';
import { t } from 'shared/i18n';
import { Page, PageHeader, QueryState, Skeleton } from 'shared/ui';
import { StickerGuide } from 'widgets/sticker-guide';

export function StickerSpecPage() {
  const spec = useStickerSpec();
  return (
    <Page>
      <PageHeader title={t('sticker.title')} code="SPC-05" />
      <QueryState query={spec} fallback={<Skeleton height="20rem" count={3} />}>
        {(data) => <StickerGuide spec={data} />}
      </QueryState>
    </Page>
  );
}
