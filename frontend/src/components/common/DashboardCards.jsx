export default function DashboardCards({ stats }) {
  const items = [
    {
      label: "Kierowcy",
      value: stats.drivers?.active ?? 0,
      total: stats.drivers?.total ?? 0,
    },
    {
      label: "Pojazdy",
      value: stats.vehicles?.available ?? 0,
      total: stats.vehicles?.total ?? 0,
    },
    {
      label: "Naczepy",
      value: stats.trailers?.available ?? 0,
      total: stats.trailers?.total ?? 0,
    },
    {
      label: "Zlecenia",
      value: stats.transportOrders?.total ?? 0,
      total: null,
    },
  ];

  return (
    <div className="hidden min-w-0 flex-1 items-center justify-center gap-2 md:flex">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex h-8 items-center gap-2 border border-border bg-card px-3 text-xs text-muted-foreground"
        >
          <span className="whitespace-nowrap">{item.label}</span>
          <span className="font-semibold text-foreground">
            {item.total === null ? item.value : `${item.value}/${item.total}`}
          </span>
        </div>
      ))}
    </div>
  );
}
