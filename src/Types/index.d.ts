/* eslint-disable @typescript-eslint/no-explicit-any */

interface LoginData {
    email: string;
    password: string;
}

interface RegisterData extends LoginData {
    name: string;
    phone: string;
    address: string;
    Image?: File;
}

interface UpdateData {
    [key: string]: any;
}

interface IUser {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: "admin" | "customer";
    profileImage: {
        url: string;
        publicId: string;
    };
    phone: string;
    address?: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    refreshToken: string;
    createdAt?: Date;
    updatedAt?: Date;

}


interface IOrder {
    _id: string;
    user: Types.ObjectId;
    items: {
        medicine: Types.ObjectId;
        quantity: number;
        price: number;
    }[];
    totalPrice: number;
    status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
    paymentStatus: "pending" | "paid" | "failed";
    paymentMethod: "COD" | "Credit Card" | "Debit Card" | "UPI" | "PayPal";
    deliveryAddress: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    prescription?: {
        url: string;
        publicId: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
}

interface IMedicine {
    _id: string;
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
    images:[
        {
            url: string;
            publicId: string;
        }
    ];
    createdAt?: Date;
    updatedAt?: Date;
}

interface SearchParams {
    search?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    requiredPrescription?: string;
    page?: string;
    limit?: string;
  };

interface OrderItem {
    medicine: string;
    quantity: number;
    price: number;
    itemTotal: number;
  }
  
  interface DeliveryAddress {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }
  
  interface OrderData {
    _id?: string;
    user: string;
    items: OrderItem[];
    deliveryAddress: DeliveryAddress;
    paymentMethod: string;
    prescription?: any;
    totalPrice: number;
  }

  interface IOrder {
    user: Types.ObjectId;
    items: {
        medicine: Types.ObjectId;
        quantity: number;
        price: number;
    }[];
    totalPrice: number;
    status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
    paymentStatus: "pending" | "paid" | "failed";
    paymentMethod: string;
    deliveryAddress: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    prescription?: {
        url: string;
        publicId: string;
    };

    transactionId?: string; 
    paymentDetails?: any;

    createdAt?: Date;
    updatedAt?: Date;
}

interface IStatistics {
    totalOrders: number;
    ordersByStatus: {
      _id: IOrder['status'];
      count: number;
      totalRevenue: number;
    }[];
    revenueStats: {
      totalRevenue: number;
      averageOrderValue: number;
      minOrderValue: number;
      maxOrderValue: number;
    };
    paymentStatusCounts: {
      _id: IOrder['paymentStatus'];
      count: number;
    }[];
    medicineStats: {
      totalMedicines: number;
      lowStock: number;
      outOfStock: number;
    };
    topSellingMedicines: {
      name: string;
      totalQuantity: number;
      totalRevenue: number;
      image?: string;
    }[];
    recentOrders: (Pick<IOrder, '_id' | 'totalPrice' | 'status' | 'paymentStatus' | 'createdAt'> & {
      user: {
        name: string;
        email: string;
      };
    })[];
  }
