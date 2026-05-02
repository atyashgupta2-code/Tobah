import CommonTypes "common";

module {
  public type Timestamp = CommonTypes.Timestamp;
  public type ProductId = CommonTypes.ProductId;
  public type OrderId = CommonTypes.OrderId;
  public type SellerId = CommonTypes.SellerId;
  public type CustomerId = CommonTypes.CustomerId;
  public type NotificationId = Text;

  // ─── Customer Types ────────────────────────────────────────────────────────

  public type Customer = {
    id : CustomerId; // phone number
    name : Text;
    phone : Text;
    createdAt : Timestamp;
  };

  // ─── Seller Types ──────────────────────────────────────────────────────────

  public type Seller = {
    id : SellerId;
    name : Text;
    email : Text;
    phone : Text;
    businessName : Text;
    address : Text; // mandatory street address
    isApproved : Bool;
    createdAt : Int;
  };

  public type SellerInput = {
    name : Text;
    email : Text;
    phone : Text;
    businessName : Text;
    address : Text; // mandatory street address
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
    price : Nat; // stored as paise (×100): seller enters ₹100 → frontend sends 10000
    imageUrl : Text;
    category : Text;
    sizes : [Text];
    hasSameDayDelivery : Bool;
    hasFitAndTry : Bool;
    stock : Nat;
    gender : Text; // Men | Women | Unisex | Handicrafts | Other | Shoes
    subcategory : ?Text; // optional: Shoes → Men/Women; Other → Bedsheets/Artificial Jewellery/Other
    sellerId : Text;
    sellerName : Text;
    fulfillmentBy : FulfillmentBy;
    isTrending : Bool; // admin-controlled trending flag
  };

  public type Product = {
    id : ProductId;
    name : Text;
    description : Text;
    price : Nat; // stored as paise (×100): 10000 = ₹100
    imageUrl : Text;
    category : Text;
    sizes : [Text];
    hasSameDayDelivery : Bool;
    hasFitAndTry : Bool;
    stock : Nat;
    gender : Text; // Men | Women | Unisex | Handicrafts | Other | Shoes
    subcategory : ?Text; // optional: Shoes → Men/Women; Other → Bedsheets/Artificial Jewellery/Other
    sellerId : Text;
    sellerName : Text;
    orderCount : Nat;
    fulfillmentBy : FulfillmentBy;
    isTrending : Bool; // admin-controlled trending flag
    isNewArrival : Bool; // admin-controlled new arrival flag
    createdAt : Int; // nanosecond timestamp when product was added
  };

  // ─── Coupon Types ──────────────────────────────────────────────────────────

  public type CouponId = Text;

  public type Coupon = {
    id : CouponId;
    code : Text;
    discountPercent : Nat; // 1–100
    isActive : Bool;
    description : Text;
    createdAt : Timestamp;
  };

  public type CouponInput = {
    code : Text;
    discountPercent : Nat;
    description : Text;
  };

  // ─── Model Showcase Types ──────────────────────────────────────────────────

  public type ModelPhotoId = Text;

  public type ModelPhoto = {
    id : ModelPhotoId;
    imageUrl : Text;
    caption : ?Text;
    createdAt : Timestamp;
  };

  // ─── Earnings Types ────────────────────────────────────────────────────────

  public type ProductEarningBreakdown = {
    productId : Text;
    productName : Text;
    totalRevenue : Nat;
    orderCount : Nat;
  };

  public type SellerEarnings = {
    totalEarnings : Nat;
    orderCount : Nat;
    productBreakdown : [ProductEarningBreakdown];
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
    #Placed; // default status when customer places an order
    #Pending;
    #Confirmed;
    #Processing;
    #Shipped;
    #Delivered;
    #Cancelled;
    #Accepted;
    #Rejected;
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
    customerId : CustomerId; // phone number — links order to a customer account
    fulfillmentChoice : ?FulfillmentBy; // set by supplier when they accept the order
    couponCode : ?Text; // coupon applied at checkout
    discountAmount : ?Nat; // discount amount in paise
  };

  // ─── Notification Types ───────────────────────────────────────────────────

  public type Notification = {
    id : NotificationId;
    message : Text;
    sellerId : ?Text; // null = admin notification
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
