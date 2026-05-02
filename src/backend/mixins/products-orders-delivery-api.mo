import Types "../types/products-orders-delivery";
import Lib "../lib/products-orders-delivery";
import Map "mo:core/Map";

mixin (
  products : Map.Map<Types.ProductId, Types.Product>,
  orders : Map.Map<Types.OrderId, Types.Order>,
  sellers : Map.Map<Types.SellerId, Types.Seller>,
  notifications : Map.Map<Types.NotificationId, Types.Notification>,
  customers : Map.Map<Types.CustomerId, Types.Customer>,
  coupons : Map.Map<Types.CouponId, Types.Coupon>,
  modelPhotos : Map.Map<Types.ModelPhotoId, Types.ModelPhoto>,
  nextProductIdRef : [var Nat],
  nextSellerIdRef : [var Nat],
  nextNotificationIdRef : [var Nat],
  nextCouponIdRef : [var Nat],
  nextModelPhotoIdRef : [var Nat],
) {
  // ─── Products ──────────────────────────────────────────────────────────────

  public query func getProducts() : async [Types.Product] {
    Lib.listProducts(products);
  };

  public query func getProduct(id : Types.ProductId) : async ?Types.Product {
    Lib.getProduct(products, id);
  };

  public query func getProductsBySeller(sellerId : Text) : async [Types.Product] {
    Lib.getProductsBySeller(products, sellerId);
  };

  /// Returns the 8 most recently added products, sorted by createdAt descending.
  public query func getNewArrivals() : async [Types.Product] {
    Lib.getNewArrivals(products);
  };

  // ─── Admin Product Mutations ────────────────────────────────────────────────

  public shared ({ caller }) func createProduct(input : Types.ProductInput) : async { #ok : Types.Product; #err : Text } {
    let currentId = nextProductIdRef[0];
    let result = Lib.createProduct(products, currentId, input);
    switch (result) {
      case (#ok(_)) { nextProductIdRef[0] += 1 };
      case (#err(_)) {};
    };
    result;
  };

  public shared ({ caller }) func updateProduct(id : Types.ProductId, input : Types.ProductInput) : async { #ok : Types.Product; #err : Text } {
    Lib.updateProduct(products, id, input);
  };

  public shared ({ caller }) func deleteProduct(id : Types.ProductId) : async { #ok : (); #err : Text } {
    Lib.deleteProduct(products, id);
  };

  /// Admin-only: set or unset a product as trending.
  public shared ({ caller }) func setProductTrending(productId : Types.ProductId, trending : Bool) : async { #ok : Types.Product; #err : Text } {
    Lib.setProductTrending(products, productId, trending);
  };

  /// Admin-only: set or unset a product as a New Arrival.
  public shared ({ caller }) func setNewArrival(productId : Types.ProductId, isNewArrival : Bool) : async { #ok : Types.Product; #err : Text } {
    Lib.setNewArrival(products, productId, isNewArrival);
  };

  // ─── Orders ────────────────────────────────────────────────────────────────

  public shared func createOrder(
    items : [Types.CartItem],
    shippingAddress : Text,
    deliveryOption : Types.DeliveryOption,
    paymentMethod : Types.PaymentMethod,
    customerName : Text,
    customerPhone : Text,
    customerId : Types.CustomerId,
    couponCode : ?Text,
  ) : async Types.Order {
    let orderId = orders.size() + 1;
    let result = Lib.createOrder(
      orders,
      products,
      sellers,
      notifications,
      coupons,
      orderId,
      nextNotificationIdRef[0],
      items,
      shippingAddress,
      deliveryOption,
      paymentMethod,
      customerName,
      customerPhone,
      customerId,
      couponCode,
    );
    nextNotificationIdRef[0] := result.nextNotificationId;
    result.order;
  };

  public query func getOrder(id : Types.OrderId) : async ?Types.Order {
    Lib.getOrder(orders, id);
  };

  public shared query ({ caller }) func listOrders() : async [(Types.OrderId, Types.Order)] {
    Lib.listOrders(orders);
  };

  public query func listOrdersByCustomer(phone : Text) : async [Types.Order] {
    Lib.listOrdersByCustomer(orders, phone);
  };

  /// Returns all orders that contain at least one product belonging to the given seller.
  public query func listOrdersBySeller(sellerId : Text) : async [Types.Order] {
    Lib.listOrdersBySeller(orders, products, sellerId);
  };

  public shared ({ caller }) func updateOrderStatus(id : Types.OrderId, newStatus : Types.OrderStatus) : async { #ok : Types.Order; #err : Text } {
    Lib.updateOrderStatus(orders, id, newStatus);
  };

  /// Supplier accepts an order and selects delivery fulfillment (Seller or Admin).
  /// Fires an admin notification with the supplier's name and delivery choice.
  public shared func acceptOrder(
    orderId : Types.OrderId,
    fulfillmentChoice : Types.FulfillmentBy,
    sellerName : Text,
  ) : async { #ok : Types.Order; #err : Text } {
    let result = Lib.acceptOrder(orders, notifications, nextNotificationIdRef[0], orderId, fulfillmentChoice, sellerName);
    nextNotificationIdRef[0] := result.nextNotificationId;
    result.result;
  };

  /// Supplier rejects an order.
  /// Fires an admin notification only — customer is NOT notified of rejection.
  public shared func rejectOrder(
    orderId : Types.OrderId,
    sellerName : Text,
  ) : async { #ok : Types.Order; #err : Text } {
    let result = Lib.rejectOrder(orders, notifications, nextNotificationIdRef[0], orderId, sellerName);
    nextNotificationIdRef[0] := result.nextNotificationId;
    result.result;
  };

  /// Customer cancels an order. Allowed unless order is Shipped or Delivered.
  public shared func cancelOrder(id : Types.OrderId) : async { #ok : (); #err : Text } {
    Lib.cancelOrder(orders, id);
  };

  // ─── Customers ─────────────────────────────────────────────────────────────

  public shared func registerCustomer(name : Text, phone : Text) : async Types.Customer {
    Lib.registerCustomer(customers, name, phone);
  };

  public query func getCustomer(phone : Text) : async ?Types.Customer {
    Lib.getCustomer(customers, phone);
  };

  // ─── Sellers ───────────────────────────────────────────────────────────────

  public shared func registerSeller(input : Types.SellerInput) : async { #ok : Types.Seller; #err : Text } {
    let currentId = nextSellerIdRef[0];
    let result = Lib.registerSeller(sellers, currentId, input);
    switch (result) {
      case (#ok(seller)) {
        // Only increment if this was a new seller (id matches currentId as Text)
        if (seller.id == currentId.toText()) {
          nextSellerIdRef[0] += 1;
        };
      };
      case (#err(_)) {};
    };
    result;
  };

  public query func getSeller(id : Types.SellerId) : async ?Types.Seller {
    Lib.getSeller(sellers, id);
  };

  public query func getSellerByEmailOrPhone(email : Text, phone : Text) : async ?Types.Seller {
    Lib.getSellerByEmailOrPhone(sellers, email, phone);
  };

  public shared query ({ caller }) func listSellers() : async [Types.Seller] {
    Lib.listSellers(sellers);
  };

  public shared ({ caller }) func removeSeller(sellerId : Types.SellerId) : async Bool {
    Lib.removeSeller(sellers, products, sellerId);
  };

  // ─── Seller Earnings ───────────────────────────────────────────────────────

  /// Returns total revenue and per-product breakdown for a seller.
  /// Only counts orders with status #Placed or #Accepted.
  public query func getSellerEarnings(sellerId : Text) : async Types.SellerEarnings {
    Lib.getSellerEarnings(orders, products, sellerId);
  };

  // ─── Coupons (admin-controlled) ────────────────────────────────────────────

  /// Admin creates a new discount coupon.
  public shared ({ caller }) func createCoupon(input : Types.CouponInput) : async { #ok : Types.Coupon; #err : Text } {
    let currentId = nextCouponIdRef[0];
    let result = Lib.createCoupon(coupons, currentId, input);
    switch (result) {
      case (#ok(_)) { nextCouponIdRef[0] += 1 };
      case (#err(_)) {};
    };
    result;
  };

  /// Public: validate and fetch an active coupon by its code. Used at checkout.
  public query func getCoupon(code : Text) : async ?Types.Coupon {
    Lib.getCouponByCode(coupons, code);
  };

  /// Admin lists all coupons (active and inactive).
  public shared query ({ caller }) func listCoupons() : async [Types.Coupon] {
    Lib.listCoupons(coupons);
  };

  /// Admin deletes a coupon by id.
  public shared ({ caller }) func deleteCoupon(id : Types.CouponId) : async { #ok : (); #err : Text } {
    Lib.deleteCoupon(coupons, id);
  };

  /// Admin toggles a coupon active/inactive.
  public shared ({ caller }) func toggleCoupon(id : Types.CouponId) : async { #ok : Types.Coupon; #err : Text } {
    Lib.toggleCoupon(coupons, id);
  };

  /// Returns order counts for a coupon code.
  /// totalOrders = all orders that used the code.
  /// successfulOrders = orders with non-cancelled, non-rejected, non-pending status.
  /// Returns null only if code is empty.
  public query func getCouponOrderStats(code : Text) : async ?{ couponCode : Text; totalOrders : Nat; successfulOrders : Nat } {
    Lib.getCouponOrderStats(orders, code);
  };

  // ─── Model Showcase ────────────────────────────────────────────────────────

  /// Admin adds a model showcase photo. caption is optional.
  public shared ({ caller }) func addModelPhoto(imageUrl : Text, caption : ?Text) : async { #ok : Types.ModelPhoto; #err : Text } {
    let currentId = nextModelPhotoIdRef[0];
    let result = Lib.addModelPhoto(modelPhotos, currentId, imageUrl, caption);
    switch (result) {
      case (#ok(_)) { nextModelPhotoIdRef[0] += 1 };
      case (#err(_)) {};
    };
    result;
  };

  /// Public: list all model showcase photos (newest first).
  public query func listModelPhotos() : async [Types.ModelPhoto] {
    Lib.listModelPhotos(modelPhotos);
  };

  /// Admin deletes a model showcase photo.
  public shared ({ caller }) func deleteModelPhoto(id : Types.ModelPhotoId) : async { #ok : (); #err : Text } {
    Lib.deleteModelPhoto(modelPhotos, id);
  };

  // ─── Notifications ─────────────────────────────────────────────────────────

  public shared func addNotification(message : Text, sellerId : ?Text, orderId : ?Text) : async Text {
    let result = Lib.addNotification(notifications, nextNotificationIdRef[0], message, sellerId, orderId);
    nextNotificationIdRef[0] := result.nextId;
    result.notification.id;
  };

  /// Get notifications filtered by sellerId:
  /// - null = admin notifications only (admin-targeted, sellerId = null)
  /// - ?id = supplier-specific notifications for that supplier
  public query func getNotifications(sellerId : ?Text) : async [Types.Notification] {
    Lib.getNotifications(notifications, sellerId);
  };

  /// Get ALL notifications regardless of target — for admin overview.
  public shared query ({ caller }) func getAllNotifications() : async [Types.Notification] {
    Lib.getAllNotifications(notifications);
  };

  public shared func markNotificationRead(notificationId : Text) : async Bool {
    Lib.markNotificationRead(notifications, notificationId);
  };

  // ─── Fit & Try ─────────────────────────────────────────────────────────────

  public shared func submitFitAndTryRequest(req : Types.FitAndTryRequest) : async Text {
    Lib.recommendSize(req);
  };
};
