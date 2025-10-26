'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Pencil, Search, Trash2 } from "lucide-react";
import EditMedicineDialog from "./edit-medicine";
import DeleteMedicineDialog from "./delete-medicine-dialog";
import { useGetAllMedicines } from "@/React-Query/Queries/medicineQueries";
import { Input } from "../ui/input";
import AddMedicineDialog from "./add-medicine-dialog";
import { useState } from "react";
import { PaginationControls } from "../shared/PaginationControls";
import { Skeleton } from "../ui/skeleton";

export default function MedicineTable() {
    const [search, setSearch] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const { data: medicines, isPending } = useGetAllMedicines({ search, page });

    return (
        <div>

            <div className="flex gap-2 mb-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search medicines..."
                        className="pl-10"
                        defaultValue={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <AddMedicineDialog>
                    <Button>Add Medicine</Button>
                </AddMedicineDialog>
            </div>
            {
                isPending ? (
                    <div className="flex flex-col gap-2 rounded-md border mb-5 bg-white p-4">
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                    </div>
                ) : (<div className="rounded-md border mb-5">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead>Prescription</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {medicines?.data?.map((medicine: IMedicine) => (
                                <TableRow key={medicine._id}>
                                    <TableCell className="font-medium">{medicine.name}</TableCell>
                                    <TableCell className="max-w-[200px] truncate">
                                        {medicine.description}
                                    </TableCell>
                                    <TableCell>${medicine.price.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                medicine.stock > 50
                                                    ? "default"
                                                    : medicine.stock > 10
                                                        ? "secondary"
                                                        : "destructive"
                                            }
                                        >
                                            {medicine.stock}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {medicine.requiredPrescription ? (
                                            <Badge className="text-white" variant="destructive">Required</Badge>
                                        ) : (
                                            <Badge variant="secondary">Not Required</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{medicine.category}</Badge>
                                    </TableCell>
                                    <TableCell className="flex gap-2">
                                        <EditMedicineDialog medicine={medicine}>
                                            <Button variant="outline" size="icon">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </EditMedicineDialog>
                                        <DeleteMedicineDialog medicineId={medicine._id}>
                                            <Button variant="outline" size="icon">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </DeleteMedicineDialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {
                        medicines?.pagination.total && medicines.pagination.total > 1 && (
                            <div className="w-full">
                                <PaginationControls
                                    currentPage={page}
                                    onPageChange={setPage}
                                    totalPages={medicines?.pagination.pages || 1}
                                />
                            </div>
                        )
                    }
                </div>)
            }


        </div>);
}