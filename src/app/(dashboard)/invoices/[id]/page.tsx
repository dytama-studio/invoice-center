import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvoiceDialog } from "@/modules/invoices/invoice-dialog";
import { getInvoiceDetail, getInvoiceLookups } from "@/modules/invoices/queries";
import { updateInvoice } from "@/modules/invoices/actions";
import { PaymentDialog } from "@/modules/payments/payment-dialog";
import { createPayment, deletePayment } from "@/modules/payments/actions";
import { InvoiceItemsTable } from "@/modules/invoices/invoice-items-table";
import { InvoiceTaxesTable } from "@/modules/invoices/invoice-taxes-table";
import { InvoicePaymentsTable } from "@/modules/invoices/invoice-payments-table";

type InvoiceDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function InvoiceDetailPage({ params }: InvoiceDetailPageProps) {
  const { id } = await params;
  const invoiceId = Number(id);
  const [detail, lookups] = await Promise.all([getInvoiceDetail(invoiceId), getInvoiceLookups()]);

  if (!detail.invoice) {
    return <div className="text-sm text-muted">Invoice not found.</div>;
  }

  const payload = {
    id: detail.invoice.id,
    contractId: detail.invoice.contractId,
    proformaId: detail.invoice.proformaId,
    number: detail.invoice.number,
    issueDate: detail.invoice.issueDate,
    dueDate: detail.invoice.dueDate,
    currency: detail.invoice.currency,
    notes: detail.invoice.notes,
    items: detail.items.map((item) => ({
      description: item.description,
      quantity: Number(item.quantity),
      unitPrice: Math.round(Number(item.unitPrice))
    })),
    taxes: detail.taxes.map((tax) => ({ type: tax.type, rate: Number(tax.rate) }))
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Invoice {detail.invoice.number}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="text-sm text-muted">Status: {detail.status}</div>
          <InvoiceDialog triggerLabel="Edit Invoice" payload={payload} contracts={lookups.contractsList} onSubmit={updateInvoice} />
        </CardContent>
      </Card>

      <Tabs defaultValue="items">
        <TabsList>
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="taxes">Taxes</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="items">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Items</CardTitle>
            </CardHeader>
            <CardContent>
              <InvoiceItemsTable data={detail.items} currency={detail.invoice.currency} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="taxes">
          <Card>
            <CardHeader>
              <CardTitle>Taxes</CardTitle>
            </CardHeader>
            <CardContent>
              <InvoiceTaxesTable data={detail.taxes} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <PaymentDialog triggerLabel="Record Payment" invoiceId={detail.invoice.id} onSubmit={createPayment} />
              <InvoicePaymentsTable
                data={detail.payments}
                currency={detail.invoice.currency}
                invoiceId={detail.invoice.id}
                onDelete={deletePayment}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
