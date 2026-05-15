import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

import LoginView from "@/components/auth/LoginView";
import DashboardCards from "@/components/common/DashboardCards";
import ToastMessage from "@/components/common/ToastMessage";
import SectionTitle from "@/components/layout/SectionTitle";
import DriversSection from "@/components/sections/DriversSection";
import VehiclesSection from "@/components/sections/VehiclesSection";
import TrailersSection from "@/components/sections/TrailersSection";
import OrdersSection from "@/components/sections/OrdersSection";
import DriverPanel from "@/components/driver/DriverPanel";

import { apiRequest } from "@/services/api";
import { buildStatusQuery } from "@/utils/buildStatusQuery";

export default function App() {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [trailers, setTrailers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({});

  const [driverFilterStatus, setDriverFilterStatus] = useState("all");
  const [vehicleFilterStatus, setVehicleFilterStatus] = useState("all");
  const [trailerFilterStatus, setTrailerFilterStatus] = useState("all");
  const [orderFilterStatus, setOrderFilterStatus] = useState("all");

  const [globalError, setGlobalError] = useState("");
  const [globalSuccess, setGlobalSuccess] = useState("");
  const [loadingData, setLoadingData] = useState(false);

  const fetchAll = async () => {
    if (!token) return;

    setLoadingData(true);

    try {
      const [driversData, vehiclesData, trailersData, ordersData, statsData] =
        await Promise.all([
          apiRequest(`/drivers${buildStatusQuery(driverFilterStatus)}`, {}, token),
          apiRequest(`/vehicles${buildStatusQuery(vehicleFilterStatus)}`, {}, token),
          apiRequest(`/trailers${buildStatusQuery(trailerFilterStatus)}`, {}, token),
          apiRequest(`/transport-orders${buildStatusQuery(orderFilterStatus)}`, {}, token),
          apiRequest("/dashboard/stats", {}, token),
        ]);

      setDrivers(driversData);
      setVehicles(vehiclesData);
      setTrailers(trailersData);
      setOrders(ordersData);
      setDashboardStats(statsData);
    } catch (err) {
      setGlobalError(err.message);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (user?.role === "driver") return;
    fetchAll();
  }, [
    token,
    user,
    driverFilterStatus,
    vehicleFilterStatus,
    trailerFilterStatus,
    orderFilterStatus,
  ]);

  useEffect(() => {
    if (!globalSuccess) return;
    const timer = setTimeout(() => setGlobalSuccess(""), 3500);
    return () => clearTimeout(timer);
  }, [globalSuccess]);

  useEffect(() => {
    if (!globalError) return;
    const timer = setTimeout(() => setGlobalError(""), 4500);
    return () => clearTimeout(timer);
  }, [globalError]);

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
      setGlobalSuccess("Zalogowano pomyślnie.");
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
    setDashboardStats({});
    setGlobalError("");
    setGlobalSuccess("");
  };

  if (!token) {
    return <LoginView onLogin={handleLogin} loading={loginLoading} error={loginError} />;
  }

  if (user?.role === "driver") {
    return <DriverPanel token={token} user={user} onLogout={logout} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex flex-col gap-3">
        <ToastMessage
          type="success"
          message={globalSuccess}
          onClose={() => setGlobalSuccess("")}
        />
        <ToastMessage
          type="error"
          message={globalError}
          onClose={() => setGlobalError("")}
        />
      </div>

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

        <DashboardCards stats={dashboardStats} />

        {loadingData ? (
          <div className="rounded-xl border bg-white px-4 py-3 text-sm text-muted-foreground shadow-sm">
            Ładowanie danych z backendu...
          </div>
        ) : null}

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="orders">Zlecenia</TabsTrigger>
            <TabsTrigger value="drivers">Kierowcy</TabsTrigger>
            <TabsTrigger value="vehicles">Pojazdy</TabsTrigger>
            <TabsTrigger value="trailers">Naczepy</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <SectionTitle
              title="Zlecenia transportowe"
              subtitle="Tworzenie i przegląd zleceń z przypisaniem kierowcy, pojazdu i naczepy."
            />
            <OrdersSection
              token={token}
              orders={orders}
              user={user}
              refresh={fetchAll}
              setError={setGlobalError}
              setSuccess={setGlobalSuccess}
              filterStatus={orderFilterStatus}
              setFilterStatus={setOrderFilterStatus}
            />
          </TabsContent>

          <TabsContent value="drivers" className="space-y-4">
            <SectionTitle
              title="Kierowcy"
              subtitle="Ewidencja kierowców, dane, statusy i uprawnienia."
            />
            <DriversSection
              token={token}
              drivers={drivers}
              refresh={fetchAll}
              setError={setGlobalError}
              setSuccess={setGlobalSuccess}
              filterStatus={driverFilterStatus}
              setFilterStatus={setDriverFilterStatus}
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
              filterStatus={vehicleFilterStatus}
              setFilterStatus={setVehicleFilterStatus}
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
              filterStatus={trailerFilterStatus}
              setFilterStatus={setTrailerFilterStatus}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}