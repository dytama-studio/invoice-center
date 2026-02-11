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

type Region = {
  id: number;
  code: string;
  name: string;
};

function RegionEditDialog({ region, onUpdate }: { region: Region; onUpdate: (formData: FormData) => void }) {
  const [open, setOpen] = React.useState(false);
  const handleUpdate = useActionToast({
    action: onUpdate,
    successTitle: "Region updated",
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
          <DialogTitle>Edit Region</DialogTitle>
        </DialogHeader>
        <Form action={handleUpdate}>
          <input type="hidden" name="id" value={region.id} />
          <FormRow>
            <FormField>
              <Label>Code</Label>
              <Input name="code" defaultValue={region.code} required />
            </FormField>
            <FormField>
              <Label>Name</Label>
              <Input name="name" defaultValue={region.name} required />
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

function RegionCreateDialog({ onCreate }: { onCreate: (formData: FormData) => void }) {
  const [open, setOpen] = React.useState(false);
  const handleCreate = useActionToast({
    action: onCreate,
    successTitle: "Region created",
    errorTitle: "Create failed",
    onSuccess: () => setOpen(false)
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">New Region</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Region</DialogTitle>
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
          </FormRow>
          <div className="flex justify-end gap-2">
            <Button type="submit">Create</Button>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function RegionDeleteForm({ id, onDelete }: { id: number; onDelete: (formData: FormData) => void }) {
  const handleDelete = useActionToast({
    action: onDelete,
    successTitle: "Region deleted",
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

export function RegionsTable({
  data,
  onCreate,
  onUpdate,
  onDelete
}: {
  data: Region[];
  onCreate: (formData: FormData) => void;
  onUpdate: (formData: FormData) => void;
  onDelete: (formData: FormData) => void;
}) {
  const columns: ColumnDef<Region>[] = [
    { accessorKey: "code", header: "Code" },
    { accessorKey: "name", header: "Name" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <RegionEditDialog region={row.original} onUpdate={onUpdate} />
          <RegionDeleteForm id={row.original.id} onDelete={onDelete} />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-3">
      <RegionCreateDialog onCreate={onCreate} />
      <DataTable data={data} columns={columns} filterPlaceholder="Filter regions..." />
    </div>
  );
}
