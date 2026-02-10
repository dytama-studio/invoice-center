"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormRow } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Region = {
  id: number;
  code: string;
  name: string;
};

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
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Region</DialogTitle>
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
          <Button size="sm">New Region</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Region</DialogTitle>
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
            </FormRow>
            <div className="flex justify-end gap-2">
              <Button type="submit">Create</Button>
            </div>
          </Form>
        </DialogContent>
      </Dialog>
      <DataTable data={data} columns={columns} filterPlaceholder="Filter regions..." />
    </div>
  );
}
