import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardSnapshot } from "@/modules/dashboard/queries";
import { formatCurrency } from "@/lib/format";
import { OutstandingInvoicesTable } from "@/modules/dashboard/outstanding-invoices-table";

export default async function HomePage() {
  const snapshot = await getDashboardSnapshot();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Outstanding Invoices</CardTitle>
          </CardHeader>
          <CardContent className="text-lg font-semibold">
            {formatCurrency(snapshot.totalOutstanding)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Paid Invoices</CardTitle>
          </CardHeader>
          <CardContent className="text-lg font-semibold">{formatCurrency(snapshot.totalPaid)}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Contracts</CardTitle>
          </CardHeader>
          <CardContent className="text-lg font-semibold">{snapshot.contractsTotal}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Outstanding Invoice List</CardTitle>
        </CardHeader>
        <CardContent>
          <OutstandingInvoicesTable data={snapshot.outstanding} />
        </CardContent>
      </Card>
    </div>
  );
}
