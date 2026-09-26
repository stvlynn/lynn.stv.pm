import type { UseQueryResult } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { ApiRequestError } from '../api';
import { t } from '../i18n';
import { Button } from './Button';
import styles from './Feedback.module.css';

export function Skeleton({ height, count = 1 }: { readonly height: string; readonly count?: number }) {
  return (
    <div className={styles.stack} role="status" aria-label={t('common.loading')}>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className={styles.skeleton} style={{ height }} />
      ))}
    </div>
  );
}

export function ErrorState({ error, onRetry }: { readonly error: Error; readonly onRetry?: () => void }) {
  const code = error instanceof ApiRequestError ? error.code : error.name;
  return (
    <div className={styles.error} role="alert">
      <h2 className={styles.errorTitle}>{t('errors.title')}</h2>
      <span className={styles.errorCode}>
        {code} · {error.message}
      </span>
      {onRetry ? (
        <Button variant="outline" size="small" onClick={onRetry}>
          {t('common.retry')}
        </Button>
      ) : null}
    </div>
  );
}

interface QueryStateProps<T> {
  readonly query: UseQueryResult<T>;
  readonly fallback: ReactNode;
  readonly children: (data: T) => ReactNode;
}

/** Renders loading, error and success states of a query in one place. */
export function QueryState<T>({ query, fallback, children }: QueryStateProps<T>) {
  if (query.isPending) {
    return <>{fallback}</>;
  }
  if (query.isError) {
    return <ErrorState error={query.error} onRetry={() => void query.refetch()} />;
  }
  return <>{children(query.data)}</>;
}
