"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormRow } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

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
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Mill</DialogTitle>
              </DialogHeader>
              <Form action={onUpdate}>
                <input type="hidden" name="id" value={row.original.id} />
                <FormRow>
                  <FormField>
                    <Label>Code</Label>
                    <Input name="code" defaultValue={row.original.code} required />
                  </FormField>
                  <FormField>
                    <Label>Name</Label>
                    <Input name="name" defaultValue={row.original.name} required />
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
                    <Label>Company</Label>
                    <Select name="companyId" defaultValue={row.original.companyId} required>
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
          <Button size="sm">New Mill</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Mill</DialogTitle>
          </DialogHeader>
          <Form action={onCreate}>
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
      <DataTable data={data} columns={columns} filterPlaceholder="Filter mills..." />
    </div>
  );
}
