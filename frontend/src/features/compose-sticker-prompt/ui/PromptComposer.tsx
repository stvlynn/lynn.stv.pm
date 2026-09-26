import { AnimatePresence, motion } from 'motion/react';
import { type FormEvent, useState } from 'react';
import { t } from 'shared/i18n';
import { duration, ease } from 'shared/lib';
import { Button, CopyValue, TextField } from 'shared/ui';
import { useComposePrompt } from '../api/use-compose-prompt';
import styles from './PromptComposer.module.css';

interface PromptComposerProps {
  readonly template: string;
  readonly example: { readonly text: string; readonly action: string };
  readonly maxCaptionLength: number;
}

/** Highlights the {text} and {action} slots of the template. */
function TemplatePreview({ template }: { readonly template: string }) {
  return (
    <p className={styles.prompt}>
      {template.split(/(\{text\}|\{action\})/).map((part, index) =>
        part === '{text}' || part === '{action}' ? (
          <mark key={index} className={styles.slot}>
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </p>
  );
}

/** Fills the sticker generation template server-side, with its rules applied. */
export function PromptComposer({ template, example, maxCaptionLength }: PromptComposerProps) {
  const [text, setText] = useState(example.text);
  const [action, setAction] = useState(example.action);
  const compose = useComposePrompt();
  const length = [...text].length;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    compose.mutate({ text, action });
  };

  return (
    <div className={styles.composer}>
      <form className={styles.form} onSubmit={submit}>
        <TextField
          label={t('sticker.composerText')}
          value={text}
          onChange={setText}
          error={length > maxCaptionLength}
          meta={t('sticker.composerCount', { count: length, max: maxCaptionLength })}
          required
        />
        <TextField label={t('sticker.composerAction')} value={action} onChange={setAction} required />
        <div className={styles.actions}>
          <Button type="submit" variant="accent" disabled={compose.isPending}>
            {t('sticker.composerSubmit')}
          </Button>
        </div>
        {compose.isError ? (
          <p className={styles.error} role="alert">
            {compose.error.message}
          </p>
        ) : null}
      </form>
      <div className={styles.output} aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={compose.data?.prompt ?? 'template'}
            className={styles.output}
            initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: duration.base, ease: ease.out }}
          >
            <span className={styles.label}>
              {compose.data ? t('sticker.composerResult') : t('sticker.composerTemplate')}
            </span>
            {compose.data ? (
              <p className={styles.prompt}>{compose.data.prompt}</p>
            ) : (
              <TemplatePreview template={template} />
            )}
            {compose.data ? (
              <div className={styles.actions}>
                <CopyValue value={compose.data.prompt}>{t('common.copy')}</CopyValue>
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
