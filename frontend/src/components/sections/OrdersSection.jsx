import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FilterBar from "@/components/common/FilterBar";
import { cargoTypes, orderStatuses } from "@/constants/options";
import { badgeVariant } from "@/utils/badgeVariant";
import { apiRequest } from "@/services/api";

export default function OrdersSection({
  token,
  orders,
  drivers,
  vehicles,
  trailers,
  user,
  refresh,
  setError,
  setSuccess,
  filterStatus,
  setFilterStatus,
}) {
  const initialForm = {
    orderNumber: "",
    clientName: "",
    pickupLocation: "",
    deliveryLocation: "",
    cargoWeightKg: "",
    cargoType: "general",
    plannedDistanceKm: "",
    plannedDurationMinutes: "",
    estimatedCost: "",
    plannedDate: "",
    status: "new",
    driverId: "",
    vehicleId: "",
    trailerId: "",
  };

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await apiRequest(
        "/transport-orders",
        {
          method: "POST",
          body: JSON.stringify({
            ...form,
            cargoWeightKg: Number(form.cargoWeightKg),
            plannedDistanceKm: form.plannedDistanceKm ? Number(form.plannedDistanceKm) : undefined,
            plannedDurationMinutes: form.plannedDurationMinutes ? Number(form.plannedDurationMinutes) : undefined,
            estimatedCost: form.estimatedCost ? Number(form.estimatedCost) : undefined,
            driverId: form.driverId ? Number(form.driverId) : undefined,
            vehicleId: form.vehicleId ? Number(form.vehicleId) : undefined,
            trailerId: form.trailerId ? Number(form.trailerId) : undefined,
            createdByUserId: user?.id,
          }),
        },
        token
      );

      setForm(initialForm);
      setSuccess("Zlecenie zostało dodane.");
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Lista zleceń</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FilterBar label="Status" value={filterStatus} options={orderStatuses} onChange={setFilterStatus} />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nr</TableHead>
                <TableHead>Klient</TableHead>
                <TableHead>Trasa</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ładunek</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.order_number}</TableCell>
                  <TableCell>{order.client_name}</TableCell>
                  <TableCell>{order.pickup_location} → {order.delivery_location}</TableCell>
                  <TableCell><Badge variant={badgeVariant(order.status)}>{order.status}</Badge></TableCell>
                  <TableCell>{order.cargo_weight_kg} kg / {order.cargo_type || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Dodaj zlecenie</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Numer zlecenia</Label><Input value={form.orderNumber} onChange={(e) => setForm({ ...form, orderNumber: e.target.value })} /></div>
              <div className="space-y-2"><Label>Klient</Label><Input value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label>Miejsce załadunku</Label><Input value={form.pickupLocation} onChange={(e) => setForm({ ...form, pickupLocation: e.target.value })} /></div>
            <div className="space-y-2"><Label>Miejsce rozładunku</Label><Input value={form.deliveryLocation} onChange={(e) => setForm({ ...form, deliveryLocation: e.target.value })} /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Rodzaj ładunku</Label>
                <select className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm" value={form.cargoType} onChange={(e) => setForm({ ...form, cargoType: e.target.value })}>
                  {cargoTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2"><Label>Masa ładunku (kg)</Label><Input type="number" value={form.cargoWeightKg} onChange={(e) => setForm({ ...form, cargoWeightKg: e.target.value })} /></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2"><Label>Dystans (km)</Label><Input type="number" value={form.plannedDistanceKm} onChange={(e) => setForm({ ...form, plannedDistanceKm: e.target.value })} /></div>
              <div className="space-y-2"><Label>Czas (min)</Label><Input type="number" value={form.plannedDurationMinutes} onChange={(e) => setForm({ ...form, plannedDurationMinutes: e.target.value })} /></div>
              <div className="space-y-2"><Label>Koszt</Label><Input type="number" value={form.estimatedCost} onChange={(e) => setForm({ ...form, estimatedCost: e.target.value })} /></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Data realizacji</Label><Input type="date" value={form.plannedDate} onChange={(e) => setForm({ ...form, plannedDate: e.target.value })} /></div>
              <div className="space-y-2">
                <Label>Status</Label>
                <select className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {orderStatuses.filter((s) => s !== "all").map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Kierowca</Label>
                <select className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm" value={form.driverId} onChange={(e) => setForm({ ...form, driverId: e.target.value })}>
                  <option value="">Brak</option>
                  {drivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.first_name} {driver.last_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Pojazd</Label>
                <select className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm" value={form.vehicleId} onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}>
                  <option value="">Brak</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.registration_number}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Naczepa</Label>
                <select className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm" value={form.trailerId} onChange={(e) => setForm({ ...form, trailerId: e.target.value })}>
                  <option value="">Brak</option>
                  {trailers.map((trailer) => (
                    <option key={trailer.id} value={trailer.id}>
                      {trailer.registration_number} / {trailer.trailer_type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Zapisywanie..." : "Dodaj zlecenie"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}