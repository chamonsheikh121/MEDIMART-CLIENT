'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useCartStore } from '@/app/stores/cart-store';
import { useCreateOrder } from '@/React-Query/Queries/orderQueries';
import { useGetMe } from '@/React-Query/Queries/authQueries';
import { useEffect, useState } from 'react';

const formSchema = z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
    country: z.string().min(1, 'Country is required'),
    paymentMethod: z.enum(['cash-on-delivery', 'online']),
    prescription: z.any().optional()
}).superRefine((data, ctx) => {
    const needsPrescription = useCartStore.getState().cart.some(item => item.requiredPrescription);
    if (needsPrescription && !data.prescription) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Prescription is required for items in your cart",
            path: ["prescription"]
        });
    }
});

export default function CheckoutForm() {
    const { data: user, isLoading: userLoading } = useGetMe();
    const { cart, totalPrice, clearCart } = useCartStore();
    const router = useRouter();
    const { mutate: createOrder, isPending } = useCreateOrder();
    const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);

    const needsPrescription = cart.some(item => item.requiredPrescription);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            street: '',
            city: '',
            state: '',
            postalCode: '',
            country: '',
            paymentMethod: 'online',
            prescription: undefined,
        },
    });

    

    useEffect(() => {
        if (!userLoading && user?.role !== 'customer') {
            console.log("Role in Checkout:", user, user?.role);
            toast.error('Only customers can place orders');
            router.push('/');
        }
    }, [user, userLoading, router]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (user?.role !== 'customer') {
            toast.error('Only customers can place orders');
            return;
        }

        const orderData = {
            user: user?._id,
            items: cart.map(item => ({
                medicine: item._id,
                quantity: item.quantity,
                price: item.price,
                itemTotal: item.price * item.quantity,
            })),
            deliveryAddress: {
                street: values.street,
                city: values.city,
                state: values.state,
                postalCode: values.postalCode,
                country: values.country,
            },
            paymentMethod: 'online',
            totalPrice,
            prescription: prescriptionFile
        };

        createOrder(orderData, {
            onSuccess: (data) => {
                if (data.data.paymentUrl) {
                    window.location.href = data.data.paymentUrl;
                } else {
                    clearCart();
                    toast.success('Order placed successfully!');
                    router.push('/orders');
                }
            },
            onError: (error) => {
                toast.error(error.message || 'Failed to place order');
            }
        });
    }

    if (userLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (user?.role !== 'customer') {
        return null;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* Delivery Information Card */}
                <Card className="shadow-lg dark:bg-gray-800 ">
                    <CardHeader className="border-b">
                        <CardTitle className="text-xl">Delivery Information</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="street"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Street Address</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="123 Main St" {...field} className="py-6 dark:border-gray-700 dark:bg-gray-900" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="city"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>City</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="New York" {...field} className="py-6 dark:border-gray-700 dark:bg-gray-900" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="state"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>State/Province</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="NY" {...field} className="py-6 dark:border-gray-700 dark:bg-gray-900" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="postalCode"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Postal Code</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="10001" {...field} className="py-6 dark:border-gray-700 dark:bg-gray-900" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="country"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Country</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="United States" {...field} className="py-6 dark:border-gray-700 dark:bg-gray-900" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    
                                    {needsPrescription && (
                                        <FormField
                                            control={form.control}
                                            name="prescription"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Prescription (Required for some items)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="file"
                                                            accept="image/*,.pdf"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) {
                                                                    setPrescriptionFile(file);
                                                                    field.onChange(file.name);
                                                                }
                                                            }}
                                                            className='dark:border-gray-700 dark:bg-gray-900'
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                    <p className="text-sm text-muted-foreground mt-2">
                                                        Upload a clear image or PDF of your prescription
                                                    </p>
                                                </FormItem>
                                            )}
                                        />
                                    )}
                                    
                                </div>
                                
                                <Button 
                                    type="submit" 
                                    className="w-full py-6 text-lg dark:bg-gray-950 dark:hover:bg-gray-900 dark:text-white" 
                                    disabled={isPending}
                                >
                                    {isPending ? 'Processing...' : 'Place Order & Pay'}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                {/* Order Summary Card */}
                <Card className="shadow-lg h-fit sticky dark:bg-gray-800 top-8">
                    <CardHeader className="border-b dark:border-gray-700">
                        <CardTitle className="text-xl pb-3">Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-6">
                            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                {cart.map((item) => (
                                    <div key={item._id} className="flex justify-between items-start pb-4 border-b dark:border-gray-700">
                                        <div>
                                            <h4 className="font-medium">{item.name}</h4>
                                            {item.requiredPrescription && (
                                                <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full mt-1">
                                                    Requires prescription
                                                </span>
                                            )}
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {item.quantity} × ${item.price.toFixed(2)}
                                            </p>
                                        </div>
                                        <p className="font-medium">
                                            ${(item.quantity * item.price).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="space-y-2  pt-4 ">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg pt-2">
                                    <span>Total</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}