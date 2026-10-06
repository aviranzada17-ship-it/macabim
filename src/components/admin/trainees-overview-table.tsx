"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Group } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search } from "lucide-react";

type Row = {
  id: string;
  fullName: string;
  username: string;
  groupName: string | null;
  groupId: string | null;
  onboardingCompleted: boolean;
  active: boolean;
  daysSince: number | null;
  status: "active" | "warning" | "stale" | "none";
};

const STATUS_META: Record<
  Row["status"],
  { label: string; className: string }
> = {
  active: { label: "פעיל", className: "bg-secondary text-secondary-foreground" },
  warning: { label: "כדאי לעקוב", className: "bg-accent text-accent-foreground" },
  stale: { label: "דורש תשומת לב", className: "bg-destructive text-white" },
  none: { label: "אין עדיין נתונים", className: "bg-muted text-muted-foreground" },
};

export function TraineesOverviewTable({
  rows,
  groups,
}: {
  rows: Row[];
  groups: Group[];
}) {
  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState("");

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const matchesSearch =
        !search ||
        r.fullName.toLowerCase().includes(search.toLowerCase()) ||
        r.username.toLowerCase().includes(search.toLowerCase());
      const matchesGroup = !groupFilter || r.groupId === groupFilter;
      return matchesSearch && matchesGroup;
    });
  }, [rows, search, groupFilter]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative max-w-xs flex-1">
          <Search className="pointer-events-none absolute end-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="חיפוש חניך..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pe-8"
          />
        </div>
        <NativeSelect
          value={groupFilter}
          onChange={(e) => setGroupFilter(e.target.value)}
          className="max-w-48"
        >
          <option value="">כל הקבוצות</option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </NativeSelect>
        <div className="flex-1" />
        <Button asChild>
          <Link href="/admin/trainees/new" className="flex items-center gap-1.5">
            <Plus className="size-4" />
            הוספת חניך
          </Link>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>שם</TableHead>
              <TableHead>קבוצה</TableHead>
              <TableHead>עדכון אחרון</TableHead>
              <TableHead>סטטוס</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                  לא נמצאו חניכים תואמים.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <Link
                      href={`/admin/trainees/${r.id}`}
                      className="font-semibold text-primary hover:underline"
                    >
                      {r.fullName}
                    </Link>
                    {!r.onboardingCompleted ? (
                      <span className="ms-2 text-xs text-muted-foreground">
                        (קליטה לא הושלמה)
                      </span>
                    ) : null}
                    {!r.active ? (
                      <span className="ms-2 text-xs text-destructive">
                        (לא פעיל)
                      </span>
                    ) : null}
                  </TableCell>
                  <TableCell>{r.groupName ?? "–"}</TableCell>
                  <TableCell>
                    {r.daysSince === null
                      ? "אין נתונים"
                      : r.daysSince === 0
                        ? "היום"
                        : `לפני ${r.daysSince} ימים`}
                  </TableCell>
                  <TableCell>
                    <Badge className={STATUS_META[r.status].className} variant="secondary">
                      {STATUS_META[r.status].label}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
