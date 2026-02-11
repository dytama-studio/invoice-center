"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";

type InvoiceTaxRow = {
  id: number;
  type: string;
  rate: string;
};

export function InvoiceTaxesTable({ data }: { data: InvoiceTaxRow[] }) {
  const columns: ColumnDef<InvoiceTaxRow>[] = [
    { accessorKey: "type", header: "Type" },
    {
      accessorKey: "rate",
      header: "Rate",
      cell: ({ row }) => `${Number(row.original.rate) * 100}%`
    }
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      filterPlaceholder="Filter taxes..."
      filterColumnKey="type"
      showColumnVisibility={false}
      pageSize={8}
    />
  );
}
