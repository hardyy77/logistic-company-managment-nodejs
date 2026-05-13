import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FilterBar from "@/components/common/FilterBar";
import { vehicleStatuses } from "@/constants/options";
import { badgeVariant } from "@/utils/badgeVariant";
import { apiRequest } from "@/services/api";

export default function VehiclesSection({
  token,
  vehicles,
  refresh,
  setError,
  setSuccess,
  filterStatus,
  setFilterStatus,
}) {
  const initialForm = {
    registrationNumber: "",
    brand: "",
    model: "",
    productionYear: "",
    vehicleType: "truck",
    capacityKg: "",
    mileage: "",
    status: "available",
    inspectionValidUntil: "",
    insuranceValidUntil: "",
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
        "/vehicles",
        {
          method: "POST",
          body: JSON.stringify({
            ...form,
            productionYear: form.productionYear ? Number(form.productionYear) : undefined,
            capacityKg: Number(form.capacityKg),
            mileage: form.mileage ? Number(form.mileage) : 0,
          }),
        },
        token
      );

      setForm(initialForm);
      setSuccess("Pojazd został dodany.");
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Lista pojazdów</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FilterBar label="Status" value={filterStatus} options={vehicleStatuses} onChange={setFilterStatus} />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Rejestracja</TableHead>
                <TableHead>Marka / model</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ładowność</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>{vehicle.id}</TableCell>
                  <TableCell>{vehicle.registration_number}</TableCell>
                  <TableCell>{vehicle.brand} {vehicle.model}</TableCell>
                  <TableCell><Badge variant={badgeVariant(vehicle.status)}>{vehicle.status}</Badge></TableCell>
                  <TableCell>{vehicle.capacity_kg} kg</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Dodaj pojazd</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Rejestracja</Label><Input value={form.registrationNumber} onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })} /></div>
              <div className="space-y-2"><Label>Typ pojazdu</Label><Input value={form.vehicleType} onChange={(e) => setForm({ ...form, vehicleType: e.target.value })} /></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Marka</Label><Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} /></div>
              <div className="space-y-2"><Label>Model</Label><Input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} /></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Rok produkcji</Label><Input type="number" value={form.productionYear} onChange={(e) => setForm({ ...form, productionYear: e.target.value })} /></div>
              <div className="space-y-2"><Label>Ładowność (kg)</Label><Input type="number" value={form.capacityKg} onChange={(e) => setForm({ ...form, capacityKg: e.target.value })} /></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Przebieg</Label><Input type="number" value={form.mileage} onChange={(e) => setForm({ ...form, mileage: e.target.value })} /></div>
              <div className="space-y-2">
                <Label>Status</Label>
                <select className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {vehicleStatuses.filter((s) => s !== "all").map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Przegląd ważny do</Label><Input type="date" value={form.inspectionValidUntil} onChange={(e) => setForm({ ...form, inspectionValidUntil: e.target.value })} /></div>
              <div className="space-y-2"><Label>Ubezpieczenie ważne do</Label><Input type="date" value={form.insuranceValidUntil} onChange={(e) => setForm({ ...form, insuranceValidUntil: e.target.value })} /></div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Zapisywanie..." : "Dodaj pojazd"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}