import { CenterMorphModal, CenterMorphModalContent } from '@/components/motion/center-morph-modal';
import type { ReactNode } from 'react';
import { t } from '../i18n';
import { cn } from '../lib';

interface DialogProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly label: string;
  /** Tailwind max-width class for the panel, e.g. `max-w-5xl`. */
  readonly widthClass?: string;
  readonly children: ReactNode;
}

/** beUI center-morph modal, controlled. */
export function Dialog({ open, onClose, label, widthClass = 'max-w-3xl', children }: DialogProps) {
  return (
    <CenterMorphModal open={open} onOpenChange={(next) => (next ? undefined : onClose())}>
      <CenterMorphModalContent
        ariaLabel={label}
        closeButtonLabel={t('common.close')}
        className={cn('bg-card text-foreground', widthClass)}
        backdropClassName="bg-(--ink-950)/50"
      >
        {children}
      </CenterMorphModalContent>
    </CenterMorphModal>
  );
}
