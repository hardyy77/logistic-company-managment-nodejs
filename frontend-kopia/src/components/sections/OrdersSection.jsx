import { useEffect, useState } from "react";
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

const durationOptions = [
  { label: "24h", value: 1440 },
  { label: "48h", value: 2880 },
  { label: "72h", value: 4320 },
  { label: "7 dni", value: 10080 },
];

export default function OrdersSection({
  token,
  orders,
  user,
  refresh,
  setError,
  setSuccess,
  filterStatus,
  setFilterStatus,
}) {
  const initialForm = {
    clientName: "",
    pickupLocation: "",
    deliveryLocation: "",
    cargoWeightKg: "",
    cargoType: "general",
    cargoName: "",
    plannedDistanceKm: "",
    plannedDurationMinutes: 1440,
    estimatedCost: "",
    plannedDate: "",
    status: "new",
    driverId: "",
    vehicleId: "",
    trailerId: "",
  };

  const [form, setForm] = useState(initialForm);
  const [editingOrderId, setEditingOrderId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [resourceLoading, setResourceLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [availableTrailers, setAvailableTrailers] = useState([]);
  const [requiredPermissionSets, setRequiredPermissionSets] = useState([]);

  const resetForm = () => {
    setForm(initialForm);
    setEditingOrderId(null);
    setAvailableDrivers([]);
    setAvailableVehicles([]);
    setAvailableTrailers([]);
    setRequiredPermissionSets([]);
  };

  const fetchAvailableResources = async () => {
    if (!token) return;

    if (!form.cargoType || !form.cargoWeightKg) {
      setAvailableDrivers([]);
      setAvailableVehicles([]);
      setAvailableTrailers([]);
      setRequiredPermissionSets([]);
      return;
    }

    try {
      setResourceLoading(true);
      setError("");

      const query = new URLSearchParams({
        cargoType: form.cargoType,
        cargoWeightKg: String(form.cargoWeightKg),
      });

      if (editingOrderId) {
        query.append("excludeOrderId", String(editingOrderId));
      }

      const data = await apiRequest(
        `/transport-orders/available-resources?${query.toString()}`,
        {},
        token
      );

      setAvailableDrivers(data.drivers || []);
      setAvailableVehicles(data.vehicles || []);
      setAvailableTrailers(data.trailers || []);
      setRequiredPermissionSets(
        Array.isArray(data.requiredPermissionSets) ? data.requiredPermissionSets : []
      );
    } catch (err) {
      setError(err.message);
      setAvailableDrivers([]);
      setAvailableVehicles([]);
      setAvailableTrailers([]);
      setRequiredPermissionSets([]);
    } finally {
      setResourceLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableResources();
  }, [form.cargoType, form.cargoWeightKg, token, editingOrderId]);

  useEffect(() => {
    if (
      form.driverId &&
      !availableDrivers.some((driver) => String(driver.id) === String(form.driverId))
    ) {
      setForm((prev) => ({ ...prev, driverId: "" }));
    }

    if (
      form.vehicleId &&
      !availableVehicles.some((vehicle) => String(vehicle.id) === String(form.vehicleId))
    ) {
      setForm((prev) => ({ ...prev, vehicleId: "" }));
    }

    if (
      form.trailerId &&
      !availableTrailers.some((trailer) => String(trailer.id) === String(form.trailerId))
    ) {
      setForm((prev) => ({ ...prev, trailerId: "" }));
    }
  }, [availableDrivers, availableVehicles, availableTrailers]);

  const handleEdit = async (order) => {
    setError("");
    setSuccess("");

    setEditingOrderId(order.id);
    setForm({
      clientName: order.client_name || "",
      pickupLocation: order.pickup_location || "",
      deliveryLocation: order.delivery_location || "",
      cargoWeightKg: order.cargo_weight_kg || "",
      cargoType: order.cargo_type || "general",
      cargoName: order.cargo_name || "",
      plannedDistanceKm: order.planned_distance_km || "",
      plannedDurationMinutes: order.planned_duration_minutes || 1440,
      estimatedCost: order.estimated_cost || "",
      plannedDate: order.planned_date ? String(order.planned_date).slice(0, 10) : "",
      status: order.status || "new",
      driverId: order.driver_id ? String(order.driver_id) : "",
      vehicleId: order.vehicle_id ? String(order.vehicle_id) : "",
      trailerId: order.trailer_id ? String(order.trailer_id) : "",
    });

    setSuccess(`Wczytano zlecenie ${order.order_number} do edycji.`);
  };

  const handleDelete = async (order) => {
    const confirmed = window.confirm(
      `Czy na pewno chcesz usunąć zlecenie ${order.order_number}?`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");
    setDeleteLoadingId(order.id);

    try {
      await apiRequest(
        `/transport-orders/${order.id}`,
        {
          method: "DELETE",
        },
        token
      );

      if (editingOrderId === order.id) {
        resetForm();
      }

      setSuccess(`Usunięto zlecenie ${order.order_number}.`);
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
      clientName: form.clientName,
      pickupLocation: form.pickupLocation,
      deliveryLocation: form.deliveryLocation,
      cargoWeightKg: Number(form.cargoWeightKg),
      cargoType: form.cargoType,
      cargoName: form.cargoName,
      plannedDistanceKm: form.plannedDistanceKm
        ? Number(form.plannedDistanceKm)
        : undefined,
      plannedDurationMinutes: Number(form.plannedDurationMinutes),
      estimatedCost: form.estimatedCost ? Number(form.estimatedCost) : undefined,
      plannedDate: form.plannedDate,
      status: form.status,
      driverId: form.driverId ? Number(form.driverId) : undefined,
      vehicleId: form.vehicleId ? Number(form.vehicleId) : undefined,
      trailerId: form.trailerId ? Number(form.trailerId) : undefined,
      createdByUserId: user?.id,
    };

    try {
      if (editingOrderId) {
        const currentOrder = orders.find((order) => order.id === editingOrderId);

        await apiRequest(
          `/transport-orders/${editingOrderId}`,
          {
            method: "PUT",
            body: JSON.stringify({
              orderNumber: currentOrder?.order_number,
              ...payload,
            }),
          },
          token
        );

        setSuccess("Zlecenie zostało zaktualizowane.");
      } else {
        await apiRequest(
          "/transport-orders",
          {
            method: "POST",
            body: JSON.stringify(payload),
          },
          token
        );

        setSuccess("Zlecenie zostało dodane.");
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
    <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Lista zleceń</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FilterBar
            label="Status"
            value={filterStatus}
            options={orderStatuses}
            onChange={setFilterStatus}
          />

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nr</TableHead>
                <TableHead>Klient</TableHead>
                <TableHead>Ładunek</TableHead>
                <TableHead>Trasa</TableHead>
                <TableHead>Kierowca</TableHead>
                <TableHead>Pojazd</TableHead>
                <TableHead>Naczepa</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.order_number}</TableCell>
                  <TableCell>{order.client_name}</TableCell>
                  <TableCell>
                    <div className="font-medium">{order.cargo_name || "—"}</div>
                    <div className="text-xs text-muted-foreground">
                      {order.cargo_type || "—"} / {order.cargo_weight_kg} kg
                    </div>
                  </TableCell>
                  <TableCell>
                    {order.pickup_location} → {order.delivery_location}
                  </TableCell>
                  <TableCell>
                    {order.driver_first_name
                      ? `${order.driver_first_name} ${order.driver_last_name}`
                      : "—"}
                  </TableCell>
                  <TableCell>{order.vehicle_registration_number || "—"}</TableCell>
                  <TableCell>
                    {order.trailer_registration_number
                      ? `${order.trailer_registration_number}${
                          order.trailer_type ? ` / ${order.trailer_type}` : ""
                        }`
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={badgeVariant(order.status)}>{order.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(order)}
                      >
                        Edytuj
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        disabled={deleteLoadingId === order.id}
                        onClick={() => handleDelete(order)}
                      >
                        {deleteLoadingId === order.id ? "Usuwanie..." : "Usuń"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>
            {editingOrderId ? "Edytuj zlecenie" : "Dodaj zlecenie"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="rounded-lg border bg-slate-50 p-3 text-sm text-muted-foreground">
              {editingOrderId
                ? "Edytujesz istniejące zlecenie."
                : "Numer zlecenia zostanie nadany automatycznie przez system."}
            </div>

            <div className="space-y-2">
              <Label>Klient</Label>
              <Input
                value={form.clientName}
                onChange={(e) => setForm({ ...form, clientName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Miejsce załadunku</Label>
              <Input
                value={form.pickupLocation}
                onChange={(e) => setForm({ ...form, pickupLocation: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Miejsce rozładunku</Label>
              <Input
                value={form.deliveryLocation}
                onChange={(e) => setForm({ ...form, deliveryLocation: e.target.value })}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Typ ładunku</Label>
                <select
                  className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
                  value={form.cargoType}
                  onChange={(e) => setForm({ ...form, cargoType: e.target.value })}
                >
                  {cargoTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Nazwa ładunku</Label>
                <Input
                  placeholder="np. jabłka"
                  value={form.cargoName}
                  onChange={(e) => setForm({ ...form, cargoName: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Masa ładunku (kg)</Label>
                <Input
                  type="number"
                  value={form.cargoWeightKg}
                  onChange={(e) => setForm({ ...form, cargoWeightKg: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Planowany czas realizacji</Label>
                <select
                  className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
                  value={form.plannedDurationMinutes}
                  onChange={(e) =>
                    setForm({ ...form, plannedDurationMinutes: Number(e.target.value) })
                  }
                >
                  {durationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Dystans (km)</Label>
                <Input
                  type="number"
                  value={form.plannedDistanceKm}
                  onChange={(e) =>
                    setForm({ ...form, plannedDistanceKm: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Koszt</Label>
                <Input
                  type="number"
                  value={form.estimatedCost}
                  onChange={(e) => setForm({ ...form, estimatedCost: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Data realizacji</Label>
                <Input
                  type="date"
                  value={form.plannedDate}
                  onChange={(e) => setForm({ ...form, plannedDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <select
                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                {orderStatuses
                  .filter((status) => status !== "all")
                  .map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
              </select>
            </div>

            <Separator />

            <div className="rounded-lg border bg-slate-50 p-3 text-sm">
              <div className="font-medium">Dostępne zasoby do tego zlecenia</div>
              <div className="mt-1 text-muted-foreground">
                Backend filtruje zasoby na podstawie typu ładunku, masy i wymaganych uprawnień.
              </div>

              {requiredPermissionSets.length > 0 ? (
                <div className="mt-2 text-xs text-muted-foreground">
                  Możliwe zestawy uprawnień:
                  <div className="mt-1 space-y-1">
                    {requiredPermissionSets.map((set, index) => (
                      <div key={index}>- {set.join(" + ")}</div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-2 text-xs text-muted-foreground">
                Kierowcy: {availableDrivers.length} | Pojazdy: {availableVehicles.length} | Naczepy: {availableTrailers.length}
              </div>

              {resourceLoading ? (
                <div className="mt-2 text-xs text-muted-foreground">
                  Szukanie dostępnych kierowców, pojazdów i naczep...
                </div>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Kierowca</Label>
                <select
                  className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
                  value={form.driverId}
                  onChange={(e) => setForm({ ...form, driverId: e.target.value })}
                >
                  <option value="">Brak</option>
                  {availableDrivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.first_name} {driver.last_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Pojazd</Label>
                <select
                  className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
                  value={form.vehicleId}
                  onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
                >
                  <option value="">Brak</option>
                  {availableVehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.registration_number} / {vehicle.brand} {vehicle.model}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Naczepa</Label>
                <select
                  className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
                  value={form.trailerId}
                  onChange={(e) => setForm({ ...form, trailerId: e.target.value })}
                >
                  <option value="">Brak</option>
                  {availableTrailers.map((trailer) => (
                    <option key={trailer.id} value={trailer.id}>
                      {trailer.registration_number} / {trailer.trailer_type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading
                  ? "Zapisywanie..."
                  : editingOrderId
                  ? "Zapisz zmiany"
                  : "Dodaj zlecenie"}
              </Button>

              {editingOrderId ? (
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