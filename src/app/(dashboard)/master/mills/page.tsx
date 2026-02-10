import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMills, getMillsLookups } from "@/modules/master/mills/queries";
import { createMill, deleteMill, updateMill } from "@/modules/master/mills/actions";
import { MillsTable } from "@/modules/master/mills/table";

export default async function MillsPage() {
  const [data, lookups] = await Promise.all([getMills(), getMillsLookups()]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mills (PKS)</CardTitle>
      </CardHeader>
      <CardContent>
        <MillsTable
          data={data}
          regions={lookups.regionList}
          companies={lookups.companyList}
          onCreate={createMill}
          onUpdate={updateMill}
          onDelete={deleteMill}
        />
      </CardContent>
    </Card>
  );
}
