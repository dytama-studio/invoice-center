"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { formatCurrency } from "@/lib/format";
import { PaymentDeleteForm } from "@/modules/payments/payment-delete-form";

type InvoicePaymentRow = {
  id: number;
  paymentDate: string;
  amount: string;
  method: string | null;
};

export function InvoicePaymentsTable({
  data,
  currency,
  invoiceId,
  onDelete
}: {
  data: InvoicePaymentRow[];
  currency: string;
  invoiceId: number;
  onDelete: (formData: FormData) => void;
}) {
  const columns: ColumnDef<InvoicePaymentRow>[] = [
    { accessorKey: "paymentDate", header: "Date" },
    {
      id: "amount",
      header: "Amount",
      cell: ({ row }) => formatCurrency(row.original.amount, currency)
    },
    {
      accessorKey: "method",
      header: "Method",
      cell: ({ row }) => row.original.method ?? "-"
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => <PaymentDeleteForm paymentId={row.original.id} invoiceId={invoiceId} onDelete={onDelete} />
    }
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      filterPlaceholder="Filter payments..."
      filterColumnKey="method"
      showColumnVisibility={false}
      pageSize={8}
    />
  );
}
