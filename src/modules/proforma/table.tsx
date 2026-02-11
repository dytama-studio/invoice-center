"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormRow } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui2/select";
import Link from "next/link";
import { useActionToast } from "@/lib/use-action-toast";

type ProformaRow = {
  id: number;
  number: string;
  status: string;
  issueDate: string;
  contractNo: string | null;
};

type ContractOption = { id: number; contractNo: string };

function ProformaEditDialog({
  row,
  onUpdate
}: {
  row: ProformaRow;
  onUpdate: (formData: FormData) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const handleUpdate = useActionToast({
    action: onUpdate,
    successTitle: "Proforma updated",
    errorTitle: "Update failed",
    onSuccess: () => setOpen(false)
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Proforma</DialogTitle>
        </DialogHeader>
        <Form action={handleUpdate}>
          <input type="hidden" name="id" value={row.id} />
          <FormRow>
            <FormField>
              <Label>Issue Date</Label>
              <Input type="date" name="issueDate" defaultValue={row.issueDate} required />
            </FormField>
            <FormField>
              <Label>Status</Label>
              <Select name="status" defaultValue={row.status}>
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
  );
}

function ProformaCreateDialog({
  contracts,
  onCreate
}: {
  contracts: ContractOption[];
  onCreate: (formData: FormData) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const handleCreate = useActionToast({
    action: onCreate,
    successTitle: "Proforma created",
    errorTitle: "Create failed",
    onSuccess: () => setOpen(false)
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">New Proforma</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Proforma</DialogTitle>
        </DialogHeader>
        <Form action={handleCreate}>
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
  );
}

function ProformaDeleteForm({ id, onDelete }: { id: number; onDelete: (formData: FormData) => void }) {
  const handleDelete = useActionToast({
    action: onDelete,
    successTitle: "Proforma deleted",
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
          <ProformaEditDialog row={row.original} onUpdate={onUpdate} />
          <ProformaDeleteForm id={row.original.id} onDelete={onDelete} />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-3">
      <ProformaCreateDialog contracts={contracts} onCreate={onCreate} />
      <DataTable data={data} columns={columns} filterPlaceholder="Filter proforma..." />
    </div>
  );
}
