import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Truck, Users, Package } from "lucide-react";

export default function LoginView({ onLogin, loading, error }) {
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