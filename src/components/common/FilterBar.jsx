import { Label } from "@/components/ui/label";

export default function FilterBar({ label, value, options, onChange }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <Label className="text-sm text-muted-foreground">{label}</Label>
      <select
        className="flex h-9 min-w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  );
}
