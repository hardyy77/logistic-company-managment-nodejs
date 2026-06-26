import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ToastMessage from "@/components/common/ToastMessage";
import { apiRequest } from "@/services/api";
import { badgeVariant } from "@/utils/badgeVariant";
import { RefreshCw } from "lucide-react";

export default function DriverPanel({ token, user, onLogout }) {
  const [profile, setProfile] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const fetchDriverPanelData = async () => {
    if (!token) return;

    setLoading(true);
    setError("");

    try {
      const [profileData, currentOrderData, orderHistoryData] = await Promise.all([
        apiRequest("/driver-panel/me", {}, token),
        apiRequest("/driver-panel/current-order", {}, token),
        apiRequest("/driver-panel/order-history", {}, token),
      ]);

      setProfile(profileData);
      setCurrentOrder(currentOrderData);
      setOrderHistory(orderHistoryData || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDriverPanelData();
  }, [token]);

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => setSuccess(""), 3500);
    return () => clearTimeout(timer);
  }, [success]);

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(""), 4500);
    return () => clearTimeout(timer);
  }, [error]);

  const handleStartOrder = async () => {
    setError("");
    setSuccess("");
    setActionLoading(true);

    try {
      const data = await apiRequest(
        "/driver-panel/current-order/start",
        { method: "PATCH" },
        token
      );

      setSuccess(data.message || "Rozpoczęto realizację zlecenia.");
      await fetchDriverPanelData();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteOrder = async () => {
    setError("");
    setSuccess("");
    setActionLoading(true);

    try {
      const data = await apiRequest(
        "/driver-panel/current-order/complete",
        { method: "PATCH" },
        token
      );

      setSuccess(data.message || "Zakończono realizację zlecenia.");
      await fetchDriverPanelData();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 text-foreground sm:p-6 lg:p-8">
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex flex-col gap-3">
        <ToastMessage
          type="success"
          message={success}
          onClose={() => setSuccess("")}
        />
        <ToastMessage
          type="error"
          message={error}
          onClose={() => setError("")}
        />
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Panel kierowcy</h1>
            <p className="text-sm text-muted-foreground">
              Zalogowano jako {user?.firstName} {user?.lastName} ({user?.role})
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={fetchDriverPanelData}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Odśwież
            </Button>
            <Button variant="secondary" onClick={onLogout}>
              Wyloguj
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="rounded-md border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
            Ładowanie danych kierowcy...
          </div>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Card className="rounded-md border-border bg-card">
            <CardHeader>
              <CardTitle>Moje dane</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground">Imię i nazwisko</div>
                <div className="font-medium">
                  {profile ? `${profile.first_name} ${profile.last_name}` : "—"}
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="font-medium">{profile?.email || profile?.user_email || "—"}</div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground">Telefon</div>
                <div className="font-medium">{profile?.phone || "—"}</div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground">Status</div>
                <div className="mt-1">
                  <Badge variant={badgeVariant(profile?.status || "inactive")}>
                    {profile?.status || "—"}
                  </Badge>
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground">Prawo jazdy</div>
                <div className="font-medium">
                  {profile?.license_category || "—"} / {profile?.license_number || "—"}
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground">Badania ważne do</div>
                <div className="font-medium">
                  {profile?.medical_exam_valid_until
                    ? String(profile.medical_exam_valid_until).slice(0, 10)
                    : "—"}
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground">Uprawnienia</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {profile?.permissions?.length ? (
                    profile.permissions.map((permission) => (
                      <Badge key={permission.id} variant="outline">
                        {permission.code}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">Brak przypisanych uprawnień</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-md border-border bg-card">
            <CardHeader>
              <CardTitle>Moje aktualne zlecenie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentOrder ? (
                <>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Numer zlecenia</div>
                      <div className="font-medium">{currentOrder.order_number}</div>
                    </div>
                    <Badge variant={badgeVariant(currentOrder.status)}>
                      {currentOrder.status}
                    </Badge>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground">Klient</div>
                    <div className="font-medium">{currentOrder.client_name}</div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground">Trasa</div>
                    <div className="font-medium">
                      {currentOrder.pickup_location} → {currentOrder.delivery_location}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground">Ładunek</div>
                    <div className="font-medium">
                      {currentOrder.cargo_name || "—"} / {currentOrder.cargo_type || "—"} /{" "}
                      {currentOrder.cargo_weight_kg} kg
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <div className="text-sm text-muted-foreground">Pojazd</div>
                      <div className="font-medium">
                        {currentOrder.vehicle_registration_number
                          ? `${currentOrder.vehicle_registration_number} / ${currentOrder.vehicle_brand} ${currentOrder.vehicle_model}`
                          : "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Naczepa</div>
                      <div className="font-medium">
                        {currentOrder.trailer_registration_number
                          ? `${currentOrder.trailer_registration_number} / ${currentOrder.trailer_type}`
                          : "—"}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground">Data realizacji</div>
                    <div className="font-medium">
                      {currentOrder.planned_date
                        ? String(currentOrder.planned_date).slice(0, 10)
                        : "—"}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    {currentOrder.status === "planned" ? (
                      <Button onClick={handleStartOrder} disabled={actionLoading}>
                        {actionLoading ? "Przetwarzanie..." : "Rozpocznij trasę"}
                      </Button>
                    ) : null}

                    {currentOrder.status === "in_progress" ? (
                      <Button onClick={handleCompleteOrder} disabled={actionLoading}>
                        {actionLoading ? "Przetwarzanie..." : "Zakończ trasę"}
                      </Button>
                    ) : null}
                  </div>
                </>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Brak aktywnego zlecenia.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-md border-border bg-card">
          <CardHeader>
            <CardTitle>Historia moich zleceń</CardTitle>
          </CardHeader>
          <CardContent>
            {orderHistory.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                Brak historii zleceń.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nr</TableHead>
                    <TableHead>Klient</TableHead>
                    <TableHead>Ładunek</TableHead>
                    <TableHead>Trasa</TableHead>
                    <TableHead>Pojazd</TableHead>
                    <TableHead>Naczepa</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderHistory.map((order) => (
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}