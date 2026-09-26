import { Input } from '@/components/motion/input';
import type { ReactNode } from 'react';

interface TextFieldProps {
  readonly label: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly meta?: ReactNode;
  readonly placeholder?: string;
  readonly type?: 'text' | 'search';
  readonly required?: boolean;
  readonly error?: string | boolean;
}

/** beUI input with a mono counter in the trailing slot. */
export function TextField({
  label,
  value,
  onChange,
  meta,
  placeholder,
  type = 'text',
  required,
  error,
}: TextFieldProps) {
  return (
    <Input
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      required={required}
      error={error}
      rightIcon={meta ? <span className="pr-3.5 font-mono text-xs tabular-nums">{meta}</span> : undefined}
      classNames={{ label: 'font-mono text-xs uppercase tracking-[0.08em] text-(--color-text-muted)' }}
    />
  );
}
