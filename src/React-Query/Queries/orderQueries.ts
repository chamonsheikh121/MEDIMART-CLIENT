/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import axiosSecure from '../Axios/AxiosSecure';




export const useGetAllOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await axiosSecure.get('/order');
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};


export const useGetOrderById = (id: string) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const response = await axiosSecure.get(`/order/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};


export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: OrderData) => {
      const formData = new FormData();
      
  
      formData.append('items', JSON.stringify(data.items));
      formData.append('paymentMethod', data.paymentMethod);
      formData.append('deliveryAddress', JSON.stringify(data.deliveryAddress));
      formData.append('totalPrice', data.totalPrice.toString());

      if (data.prescription) {
        formData.append('prescription', data.prescription);
      }

      console.log(data.prescription);

      const response = await axiosSecure.post('/order/initiate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create order');
    },
  });
};


export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await axiosSecure.put(`/order/${id}`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order status updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update order status');
    },
  });
};


export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosSecure.delete(`/order/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete order');
    },
  });
};


export const useGetUserOrders = () => {
  return useQuery({
    queryKey: ['user-orders'],
    queryFn: async () => {
      const response = await axiosSecure.get('/order/user');
      return response.data;
    },
  });
};


export const useGetOrdersByUserId = (userId: string) => {
  return useQuery({
    queryKey: ['user-orders', userId],
    queryFn: async () => {
      const response = await axiosSecure.get(`/order/user/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });
};


export const useValidatePayment = () => {
  return useMutation({
    mutationFn: async ({ tran_id, val_id}: { tran_id: string, val_id: string}) => {
      const response = await axiosSecure.get(`/order/validate/${tran_id}?val_id=${val_id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Payment validated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to validate payment');
    },
  });
};