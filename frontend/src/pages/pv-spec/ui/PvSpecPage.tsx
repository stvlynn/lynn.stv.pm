import { usePvSpec } from 'features/study-pv';
import { t } from 'shared/i18n';
import { Page, PageHeader, QueryState, Skeleton } from 'shared/ui';
import { PvGuide } from 'widgets/pv-guide';

export function PvSpecPage() {
  const spec = usePvSpec();
  return (
    <Page>
      <QueryState query={spec} fallback={<Skeleton height="20rem" count={3} />}>
        {(data) => (
          <>
            <PageHeader
              title={`${t('pv.title')} · ${data.title}`}
              code="SPC-06"
              lead={data.summary}
              meta={[data.titleNative]}
            />
            <PvGuide spec={data} />
          </>
        )}
      </QueryState>
    </Page>
  );
}
