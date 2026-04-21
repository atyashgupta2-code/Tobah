import CommonTypes "common";

module {
  public type Timestamp = CommonTypes.Timestamp;
  public type ProductId = CommonTypes.ProductId;
  public type OrderId = CommonTypes.OrderId;
  public type SellerId = CommonTypes.SellerId;
  public type NotificationId = Text;

  // ─── Seller Types ──────────────────────────────────────────────────────────

  public type Seller = {
    id : SellerId;
    name : Text;
    email : Text;
    phone : Text;
    businessName : Text;
    isApproved : Bool;
    createdAt : Int;
  };

  public type SellerInput = {
    name : Text;
    email : Text;
    phone : Text;
    businessName : Text;
  };

  // ─── Product Types ─────────────────────────────────────────────────────────

  public type FulfillmentBy = {
    #SellerFulfilled;
    #AdminFulfilled;
  };

  // Input type for product create / update (no id — auto-generated)
  public type ProductInput = {
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
    fulfillmentBy : FulfillmentBy;
  };

  public type Product = {
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
    orderCount : Nat;
    fulfillmentBy : FulfillmentBy;
  };

  // ─── Order / Delivery Types ────────────────────────────────────────────────

  public type DeliveryOption = {
    #SameDay;
    #NextDay;
    #Standard;
  };

  public type PaymentMethod = {
    #CashOnDelivery;
    #Card;
  };

  public type OrderStatus = {
    #Pending;
    #Confirmed;
    #Processing;
    #Shipped;
    #Delivered;
    #Cancelled;
  };

  public type CartItem = {
    productId : ProductId;
    quantity : Nat;
    selectedSize : Text;
    deliveryOption : DeliveryOption;
  };

  public type Order = {
    id : OrderId;
    items : [CartItem];
    total : Nat;
    shippingAddress : Text;
    deliveryOption : DeliveryOption;
    paymentMethod : PaymentMethod;
    status : OrderStatus;
    createdAt : Timestamp;
    customerName : Text;
    customerPhone : Text;
  };

  // ─── Notification Types ───────────────────────────────────────────────────

  public type Notification = {
    id : NotificationId;
    message : Text;
    sellerId : ?Text;
    orderId : ?Text;
    createdAt : Int;
    isRead : Bool;
  };

  // ─── Fit & Try Types ──────────────────────────────────────────────────────

  public type FitAndTryRequest = {
    productId : ProductId;
    measurements : Measurements;
    preferredSize : Text;
  };

  public type Measurements = {
    height : Nat;
    weight : Nat;
    chest : Nat;
    waist : Nat;
  };
};
