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
import { useActionToast } from "@/lib/use-action-toast";

type QualitySpec = {
  id: number;
  commodityId: number;
  commodityName: string | null;
  name: string;
  description: string | null;
};

type CommodityOption = { id: number; name: string };

function QualitySpecEditDialog({
  spec,
  commodities,
  onUpdate
}: {
  spec: QualitySpec;
  commodities: CommodityOption[];
  onUpdate: (formData: FormData) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const handleUpdate = useActionToast({
    action: onUpdate,
    successTitle: "Quality spec updated",
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
          <DialogTitle>Edit Quality Spec</DialogTitle>
        </DialogHeader>
        <Form action={handleUpdate}>
          <input type="hidden" name="id" value={spec.id} />
          <FormRow>
            <FormField>
              <Label>Commodity</Label>
              <Select name="commodityId" defaultValue={spec.commodityId} required>
                {commodities.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField>
              <Label>Name</Label>
              <Input name="name" defaultValue={spec.name} required />
            </FormField>
            <FormField>
              <Label>Description</Label>
              <Input name="description" defaultValue={spec.description ?? ""} />
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

function QualitySpecCreateDialog({
  commodities,
  onCreate
}: {
  commodities: CommodityOption[];
  onCreate: (formData: FormData) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const handleCreate = useActionToast({
    action: onCreate,
    successTitle: "Quality spec created",
    errorTitle: "Create failed",
    onSuccess: () => setOpen(false)
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">New Quality Spec</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Quality Spec</DialogTitle>
        </DialogHeader>
        <Form action={handleCreate}>
          <FormRow>
            <FormField>
              <Label>Commodity</Label>
              <Select name="commodityId" required>
                {commodities.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField>
              <Label>Name</Label>
              <Input name="name" required />
            </FormField>
            <FormField>
              <Label>Description</Label>
              <Input name="description" />
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

function QualitySpecDeleteForm({ id, onDelete }: { id: number; onDelete: (formData: FormData) => void }) {
  const handleDelete = useActionToast({
    action: onDelete,
    successTitle: "Quality spec deleted",
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

export function QualitySpecsTable({
  data,
  commodities,
  onCreate,
  onUpdate,
  onDelete
}: {
  data: QualitySpec[];
  commodities: CommodityOption[];
  onCreate: (formData: FormData) => void;
  onUpdate: (formData: FormData) => void;
  onDelete: (formData: FormData) => void;
}) {
  const columns: ColumnDef<QualitySpec>[] = [
    { accessorKey: "name", header: "Spec" },
    { accessorKey: "commodityName", header: "Commodity" },
    { accessorKey: "description", header: "Description" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <QualitySpecEditDialog spec={row.original} commodities={commodities} onUpdate={onUpdate} />
          <QualitySpecDeleteForm id={row.original.id} onDelete={onDelete} />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-3">
      <QualitySpecCreateDialog commodities={commodities} onCreate={onCreate} />
      <DataTable data={data} columns={columns} filterPlaceholder="Filter quality specs..." />
    </div>
  );
}
