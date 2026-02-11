import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContractDialog } from "@/modules/contracts/contract-dialog";
import { getContractDetail, getContractLookups } from "@/modules/contracts/queries";
import { updateContract } from "@/modules/contracts/actions";
import { ContractItemsTable } from "@/modules/contracts/contract-items-table";

type ContractDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ContractDetailPage({ params }: ContractDetailPageProps) {
  const { id } = await params;
  const contractId = Number(id);
  const [detail, lookups] = await Promise.all([getContractDetail(contractId), getContractLookups()]);

  if (!detail.contract) {
    return <div className="text-sm text-muted">Contract not found.</div>;
  }

  const payload = {
    id: detail.contract.id,
    contractNo: detail.contract.contractNo,
    sellerCompanyId: detail.contract.sellerCompanyId,
    buyerCompanyId: detail.contract.buyerCompanyId,
    regionId: detail.contract.regionId,
    contractDate: detail.contract.contractDate,
    status: detail.contract.status,
    notes: detail.contract.notes,
    items: detail.items.map((item) => ({
      commodityId: item.commodityId,
      qualitySpecId: item.qualitySpecId,
      description: item.description,
      quantity: String(item.quantity),
      unitPrice: String(Math.round(Number(item.unitPrice))),
      uom: item.uom,
      deliveryStart: item.deliveryStart,
      deliveryEnd: item.deliveryEnd
    }))
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contract {detail.contract.contractNo}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="text-sm text-muted">Status: {detail.contract.status}</div>
          <ContractDialog
            triggerLabel="Edit Contract"
            payload={payload}
            companies={lookups.companyList}
            regions={lookups.regionList}
            commodities={lookups.commodityList}
            qualitySpecs={lookups.qualityList}
            onSubmit={updateContract}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent>
          <ContractItemsTable data={detail.items} />
        </CardContent>
      </Card>
    </div>
  );
}
