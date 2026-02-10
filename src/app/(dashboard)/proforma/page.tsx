import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getContractLookup, getProformas } from "@/modules/proforma/queries";
import { createProforma, deleteProforma, updateProforma } from "@/modules/proforma/actions";
import { ProformaTable } from "@/modules/proforma/table";

export default async function ProformaPage() {
  const [data, contracts] = await Promise.all([getProformas(), getContractLookup()]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Proforma Invoices</CardTitle>
      </CardHeader>
      <CardContent>
        <ProformaTable
          data={data}
          contracts={contracts}
          onCreate={createProforma}
          onUpdate={updateProforma}
          onDelete={deleteProforma}
        />
      </CardContent>
    </Card>
  );
}
