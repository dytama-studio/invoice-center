"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ContractDialog } from "@/modules/contracts/contract-dialog";
import { useActionToast } from "@/lib/use-action-toast";

type ContractRow = {
  id: number;
  contractNo: string;
  sellerId: number;
  buyerId: number;
  sellerName: string | null;
  buyerName: string | null;
  regionName: string | null;
  status: string;
  contractDate: string;
};

type Option = { id: number; name: string; uom?: string; commodityId?: number };

function ContractDeleteForm({ id, onDelete }: { id: number; onDelete: (formData: FormData) => void }) {
  const handleDelete = useActionToast({
    action: onDelete,
    successTitle: "Contract deleted",
    errorTitle: "Delete failed"
  });

  return (
    <form action={handleDelete}>
      <input type="hidden" name="id" value={id} />
      <Button size="sm" variant="ghost" type="submit">
        Delete
      </Button>
    </form>
  );
}

export function ContractsTable({
  data,
  lookups,
  onCreate,
  onDelete
}: {
  data: ContractRow[];
  lookups: {
    companyList: Option[];
    regionList: Option[];
    commodityList: Option[];
    qualityList: Option[];
  };
  onCreate: (formData: FormData) => void;
  onDelete: (formData: FormData) => void;
}) {
  const columns: ColumnDef<ContractRow>[] = [
    {
      accessorKey: "contractNo",
      header: "Contract No",
      cell: ({ row }) => (
        <Link className="text-ink underline" href={`/contracts/${row.original.id}`}>
          {row.original.contractNo}
        </Link>
      )
    },
    { accessorKey: "sellerName", header: "Seller" },
    { accessorKey: "buyerName", header: "Buyer" },
    { accessorKey: "regionName", header: "Region" },
    { accessorKey: "status", header: "Status" },
    { accessorKey: "contractDate", header: "Date" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Link href={`/contracts/${row.original.id}`}>
            <Button size="sm" variant="outline">
              View
            </Button>
          </Link>
          <ContractDeleteForm id={row.original.id} onDelete={onDelete} />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-3">
      <ContractDialog
        triggerLabel="New Contract"
        companies={lookups.companyList}
        regions={lookups.regionList}
        commodities={lookups.commodityList}
        qualitySpecs={lookups.qualityList}
        onSubmit={onCreate}
      />
      <DataTable data={data} columns={columns} filterPlaceholder="Filter contracts..." />
    </div>
  );
}
