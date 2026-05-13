import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

import LoginView from "@/components/auth/LoginView";
import DashboardCards from "@/components/common/DashboardCards";
import SectionTitle from "@/components/layout/SectionTitle";
import DriversSection from "@/components/sections/DriversSection";
import VehiclesSection from "@/components/sections/VehiclesSection";
import TrailersSection from "@/components/sections/TrailersSection";
import OrdersSection from "@/components/sections/OrdersSection";
import RulesSection from "@/components/sections/RulesSection";

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
    setGlobalError("");

    try {
      const [driversData, vehiclesData, trailersData, ordersData, statsData] = await Promise.all([
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
    fetchAll();
  }, [token, driverFilterStatus, vehicleFilterStatus, trailerFilterStatus, orderFilterStatus]);

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
    setDashboardStats({});
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

        <DashboardCards stats={dashboardStats} />

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
              filterStatus={orderFilterStatus}
              setFilterStatus={setOrderFilterStatus}
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

          <TabsContent value="rules" className="space-y-4">
            <SectionTitle
              title="Zasady robocze"
              subtitle="Pomocnicza ściąga, żeby ograniczyć chaos przy statusach."
            />
            <RulesSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}