import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Truck, Users, Package, RefreshCw } from "lucide-react";

const API_BASE = "http://localhost:3000";

const driverStatuses = ["active", "inactive", "unavailable"];
const vehicleStatuses = ["available", "in_use", "in_service", "inactive"];
const trailerStatuses = ["available", "in_use", "in_service", "inactive"];
const orderStatuses = ["new", "planned", "in_progress", "completed", "cancelled"];
const trailerTypes = ["curtain", "refrigerated", "box", "tanker", "container", "dump"];
const cargoTypes = [
  "general",
  "electronics",
  "food",
  "frozen",
  "pharma",
  "liquid",
  "fuel",
  "chemical",
  "bulk",
  "aggregate",
  "construction",
  "containerized",
  "parcel",
];

function badgeVariant(status) {
  if (["active", "available", "completed"].includes(status)) return "default";
  if (["planned", "in_progress", "in_use", "unavailable"].includes(status)) return "secondary";
  if (["inactive", "in_service", "cancelled"].includes(status)) return "destructive";
  return "outline";
}

async function apiRequest(path, options = {}, token = "") {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  let data;
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    throw new Error(data?.error || data?.message || "Błąd żądania");
  }

  return data;
}

function SectionTitle({ title, subtitle, action }) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

function LoginView({ onLogin, loading, error }) {
  const [email, setEmail] = useState("arek@example.com");
  const [password, setPassword] = useState("tajnehaslo123");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ email, password });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="flex h-full flex-col justify-center gap-6 p-8">
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold">Panel logistyczny</h1>
              <p className="text-base leading-7 text-muted-foreground">
                Roboczy interfejs do zarządzania kierowcami, pojazdami, naczepami
                i zleceniami bez używania Swaggera.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <CardContent className="flex items-center gap-3 p-4">
                  <Users className="h-5 w-5" />
                  <div>
                    <div className="font-medium">Kierowcy</div>
                    <div className="text-xs text-muted-foreground">statusy i dane</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-3 p-4">
                  <Truck className="h-5 w-5" />
                  <div>
                    <div className="font-medium">Pojazdy</div>
                    <div className="text-xs text-muted-foreground">gotowość do pracy</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-3 p-4">
                  <Package className="h-5 w-5" />
                  <div>
                    <div className="font-medium">Zlecenia</div>
                    <div className="text-xs text-muted-foreground">powiązanie zasobów</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Logowanie</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Hasło</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error ? (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}

              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? "Logowanie..." : "Zaloguj się"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DashboardCards({ counts }) {
  const items = [
    { title: "Kierowcy", value: counts.drivers, icon: Users },
    { title: "Pojazdy", value: counts.vehicles, icon: Truck },
    { title: "Naczepy", value: counts.trailers, icon: Truck },
    { title: "Zlecenia", value: counts.orders, icon: Package },
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

function DriversSection({ token, drivers, refresh, setError, setSuccess }) {
  const initialForm = {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    licenseNumber: "",
    licenseCategory: "C+E",
    medicalExamValidUntil: "",
    status: "active",
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
        "/drivers",
        {
          method: "POST",
          body: JSON.stringify(form),
        },
        token
      );

      setForm(initialForm);
      setSuccess("Kierowca został dodany.");
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
          <CardTitle>Lista kierowców</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Imię i nazwisko</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prawo jazdy</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drivers.map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell>{driver.id}</TableCell>
                  <TableCell>
                    {driver.first_name} {driver.last_name}
                  </TableCell>
                  <TableCell>
                    <Badge variant={badgeVariant(driver.status)}>{driver.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {driver.license_category} / {driver.license_number}
                  </TableCell>
                  <TableCell>{driver.email || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Dodaj kierowcę</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Imię</Label>
                <Input
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Nazwisko</Label>
                <Input
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Telefon</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Numer prawa jazdy</Label>
                <Input
                  value={form.licenseNumber}
                  onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Kategoria</Label>
                <Input
                  value={form.licenseCategory}
                  onChange={(e) => setForm({ ...form, licenseCategory: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Badania ważne do</Label>
                <Input
                  type="date"
                  value={form.medicalExamValidUntil}
                  onChange={(e) =>
                    setForm({ ...form, medicalExamValidUntil: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <select
                  className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {driverStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Zapisywanie..." : "Dodaj kierowcę"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function VehiclesSection({ token, vehicles, refresh, setError, setSuccess }) {
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
        <CardContent>
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
                  <TableCell>
                    {vehicle.brand} {vehicle.model}
                  </TableCell>
                  <TableCell>
                    <Badge variant={badgeVariant(vehicle.status)}>{vehicle.status}</Badge>
                  </TableCell>
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
              <div className="space-y-2">
                <Label>Rejestracja</Label>
                <Input
                  value={form.registrationNumber}
                  onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })}
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
                  onChange={(e) => setForm({ ...form, productionYear: e.target.value })}
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
                  className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {vehicleStatuses.map((status) => (
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

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Zapisywanie..." : "Dodaj pojazd"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function TrailersSection({ token, trailers, refresh, setError, setSuccess }) {
  const initialForm = {
    registrationNumber: "",
    trailerType: "curtain",
    capacityKg: "",
    volumeM3: "",
    status: "available",
    inspectionValidUntil: "",
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
        "/trailers",
        {
          method: "POST",
          body: JSON.stringify({
            ...form,
            capacityKg: Number(form.capacityKg),
            volumeM3: form.volumeM3 ? Number(form.volumeM3) : undefined,
          }),
        },
        token
      );

      setForm(initialForm);
      setSuccess("Naczepa została dodana.");
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
          <CardTitle>Lista naczep</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Rejestracja</TableHead>
                <TableHead>Typ</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ładowność</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trailers.map((trailer) => (
                <TableRow key={trailer.id}>
                  <TableCell>{trailer.id}</TableCell>
                  <TableCell>{trailer.registration_number}</TableCell>
                  <TableCell>{trailer.trailer_type}</TableCell>
                  <TableCell>
                    <Badge variant={badgeVariant(trailer.status)}>{trailer.status}</Badge>
                  </TableCell>
                  <TableCell>{trailer.capacity_kg} kg</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Dodaj naczepę</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Rejestracja</Label>
                <Input
                  value={form.registrationNumber}
                  onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Typ naczepy</Label>
                <select
                  className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
                  value={form.trailerType}
                  onChange={(e) => setForm({ ...form, trailerType: e.target.value })}
                >
                  {trailerTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Ładowność (kg)</Label>
                <Input
                  type="number"
                  value={form.capacityKg}
                  onChange={(e) => setForm({ ...form, capacityKg: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Objętość (m3)</Label>
                <Input
                  type="number"
                  value={form.volumeM3}
                  onChange={(e) => setForm({ ...form, volumeM3: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Status</Label>
                <select
                  className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {trailerStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
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
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Zapisywanie..." : "Dodaj naczepę"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function OrdersSection({
  token,
  orders,
  drivers,
  vehicles,
  trailers,
  user,
  refresh,
  setError,
  setSuccess,
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
            plannedDistanceKm: form.plannedDistanceKm
              ? Number(form.plannedDistanceKm)
              : undefined,
            plannedDurationMinutes: form.plannedDurationMinutes
              ? Number(form.plannedDurationMinutes)
              : undefined,
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
        <CardContent>
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
                  <TableCell>
                    {order.pickup_location} → {order.delivery_location}
                  </TableCell>
                  <TableCell>
                    <Badge variant={badgeVariant(order.status)}>{order.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {order.cargo_weight_kg} kg / {order.cargo_type || "—"}
                  </TableCell>
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
              <div className="space-y-2">
                <Label>Numer zlecenia</Label>
                <Input
                  value={form.orderNumber}
                  onChange={(e) => setForm({ ...form, orderNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Klient</Label>
                <Input
                  value={form.clientName}
                  onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                />
              </div>
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
                <Label>Rodzaj ładunku</Label>
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
                <Label>Masa ładunku (kg)</Label>
                <Input
                  type="number"
                  value={form.cargoWeightKg}
                  onChange={(e) => setForm({ ...form, cargoWeightKg: e.target.value })}
                />
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
                <Label>Czas (min)</Label>
                <Input
                  type="number"
                  value={form.plannedDurationMinutes}
                  onChange={(e) =>
                    setForm({ ...form, plannedDurationMinutes: e.target.value })
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
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Data realizacji</Label>
                <Input
                  type="date"
                  value={form.plannedDate}
                  onChange={(e) => setForm({ ...form, plannedDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <select
                  className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {orderStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Kierowca</Label>
                <select
                  className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
                  value={form.driverId}
                  onChange={(e) => setForm({ ...form, driverId: e.target.value })}
                >
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
                <select
                  className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
                  value={form.vehicleId}
                  onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
                >
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
                <select
                  className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
                  value={form.trailerId}
                  onChange={(e) => setForm({ ...form, trailerId: e.target.value })}
                >
                  <option value="">Brak</option>
                  {trailers.map((trailer) => (
                    <option key={trailer.id} value={trailer.id}>
                      {trailer.registration_number} / {trailer.trailer_type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Zapisywanie..." : "Dodaj zlecenie"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function App() {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [trailers, setTrailers] = useState([]);
  const [orders, setOrders] = useState([]);

  const [globalError, setGlobalError] = useState("");
  const [globalSuccess, setGlobalSuccess] = useState("");
  const [loadingData, setLoadingData] = useState(false);

  const counts = useMemo(
    () => ({
      drivers: drivers.length,
      vehicles: vehicles.length,
      trailers: trailers.length,
      orders: orders.length,
    }),
    [drivers, vehicles, trailers, orders]
  );

  const fetchAll = async () => {
    if (!token) return;

    setLoadingData(true);
    setGlobalError("");

    try {
      const [driversData, vehiclesData, trailersData, ordersData] = await Promise.all([
        apiRequest("/drivers", {}, token),
        apiRequest("/vehicles", {}, token),
        apiRequest("/trailers", {}, token),
        apiRequest("/transport-orders", {}, token),
      ]);

      setDrivers(driversData);
      setVehicles(vehiclesData);
      setTrailers(trailersData);
      setOrders(ordersData);
    } catch (err) {
      setGlobalError(err.message);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [token]);

  const handleLogin = async ({ email, password }) => {
    setLoginLoading(true);
    setLoginError("");

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      setToken(data.token);
      setUser(data.user);
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const logout = () => {
    setToken("");
    setUser(null);
    setDrivers([]);
    setVehicles([]);
    setTrailers([]);
    setOrders([]);
    setGlobalError("");
    setGlobalSuccess("");
  };

  if (!token) {
    return <LoginView onLogin={handleLogin} loading={loginLoading} error={loginError} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Panel logistyczny</h1>
            <p className="text-sm text-muted-foreground">
              Zalogowano jako {user?.firstName} {user?.lastName} ({user?.role})
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchAll}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Odśwież
            </Button>
            <Button variant="secondary" onClick={logout}>
              Wyloguj
            </Button>
          </div>
        </div>

        <DashboardCards counts={counts} />

        {globalError ? (
          <Alert variant="destructive">
            <AlertDescription>{globalError}</AlertDescription>
          </Alert>
        ) : null}

        {globalSuccess ? (
          <Alert>
            <AlertDescription>{globalSuccess}</AlertDescription>
          </Alert>
        ) : null}

        {loadingData ? (
          <Alert>
            <AlertDescription>Ładowanie danych z backendu...</AlertDescription>
          </Alert>
        ) : null}

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="orders">Zlecenia</TabsTrigger>
            <TabsTrigger value="drivers">Kierowcy</TabsTrigger>
            <TabsTrigger value="vehicles">Pojazdy</TabsTrigger>
            <TabsTrigger value="trailers">Naczepy</TabsTrigger>
            <TabsTrigger value="rules">Zasady</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <SectionTitle
              title="Zlecenia transportowe"
              subtitle="Tworzenie i przegląd zleceń z przypisaniem kierowcy, pojazdu i naczepy."
            />
            <OrdersSection
              token={token}
              orders={orders}
              drivers={drivers}
              vehicles={vehicles}
              trailers={trailers}
              user={user}
              refresh={fetchAll}
              setError={setGlobalError}
              setSuccess={setGlobalSuccess}
            />
          </TabsContent>

          <TabsContent value="drivers" className="space-y-4">
            <SectionTitle
              title="Kierowcy"
              subtitle="Ewidencja kierowców, dane i statusy dostępności."
            />
            <DriversSection
              token={token}
              drivers={drivers}
              refresh={fetchAll}
              setError={setGlobalError}
              setSuccess={setGlobalSuccess}
            />
          </TabsContent>

          <TabsContent value="vehicles" className="space-y-4">
            <SectionTitle
              title="Pojazdy"
              subtitle="Pojazdy firmy, statusy, ładowność i terminy ważności."
            />
            <VehiclesSection
              token={token}
              vehicles={vehicles}
              refresh={fetchAll}
              setError={setGlobalError}
              setSuccess={setGlobalSuccess}
            />
          </TabsContent>

          <TabsContent value="trailers" className="space-y-4">
            <SectionTitle
              title="Naczepy"
              subtitle="Zarządzanie naczepami, typami i gotowością do pracy."
            />
            <TrailersSection
              token={token}
              trailers={trailers}
              refresh={fetchAll}
              setError={setGlobalError}
              setSuccess={setGlobalSuccess}
            />
          </TabsContent>

          <TabsContent value="rules" className="space-y-4">
            <SectionTitle
              title="Zasady robocze"
              subtitle="Pomocnicza ściąga, żeby ograniczyć chaos przy statusach."
            />

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
                  <p>W kolejnym kroku można dodać zgodność <strong>trailerType</strong> z <strong>cargoType</strong>.</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}