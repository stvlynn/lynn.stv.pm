import { Tabs, TabsList, TabsTrigger } from '@/components/motion/tabs';

interface Option<T extends string> {
  readonly value: T;
  readonly label: string;
}

interface SegmentedControlProps<T extends string> {
  readonly label: string;
  readonly options: readonly Option<T>[];
  readonly value: T;
  readonly onChange: (value: T) => void;
}

/** beUI segment tabs used as a single-choice filter. */
export function SegmentedControl<T extends string>({ label, options, value, onChange }: SegmentedControlProps<T>) {
  return (
    <Tabs variant="segment" value={value} onValueChange={(next) => onChange(next as T)}>
      <TabsList className="border border-border font-mono" wrapperClassName="w-auto">
        {options.map((option) => (
          <TabsTrigger key={option.value} value={option.value} className="text-xs tracking-[0.03em]">
            {option.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <span className="sr-only">{label}</span>
    </Tabs>
  );
}
