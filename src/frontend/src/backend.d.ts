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
    address: string;
    phone: string;
}
export interface SellerEarnings {
    productBreakdown: Array<ProductEarningBreakdown>;
    orderCount: bigint;
    totalEarnings: bigint;
}
export type Timestamp = bigint;
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
    isTrending: boolean;
}
export interface ProductEarningBreakdown {
    productId: string;
    productName: string;
    orderCount: bigint;
    totalRevenue: bigint;
}
export type ModelPhotoId = string;
export interface Seller {
    id: SellerId;
    isApproved: boolean;
    name: string;
    createdAt: bigint;
    businessName: string;
    email: string;
    address: string;
    phone: string;
}
export interface FitAndTryRequest {
    productId: ProductId;
    measurements: Measurements;
    preferredSize: string;
}
export type SellerId = string;
export interface Coupon {
    id: CouponId;
    code: string;
    createdAt: Timestamp;
    description: string;
    discountPercent: bigint;
    isActive: boolean;
}
export interface Order {
    id: OrderId;
    customerName: string;
    status: OrderStatus;
    couponCode?: string;
    total: bigint;
    paymentMethod: PaymentMethod;
    customerPhone: string;
    discountAmount?: bigint;
    createdAt: Timestamp;
    deliveryOption: DeliveryOption;
    shippingAddress: string;
    customerId: CustomerId;
    items: Array<CartItem>;
    fulfillmentChoice?: FulfillmentBy;
}
export interface Measurements {
    weight: bigint;
    height: bigint;
    chest: bigint;
    waist: bigint;
}
export interface Customer {
    id: CustomerId;
    name: string;
    createdAt: Timestamp;
    phone: string;
}
export type CustomerId = string;
export type NotificationId = string;
export interface Notification {
    id: NotificationId;
    createdAt: bigint;
    isRead: boolean;
    orderId?: string;
    message: string;
    sellerId?: string;
}
export interface ModelPhoto {
    id: ModelPhotoId;
    createdAt: Timestamp;
    imageUrl: string;
    caption?: string;
}
export interface CouponInput {
    code: string;
    description: string;
    discountPercent: bigint;
}
export type ProductId = string;
export type CouponId = string;
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
    createdAt: bigint;
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
    isTrending: boolean;
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
    Placed = "Placed",
    Rejected = "Rejected",
    Accepted = "Accepted",
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
    acceptOrder(orderId: OrderId, fulfillmentChoice: FulfillmentBy, sellerName: string): Promise<{
        __kind__: "ok";
        ok: Order;
    } | {
        __kind__: "err";
        err: string;
    }>;
    addModelPhoto(imageUrl: string, caption: string | null): Promise<{
        __kind__: "ok";
        ok: ModelPhoto;
    } | {
        __kind__: "err";
        err: string;
    }>;
    addNotification(message: string, sellerId: string | null, orderId: string | null): Promise<string>;
    cancelOrder(id: OrderId): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createCoupon(input: CouponInput): Promise<{
        __kind__: "ok";
        ok: Coupon;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createOrder(items: Array<CartItem>, shippingAddress: string, deliveryOption: DeliveryOption, paymentMethod: PaymentMethod, customerName: string, customerPhone: string, customerId: CustomerId, couponCode: string | null): Promise<Order>;
    createProduct(input: ProductInput): Promise<{
        __kind__: "ok";
        ok: Product;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteCoupon(id: CouponId): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteModelPhoto(id: ModelPhotoId): Promise<{
        __kind__: "ok";
        ok: null;
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
    getAllNotifications(): Promise<Array<Notification>>;
    getCoupon(code: string): Promise<Coupon | null>;
    getCustomer(phone: string): Promise<Customer | null>;
    getNewArrivals(): Promise<Array<Product>>;
    getNotifications(sellerId: string | null): Promise<Array<Notification>>;
    getOrder(id: OrderId): Promise<Order | null>;
    getProduct(id: ProductId): Promise<Product | null>;
    getProducts(): Promise<Array<Product>>;
    getProductsBySeller(sellerId: string): Promise<Array<Product>>;
    getSeller(id: SellerId): Promise<Seller | null>;
    getSellerByEmailOrPhone(email: string, phone: string): Promise<Seller | null>;
    getSellerEarnings(sellerId: string): Promise<SellerEarnings>;
    listCoupons(): Promise<Array<Coupon>>;
    listModelPhotos(): Promise<Array<ModelPhoto>>;
    listOrders(): Promise<Array<[OrderId, Order]>>;
    listOrdersByCustomer(phone: string): Promise<Array<Order>>;
    listOrdersBySeller(sellerId: string): Promise<Array<Order>>;
    listSellers(): Promise<Array<Seller>>;
    markNotificationRead(notificationId: string): Promise<boolean>;
    registerCustomer(name: string, phone: string): Promise<Customer>;
    registerSeller(input: SellerInput): Promise<{
        __kind__: "ok";
        ok: Seller;
    } | {
        __kind__: "err";
        err: string;
    }>;
    rejectOrder(orderId: OrderId, sellerName: string): Promise<{
        __kind__: "ok";
        ok: Order;
    } | {
        __kind__: "err";
        err: string;
    }>;
    removeSeller(sellerId: SellerId): Promise<boolean>;
    setProductTrending(productId: ProductId, trending: boolean): Promise<{
        __kind__: "ok";
        ok: Product;
    } | {
        __kind__: "err";
        err: string;
    }>;
    submitFitAndTryRequest(req: FitAndTryRequest): Promise<string>;
    toggleCoupon(id: CouponId): Promise<{
        __kind__: "ok";
        ok: Coupon;
    } | {
        __kind__: "err";
        err: string;
    }>;
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
