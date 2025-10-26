"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useDeleteMedicine } from "@/React-Query/Queries/medicineQueries";

export default function DeleteMedicineDialog({
  children,
  medicineId,
}: {
  children: React.ReactNode;
  medicineId: string;
}) {
  const [open, setOpen] = useState(false);
    const {mutate: deleteMedicine} = useDeleteMedicine(); 

  async function handleDelete() {
    deleteMedicine(medicineId, {
      onSuccess: () => {
        setOpen(false);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Medicine</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this medicine? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}