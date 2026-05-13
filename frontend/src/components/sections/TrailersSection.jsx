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
import { trailerStatuses, trailerTypes } from "@/constants/options";
import { badgeVariant } from "@/utils/badgeVariant";
import { apiRequest } from "@/services/api";

export default function TrailersSection({
  token,
  trailers,
  refresh,
  setError,
  setSuccess,
  filterStatus,
  setFilterStatus,
}) {
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
        <CardContent className="space-y-4">
          <FilterBar label="Status" value={filterStatus} options={trailerStatuses} onChange={setFilterStatus} />
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
                  <TableCell><Badge variant={badgeVariant(trailer.status)}>{trailer.status}</Badge></TableCell>
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
              <div className="space-y-2"><Label>Rejestracja</Label><Input value={form.registrationNumber} onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })} /></div>
              <div className="space-y-2">
                <Label>Typ naczepy</Label>
                <select className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm" value={form.trailerType} onChange={(e) => setForm({ ...form, trailerType: e.target.value })}>
                  {trailerTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Ładowność (kg)</Label><Input type="number" value={form.capacityKg} onChange={(e) => setForm({ ...form, capacityKg: e.target.value })} /></div>
              <div className="space-y-2"><Label>Objętość (m3)</Label><Input type="number" value={form.volumeM3} onChange={(e) => setForm({ ...form, volumeM3: e.target.value })} /></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Status</Label>
                <select className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {trailerStatuses.filter((s) => s !== "all").map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2"><Label>Przegląd ważny do</Label><Input type="date" value={form.inspectionValidUntil} onChange={(e) => setForm({ ...form, inspectionValidUntil: e.target.value })} /></div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Zapisywanie..." : "Dodaj naczepę"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}