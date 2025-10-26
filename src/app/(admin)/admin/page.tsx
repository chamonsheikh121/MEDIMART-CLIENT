'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStatistics } from '@/React-Query/Queries/statisticsQuery';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function DashboardPage() {
  const { data: statistics, isLoading, error } = useStatistics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div>Error loading statistics</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics?.totalOrders}</div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${statistics?.revenueStats.totalRevenue?.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Avg. Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${statistics?.revenueStats.averageOrderValue?.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Medicines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistics?.medicineStats.totalMedicines} ({statistics?.medicineStats.lowStock} low, {statistics?.medicineStats.outOfStock} out)
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Orders by Status</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statistics?.ordersByStatus}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="Order Count" />
                <Bar dataKey="totalRevenue" fill="#82ca9d" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Payment Status</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statistics?.paymentStatusCounts}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="_id"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {statistics?.paymentStatusCounts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Selling Medicines */}
      <Card className="mb-8 bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle>Top Selling Medicines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {statistics?.topSellingMedicines.map((medicine) => (
              <div key={medicine.name} className="border rounded-lg p-4 text-center">
                {medicine.image && (
                  <div className="relative w-20 h-20 mx-auto mb-2">
                    <Image
                      src={medicine.image}
                      alt={medicine.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <h3 className="font-medium">{medicine.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sold: {medicine.totalQuantity}
                </p>
                <p className="text-sm font-medium">
                  ${medicine.totalRevenue.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {statistics?.recentOrders.map((order) => (
              <div key={order._id.toString()} className="border-b pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Order #{order._id.toString().slice(-6).toUpperCase()}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{order.user.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${order.totalPrice.toFixed(2)}</p>
                    <div className="flex gap-2 justify-end">
                      <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        {order.status}
                      </span>
                      <span className="text-sm px-2 py-1 bg-green-100 text-green-800 rounded">
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
