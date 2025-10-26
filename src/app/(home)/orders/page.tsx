'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';

// Components

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Loader2, 
  ShoppingBag, 
  Box, 
  Calendar, 
  ChevronDown,
  ChevronRight,
  Search,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useGetMe } from '@/React-Query/Queries/authQueries';
import { useGetUserOrders } from '@/React-Query/Queries/orderQueries';
import Image from 'next/image';

export default function OrdersPage() {
  const router = useRouter();
  const { data: user, isLoading: isUserLoading } = useGetMe();
  const { data: userOrders, isLoading: isOrdersLoading } = useGetUserOrders();
  console.log("userOrders: ", userOrders);
  
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || isOrdersLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 dark:text-blue-400 mb-4" />
        <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">Loading your orders...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Redirect will happen in useEffect
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
              Pending
            </div>
          </Badge>
        );
      case 'confirmed':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-500"></span>
              Confirmed
            </div>
          </Badge>
        );
      case 'shipped':
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-purple-500"></span>
              Shipped
            </div>
          </Badge>
        );
      case 'delivered':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              Delivered
            </div>
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-500"></span>
              Cancelled
            </div>
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700">
            Pending
          </Badge>
        );
      case 'paid':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
            Paid
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
            Failed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  const toggleOrderExpansion = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  const filterOrders = (orders: IOrder[]) => {
    if (!orders) return [];
    
    const filtered = orders.filter(order => {
      const orderIdMatch = order._id.toString().toLowerCase().includes(searchTerm.toLowerCase());
      
      if (activeFilter === 'all') return orderIdMatch;
      return order.status === activeFilter && orderIdMatch;
    });
    
    return filtered;
  };

  const FilterButton = ({ status, label, count }: { status: string; label: string; count: number }) => (
    <Button 
      variant={activeFilter === status ? "default" : "outline"}
      size="sm"
      className={`rounded-full h-9 px-4 ${
        activeFilter === status 
          ? "bg-blue-600 hover:bg-blue-700 text-white" 
          : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
      }`}
      onClick={() => setActiveFilter(status)}
    >
      {label}
      {count > 0 && (
        <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
          activeFilter === status 
            ? "bg-white text-blue-600" 
            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
        }`}>
          {count}
        </span>
      )}
    </Button>
  );

  const filteredOrders = filterOrders(userOrders?.data || []);
  
  // Count orders by status
  const orderCounts = {
    all: userOrders?.data?.length || 0,
    pending: userOrders?.data?.filter((order: IOrder) => order.status === 'pending')?.length || 0,
    confirmed: userOrders?.data?.filter((order: IOrder) => order.status === 'confirmed')?.length || 0,
    shipped: userOrders?.data?.filter((order: IOrder) => order.status === 'shipped')?.length || 0,
    delivered: userOrders?.data?.filter((order: IOrder) => order.status === 'delivered')?.length || 0,
    cancelled: userOrders?.data?.filter((order: IOrder) => order.status === 'cancelled')?.length || 0
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-16 ">
      {/* Page Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                Your Orders
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                View and track all your medication purchases
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Button asChild className="bg-blue-600 dark:text-white hover:bg-blue-700">
                <Link href="/shop">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and Filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative w-full sm:w-64 md:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 w-full border-gray-200 dark:border-gray-700 focus-visible:ring-blue-500"
            />
          </div>
          
          <div className="w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            <div className="flex gap-2">
              <FilterButton status="all" label="All Orders" count={orderCounts.all} />
              <FilterButton status="pending" label="Pending" count={orderCounts.pending} />
              <FilterButton status="confirmed" label="Confirmed" count={orderCounts.confirmed} />
              <FilterButton status="shipped" label="Shipped" count={orderCounts.shipped} />
              <FilterButton status="delivered" label="Delivered" count={orderCounts.delivered} />
              <FilterButton status="cancelled" label="Cancelled" count={orderCounts.cancelled} />
            </div>
          </div>
        </div>

        {/* Orders List */}
        {userOrders?.length === 0 || filteredOrders.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
            <div className="flex flex-col items-center">
              <Box className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No orders found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {userOrders?.length === 0 
                  ? "You haven't placed any orders yet." 
                  : "No orders match your current filters."}
              </p>
              <Button asChild className="bg-blue-600 dark:text-white hover:bg-blue-700">
                <Link href="/shop">Browse Medicines</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order: IOrder) => (
              <div 
                key={order._id} 
                className="bg-white dark:bg-gray-900  rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                {/* Order Header */}
                <div 
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 md:px-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => toggleOrderExpansion(order._id)}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:gap-8 mb-3 md:mb-0">
                    <div className="flex items-center gap-2 mb-2 md:mb-0">
                      {expandedOrder === order._id ? 
                        <ChevronDown className="h-5 w-5 text-gray-400" /> : 
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      }
                      <span className="font-semibold text-gray-900 dark:text-white">
                        Order #{order._id.toString().slice(-6).toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-4 w-4" />
                      {order.createdAt ? format(new Date(order.createdAt), 'MMM dd, yyyy') : 'N/A'}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    {getStatusBadge(order.status)}
                    <div className="text-lg font-medium text-gray-900 dark:text-white">
                      ${order.totalPrice.toFixed(2)}
                    </div>
                  </div>
                </div>
                
                {/* Order Details (expandable) */}
                {expandedOrder === order._id && (
                  <div className="border-t border-gray-200 dark:border-gray-700">
                    <div className="p-4 md:p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Order Summary</h4>
                          <div className="grid grid-cols-2 gap-y-2 text-sm">
                            <div className="text-gray-500 dark:text-gray-400">Items:</div>
                            <div className="text-gray-900 dark:text-white font-medium">{order.items.reduce((acc, item) => acc + item.quantity, 0)}</div>
                            
                            <div className="text-gray-500 dark:text-gray-400">Order Date:</div>
                            <div className="text-gray-900 dark:text-white font-medium">
                              {order.createdAt ? format(new Date(order.createdAt), 'MMMM dd, yyyy') : 'N/A'}
                            </div>
                            
                            <div className="text-gray-500 dark:text-gray-400">Order Status:</div>
                            <div>{getStatusBadge(order.status)}</div>
                            
                            <div className="text-gray-500 dark:text-gray-400">Payment Status:</div>
                            <div>{getPaymentBadge(order.paymentStatus)}</div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Price Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500 dark:text-gray-400">Subtotal:</span>
                              <span className="text-gray-900 dark:text-white font-medium">${(order?.totalPrice|| 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500 dark:text-gray-400">Shipping Fee:</span>
                              <span className="text-gray-900 dark:text-white font-medium">$0.00</span>
                            </div>
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2 flex justify-between">
                              <span className="font-medium text-gray-700 dark:text-gray-300">Total:</span>
                              <span className="font-medium text-gray-900 dark:text-white">${order.totalPrice.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Order Items */}
                      <div className="mt-6">
                        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Order Items</h4>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                              <thead className="bg-gray-100 dark:bg-gray-800">
                                <tr>
                                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Item</th>
                                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quantity</th>
                                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {order.items.map((item, index) => (
                                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                    <td className="px-4 py-3 whitespace-nowrap">
                                      <div className="flex items-center">
                                        {item.medicine.images && (
                                          <div className="flex-shrink-0 h-10 w-10 mr-3">
                                            <Image className="h-10 w-10 rounded-md object-cover" src={item.medicine.images[0].url} alt={item.medicine.name} width={40} height={40} />
                                          </div>
                                        )}
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{item.medicine.name}</div>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">{item.quantity}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">${item.price.toFixed(2)}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="mt-6 flex justify-end">
                        <Button variant="outline" className="mr-3">
                          Track Order
                        </Button>
                        <Button>View Invoice</Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}