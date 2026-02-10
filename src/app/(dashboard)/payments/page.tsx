import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getInvoiceLookup, getPayments } from "@/modules/payments/queries";
import { createPayment, deletePayment } from "@/modules/payments/actions";
import { PaymentDialog } from "@/modules/payments/payment-dialog";
import { PaymentsTable } from "@/modules/payments/table";

export default async function PaymentsPage() {
  const [data, invoices] = await Promise.all([getPayments(), getInvoiceLookup()]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <PaymentDialog triggerLabel="Record Payment" invoices={invoices} onSubmit={createPayment} />
        <PaymentsTable data={data} onDelete={deletePayment} />
      </CardContent>
    </Card>
  );
}
