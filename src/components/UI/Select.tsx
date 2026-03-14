interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
}

export function Select({ label, value, options, onChange }: SelectProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <label className="text-xs font-medium text-text-dim uppercase tracking-wider">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-surface-light/80 border border-white/[0.06] rounded-xl px-4 py-3.5 text-text text-base focus:outline-none focus:border-accent/60 focus:shadow-[0_0_0_3px_rgba(6,182,212,0.1)] transition-all duration-200"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
