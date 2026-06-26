import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/services/api";

export default function LoginView({ onLogin, loading, error }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    email: "",
    password: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [changePasswordMessage, setChangePasswordMessage] = useState("");
  const [changePasswordError, setChangePasswordError] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    await onLogin({
      email: form.email,
      password: form.password,
    });
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setChangePasswordError("");
    setChangePasswordMessage("");

    if (!form.email || !form.password || !form.newPassword || !form.confirmNewPassword) {
      setChangePasswordError("Uzupełnij wszystkie pola.");
      return;
    }

    if (form.newPassword !== form.confirmNewPassword) {
      setChangePasswordError("Nowe hasła nie są takie same.");
      return;
    }

    try {
      setChangePasswordLoading(true);

      const loginData = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      await apiRequest(
        "/auth/change-password",
        {
          method: "PUT",
          body: JSON.stringify({
            oldPassword: form.password,
            newPassword: form.newPassword,
          }),
        },
        loginData.token
      );

      setChangePasswordMessage("Hasło zostało zmienione. Możesz się teraz zalogować.");
      setMode("login");
      setForm((prev) => ({
        ...prev,
        password: "",
        newPassword: "",
        confirmNewPassword: "",
      }));
    } catch (err) {
      setChangePasswordError(err.message || "Nie udało się zmienić hasła.");
    } finally {
      setChangePasswordLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <Card className="w-full max-w-md rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">
            {mode === "login" ? "Logowanie" : "Zmiana hasła"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mode === "login" ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="Wpisz email"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Hasło</label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                  placeholder="Wpisz hasło"
                />
              </div>

              {error ? (
                <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              {changePasswordMessage ? (
                <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                  {changePasswordMessage}
                </div>
              ) : null}

              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? "Logowanie..." : "Zaloguj się"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setMode("changePassword");
                    setChangePasswordError("");
                    setChangePasswordMessage("");
                  }}
                >
                  Zmień hasło
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="Wpisz email"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Obecne hasło</label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                  placeholder="Wpisz obecne hasło"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Nowe hasło</label>
                <Input
                  type="password"
                  value={form.newPassword}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, newPassword: e.target.value }))
                  }
                  placeholder="Wpisz nowe hasło"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Powtórz nowe hasło</label>
                <Input
                  type="password"
                  value={form.confirmNewPassword}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      confirmNewPassword: e.target.value,
                    }))
                  }
                  placeholder="Powtórz nowe hasło"
                />
              </div>

              {changePasswordError ? (
                <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {changePasswordError}
                </div>
              ) : null}

              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={changePasswordLoading}>
                  {changePasswordLoading ? "Zmiana..." : "Zapisz hasło"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setMode("login");
                    setChangePasswordError("");
                  }}
                >
                  Wróć do logowania
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}