"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, ShoppingCart } from "lucide-react";
import { useGetAllUsers } from "@/React-Query/Queries/authQueries";
import { PaginationControls } from "../shared/PaginationControls";
import UserDetailsDialog from "./UserDetailsDialog";
import OrderHistoryDialog from "./OrderHistoryDialog";


export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [dialogType, setDialogType] = useState<"details" | "orders" | null>(null);

  const { data: users, isLoading, isError } = useGetAllUsers(searchTerm, page, limit);

  const handleViewDetails = (user: IUser) => {
    setSelectedUser(user);
    setDialogType("details");
  };

  const handleViewOrders = (user: IUser) => {
    setSelectedUser(user);
    setDialogType("orders");
  };

  const handleCloseDialog = () => {
    setSelectedUser(null);
    setDialogType(null);
  };

  if (isError) {
    return <div className="text-red-500">Error loading users</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold mb-3 w-full">User Management</h1>
          <div className="lg:w-1/3 w-full">
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from({ length: 6 }).map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : users?.users?.length ? (
                users.users.map((user: IUser) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${user.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                          }`}
                      >
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt as Date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleViewDetails(user)}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleViewOrders(user)}
                        title="View Orders"
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {users?.totalPages && users.totalPages > 1 && (
          <PaginationControls
            currentPage={page}
            totalPages={users.totalPages}
            onPageChange={setPage}
          />
        )}

        {selectedUser && dialogType === "details" && (
          <UserDetailsDialog user={selectedUser} onClose={handleCloseDialog} />
        )}

        {selectedUser && dialogType === "orders" && (
          <OrderHistoryDialog userId={selectedUser._id} onClose={handleCloseDialog} />
        )}
      </div>
    </div>
  );
}