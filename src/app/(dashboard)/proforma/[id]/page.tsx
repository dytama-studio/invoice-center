import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProformaDetail } from "@/modules/proforma/queries";
import { ProformaItemsTable } from "@/modules/proforma/proforma-items-table";

type ProformaDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProformaDetailPage({ params }: ProformaDetailPageProps) {
  const { id } = await params;
  const proformaId = Number(id);
  const detail = await getProformaDetail(proformaId);

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
          <ProformaItemsTable data={detail.items} />
        </CardContent>
      </Card>
    </div>
  );
}
