import { Switch as BeuiSwitch } from '@/components/motion/switch';

interface SwitchProps {
  readonly label: string;
  readonly checked: boolean;
  readonly onChange: (checked: boolean) => void;
}

export function Switch({ label, checked, onChange }: SwitchProps) {
  return <BeuiSwitch checked={checked} onCheckedChange={onChange} label={label} />;
}
