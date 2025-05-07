import { Product } from './product.interface';

export interface Order {
  payment_method :   string;
  card ?:            string;
  shipping_method  : string;
  products         : DetalleVenta[]
}

export interface DetalleVenta {
  product:      Product;
  quantity:     number;
  sub_total:    number;
}

export interface ProductResponse {
  product: string; // ID del producto
  quantity: number; // Cantidad del producto
  _id: string; // ID único del item del producto
}

export interface PaymentResponse {
  __v: number; // Versión del documento
  _id: string; // ID del documento
  date: string; // Fecha en formato ISO
  payment_method: string; // Método de pago
  products: ProductResponse[]; // Lista de productos
  shipping_cost: number; // Costo de envío
  shipping_method: string; // Método de envío
  status: string; // Estado del pedido
  subtotal: number; // Subtotal de la orden
  total: number; // Total de la orden
  user: string; // ID del usuario
}
