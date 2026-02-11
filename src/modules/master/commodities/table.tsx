"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormRow } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionToast } from "@/lib/use-action-toast";

type Commodity = {
  id: number;
  code: string;
  name: string;
  uom: string;
};

function CommodityEditDialog({
  commodity,
  onUpdate
}: {
  commodity: Commodity;
  onUpdate: (formData: FormData) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const handleUpdate = useActionToast({
    action: onUpdate,
    successTitle: "Commodity updated",
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
          <DialogTitle>Edit Commodity</DialogTitle>
        </DialogHeader>
        <Form action={handleUpdate}>
          <input type="hidden" name="id" value={commodity.id} />
          <FormRow>
            <FormField>
              <Label>Code</Label>
              <Input name="code" defaultValue={commodity.code} required />
            </FormField>
            <FormField>
              <Label>Name</Label>
              <Input name="name" defaultValue={commodity.name} required />
            </FormField>
            <FormField>
              <Label>UOM</Label>
              <Input name="uom" defaultValue={commodity.uom} required />
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

function CommodityCreateDialog({ onCreate }: { onCreate: (formData: FormData) => void }) {
  const [open, setOpen] = React.useState(false);
  const handleCreate = useActionToast({
    action: onCreate,
    successTitle: "Commodity created",
    errorTitle: "Create failed",
    onSuccess: () => setOpen(false)
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">New Commodity</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Commodity</DialogTitle>
        </DialogHeader>
        <Form action={handleCreate}>
          <FormRow>
            <FormField>
              <Label>Code</Label>
              <Input name="code" required />
            </FormField>
            <FormField>
              <Label>Name</Label>
              <Input name="name" required />
            </FormField>
            <FormField>
              <Label>UOM</Label>
              <Input name="uom" required />
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

function CommodityDeleteForm({
  id,
  onDelete
}: {
  id: number;
  onDelete: (formData: FormData) => void;
}) {
  const handleDelete = useActionToast({
    action: onDelete,
    successTitle: "Commodity deleted",
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

export function CommoditiesTable({
  data,
  onCreate,
  onUpdate,
  onDelete
}: {
  data: Commodity[];
  onCreate: (formData: FormData) => void;
  onUpdate: (formData: FormData) => void;
  onDelete: (formData: FormData) => void;
}) {
  const columns: ColumnDef<Commodity>[] = [
    { accessorKey: "code", header: "Code" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "uom", header: "UOM" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <CommodityEditDialog commodity={row.original} onUpdate={onUpdate} />
          <CommodityDeleteForm id={row.original.id} onDelete={onDelete} />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-3">
      <CommodityCreateDialog onCreate={onCreate} />
      <DataTable data={data} columns={columns} filterPlaceholder="Filter commodities..." />
    </div>
  );
}
