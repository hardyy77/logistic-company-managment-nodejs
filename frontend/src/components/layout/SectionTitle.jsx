export default function SectionTitle({ title, subtitle, action }) {
  return (
    <div className="flex flex-col gap-2 border-b border-border pb-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}
