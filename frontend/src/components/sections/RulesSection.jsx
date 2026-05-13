import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RulesSection() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Statusy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div><strong>Kierowcy:</strong> active, inactive, unavailable</div>
          <div><strong>Pojazdy:</strong> available, in_use, in_service, inactive</div>
          <div><strong>Naczepy:</strong> available, in_use, in_service, inactive</div>
          <div><strong>Zlecenia:</strong> new, planned, in_progress, completed, cancelled</div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Założenia</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>Kierowca powinien być <strong>active</strong>, aby można było go przypisać do zlecenia.</p>
          <p>Pojazd i naczepa powinny mieć status <strong>available</strong>, aby można było ich użyć.</p>
          <p>Dobór naczepy do ładunku jest sprawdzany po stronie backendu.</p>
          <p>Kafelki dashboardu są pobierane z endpointu <strong>/dashboard/stats</strong>.</p>
        </CardContent>
      </Card>
    </div>
  );
}