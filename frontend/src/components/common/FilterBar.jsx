import { Filter } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function FilterBar({ label, value, options, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <Filter className="h-4 w-4 text-muted-foreground" />
      <Label className="text-sm">{label}</Label>
      <select
        className="flex h-10 min-w-[180px] rounded-md border bg-background px-3 py-2 text-sm"
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