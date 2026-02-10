"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormRow } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import Link from "next/link";

type ProformaRow = {
  id: number;
  number: string;
  status: string;
  issueDate: string;
  contractNo: string | null;
};

type ContractOption = { id: number; contractNo: string };

export function ProformaTable({
  data,
  contracts,
  onCreate,
  onUpdate,
  onDelete
}: {
  data: ProformaRow[];
  contracts: ContractOption[];
  onCreate: (formData: FormData) => void;
  onUpdate: (formData: FormData) => void;
  onDelete: (formData: FormData) => void;
}) {
  const columns: ColumnDef<ProformaRow>[] = [
    {
      accessorKey: "number",
      header: "Proforma No",
      cell: ({ row }) => (
        <Link className="underline" href={`/proforma/${row.original.id}`}>
          {row.original.number}
        </Link>
      )
    },
    { accessorKey: "contractNo", header: "Contract" },
    { accessorKey: "issueDate", header: "Issue Date" },
    { accessorKey: "status", header: "Status" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Proforma</DialogTitle>
              </DialogHeader>
              <Form action={onUpdate}>
                <input type="hidden" name="id" value={row.original.id} />
                <FormRow>
                  <FormField>
                    <Label>Issue Date</Label>
                    <Input type="date" name="issueDate" defaultValue={row.original.issueDate} required />
                  </FormField>
                  <FormField>
                    <Label>Status</Label>
                    <Select name="status" defaultValue={row.original.status}>
                      <option value="draft">Draft</option>
                      <option value="issued">Issued</option>
                    </Select>
                  </FormField>
                </FormRow>
                <div className="flex justify-end gap-2">
                  <Button type="submit">Save</Button>
                </div>
              </Form>
            </DialogContent>
          </Dialog>
          <form action={onDelete}>
            <input type="hidden" name="id" value={row.original.id} />
            <Button size="sm" variant="ghost" type="submit">
              Delete
            </Button>
          </form>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-3">
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm">New Proforma</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Proforma</DialogTitle>
          </DialogHeader>
          <Form action={onCreate}>
            <FormRow>
              <FormField>
                <Label>Contract</Label>
                <Select name="contractId" required>
                  {contracts.map((contract) => (
                    <option key={contract.id} value={contract.id}>
                      {contract.contractNo}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField>
                <Label>Number</Label>
                <Input name="number" required />
              </FormField>
              <FormField>
                <Label>Issue Date</Label>
                <Input type="date" name="issueDate" required />
              </FormField>
              <FormField>
                <Label>Status</Label>
                <Select name="status" defaultValue="draft">
                  <option value="draft">Draft</option>
                  <option value="issued">Issued</option>
                </Select>
              </FormField>
            </FormRow>
            <div className="flex justify-end gap-2">
              <Button type="submit">Create</Button>
            </div>
          </Form>
        </DialogContent>
      </Dialog>
      <DataTable data={data} columns={columns} filterPlaceholder="Filter proforma..." />
    </div>
  );
}
