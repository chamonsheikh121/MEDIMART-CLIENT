'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useCartStore } from '@/app/stores/cart-store';

interface AddToCartButtonProps {
  medicine: IMedicine;
}

export default function AddToCartButton({ medicine }: AddToCartButtonProps) {
  const { addToCart, mounted } = useCartStore();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    if (!mounted) return;
    
    addToCart(medicine);
    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  return (
    <Button 
      className={`w-full transition-all duration-300 ${
        added 
          ? "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800" 
          : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
      } text-white`}
      disabled={!mounted || medicine.stock === 0 }
      onClick={handleAddToCart}
    >
      {added ? (
        <span className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          Added to Cart
        </span>
      ) : (
        <>
          { medicine.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </>
      )}
    </Button>
  );
}