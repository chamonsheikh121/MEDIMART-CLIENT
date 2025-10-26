'use client';

import { ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/app/stores/cart-store';

export default function CartIcon() {
    const {
        cart,
        totalItems,
        totalPrice,
        removeFromCart,
        updateQuantity,
        mounted,
        version 
    } = useCartStore();


    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" className="relative p-2" key={`cart-${version}`}>
                    <ShoppingCart className="h-6 w-6" />
                    {mounted && totalItems > 0 && (
                        <Badge className="absolute -top-2 -right-2 bg-blue-600 text-white">
                            {totalItems}
                        </Badge>
                    )}
                </Button>
            </SheetTrigger>

            <SheetContent className="w-full sm:max-w-md p-5 bg-gray-900">
                <SheetHeader>
                    <SheetTitle>
                        Your Cart ({mounted ? totalItems : 0} {totalItems === 1 ? 'item' : 'items'})
                    </SheetTitle>
                </SheetHeader>

                <div className="mt-6">
                    {!mounted ? (
                        <div className="flex justify-center items-center h-40">
                            <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent" />
                        </div>
                    ) : cart.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">Your cart is empty</p>
                            <Link href="/shop" className="mt-4 inline-block">
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                    Browse Products
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                                {cart.map(item => (
                                    <div
                                        key={item._id}
                                        className="flex items-center gap-4 py-4 border-b"
                                    >
                                        <div className="relative w-16 h-16 bg-gray-100 rounded">
                                            <Image
                                                src={item.images[0]?.url || "/placeholder.svg"}
                                                alt={item.name}
                                                fill
                                                className="object-contain p-2"
                                                sizes="64px"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium truncate">{item.name}</h3>
                                            <p className="text-blue-600">${item.price.toFixed(2)}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                            >
                                                -
                                            </Button>
                                            <span className="w-8 text-center">{item.quantity}</span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                            >
                                                +
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-500 hover:text-red-600"
                                                onClick={() => removeFromCart(item._id)}
                                            >
                                                ×
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 space-y-4">
                                <div className="flex justify-between text-lg font-semibold">
                                    <span>Total:</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>
                                <Link href="/checkout" className="block">
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                        Proceed to Checkout
                                    </Button>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}