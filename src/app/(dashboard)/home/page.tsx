import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDashboardSnapshot } from "@/modules/dashboard/queries";
import { formatCurrency } from "@/lib/format";

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
          <Table className="table-compact">
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {snapshot.outstanding.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.number}</TableCell>
                  <TableCell className="capitalize">{row.status}</TableCell>
                  <TableCell>{row.issueDate}</TableCell>
                  <TableCell>{formatCurrency(row.total, row.currency)}</TableCell>
                  <TableCell>{formatCurrency(row.balance, row.currency)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
