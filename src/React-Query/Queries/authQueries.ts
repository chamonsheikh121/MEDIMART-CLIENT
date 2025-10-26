/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import axiosSecure, { CustomAxiosRequestConfig } from '../Axios/AxiosSecure';



export const useLogin = (shouldRedirect = false) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await axiosSecure.post('/login', data,{
        ignoreAuthError: !shouldRedirect, // 👈 Dynamic behavior
      } as CustomAxiosRequestConfig);
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success('Welcome back to Medimart.');

      setTimeout(() => {
        router.push(data.role === 'admin' ? '/admin' : '/');
      }
        , 1000);

    },
    onError: (error: any) => {
      console.log(error);
      toast.error(error.response?.data?.message || "Login failed. Please check your credentials.");
    },
  });
};


export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const formData = new FormData();


      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('phone', data.phone);
      formData.append('address', data.address);
      formData.append('Image', data.Image as any);

      const response = await axiosSecure.post('/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      toast.success('Registration successful!');
      router.push('/log-in');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Registration failed');
    },
  });
};


export const useRefreshToken = () => {
  return useQuery({
    queryKey: ['refresh-token'],
    queryFn: async () => {
      const response = await axiosSecure.post('/refresh');
      return response.data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await axiosSecure.post('/logout');
      return response.data;
    },
    onSuccess: () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      queryClient.clear();
      toast('Logged out successfully', { icon: '👋' });
      router.push('/log-in');
    },
    onError: () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      queryClient.clear();
      toast('Logged out successfully', { icon: '👋' });
      router.push('/log-in');
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateData }) => {
      const response = await axiosSecure.post(`/update/${id}`, data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user', data.id] });
      toast.success('Profile updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Update failed');
    },
  });
};


export const useGetAllUsers = (
  search: string = '',
  page: number = 1,
  limit: number = 10,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['users', search, page, limit],
    queryFn: async () => {
      const response = await axiosSecure.get('/', {
        params: {
          search,
          page,
          limit
        },
      });
      return response.data.data;
    },
    enabled,
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetMe = (shouldRedirect = true) => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await axiosSecure.get('/me',{
        ignoreAuthError: !shouldRedirect, // 👈 Dynamic behavior
      } as CustomAxiosRequestConfig);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 3;
    }
  });
};