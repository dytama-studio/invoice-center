"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { formatNumberTrimmed } from "@/lib/number";

type ProformaItemRow = {
  id: number;
  commodityName: string | null;
  qualityName: string | null;
  description: string | null;
  quantity: string;
  unitPrice: string;
};

export function ProformaItemsTable({ data }: { data: ProformaItemRow[] }) {
  const columns: ColumnDef<ProformaItemRow>[] = [
    { accessorKey: "commodityName", header: "Commodity" },
    { accessorKey: "qualityName", header: "Quality" },
    { accessorKey: "description", header: "Description" },
    {
      accessorKey: "quantity",
      header: "Qty",
      cell: ({ row }) => formatNumberTrimmed(row.original.quantity, 3)
    },
    {
      accessorKey: "unitPrice",
      header: "Unit Price",
      cell: ({ row }) => formatNumberTrimmed(row.original.unitPrice, 2)
    }
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      filterPlaceholder="Filter proforma items..."
      filterColumnKey="commodityName"
      showColumnVisibility={false}
      pageSize={8}
    />
  );
}
