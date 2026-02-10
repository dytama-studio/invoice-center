import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getProformaDetail } from "@/modules/proforma/queries";

export default async function ProformaDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const detail = await getProformaDetail(id);

  if (!detail.proforma) {
    return <div className="text-sm text-muted">Proforma not found.</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Proforma {detail.proforma.number}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted">
          Status: {detail.proforma.status} · Issue Date: {detail.proforma.issueDate}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="table-compact">
            <TableHeader>
              <TableRow>
                <TableHead>Commodity</TableHead>
                <TableHead>Quality</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Unit Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detail.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.commodityName}</TableCell>
                  <TableCell>{item.qualityName}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.unitPrice}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
