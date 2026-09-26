import { paths } from 'shared/config';
import { t } from 'shared/i18n';
import { ButtonLink, FigureDrawing, Page, PageHeader } from 'shared/ui';
import styles from './NotFoundPage.module.css';

export function NotFoundPage() {
  return (
    <Page>
      <div className={styles.layout}>
        <div>
          <PageHeader title={t('errors.notFoundTitle')} code="404" lead={t('errors.notFoundBody')} />
          <ButtonLink to={paths.home} variant="ink">
            {t('errors.backHome')}
          </ButtonLink>
        </div>
        <div className={styles.drawing}>
          <FigureDrawing label={t('blueprint.figureLabel')} draw />
        </div>
      </div>
    </Page>
  );
}
