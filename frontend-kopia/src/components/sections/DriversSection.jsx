import { useEffect, useState } from "react";
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
import { driverStatuses } from "@/constants/options";
import { badgeVariant } from "@/utils/badgeVariant";
import { apiRequest } from "@/services/api";

export default function DriversSection({
  token,
  drivers,
  refresh,
  setError,
  setSuccess,
  filterStatus,
  setFilterStatus,
}) {
  const initialForm = {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    licenseNumber: "",
    licenseCategory: "C+E",
    medicalExamValidUntil: "",
    status: "available",
    createUserAccount: false,
  };

  const [form, setForm] = useState(initialForm);
  const [editingDriverId, setEditingDriverId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  const [allPermissions, setAllPermissions] = useState([]);
  const [selectedDriverId, setSelectedDriverId] = useState("");
  const [selectedDriverPermissions, setSelectedDriverPermissions] = useState([]);
  const [selectedPermissionId, setSelectedPermissionId] = useState("");
  const [permissionLoading, setPermissionLoading] = useState(false);

  const [createdCredentials, setCreatedCredentials] = useState(null);

  const resetForm = () => {
    setForm(initialForm);
    setEditingDriverId(null);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setSuccess("Skopiowano do schowka.");
    } catch {
      setError("Nie udało się skopiować do schowka.");
    }
  };

  const fetchAllPermissions = async () => {
    if (!token) return;

    try {
      const data = await apiRequest("/permissions", {}, token);
      setAllPermissions(data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchDriverPermissions = async (driverId) => {
    if (!token || !driverId) {
      setSelectedDriverPermissions([]);
      return;
    }

    try {
      setPermissionLoading(true);
      const data = await apiRequest(`/permissions/driver/${driverId}`, {}, token);
      setSelectedDriverPermissions(data || []);
    } catch (err) {
      setError(err.message);
      setSelectedDriverPermissions([]);
    } finally {
      setPermissionLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPermissions();
  }, [token]);

  useEffect(() => {
    if (selectedDriverId) {
      fetchDriverPermissions(selectedDriverId);
    } else {
      setSelectedDriverPermissions([]);
    }
  }, [selectedDriverId, token]);

  const handleEdit = (driver) => {
    setError("");
    setSuccess("");
    setCreatedCredentials(null);

    setEditingDriverId(driver.id);
    setForm({
      firstName: driver.first_name || "",
      lastName: driver.last_name || "",
      phone: driver.phone || "",
      email: driver.email || "",
      licenseNumber: driver.license_number || "",
      licenseCategory: driver.license_category || "C+E",
      medicalExamValidUntil: driver.medical_exam_valid_until
        ? String(driver.medical_exam_valid_until).slice(0, 10)
        : "",
      status: driver.status || "available",
      createUserAccount: false,
    });

    setSelectedDriverId(String(driver.id));
    setSelectedPermissionId("");
    setSuccess(`Wczytano kierowcę ${driver.first_name} ${driver.last_name} do edycji.`);
  };

  const handleDelete = async (driver) => {
    const confirmed = window.confirm(
      `Czy na pewno chcesz usunąć kierowcę ${driver.first_name} ${driver.last_name}?`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");
    setDeleteLoadingId(driver.id);

    try {
      await apiRequest(
        `/drivers/${driver.id}`,
        {
          method: "DELETE",
        },
        token
      );

      if (editingDriverId === driver.id) {
        resetForm();
      }

      if (selectedDriverId === String(driver.id)) {
        setSelectedDriverId("");
        setSelectedPermissionId("");
        setSelectedDriverPermissions([]);
      }

      setSuccess(`Usunięto kierowcę ${driver.first_name} ${driver.last_name}.`);
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

    try {
      if (editingDriverId) {
        await apiRequest(
          `/drivers/${editingDriverId}`,
          {
            method: "PUT",
            body: JSON.stringify({
              firstName: form.firstName,
              lastName: form.lastName,
              phone: form.phone,
              email: form.email,
              licenseNumber: form.licenseNumber,
              licenseCategory: form.licenseCategory,
              medicalExamValidUntil: form.medicalExamValidUntil,
              status: form.status,
            }),
          },
          token
        );

        setCreatedCredentials(null);
        setSuccess("Kierowca został zaktualizowany.");
      } else {
        const response = await apiRequest(
          "/drivers",
          {
            method: "POST",
            body: JSON.stringify({
              firstName: form.firstName,
              lastName: form.lastName,
              phone: form.phone,
              email: form.email,
              licenseNumber: form.licenseNumber,
              licenseCategory: form.licenseCategory,
              medicalExamValidUntil: form.medicalExamValidUntil,
              status: form.status,
              createUserAccount: form.createUserAccount,
            }),
          },
          token
        );

        if (response?.createdAccount) {
          setCreatedCredentials({
            email: response.createdAccount.email,
            temporaryPassword: response.createdAccount.temporaryPassword,
            fullName: `${form.firstName} ${form.lastName}`,
          });
          setSuccess("Kierowca i konto zostały utworzone.");
        } else {
          setCreatedCredentials(null);
          setSuccess("Kierowca został dodany.");
        }
      }

      resetForm();
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPermission = async () => {
    if (!selectedDriverId || !selectedPermissionId) return;

    setError("");
    setSuccess("");

    try {
      await apiRequest(
        `/permissions/driver/${selectedDriverId}`,
        {
          method: "POST",
          body: JSON.stringify({
            permissionId: Number(selectedPermissionId),
          }),
        },
        token
      );

      setSuccess("Uprawnienie zostało dodane.");
      setSelectedPermissionId("");
      await fetchDriverPermissions(selectedDriverId);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemovePermission = async (permissionId) => {
    if (!selectedDriverId || !permissionId) return;

    setError("");
    setSuccess("");

    try {
      await apiRequest(
        `/permissions/driver/${selectedDriverId}`,
        {
          method: "DELETE",
          body: JSON.stringify({
            permissionId,
          }),
        },
        token
      );

      setSuccess("Uprawnienie zostało usunięte.");
      await fetchDriverPermissions(selectedDriverId);
    } catch (err) {
      setError(err.message);
    }
  };

  const availablePermissionsToAdd = allPermissions.filter(
    (permission) =>
      !selectedDriverPermissions.some(
        (driverPermission) => Number(driverPermission.id) === Number(permission.id)
      )
  );

  return (
    <div className="grid gap-6">
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Lista kierowców</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FilterBar
            label="Status"
            value={filterStatus}
            options={driverStatuses}
            onChange={setFilterStatus}
          />

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Imię i nazwisko</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prawo jazdy</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Konto</TableHead>
                <TableHead>Akcje</TableHead>
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
                  <TableCell>{driver.user_id ? "Tak" : "Nie"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(driver)}
                      >
                        Edytuj
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        disabled={deleteLoadingId === driver.id}
                        onClick={() => handleDelete(driver)}
                      >
                        {deleteLoadingId === driver.id ? "Usuwanie..." : "Usuń"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>
              {editingDriverId ? "Edytuj kierowcę" : "Dodaj kierowcę"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                    {driverStatuses
                      .filter((s) => s !== "all")
                      .map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {!editingDriverId ? (
                <div className="flex items-center gap-2 rounded-md border p-3">
                  <input
                    id="createUserAccount"
                    type="checkbox"
                    checked={form.createUserAccount}
                    onChange={(e) =>
                      setForm({ ...form, createUserAccount: e.target.checked })
                    }
                  />
                  <Label htmlFor="createUserAccount" className="cursor-pointer">
                    Utwórz od razu konto kierowcy na podstawie podanego emaila
                  </Label>
                </div>
              ) : null}

              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading
                    ? "Zapisywanie..."
                    : editingDriverId
                    ? "Zapisz zmiany"
                    : "Dodaj kierowcę"}
                </Button>

                {editingDriverId ? (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Anuluj
                  </Button>
                ) : null}
              </div>
            </form>

            {createdCredentials ? (
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium text-blue-900">
                      Konto kierowcy zostało utworzone
                    </div>
                    <div className="text-sm text-blue-800">
                      Zachowaj te dane i przekaż je kierowcy.
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCreatedCredentials(null)}
                  >
                    Zamknij
                  </Button>
                </div>

                <div className="rounded-md border bg-white p-3">
                  <div className="text-sm text-muted-foreground">Kierowca</div>
                  <div className="font-medium">{createdCredentials.fullName}</div>
                </div>

                <div className="rounded-md border bg-white p-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Login</div>
                    <div className="font-medium break-all">{createdCredentials.email}</div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => copyToClipboard(createdCredentials.email)}
                  >
                    Kopiuj
                  </Button>
                </div>

                <div className="rounded-md border bg-white p-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Hasło tymczasowe</div>
                    <div className="font-medium break-all">
                      {createdCredentials.temporaryPassword}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      copyToClipboard(createdCredentials.temporaryPassword)
                    }
                  >
                    Kopiuj
                  </Button>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Zarządzanie uprawnieniami kierowcy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Wybierz kierowcę</Label>
              <select
                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
                value={selectedDriverId}
                onChange={(e) => {
                  setSelectedDriverId(e.target.value);
                  setSelectedPermissionId("");
                }}
              >
                <option value="">Wybierz kierowcę</option>
                {drivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.id} - {driver.first_name} {driver.last_name}
                  </option>
                ))}
              </select>
            </div>

            {selectedDriverId ? (
              <>
                <div className="space-y-2">
                  <Label>Dodaj uprawnienie</Label>
                  <div className="flex gap-2">
                    <select
                      className="flex h-10 flex-1 rounded-md border bg-background px-3 py-2 text-sm"
                      value={selectedPermissionId}
                      onChange={(e) => setSelectedPermissionId(e.target.value)}
                    >
                      <option value="">Wybierz uprawnienie</option>
                      {availablePermissionsToAdd.map((permission) => (
                        <option key={permission.id} value={permission.id}>
                          {permission.code} - {permission.name}
                        </option>
                      ))}
                    </select>

                    <Button type="button" onClick={handleAddPermission}>
                      Dodaj
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Aktualne uprawnienia</Label>

                  {permissionLoading ? (
                    <div className="text-sm text-muted-foreground">
                      Ładowanie uprawnień...
                    </div>
                  ) : selectedDriverPermissions.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                      Brak przypisanych uprawnień.
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {selectedDriverPermissions.map((permission) => (
                        <div
                          key={permission.id}
                          className="flex items-center gap-2 rounded-md border px-3 py-2"
                        >
                          <Badge variant="outline">{permission.code}</Badge>
                          <span className="text-sm">{permission.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            className="h-7 px-2"
                            onClick={() => handleRemovePermission(permission.id)}
                          >
                            Usuń
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">
                Wybierz kierowcę, aby zobaczyć i edytować jego uprawnienia.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}