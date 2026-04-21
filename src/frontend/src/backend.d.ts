import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SellerInput {
    name: string;
    businessName: string;
    email: string;
    phone: string;
}
export interface ProductInput {
    fulfillmentBy: FulfillmentBy;
    name: string;
    description: string;
    hasFitAndTry: boolean;
    sizes: Array<string>;
    sellerName: string;
    stock: bigint;
    imageUrl: string;
    hasSameDayDelivery: boolean;
    gender: string;
    category: string;
    sellerId: string;
    price: bigint;
}
export type Timestamp = bigint;
export interface FitAndTryRequest {
    productId: ProductId;
    measurements: Measurements;
    preferredSize: string;
}
export interface Seller {
    id: SellerId;
    isApproved: boolean;
    name: string;
    createdAt: bigint;
    businessName: string;
    email: string;
    phone: string;
}
export type SellerId = string;
export interface Measurements {
    weight: bigint;
    height: bigint;
    chest: bigint;
    waist: bigint;
}
export interface Order {
    id: OrderId;
    customerName: string;
    status: OrderStatus;
    total: bigint;
    paymentMethod: PaymentMethod;
    customerPhone: string;
    createdAt: Timestamp;
    deliveryOption: DeliveryOption;
    shippingAddress: string;
    items: Array<CartItem>;
}
export type NotificationId = string;
export interface Notification {
    id: NotificationId;
    createdAt: bigint;
    isRead: boolean;
    orderId?: string;
    message: string;
    sellerId?: string;
}
export type ProductId = string;
export interface CartItem {
    productId: ProductId;
    deliveryOption: DeliveryOption;
    quantity: bigint;
    selectedSize: string;
}
export interface Product {
    id: ProductId;
    fulfillmentBy: FulfillmentBy;
    name: string;
    description: string;
    hasFitAndTry: boolean;
    sizes: Array<string>;
    sellerName: string;
    orderCount: bigint;
    stock: bigint;
    imageUrl: string;
    hasSameDayDelivery: boolean;
    gender: string;
    category: string;
    sellerId: string;
    price: bigint;
}
export type OrderId = string;
export enum DeliveryOption {
    SameDay = "SameDay",
    NextDay = "NextDay",
    Standard = "Standard"
}
export enum FulfillmentBy {
    AdminFulfilled = "AdminFulfilled",
    SellerFulfilled = "SellerFulfilled"
}
export enum OrderStatus {
    Delivered = "Delivered",
    Confirmed = "Confirmed",
    Cancelled = "Cancelled",
    Processing = "Processing",
    Shipped = "Shipped",
    Pending = "Pending"
}
export enum PaymentMethod {
    Card = "Card",
    CashOnDelivery = "CashOnDelivery"
}
export interface backendInterface {
    addNotification(message: string, sellerId: string | null, orderId: string | null): Promise<string>;
    cancelOrder(id: OrderId): Promise<boolean>;
    createOrder(items: Array<CartItem>, shippingAddress: string, deliveryOption: DeliveryOption, paymentMethod: PaymentMethod, customerName: string, customerPhone: string): Promise<Order>;
    createProduct(input: ProductInput): Promise<{
        __kind__: "ok";
        ok: Product;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteProduct(id: ProductId): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getNotifications(sellerId: string | null): Promise<Array<Notification>>;
    getOrder(id: OrderId): Promise<Order | null>;
    getProduct(id: ProductId): Promise<Product | null>;
    getProducts(): Promise<Array<Product>>;
    getProductsBySeller(sellerId: string): Promise<Array<Product>>;
    getSeller(id: SellerId): Promise<Seller | null>;
    getSellerByEmailOrPhone(email: string, phone: string): Promise<Seller | null>;
    listOrders(): Promise<Array<[OrderId, Order]>>;
    listSellers(): Promise<Array<Seller>>;
    markNotificationRead(notificationId: string): Promise<boolean>;
    registerSeller(input: SellerInput): Promise<{
        __kind__: "ok";
        ok: Seller;
    } | {
        __kind__: "err";
        err: string;
    }>;
    removeSeller(sellerId: SellerId): Promise<boolean>;
    submitFitAndTryRequest(req: FitAndTryRequest): Promise<string>;
    updateOrderStatus(id: OrderId, newStatus: OrderStatus): Promise<{
        __kind__: "ok";
        ok: Order;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateProduct(id: ProductId, input: ProductInput): Promise<{
        __kind__: "ok";
        ok: Product;
    } | {
        __kind__: "err";
        err: string;
    }>;
}
