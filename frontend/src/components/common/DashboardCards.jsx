import { Card, CardContent } from "@/components/ui/card";
import { Truck, Users, Package } from "lucide-react";

export default function DashboardCards({ stats }) {
  const items = [
    {
      title: "Kierowcy",
      value: stats.drivers?.total ?? 0,
      subtitle: `aktywni: ${stats.drivers?.active ?? 0}`,
      icon: Users,
    },
    {
      title: "Pojazdy",
      value: stats.vehicles?.total ?? 0,
      subtitle: `dostępne: ${stats.vehicles?.available ?? 0}`,
      icon: Truck,
    },
    {
      title: "Naczepy",
      value: stats.trailers?.total ?? 0,
      subtitle: `dostępne: ${stats.trailers?.available ?? 0}`,
      icon: Truck,
    },
    {
      title: "Zlecenia",
      value: stats.transportOrders?.total ?? 0,
      subtitle: `new: ${stats.transportOrders?.new ?? 0}, planned: ${stats.transportOrders?.planned ?? 0}`,
      icon: Package,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.title} className="rounded-2xl shadow-sm">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <div className="text-sm text-muted-foreground">{item.title}</div>
                <div className="mt-1 text-3xl font-semibold">{item.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{item.subtitle}</div>
              </div>
              <div className="rounded-xl bg-slate-100 p-3">
                <Icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}