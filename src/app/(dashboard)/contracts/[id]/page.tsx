import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ContractDialog } from "@/modules/contracts/contract-dialog";
import { getContractDetail, getContractLookups } from "@/modules/contracts/queries";
import { updateContract } from "@/modules/contracts/actions";

export default async function ContractDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const [detail, lookups] = await Promise.all([getContractDetail(id), getContractLookups()]);

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
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice),
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
          <Table className="table-compact">
            <TableHeader>
              <TableRow>
                <TableHead>Commodity</TableHead>
                <TableHead>Quality</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>UOM</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detail.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.commodityName}</TableCell>
                  <TableCell>{item.qualityName}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.unitPrice}</TableCell>
                  <TableCell>{item.uom}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
