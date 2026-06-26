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
  const [editingVehicleId, setEditingVehicleId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  const resetForm = () => {
    setForm(initialForm);
    setEditingVehicleId(null);
  };

  const handleEdit = (vehicle) => {
    setError("");
    setSuccess("");

    setEditingVehicleId(vehicle.id);
    setForm({
      registrationNumber: vehicle.registration_number || "",
      brand: vehicle.brand || "",
      model: vehicle.model || "",
      productionYear: vehicle.production_year || "",
      vehicleType: vehicle.vehicle_type || "truck",
      capacityKg: vehicle.capacity_kg || "",
      mileage: vehicle.mileage || "",
      status: vehicle.status || "available",
      inspectionValidUntil: vehicle.inspection_valid_until
        ? String(vehicle.inspection_valid_until).slice(0, 10)
        : "",
      insuranceValidUntil: vehicle.insurance_valid_until
        ? String(vehicle.insurance_valid_until).slice(0, 10)
        : "",
    });

    setSuccess(`Wczytano pojazd ${vehicle.registration_number} do edycji.`);
  };

  const handleDelete = async (vehicle) => {
    const confirmed = window.confirm(
      `Czy na pewno chcesz usunąć pojazd ${vehicle.registration_number}?`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");
    setDeleteLoadingId(vehicle.id);

    try {
      await apiRequest(
        `/vehicles/${vehicle.id}`,
        {
          method: "DELETE",
        },
        token
      );

      if (editingVehicleId === vehicle.id) {
        resetForm();
      }

      setSuccess(`Usunięto pojazd ${vehicle.registration_number}.`);
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const payload = {
      registrationNumber: form.registrationNumber,
      brand: form.brand,
      model: form.model,
      productionYear: form.productionYear ? Number(form.productionYear) : undefined,
      vehicleType: form.vehicleType,
      capacityKg: Number(form.capacityKg),
      mileage: form.mileage ? Number(form.mileage) : 0,
      status: form.status,
      inspectionValidUntil: form.inspectionValidUntil || null,
      insuranceValidUntil: form.insuranceValidUntil || null,
    };

    try {
      if (editingVehicleId) {
        await apiRequest(
          `/vehicles/${editingVehicleId}`,
          {
            method: "PUT",
            body: JSON.stringify(payload),
          },
          token
        );

        setSuccess("Pojazd został zaktualizowany.");
      } else {
        await apiRequest(
          "/vehicles",
          {
            method: "POST",
            body: JSON.stringify(payload),
          },
          token
        );

        setSuccess("Pojazd został dodany.");
      }

      resetForm();
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <Card className="rounded-md border-border bg-card">
        <CardHeader>
          <CardTitle>Lista pojazdów</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FilterBar
            label="Status"
            value={filterStatus}
            options={vehicleStatuses}
            onChange={setFilterStatus}
          />

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Rejestracja</TableHead>
                <TableHead>Marka / model</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ładowność</TableHead>
                <TableHead>Akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>{vehicle.id}</TableCell>
                  <TableCell>{vehicle.registration_number}</TableCell>
                  <TableCell>
                    {vehicle.brand} {vehicle.model}
                  </TableCell>
                  <TableCell>
                    <Badge variant={badgeVariant(vehicle.status)}>{vehicle.status}</Badge>
                  </TableCell>
                  <TableCell>{vehicle.capacity_kg} kg</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(vehicle)}
                      >
                        Edytuj
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        disabled={deleteLoadingId === vehicle.id}
                        onClick={() => handleDelete(vehicle)}
                      >
                        {deleteLoadingId === vehicle.id ? "Usuwanie..." : "Usuń"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="rounded-md border-border bg-card">
        <CardHeader>
          <CardTitle>
            {editingVehicleId ? "Edytuj pojazd" : "Dodaj pojazd"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Rejestracja</Label>
                <Input
                  value={form.registrationNumber}
                  onChange={(e) =>
                    setForm({ ...form, registrationNumber: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Typ pojazdu</Label>
                <Input
                  value={form.vehicleType}
                  onChange={(e) => setForm({ ...form, vehicleType: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Marka</Label>
                <Input
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Model</Label>
                <Input
                  value={form.model}
                  onChange={(e) => setForm({ ...form, model: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Rok produkcji</Label>
                <Input
                  type="number"
                  value={form.productionYear}
                  onChange={(e) =>
                    setForm({ ...form, productionYear: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Ładowność (kg)</Label>
                <Input
                  type="number"
                  value={form.capacityKg}
                  onChange={(e) => setForm({ ...form, capacityKg: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Przebieg</Label>
                <Input
                  type="number"
                  value={form.mileage}
                  onChange={(e) => setForm({ ...form, mileage: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {vehicleStatuses
                    .filter((s) => s !== "all")
                    .map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Przegląd ważny do</Label>
                <Input
                  type="date"
                  value={form.inspectionValidUntil}
                  onChange={(e) =>
                    setForm({ ...form, inspectionValidUntil: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Ubezpieczenie ważne do</Label>
                <Input
                  type="date"
                  value={form.insuranceValidUntil}
                  onChange={(e) =>
                    setForm({ ...form, insuranceValidUntil: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading
                  ? "Zapisywanie..."
                  : editingVehicleId
                  ? "Zapisz zmiany"
                  : "Dodaj pojazd"}
              </Button>

              {editingVehicleId ? (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Anuluj
                </Button>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}