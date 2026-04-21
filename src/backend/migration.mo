import Map "mo:core/Map";
import List "mo:core/List";
import Types "./types/products-orders-delivery";

module {
  // ─── Old Types (inlined from .old/src/backend/types/) ─────────────────────

  type ProductId = Text;
  type OrderId = Text;
  type SellerId = Text;
  type NotificationId = Text;
  type Timestamp = Int;

  type OldDeliveryOption = { #SameDay; #NextDay; #Standard };
  type OldPaymentMethod = { #CashOnDelivery; #Card };
  type OldOrderStatus = { #Pending; #Confirmed; #Processing; #Shipped; #Delivered };

  type OldCartItem = {
    productId : ProductId;
    quantity : Nat;
    selectedSize : Text;
    deliveryOption : OldDeliveryOption;
  };

  type OldOrder = {
    id : OrderId;
    items : [OldCartItem];
    total : Nat;
    shippingAddress : Text;
    deliveryOption : OldDeliveryOption;
    paymentMethod : OldPaymentMethod;
    status : OldOrderStatus;
    createdAt : Timestamp;
  };

  type OldProduct = {
    id : ProductId;
    name : Text;
    description : Text;
    price : Nat;
    imageUrl : Text;
    category : Text;
    sizes : [Text];
    hasSameDayDelivery : Bool;
    hasFitAndTry : Bool;
    stock : Nat;
    gender : Text;
    sellerId : Text;
    sellerName : Text;
  };

  type OldSeller = {
    id : SellerId;
    name : Text;
    email : Text;
    phone : Text;
    businessName : Text;
    isApproved : Bool;
    createdAt : Int;
  };

  // ─── Old Actor stable state ────────────────────────────────────────────────

  type OldActor = {
    products : Map.Map<ProductId, OldProduct>;
    orders : Map.Map<OrderId, OldOrder>;
    sellers : Map.Map<SellerId, OldSeller>;
    nextProductIdCounter : List.List<Nat>;
    nextSellerIdCounter : List.List<Nat>;
  };

  // ─── New Actor stable state ────────────────────────────────────────────────

  type NewActor = {
    products : Map.Map<Types.ProductId, Types.Product>;
    orders : Map.Map<Types.OrderId, Types.Order>;
    sellers : Map.Map<Types.SellerId, Types.Seller>;
    notifications : Map.Map<Types.NotificationId, Types.Notification>;
    nextProductIdCounter : List.List<Nat>;
    nextSellerIdCounter : List.List<Nat>;
    nextNotificationIdCounter : List.List<Nat>;
  };

  // ─── Migration function ────────────────────────────────────────────────────

  public func run(old : OldActor) : NewActor {
    let products = old.products.map<ProductId, OldProduct, Types.Product>(
      func(_id, p) {
        {
          p with
          orderCount = 0;
          fulfillmentBy = #AdminFulfilled : Types.FulfillmentBy;
        }
      }
    );

    let orders = old.orders.map<OrderId, OldOrder, Types.Order>(
      func(_id, o) {
        {
          o with
          status = (o.status : Types.OrderStatus);
          customerName = "";
          customerPhone = "";
        }
      }
    );

    let notifications = Map.empty<Types.NotificationId, Types.Notification>();
    let nextNotificationIdCounter = List.singleton<Nat>(1);

    {
      products;
      orders;
      sellers = old.sellers;
      notifications;
      nextProductIdCounter = old.nextProductIdCounter;
      nextSellerIdCounter = old.nextSellerIdCounter;
      nextNotificationIdCounter;
    };
  };
};
