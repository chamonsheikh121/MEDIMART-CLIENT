'use client';

import { Eye, Loader2, Trash2 } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useGetMe } from '@/React-Query/Queries/authQueries';
import { useDeleteOrder, useGetAllOrders, useUpdateOrderStatus } from '@/React-Query/Queries/orderQueries';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import Image from 'next/image';


export default function ManageOrdersPage() {
    const router = useRouter();
    const [selected, SetSelected] = useState("")
    const { data: user, isLoading: isUserLoading } = useGetMe();
    const { data: orders, isLoading: isOrdersLoading } = useGetAllOrders();
    const { mutate: updateStatus, isPending } = useUpdateOrderStatus();
    const { mutate: deleteOrder, isPending: isDeletePending } = useDeleteOrder();

    useEffect(() => {
        if (!isUserLoading && user?.role !== 'admin') {
            router.push('/unauthorized');
        }
    }, [user, isUserLoading, router]);

    const handleStatusChange = (orderId: string, newStatus: string) => {
        SetSelected(orderId);
        updateStatus(
            { id: orderId, status: newStatus },
            {
                onSuccess: () => {
                    //   toast({
                    //     title: 'Success',
                    //     description: 'Order status updated successfully',
                    //   });
                },
            }
        );
    };

    const handleDeleteOrder = (orderId: string) => {

        if (confirm('Are you sure you want to delete this order?')) {
            SetSelected(orderId);
            deleteOrder(orderId, {
                onSuccess: () => {
                    //   toast({
                    //     title: 'Success',
                    //     description: 'Order deleted successfully',
                    //   });
                },
            });
        }
    };

    if (isUserLoading || isOrdersLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (user?.role !== 'admin') {
        return null; 
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="secondary">Pending</Badge>;
            case 'confirmed':
                return <Badge className="bg-blue-500">Confirmed</Badge>;
            case 'shipped':
                return <Badge className="bg-purple-500">Shipped</Badge>;
            case 'delivered':
                return <Badge className="bg-green-500">Delivered</Badge>;
            case 'cancelled':
                return <Badge className='text-white' variant="destructive">Cancelled</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>

            {orders?.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-lg text-gray-600">No orders found.</p>
                </div>
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableCaption>A list of all orders.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Items</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Prescription</TableHead>
                                <TableHead>Payment</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders?.data?.map((order: IOrder) => (
                                <TableRow key={order._id.toString()}>
                                    <TableCell className="font-medium">
                                        #{order._id.toString().slice(-6).toUpperCase()}
                                    </TableCell>
                                    <TableCell>{order.user?.name || 'Unknown'}</TableCell>
                                    <TableCell>{order.items.reduce((acc, item) => acc + item.quantity, 0)}</TableCell>
                                    <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Select
                                            disabled={isPending && selected === order._id} // Disable while updating
                                            value={order.status}
                                            onValueChange={(value) =>
                                                handleStatusChange(order._id.toString(), value)
                                            }
                                        >
                                            <SelectTrigger className="w-[150px]">
                                                {isPending && selected === order._id ? (
                                                    <span className="text-muted-foreground animate-pulse">Updating...</span>
                                                ) : (
                                                    <SelectValue placeholder="Select status" />
                                                )}
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                                <SelectItem value="shipped">Shipped</SelectItem>
                                                <SelectItem value="delivered">Delivered</SelectItem>
                                                <SelectItem value="cancelled">Cancelled</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        {order.prescription ? (
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <button className="text-blue-600 flex gap-2 cursor-pointer hover:text-blue-800">
                                                        <Eye size={20} /> Preview
                                                    </button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-md">
                                                    <div className="relative w-full aspect-video">
                                                        <Image
                                                            src={order.prescription.url}
                                                            alt="Prescription"
                                                            fill
                                                            className="object-contain rounded"
                                                            sizes="(max-width: 768px) 100vw, 600px"
                                                        />
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        ) : (
                                            <span className="text-muted-foreground">No Prescription</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(order.paymentStatus)}
                                    </TableCell>
                                    <TableCell className="flex gap-2">
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => handleDeleteOrder(order._id.toString())}
                                            disabled={isDeletePending && selected === order._id}
                                        >
                                            {isDeletePending && selected === order._id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}