import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRegions } from "@/modules/master/regions/queries";
import { createRegion, deleteRegion, updateRegion } from "@/modules/master/regions/actions";
import { RegionsTable } from "@/modules/master/regions/table";

export default async function RegionsPage() {
  const data = await getRegions();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Regions</CardTitle>
      </CardHeader>
      <CardContent>
        <RegionsTable data={data} onCreate={createRegion} onUpdate={updateRegion} onDelete={deleteRegion} />
      </CardContent>
    </Card>
  );
}
