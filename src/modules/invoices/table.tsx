"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { InvoiceDialog } from "@/modules/invoices/invoice-dialog";
import Link from "next/link";
import { formatCurrency } from "@/lib/format";

type InvoiceRow = {
  id: number;
  number: string;
  issueDate: string;
  currency: string;
  contractNo: string | null;
  status: string;
  total: string;
  balance: string;
};

type ContractOption = { id: number; contractNo: string };

export function InvoicesTable({
  data,
  contracts,
  onCreate,
  onDelete
}: {
  data: InvoiceRow[];
  contracts: ContractOption[];
  onCreate: (formData: FormData) => void;
  onDelete: (formData: FormData) => void;
}) {
  const columns: ColumnDef<InvoiceRow>[] = [
    {
      accessorKey: "number",
      header: "Invoice No",
      cell: ({ row }) => (
        <Link className="underline" href={`/invoices/${row.original.id}`}>
          {row.original.number}
        </Link>
      )
    },
    { accessorKey: "contractNo", header: "Contract" },
    { accessorKey: "issueDate", header: "Issue Date" },
    { accessorKey: "status", header: "Status" },
    {
      id: "total",
      header: "Total",
      cell: ({ row }) => formatCurrency(row.original.total, row.original.currency)
    },
    {
      id: "balance",
      header: "Balance",
      cell: ({ row }) => formatCurrency(row.original.balance, row.original.currency)
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Link href={`/invoices/${row.original.id}`}>
            <Button size="sm" variant="outline">
              View
            </Button>
          </Link>
          <form action={onDelete}>
            <input type="hidden" name="id" value={row.original.id} />
            <Button size="sm" variant="ghost" type="submit">
              Delete
            </Button>
          </form>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-3">
      <InvoiceDialog triggerLabel="New Invoice" contracts={contracts} onSubmit={onCreate} />
      <DataTable data={data} columns={columns} filterPlaceholder="Filter invoices..." />
    </div>
  );
}
