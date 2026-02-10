import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { InvoiceDialog } from "@/modules/invoices/invoice-dialog";
import { getInvoiceDetail, getInvoiceLookups } from "@/modules/invoices/queries";
import { updateInvoice } from "@/modules/invoices/actions";
import { PaymentDialog } from "@/modules/payments/payment-dialog";
import { createPayment, deletePayment } from "@/modules/payments/actions";

export default async function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const [detail, lookups] = await Promise.all([getInvoiceDetail(id), getInvoiceLookups()]);

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
      unitPrice: Number(item.unitPrice)
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
              <Table className="table-compact">
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Unit Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detail.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{formatCurrency(item.unitPrice, detail.invoice.currency)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="taxes">
          <Card>
            <CardHeader>
              <CardTitle>Taxes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table className="table-compact">
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detail.taxes.map((tax) => (
                    <TableRow key={tax.id}>
                      <TableCell>{tax.type}</TableCell>
                      <TableCell>{Number(tax.rate) * 100}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
              <Table className="table-compact">
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detail.payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.paymentDate}</TableCell>
                      <TableCell>{formatCurrency(payment.amount, detail.invoice.currency)}</TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell>
                        <form action={deletePayment}>
                          <input type="hidden" name="id" value={payment.id} />
                          <input type="hidden" name="invoiceId" value={detail.invoice.id} />
                          <Button size="sm" variant="ghost" type="submit">
                            Delete
                          </Button>
                        </form>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
