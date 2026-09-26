import type { CharacterProfile } from 'entities/character';
import { useRef, useState } from 'react';
import { t } from 'shared/i18n';
import { useCopy } from 'shared/lib';
import { Button, Icon } from 'shared/ui';
import { composeCharacterPrompt } from '../lib/compose-character-prompt';
import styles from './CharacterPrompt.module.css';

export function CharacterPrompt({ profile }: { readonly profile: CharacterProfile }) {
  const prompt = composeCharacterPrompt(profile);
  const { copied, copy } = useCopy();
  const [failed, setFailed] = useState(false);
  const preview = useRef<HTMLDetailsElement>(null);
  const text = useRef<HTMLTextAreaElement>(null);

  const copyPrompt = async () => {
    setFailed(false);
    try {
      await copy(prompt);
    } catch {
      setFailed(true);
      if (preview.current) preview.current.open = true;
      text.current?.focus();
      text.current?.select();
    }
  };

  return (
    <div className={styles.layout}>
      <div className={styles.actions}>
        <p className={styles.description}>{t('character.promptDescription')}</p>
        <Button variant="ink" onClick={() => void copyPrompt()}>
          <Icon name={copied ? 'check' : 'copy'} size={16} />
          {copied ? t('character.promptCopied') : t('character.copyPrompt')}
        </Button>
      </div>
      <p className={failed ? styles.error : styles.status} role="status">
        {failed ? t('character.promptCopyError') : copied ? t('character.promptCopied') : ''}
      </p>
      <details ref={preview} className={styles.preview}>
        <summary>{t('character.previewPrompt')}</summary>
        <textarea ref={text} readOnly value={prompt} rows={14} aria-label={t('character.prompt')} />
      </details>
    </div>
  );
}
