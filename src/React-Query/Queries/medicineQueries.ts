/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { toast } from 'sonner';
import axiosSecure from '../Axios/AxiosSecure';


interface MedicineFormData {
    name: string;
    description: string;
    price: number;
    stock: number;
    requiredPrescription: boolean;
    manufacturer: {
        name: string;
        address: string;
        contact: string;
    };
    symptoms: string[];
    category: string;
    images?: File[];
    deleteImages?: string[];
}


export const useGetAllMedicines = ({
    search,
    category,
    minPrice,
    maxPrice,
    requiredPrescription,
    page = 1,
    limit = 12,
}: {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    requiredPrescription?: boolean;
    page?: number;
    limit?: number;
} = {}) => {
    return useQuery({
        queryKey: [
            'medicines',
            search ?? '',
            category ?? '',
            minPrice ?? '',
            maxPrice ?? '',
            requiredPrescription ?? '',
            page,
            limit,
        ],
        queryFn: async () => {
            const response = await axiosSecure.get('/medicine/', {
                params: {
                    search,
                    category,
                    minPrice,
                    maxPrice,
                    requiredPrescription,
                    page,
                    limit,
                },
            });
            return response.data;
        },
        staleTime: 1000 * 60 * 5,
        placeholderData: keepPreviousData, // Optional but improves UX on pagination
    });
};



export const useGetMedicineById = (id: string) => {
    return useQuery({
        queryKey: ['medicine', id],
        queryFn: async () => {
            const response = await axiosSecure.get(`/medicine/${id}`);
            return response.data.data;
        },
        enabled: !!id, 
    });
};


export const useAddMedicine = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: MedicineFormData) => {
            const formData = new FormData();


            Object.entries(data).forEach(([key, value]) => {
                if (key === 'images' && value) {
                    (value as File[]).forEach(file => formData.append('images', file));
                } else if (key === 'manufacturer' && value) {
                    formData.append('manufacturer', JSON.stringify(value));
                } else if (key !== 'deleteImages' && value !== undefined) {
                    formData.append(key, typeof value === 'boolean' ? String(value) : String(value));
                }
            });
            

            const response = await axiosSecure.post('/medicine/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['medicines'] });
            toast.success('Medicine added successfully!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to add medicine');
        },
    });
};

export const useUpdateMedicine = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: FormData }) => {
            
            console.log("deletedImages: ",data.get("deletedImages"));
            console.log("images: ",data.get("images"));

            const response = await axiosSecure.post(`/medicine/update/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['medicines'] });
            queryClient.invalidateQueries({ queryKey: ['medicine', data.data._id] });
            toast.success('Medicine updated successfully!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update medicine');
        },
    });
};


export const useDeleteMedicine = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await axiosSecure.delete(`/medicine/remove/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['medicines'] });
            toast.success('Medicine deleted successfully!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete medicine');
        },
    });
};