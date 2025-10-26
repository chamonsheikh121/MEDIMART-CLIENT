/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import axiosSecure from "@/React-Query/Axios/AxiosSecure";
import { AlertCircle } from "lucide-react";

interface OrderHistoryDialogProps {
  userId: string;
  onClose: () => void;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const paymentStatusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
};

export default function OrderHistoryDialog({ userId, onClose }: OrderHistoryDialogProps) {
  const { data: orders, isLoading, isError, error } = useQuery({
    queryKey: ["userOrders", userId],
    queryFn: async () => {
      const response = await axiosSecure.get(`/order/user/${userId}`);
      return response.data.data as IOrder[];
    },
  });

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order History</DialogTitle>
        </DialogHeader>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from({ length: 6 }).map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-red-500 py-4">
                    {(error as any)?.response?.data?.message === "No orders found for this user" ? (
                      <div className="flex justify-center items-center gap-2">
                        <AlertCircle className="text-yellow-500" />
                        <span>No orders yet</span>
                      </div>
                    ) : (
                      <span>{(error as any)?.response?.data?.message || "Getting Error While fetching"}</span>
                    )}
                  </TableCell>
                </TableRow>
              ) : orders?.length ? (
                orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">
                      #{order._id.toString().slice(-6).toUpperCase()}
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt as Date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{order.items.length}</TableCell>
                    <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${paymentStatusColors[order.paymentStatus]}`}>
                        {order.paymentStatus}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}