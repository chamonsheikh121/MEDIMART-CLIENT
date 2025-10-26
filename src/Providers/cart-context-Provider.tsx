
'use client';

import { useCartStore } from '@/app/stores/cart-store';
import { useEffect } from 'react';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const setMounted = useCartStore((state) => state.setMounted);
  
  useEffect(() => {
    setMounted(true);
  }, [setMounted]);

  return <>{children}</>;
}