export type {
  Product,
  CartItem,
  Order,
  FitAndTryRequest,
  Measurements,
  Seller,
  SellerInput,
  ProductInput,
  Notification,
  NotificationId,
  OrderId,
  SellerId,
  ProductId,
} from "../backend.d";

export {
  DeliveryOption,
  OrderStatus,
  PaymentMethod,
  FulfillmentBy,
} from "../backend.d";

// Frontend-only cart item (uses number instead of bigint for ease of manipulation)
export interface CartItemFE {
  productId: string;
  quantity: number;
  selectedSize: string;
  deliveryOption: import("../backend.d").DeliveryOption;
  product?: import("../backend.d").Product;
}

export interface CartState {
  items: CartItemFE[];
  addItem: (
    productId: string,
    size: string,
    deliveryOption?: import("../backend.d").DeliveryOption,
  ) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
}
