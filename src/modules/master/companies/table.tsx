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

type Company = {
  id: number;
  name: string;
  type: "mitra" | "buyer" | "vendor";
  regionId: number;
  regionName: string | null;
  email: string | null;
  phone: string | null;
};

type RegionOption = { id: number; name: string };

function CompanyEditDialog({
  company,
  regions,
  onUpdate
}: {
  company: Company;
  regions: RegionOption[];
  onUpdate: (formData: FormData) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const handleUpdate = useActionToast({
    action: onUpdate,
    successTitle: "Company updated",
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
          <DialogTitle>Edit Company</DialogTitle>
        </DialogHeader>
        <Form action={handleUpdate}>
          <input type="hidden" name="id" value={company.id} />
          <FormRow>
            <FormField>
              <Label>Name</Label>
              <Input name="name" defaultValue={company.name} required />
            </FormField>
            <FormField>
              <Label>Type</Label>
              <Select name="type" defaultValue={company.type} required>
                <option value="mitra">Mitra</option>
                <option value="buyer">Buyer</option>
                <option value="vendor">Vendor</option>
              </Select>
            </FormField>
            <FormField>
              <Label>Region</Label>
              <Select name="regionId" defaultValue={company.regionId} required>
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField>
              <Label>Email</Label>
              <Input name="email" defaultValue={company.email ?? ""} />
            </FormField>
            <FormField>
              <Label>Phone</Label>
              <Input name="phone" defaultValue={company.phone ?? ""} />
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

function CompanyCreateDialog({
  regions,
  onCreate
}: {
  regions: RegionOption[];
  onCreate: (formData: FormData) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const handleCreate = useActionToast({
    action: onCreate,
    successTitle: "Company created",
    errorTitle: "Create failed",
    onSuccess: () => setOpen(false)
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">New Company</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Company</DialogTitle>
        </DialogHeader>
        <Form action={handleCreate}>
          <FormRow>
            <FormField>
              <Label>Name</Label>
              <Input name="name" required />
            </FormField>
            <FormField>
              <Label>Type</Label>
              <Select name="type" required>
                <option value="mitra">Mitra</option>
                <option value="buyer">Buyer</option>
                <option value="vendor">Vendor</option>
              </Select>
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
              <Label>Email</Label>
              <Input name="email" />
            </FormField>
            <FormField>
              <Label>Phone</Label>
              <Input name="phone" />
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

function CompanyDeleteForm({ id, onDelete }: { id: number; onDelete: (formData: FormData) => void }) {
  const handleDelete = useActionToast({
    action: onDelete,
    successTitle: "Company deleted",
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

export function CompaniesTable({
  data,
  regions,
  onCreate,
  onUpdate,
  onDelete
}: {
  data: Company[];
  regions: RegionOption[];
  onCreate: (formData: FormData) => void;
  onUpdate: (formData: FormData) => void;
  onDelete: (formData: FormData) => void;
}) {
  const columns: ColumnDef<Company>[] = [
    { accessorKey: "name", header: "Company" },
    { accessorKey: "type", header: "Type" },
    { accessorKey: "regionName", header: "Region" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <CompanyEditDialog company={row.original} regions={regions} onUpdate={onUpdate} />
          <CompanyDeleteForm id={row.original.id} onDelete={onDelete} />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-3">
      <CompanyCreateDialog regions={regions} onCreate={onCreate} />
      <DataTable data={data} columns={columns} filterPlaceholder="Filter companies..." />
    </div>
  );
}
