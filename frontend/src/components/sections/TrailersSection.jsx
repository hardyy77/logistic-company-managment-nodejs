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
  const [editingTrailerId, setEditingTrailerId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  const resetForm = () => {
    setForm(initialForm);
    setEditingTrailerId(null);
  };

  const handleEdit = (trailer) => {
    setError("");
    setSuccess("");

    setEditingTrailerId(trailer.id);
    setForm({
      registrationNumber: trailer.registration_number || "",
      trailerType: trailer.trailer_type || "curtain",
      capacityKg: trailer.capacity_kg || "",
      volumeM3: trailer.volume_m3 || "",
      status: trailer.status || "available",
      inspectionValidUntil: trailer.inspection_valid_until
        ? String(trailer.inspection_valid_until).slice(0, 10)
        : "",
    });

    setSuccess(`Wczytano naczepę ${trailer.registration_number} do edycji.`);
  };

  const handleDelete = async (trailer) => {
    const confirmed = window.confirm(
      `Czy na pewno chcesz usunąć naczepę ${trailer.registration_number}?`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");
    setDeleteLoadingId(trailer.id);

    try {
      await apiRequest(
        `/trailers/${trailer.id}`,
        {
          method: "DELETE",
        },
        token
      );

      if (editingTrailerId === trailer.id) {
        resetForm();
      }

      setSuccess(`Usunięto naczepę ${trailer.registration_number}.`);
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

    const payload = {
      registrationNumber: form.registrationNumber,
      trailerType: form.trailerType,
      capacityKg: Number(form.capacityKg),
      volumeM3: form.volumeM3 ? Number(form.volumeM3) : undefined,
      status: form.status,
      inspectionValidUntil: form.inspectionValidUntil || null,
    };

    try {
      if (editingTrailerId) {
        await apiRequest(
          `/trailers/${editingTrailerId}`,
          {
            method: "PUT",
            body: JSON.stringify(payload),
          },
          token
        );

        setSuccess("Naczepa została zaktualizowana.");
      } else {
        await apiRequest(
          "/trailers",
          {
            method: "POST",
            body: JSON.stringify(payload),
          },
          token
        );

        setSuccess("Naczepa została dodana.");
      }

      resetForm();
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <Card className="rounded-md border-border bg-card">
        <CardHeader>
          <CardTitle>Lista naczep</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FilterBar
            label="Status"
            value={filterStatus}
            options={trailerStatuses}
            onChange={setFilterStatus}
          />

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Rejestracja</TableHead>
                <TableHead>Typ</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ładowność</TableHead>
                <TableHead>Akcje</TableHead>
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
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(trailer)}
                      >
                        Edytuj
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        disabled={deleteLoadingId === trailer.id}
                        onClick={() => handleDelete(trailer)}
                      >
                        {deleteLoadingId === trailer.id ? "Usuwanie..." : "Usuń"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="rounded-md border-border bg-card">
        <CardHeader>
          <CardTitle>
            {editingTrailerId ? "Edytuj naczepę" : "Dodaj naczepę"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Rejestracja</Label>
                <Input
                  value={form.registrationNumber}
                  onChange={(e) =>
                    setForm({ ...form, registrationNumber: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Typ naczepy</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
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
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {trailerStatuses
                    .filter((s) => s !== "all")
                    .map((status) => (
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

            <div className="flex flex-wrap gap-2">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading
                  ? "Zapisywanie..."
                  : editingTrailerId
                  ? "Zapisz zmiany"
                  : "Dodaj naczepę"}
              </Button>

              {editingTrailerId ? (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Anuluj
                </Button>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}