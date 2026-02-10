import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCompanies, getRegionsLookup } from "@/modules/master/companies/queries";
import { createCompany, deleteCompany, updateCompany } from "@/modules/master/companies/actions";
import { CompaniesTable } from "@/modules/master/companies/table";

export default async function CompaniesPage() {
  const [data, regions] = await Promise.all([getCompanies(), getRegionsLookup()]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Companies</CardTitle>
      </CardHeader>
      <CardContent>
        <CompaniesTable
          data={data}
          regions={regions}
          onCreate={createCompany}
          onUpdate={updateCompany}
          onDelete={deleteCompany}
        />
      </CardContent>
    </Card>
  );
}
