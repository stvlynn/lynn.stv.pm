import { useUiSpec } from 'features/inspect-tokens';
import { t } from 'shared/i18n';
import { Page, PageHeader, QueryState, Skeleton } from 'shared/ui';
import { UiFoundations } from 'widgets/ui-foundations';

export function UiSpecPage() {
  const spec = useUiSpec();
  return (
    <Page>
      <PageHeader title={t('ui.title')} code="SPC-04" lead={t('ui.lead')} />
      <QueryState query={spec} fallback={<Skeleton height="12rem" count={4} />}>
        {(data) => <UiFoundations spec={data} />}
      </QueryState>
    </Page>
  );
}
