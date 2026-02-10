import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getInvoiceLookups, getInvoices } from "@/modules/invoices/queries";
import { createInvoice, deleteInvoice } from "@/modules/invoices/actions";
import { InvoicesTable } from "@/modules/invoices/table";

export default async function InvoicesPage() {
  const [data, lookups] = await Promise.all([getInvoices(), getInvoiceLookups()]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoices</CardTitle>
      </CardHeader>
      <CardContent>
        <InvoicesTable data={data} contracts={lookups.contractsList} onCreate={createInvoice} onDelete={deleteInvoice} />
      </CardContent>
    </Card>
  );
}
