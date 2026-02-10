"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";

type PaymentRow = {
  id: number;
  invoiceId: number;
  invoiceNumber: string | null;
  paymentDate: string;
  amount: string;
  method: string | null;
};

export function PaymentsTable({
  data,
  onDelete
}: {
  data: PaymentRow[];
  onDelete: (formData: FormData) => void;
}) {
  const columns: ColumnDef<PaymentRow>[] = [
    { accessorKey: "invoiceNumber", header: "Invoice" },
    { accessorKey: "paymentDate", header: "Payment Date" },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => formatCurrency(row.original.amount)
    },
    { accessorKey: "method", header: "Method" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <form action={onDelete}>
          <input type="hidden" name="id" value={row.original.id} />
          <input type="hidden" name="invoiceId" value={row.original.invoiceId} />
          <Button size="sm" variant="ghost" type="submit">
            Delete
          </Button>
        </form>
      )
    }
  ];

  return <DataTable data={data} columns={columns} filterPlaceholder="Filter payments..." />;
}
