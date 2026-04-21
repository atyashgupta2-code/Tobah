import Types "../types/products-orders-delivery";
import Lib "../lib/products-orders-delivery";
import Map "mo:core/Map";
import List "mo:core/List";

mixin (
  products : Map.Map<Types.ProductId, Types.Product>,
  orders : Map.Map<Types.OrderId, Types.Order>,
  sellers : Map.Map<Types.SellerId, Types.Seller>,
  notifications : Map.Map<Types.NotificationId, Types.Notification>,
  nextProductIdCounter : List.List<Nat>,
  nextSellerIdCounter : List.List<Nat>,
  nextNotificationIdCounter : List.List<Nat>,
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

  // ─── Admin Product Mutations ────────────────────────────────────────────────

  public shared ({ caller }) func createProduct(input : Types.ProductInput) : async { #ok : Types.Product; #err : Text } {
    let nextId = nextProductIdCounter.at(0);
    let result = Lib.createProduct(products, nextId, input);
    switch (result) {
      case (#ok(_)) { nextProductIdCounter.put(0, nextId + 1) };
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

  // ─── Orders ────────────────────────────────────────────────────────────────

  public shared func createOrder(
    items : [Types.CartItem],
    shippingAddress : Text,
    deliveryOption : Types.DeliveryOption,
    paymentMethod : Types.PaymentMethod,
    customerName : Text,
    customerPhone : Text,
  ) : async Types.Order {
    // Use orders map size + 1 as auto-incrementing order id
    let orderId = orders.size() + 1;
    let nextNotifId = nextNotificationIdCounter.at(0);
    let result = Lib.createOrder(
      orders,
      products,
      notifications,
      orderId,
      nextNotifId,
      items,
      shippingAddress,
      deliveryOption,
      paymentMethod,
      customerName,
      customerPhone,
    );
    nextNotificationIdCounter.put(0, result.nextNotificationId);
    result.order;
  };

  public query func getOrder(id : Types.OrderId) : async ?Types.Order {
    Lib.getOrder(orders, id);
  };

  public shared query ({ caller }) func listOrders() : async [(Types.OrderId, Types.Order)] {
    Lib.listOrders(orders);
  };

  public shared ({ caller }) func updateOrderStatus(id : Types.OrderId, newStatus : Types.OrderStatus) : async { #ok : Types.Order; #err : Text } {
    Lib.updateOrderStatus(orders, id, newStatus);
  };

  public shared func cancelOrder(id : Types.OrderId) : async Bool {
    Lib.cancelOrder(orders, id);
  };

  // ─── Sellers ───────────────────────────────────────────────────────────────

  public shared func registerSeller(input : Types.SellerInput) : async { #ok : Types.Seller; #err : Text } {
    let nextId = nextSellerIdCounter.at(0);
    let result = Lib.registerSeller(sellers, nextId, input);
    switch (result) {
      case (#ok(seller)) {
        // Only increment if this was a new seller (id matches nextId as Text)
        if (seller.id == nextId.toText()) {
          nextSellerIdCounter.put(0, nextId + 1);
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

  // ─── Notifications ─────────────────────────────────────────────────────────

  public shared func addNotification(message : Text, sellerId : ?Text, orderId : ?Text) : async Text {
    let nextId = nextNotificationIdCounter.at(0);
    let result = Lib.addNotification(notifications, nextId, message, sellerId, orderId);
    nextNotificationIdCounter.put(0, result.nextId);
    result.notification.id;
  };

  public query func getNotifications(sellerId : ?Text) : async [Types.Notification] {
    Lib.getNotifications(notifications, sellerId);
  };

  public shared func markNotificationRead(notificationId : Text) : async Bool {
    Lib.markNotificationRead(notifications, notificationId);
  };

  // ─── Fit & Try ─────────────────────────────────────────────────────────────

  public shared func submitFitAndTryRequest(req : Types.FitAndTryRequest) : async Text {
    Lib.recommendSize(req);
  };
};
