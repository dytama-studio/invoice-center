import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getContractLookups, getContracts } from "@/modules/contracts/queries";
import { createContract, deleteContract } from "@/modules/contracts/actions";
import { ContractsTable } from "@/modules/contracts/table";

export default async function ContractsPage() {
  const [data, lookups] = await Promise.all([getContracts(), getContractLookups()]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contracts</CardTitle>
      </CardHeader>
      <CardContent>
        <ContractsTable data={data} lookups={lookups} onCreate={createContract} onDelete={deleteContract} />
      </CardContent>
    </Card>
  );
}
