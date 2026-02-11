"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { formatCurrency } from "@/lib/format";

type OutstandingInvoiceRow = {
  id: number;
  number: string;
  status: string;
  issueDate: string;
  total: string;
  balance: string;
  currency: string;
};

export function OutstandingInvoicesTable({ data }: { data: OutstandingInvoiceRow[] }) {
  const columns: ColumnDef<OutstandingInvoiceRow>[] = [
    { accessorKey: "number", header: "Invoice" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <span className="capitalize">{row.original.status}</span>
    },
    { accessorKey: "issueDate", header: "Issue Date" },
    {
      id: "total",
      header: "Total",
      cell: ({ row }) => formatCurrency(row.original.total, row.original.currency)
    },
    {
      id: "balance",
      header: "Balance",
      cell: ({ row }) => formatCurrency(row.original.balance, row.original.currency)
    }
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      filterPlaceholder="Filter outstanding invoices..."
      filterColumnKey="number"
      showColumnVisibility={false}
      pageSize={5}
    />
  );
}
