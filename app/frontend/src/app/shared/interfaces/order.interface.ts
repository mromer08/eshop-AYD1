export type Status = 'Processing' | 'Shipped' | 'Delivered';

interface OrderUser {
    _id:        string;
    name:       string;
    lastname:   string;
}

interface ProductInfo {
    _id:    String;
    name:   String;
    price:  number;
}

interface OrderProduct {
    _id:        string;
    product:    ProductInfo;
    quantity:   number;
}

export interface Order {
    _id:                string;
    user:               OrderUser;
    date:               Date;
    total:              number;
    subtotal:           number;
    payment_method:     'Cash' | 'Credit Card';
    shipping_method:    'Home Delivery' | 'Store Pickup';
    shipping_cost:      number;
    status:             Status;
    products:           OrderProduct[];
}