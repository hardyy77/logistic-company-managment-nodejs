import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronDown, ClipboardList, LogOut, Package, RefreshCw, Truck, UserCircle, Users } from "lucide-react";

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

const buildStatusQuery = (status) =>
  status && status !== "all" ? `?status=${encodeURIComponent(status)}` : "";

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
  const [userMenuOpen, setUserMenuOpen] = useState(false);

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
    setUserMenuOpen(false);
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

  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.name ||
    user?.email ||
    "Użytkownik";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex flex-col gap-3">
        <ToastMessage type="success" message={globalSuccess} onClose={() => setGlobalSuccess("")} />
        <ToastMessage type="error" message={globalError} onClose={() => setGlobalError("")} />
      </div>

      <Tabs defaultValue="orders" className="min-h-screen">
        <header className="relative z-20 border-b border-border bg-background">
          <div className="flex min-h-12 items-center gap-3 px-3 sm:px-4">
            <div className="w-auto shrink-0 text-sm font-semibold tracking-tight lg:w-[204px]">
              LogiPanel
            </div>

            <DashboardCards stats={dashboardStats} />

            <div className="relative ml-auto">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setUserMenuOpen((open) => !open)}
                className="h-8 rounded-sm px-2 text-xs"
              >
                <UserCircle className="mr-2 h-4 w-4" />
                <span className="max-w-[140px] truncate">{displayName}</span>
                <span className="hidden text-muted-foreground sm:inline">({user?.role})</span>
                <ChevronDown className="ml-1 h-3.5 w-3.5" />
              </Button>

              {userMenuOpen ? (
                <div className="absolute right-0 top-10 z-50 w-40 border border-border bg-card p-1 shadow-lg">
                  <button
                    type="button"
                    onClick={logout}
                    className="flex h-8 w-full items-center px-2 text-left text-xs text-foreground hover:bg-muted"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Wyloguj
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <div className="lg:grid lg:min-h-[calc(100vh-49px)] lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="border-b border-border bg-sidebar p-3 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
          <div className="flex h-full flex-col gap-4">
            <TabsList className="grid h-auto w-full grid-cols-2 gap-1 bg-transparent p-0 sm:grid-cols-4 lg:flex lg:flex-col">
              <TabsTrigger value="orders" className="h-9 justify-start rounded-sm px-3 lg:w-full">
                <ClipboardList className="mr-2 h-4 w-4" />
                Zlecenia
              </TabsTrigger>
              <TabsTrigger value="drivers" className="h-9 justify-start rounded-sm px-3 lg:w-full">
                <Users className="mr-2 h-4 w-4" />
                Kierowcy
              </TabsTrigger>
              <TabsTrigger value="vehicles" className="h-9 justify-start rounded-sm px-3 lg:w-full">
                <Truck className="mr-2 h-4 w-4" />
                Pojazdy
              </TabsTrigger>
              <TabsTrigger value="trailers" className="h-9 justify-start rounded-sm px-3 lg:w-full">
                <Package className="mr-2 h-4 w-4" />
                Naczepy
              </TabsTrigger>
            </TabsList>

            <div className="mt-auto grid gap-1">
              <Button variant="ghost" onClick={fetchAll} className="h-9 justify-start rounded-sm px-3">
                <RefreshCw className="mr-2 h-4 w-4" />
                Odśwież
              </Button>
            </div>
          </div>
        </aside>

        <main className="min-w-0 bg-background p-4 pt-5 sm:p-5 lg:p-6 lg:pt-6">
          <div className="mx-auto flex max-w-7xl flex-col gap-5">
            {loadingData ? (
              <div className="rounded-sm border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
                Ładowanie danych...
              </div>
            ) : null}

            <TabsContent value="orders" className="scroll-mt-16 space-y-4">
              <SectionTitle title="Zlecenia" />
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

            <TabsContent value="drivers" className="scroll-mt-16 space-y-4">
              <SectionTitle title="Kierowcy" />
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

            <TabsContent value="vehicles" className="scroll-mt-16 space-y-4">
              <SectionTitle title="Pojazdy" />
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

            <TabsContent value="trailers" className="scroll-mt-16 space-y-4">
              <SectionTitle title="Naczepy" />
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
          </div>
        </main>
        </div>
      </Tabs>
    </div>
  );
}
