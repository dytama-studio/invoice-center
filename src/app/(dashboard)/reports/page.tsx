import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reports</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted">
        <div>Outstanding Invoices</div>
        <div>Paid Invoices</div>
        <div>Monthly Cashflow</div>
        <div>Tax Reports (PPN, PPH22, PPH23)</div>
        <div>Contract Realization</div>
      </CardContent>
    </Card>
  );
}
