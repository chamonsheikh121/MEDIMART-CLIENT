import { useQuery } from '@tanstack/react-query';
import axiosSecure from '../Axios/AxiosSecure';

export const useStatistics = () => {
  return useQuery<IStatistics>({
    queryKey: ['statistics'],
    queryFn: async () => {
      const { data } = await axiosSecure.get('/statistics');
      return data;
    },
    refetchInterval: 300000, // Refetch every 5 minutes
  });
};