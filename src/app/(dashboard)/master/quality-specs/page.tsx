import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCommoditiesLookup, getQualitySpecs } from "@/modules/master/quality-specs/queries";
import { createQualitySpec, deleteQualitySpec, updateQualitySpec } from "@/modules/master/quality-specs/actions";
import { QualitySpecsTable } from "@/modules/master/quality-specs/table";

export default async function QualitySpecsPage() {
  const [data, commodities] = await Promise.all([getQualitySpecs(), getCommoditiesLookup()]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quality Specs</CardTitle>
      </CardHeader>
      <CardContent>
        <QualitySpecsTable
          data={data}
          commodities={commodities}
          onCreate={createQualitySpec}
          onUpdate={updateQualitySpec}
          onDelete={deleteQualitySpec}
        />
      </CardContent>
    </Card>
  );
}
