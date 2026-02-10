"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormRow } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

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
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Company</DialogTitle>
              </DialogHeader>
              <Form action={onUpdate}>
                <input type="hidden" name="id" value={row.original.id} />
                <FormRow>
                  <FormField>
                    <Label>Name</Label>
                    <Input name="name" defaultValue={row.original.name} required />
                  </FormField>
                  <FormField>
                    <Label>Type</Label>
                    <Select name="type" defaultValue={row.original.type} required>
                      <option value="mitra">Mitra</option>
                      <option value="buyer">Buyer</option>
                      <option value="vendor">Vendor</option>
                    </Select>
                  </FormField>
                  <FormField>
                    <Label>Region</Label>
                    <Select name="regionId" defaultValue={row.original.regionId} required>
                      {regions.map((region) => (
                        <option key={region.id} value={region.id}>
                          {region.name}
                        </option>
                      ))}
                    </Select>
                  </FormField>
                  <FormField>
                    <Label>Email</Label>
                    <Input name="email" defaultValue={row.original.email ?? ""} />
                  </FormField>
                  <FormField>
                    <Label>Phone</Label>
                    <Input name="phone" defaultValue={row.original.phone ?? ""} />
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
          <Button size="sm">New Company</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Company</DialogTitle>
          </DialogHeader>
          <Form action={onCreate}>
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
      <DataTable data={data} columns={columns} filterPlaceholder="Filter companies..." />
    </div>
  );
}
