"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { useActionToast } from "@/lib/use-action-toast";

type PaymentRow = {
  id: number;
  invoiceId: number;
  invoiceNumber: string | null;
  paymentDate: string;
  amount: string;
  method: string | null;
};

function PaymentDeleteForm({
  id,
  invoiceId,
  onDelete
}: {
  id: number;
  invoiceId: number;
  onDelete: (formData: FormData) => void;
}) {
  const handleDelete = useActionToast({
    action: onDelete,
    successTitle: "Payment deleted",
    errorTitle: "Delete failed"
  });

  return (
    <form action={handleDelete}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="invoiceId" value={invoiceId} />
      <Button size="sm" variant="ghost" type="submit">
        Delete
      </Button>
    </form>
  );
}

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
        <PaymentDeleteForm id={row.original.id} invoiceId={row.original.invoiceId} onDelete={onDelete} />
      )
    }
  ];

  return <DataTable data={data} columns={columns} filterPlaceholder="Filter payments..." />;
}
