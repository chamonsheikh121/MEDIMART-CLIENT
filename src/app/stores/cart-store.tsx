import { create } from 'zustand'; 
import { persist, createJSONStorage } from 'zustand/middleware'; 

interface CartItem extends IMedicine { 
    quantity: number; 
} 

interface CartStore { 
    cart: CartItem[]; 
    mounted: boolean; 
    totalItems: number;
    totalPrice: number;
    version: number;
    setMounted: (value: boolean) => void; 
    addToCart: (medicine: IMedicine) => void; 
    removeFromCart: (medicineId: string) => void; 
    updateQuantity: (medicineId: string, quantity: number) => void; 
    clearCart: () => void; 
} 

export const useCartStore = create<CartStore>()( 
    persist( 
        (set, get) => ({ 
            cart: [], 
            mounted: false, 
            totalItems: 0,
            totalPrice: 0,
            version: 0, 

            setMounted: (value) => set({ mounted: value }), 

            addToCart: (medicine) => { 
                set((state) => {
                    const existingItem = state.cart.find(item => item._id === medicine._id); 
                    const newCart = existingItem 
                        ? state.cart.map(item => 
                            item._id === medicine._id 
                                ? { ...item, quantity: item.quantity + 1 } 
                                : item 
                        ) 
                        : [...state.cart, { ...medicine, quantity: 1 }];
                    

                    const totalItems = newCart.reduce((sum, item) => sum + item.quantity, 0);
                    const totalPrice = newCart.reduce(
                        (sum, item) => sum + (Number(item.price) * item.quantity), 
                        0
                    );

                    return { 
                        cart: newCart, 
                        totalItems,
                        totalPrice,
                        version: state.version + 1 
                    }; 
                }); 
            }, 

            removeFromCart: (medicineId) => { 
                set((state) => {
                    const newCart = state.cart.filter(item => item._id !== medicineId);

                    const totalItems = newCart.reduce((sum, item) => sum + item.quantity, 0);
                    const totalPrice = newCart.reduce(
                        (sum, item) => sum + (Number(item.price) * item.quantity), 
                        0
                    );

                    return { 
                        cart: newCart, 
                        totalItems,
                        totalPrice,
                        version: state.version + 1 
                    }; 
                }); 
            }, 

            updateQuantity: (medicineId, quantity) => { 
                if (quantity <= 0) { 
                    get().removeFromCart(medicineId); 
                    return; 
                } 
                
                set((state) => {
                    const newCart = state.cart.map(item => 
                        item._id === medicineId 
                            ? { ...item, quantity } 
                            : item 
                    );
                    

                    const totalItems = newCart.reduce((sum, item) => sum + item.quantity, 0);
                    const totalPrice = newCart.reduce(
                        (sum, item) => sum + (Number(item.price) * item.quantity), 
                        0
                    );

                    return { 
                        cart: newCart, 
                        totalItems,
                        totalPrice,
                        version: state.version + 1 
                    }; 
                }); 
            }, 

            clearCart: () => set({ 
                cart: [], 
                totalItems: 0,
                totalPrice: 0,
                version: get().version + 1 
            }),
        }), 
        { 
            name: 'medimart-cart', 
            storage: createJSONStorage(() => localStorage), 
            partialize: (state) => ({ 
                cart: state.cart,
                totalItems: state.totalItems,
                totalPrice: state.totalPrice
            }), 
            onRehydrateStorage: () => (state) => { 
                state?.setMounted(true); 
            } 
        } 
    ) 
);