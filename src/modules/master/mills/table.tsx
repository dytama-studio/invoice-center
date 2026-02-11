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

type Mill = {
  id: number;
  code: string;
  name: string;
  regionId: number;
  regionName: string | null;
  companyId: number;
  companyName: string | null;
};

type Option = { id: number; name: string };

function MillEditDialog({
  mill,
  regions,
  companies,
  onUpdate
}: {
  mill: Mill;
  regions: Option[];
  companies: Option[];
  onUpdate: (formData: FormData) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const handleUpdate = useActionToast({
    action: onUpdate,
    successTitle: "Mill updated",
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
          <DialogTitle>Edit Mill</DialogTitle>
        </DialogHeader>
        <Form action={handleUpdate}>
          <input type="hidden" name="id" value={mill.id} />
          <FormRow>
            <FormField>
              <Label>Code</Label>
              <Input name="code" defaultValue={mill.code} required />
            </FormField>
            <FormField>
              <Label>Name</Label>
              <Input name="name" defaultValue={mill.name} required />
            </FormField>
            <FormField>
              <Label>Region</Label>
              <Select name="regionId" defaultValue={mill.regionId} required>
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField>
              <Label>Company</Label>
              <Select name="companyId" defaultValue={mill.companyId} required>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
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

function MillCreateDialog({
  regions,
  companies,
  onCreate
}: {
  regions: Option[];
  companies: Option[];
  onCreate: (formData: FormData) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const handleCreate = useActionToast({
    action: onCreate,
    successTitle: "Mill created",
    errorTitle: "Create failed",
    onSuccess: () => setOpen(false)
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">New Mill</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Mill</DialogTitle>
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
              <Label>Region</Label>
              <Select name="regionId" required>
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField>
              <Label>Company</Label>
              <Select name="companyId" required>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
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

function MillDeleteForm({ id, onDelete }: { id: number; onDelete: (formData: FormData) => void }) {
  const handleDelete = useActionToast({
    action: onDelete,
    successTitle: "Mill deleted",
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

export function MillsTable({
  data,
  regions,
  companies,
  onCreate,
  onUpdate,
  onDelete
}: {
  data: Mill[];
  regions: Option[];
  companies: Option[];
  onCreate: (formData: FormData) => void;
  onUpdate: (formData: FormData) => void;
  onDelete: (formData: FormData) => void;
}) {
  const columns: ColumnDef<Mill>[] = [
    { accessorKey: "code", header: "Code" },
    { accessorKey: "name", header: "Mill" },
    { accessorKey: "regionName", header: "Region" },
    { accessorKey: "companyName", header: "Company" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <MillEditDialog mill={row.original} regions={regions} companies={companies} onUpdate={onUpdate} />
          <MillDeleteForm id={row.original.id} onDelete={onDelete} />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-3">
      <MillCreateDialog regions={regions} companies={companies} onCreate={onCreate} />
      <DataTable data={data} columns={columns} filterPlaceholder="Filter mills..." />
    </div>
  );
}
