"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { formatCurrency } from "@/lib/format";
import { formatNumberTrimmed } from "@/lib/number";

type InvoiceItemRow = {
  id: number;
  description: string;
  quantity: string;
  unitPrice: string;
};

export function InvoiceItemsTable({ data, currency }: { data: InvoiceItemRow[]; currency: string }) {
  const columns: ColumnDef<InvoiceItemRow>[] = [
    { accessorKey: "description", header: "Description" },
    {
      accessorKey: "quantity",
      header: "Qty",
      cell: ({ row }) => formatNumberTrimmed(row.original.quantity, 3)
    },
    {
      id: "unitPrice",
      header: "Unit Price",
      cell: ({ row }) => formatCurrency(row.original.unitPrice, currency)
    }
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      filterPlaceholder="Filter invoice items..."
      filterColumnKey="description"
      showColumnVisibility={false}
      pageSize={8}
    />
  );
}
