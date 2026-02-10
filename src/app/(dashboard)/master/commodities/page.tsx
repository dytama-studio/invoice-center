import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCommodities } from "@/modules/master/commodities/queries";
import { createCommodity, deleteCommodity, updateCommodity } from "@/modules/master/commodities/actions";
import { CommoditiesTable } from "@/modules/master/commodities/table";

export default async function CommoditiesPage() {
  const data = await getCommodities();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Commodities</CardTitle>
      </CardHeader>
      <CardContent>
        <CommoditiesTable
          data={data}
          onCreate={createCommodity}
          onUpdate={updateCommodity}
          onDelete={deleteCommodity}
        />
      </CardContent>
    </Card>
  );
}
