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
        <CardContent className="space-y-4">
          <FilterBar label="Status" value={filterStatus} options={driverStatuses} onChange={setFilterStatus} />
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
                  <TableCell>{driver.first_name} {driver.last_name}</TableCell>
                  <TableCell><Badge variant={badgeVariant(driver.status)}>{driver.status}</Badge></TableCell>
                  <TableCell>{driver.license_category} / {driver.license_number}</TableCell>
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
              <div className="space-y-2"><Label>Imię</Label><Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></div>
              <div className="space-y-2"><Label>Nazwisko</Label><Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Telefon</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <div className="space-y-2"><Label>Email</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Numer prawa jazdy</Label><Input value={form.licenseNumber} onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })} /></div>
              <div className="space-y-2"><Label>Kategoria</Label><Input value={form.licenseCategory} onChange={(e) => setForm({ ...form, licenseCategory: e.target.value })} /></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Badania ważne do</Label><Input type="date" value={form.medicalExamValidUntil} onChange={(e) => setForm({ ...form, medicalExamValidUntil: e.target.value })} /></div>
              <div className="space-y-2">
                <Label>Status</Label>
                <select className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {driverStatuses.filter((s) => s !== "all").map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Zapisywanie..." : "Dodaj kierowcę"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}