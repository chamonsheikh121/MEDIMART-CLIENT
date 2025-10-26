
'use client';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/React-Query';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}