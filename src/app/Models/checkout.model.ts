export interface CheckoutData {
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    transactionId?: string;
    orderItems: OrderItem[];
  }
  
  export interface ShippingAddress {
    firstName: string;
    lastName: string;
    companyName?: string;
    country: string;
    address: string;
    city: string;
    zipCode: string;
    phone: string;
    email: string;
    additionalInfo?: string;
  }
  
  export interface OrderItem {
    productId: string;
    // productName: string;
    quantity: number;
    price: number;
    subtotal: number;
  }