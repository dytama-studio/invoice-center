"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormRow } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

type QualitySpec = {
  id: number;
  commodityId: number;
  commodityName: string | null;
  name: string;
  description: string | null;
};

type CommodityOption = { id: number; name: string };

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
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Quality Spec</DialogTitle>
              </DialogHeader>
              <Form action={onUpdate}>
                <input type="hidden" name="id" value={row.original.id} />
                <FormRow>
                  <FormField>
                    <Label>Commodity</Label>
                    <Select name="commodityId" defaultValue={row.original.commodityId} required>
                      {commodities.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </Select>
                  </FormField>
                  <FormField>
                    <Label>Name</Label>
                    <Input name="name" defaultValue={row.original.name} required />
                  </FormField>
                  <FormField>
                    <Label>Description</Label>
                    <Input name="description" defaultValue={row.original.description ?? ""} />
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
          <Button size="sm">New Quality Spec</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Quality Spec</DialogTitle>
          </DialogHeader>
          <Form action={onCreate}>
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
      <DataTable data={data} columns={columns} filterPlaceholder="Filter quality specs..." />
    </div>
  );
}
