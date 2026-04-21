import Types "../types/products-orders-delivery";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Iter "mo:core/Iter";

module {
  // ─── Seller Helpers ────────────────────────────────────────────────────────

  /// Registers a seller, deduplicating by email OR phone.
  /// Returns existing seller if either matches; creates new entry otherwise.
  public func registerSeller(
    sellers : Map.Map<Types.SellerId, Types.Seller>,
    nextSellerId : Nat,
    input : Types.SellerInput,
  ) : { #ok : Types.Seller; #err : Text } {
    let existing = getSellerByEmailOrPhone(sellers, input.email, input.phone);
    switch (existing) {
      case (?s) { #ok(s) };
      case null {
        let id = nextSellerId.toText();
        let seller : Types.Seller = {
          id = id;
          name = input.name;
          email = input.email;
          phone = input.phone;
          businessName = input.businessName;
          isApproved = true;
          createdAt = Time.now();
        };
        sellers.add(id, seller);
        #ok(seller);
      };
    };
  };

  public func getSeller(
    sellers : Map.Map<Types.SellerId, Types.Seller>,
    id : Types.SellerId,
  ) : ?Types.Seller {
    sellers.get(id);
  };

  public func getSellerByEmailOrPhone(
    sellers : Map.Map<Types.SellerId, Types.Seller>,
    email : Text,
    phone : Text,
  ) : ?Types.Seller {
    switch (sellers.entries().find(func(pair : (Types.SellerId, Types.Seller)) : Bool { pair.1.email == email or pair.1.phone == phone })) {
      case (?(_, seller)) { ?seller };
      case null { null };
    };
  };

  public func listSellers(sellers : Map.Map<Types.SellerId, Types.Seller>) : [Types.Seller] {
    sellers.values().toArray();
  };

  /// Removes seller account and all their active products.
  /// Does NOT delete past orders referencing this seller.
  public func removeSeller(
    sellers : Map.Map<Types.SellerId, Types.Seller>,
    products : Map.Map<Types.ProductId, Types.Product>,
    id : Types.SellerId,
  ) : Bool {
    switch (sellers.get(id)) {
      case null { false };
      case (?_) {
        sellers.remove(id);
        let toRemove = products.entries().filter(func(pair : (Types.ProductId, Types.Product)) : Bool { pair.1.sellerId == id }).toArray(
          
        );
        for ((pid, _) in toRemove.values()) {
          products.remove(pid);
        };
        true;
      };
    };
  };

  public func getProductsBySeller(
    products : Map.Map<Types.ProductId, Types.Product>,
    sellerId : Text,
  ) : [Types.Product] {
    products.values().filter(func(p : Types.Product) : Bool { p.sellerId == sellerId }).toArray();
  };

  // ─── Product Helpers ───────────────────────────────────────────────────────

  public func seedProducts(products : Map.Map<Types.ProductId, Types.Product>) {
    if (not products.isEmpty()) { return };

    let seed : [(Types.ProductId, Types.Product)] = [
      (
        "1",
        {
          id = "1";
          name = "Street Style Hoodie";
          description = "Premium oversized hoodie with bold graphic print. Perfect for the streets.";
          price = 899;
          imageUrl = "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800";
          category = "Hoodies";
          sizes = ["S", "M", "L", "XL"];
          hasSameDayDelivery = true;
          hasFitAndTry = true;
          stock = 50;
          gender = "Unisex";
          sellerId = "admin";
          sellerName = "TBah";
          orderCount = 0;
          fulfillmentBy = #AdminFulfilled;
        },
      ),
      (
        "2",
        {
          id = "2";
          name = "Cargo Joggers";
          description = "Multi-pocket cargo joggers with an elastic waistband. Trendy and functional.";
          price = 1299;
          imageUrl = "https://images.unsplash.com/photo-1594938298603-c8148c4b4546?w=800";
          category = "Bottoms";
          sizes = ["S", "M", "L", "XL", "XXL"];
          hasSameDayDelivery = true;
          hasFitAndTry = true;
          stock = 30;
          gender = "Men";
          sellerId = "admin";
          sellerName = "TBah";
          orderCount = 0;
          fulfillmentBy = #AdminFulfilled;
        },
      ),
      (
        "3",
        {
          id = "3";
          name = "Crop Top Co-ord Set";
          description = "Matching crop top and skirt set. Vibrant colours and bold design.";
          price = 1499;
          imageUrl = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800";
          category = "Co-ords";
          sizes = ["XS", "S", "M", "L"];
          hasSameDayDelivery = true;
          hasFitAndTry = true;
          stock = 25;
          gender = "Women";
          sellerId = "admin";
          sellerName = "TBah";
          orderCount = 0;
          fulfillmentBy = #AdminFulfilled;
        },
      ),
      (
        "4",
        {
          id = "4";
          name = "Graphic Tee - Neon";
          description = "Bright neon graphic tee that stands out in a crowd.";
          price = 499;
          imageUrl = "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800";
          category = "T-Shirts";
          sizes = ["XS", "S", "M", "L", "XL"];
          hasSameDayDelivery = true;
          hasFitAndTry = false;
          stock = 100;
          gender = "Unisex";
          sellerId = "admin";
          sellerName = "TBah";
          orderCount = 0;
          fulfillmentBy = #AdminFulfilled;
        },
      ),
      (
        "5",
        {
          id = "5";
          name = "Wide Leg Trousers";
          description = "Chic wide leg trousers suitable for casual and semi-formal occasions.";
          price = 1799;
          imageUrl = "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800";
          category = "Bottoms";
          sizes = ["XS", "S", "M", "L", "XL"];
          hasSameDayDelivery = false;
          hasFitAndTry = true;
          stock = 20;
          gender = "Women";
          sellerId = "admin";
          sellerName = "TBah";
          orderCount = 0;
          fulfillmentBy = #AdminFulfilled;
        },
      ),
      (
        "6",
        {
          id = "6";
          name = "Denim Jacket - Washed";
          description = "Classic washed denim jacket with a modern slim fit.";
          price = 2199;
          imageUrl = "https://images.unsplash.com/photo-1544441893-675973e31985?w=800";
          category = "Jackets";
          sizes = ["S", "M", "L", "XL"];
          hasSameDayDelivery = true;
          hasFitAndTry = true;
          stock = 15;
          gender = "Unisex";
          sellerId = "admin";
          sellerName = "TBah";
          orderCount = 0;
          fulfillmentBy = #AdminFulfilled;
        },
      ),
      (
        "7",
        {
          id = "7";
          name = "Ribbed Crop Sweater";
          description = "Soft ribbed knit crop sweater in pastel shades.";
          price = 999;
          imageUrl = "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800";
          category = "Tops";
          sizes = ["XS", "S", "M", "L"];
          hasSameDayDelivery = false;
          hasFitAndTry = true;
          stock = 40;
          gender = "Women";
          sellerId = "admin";
          sellerName = "TBah";
          orderCount = 0;
          fulfillmentBy = #AdminFulfilled;
        },
      ),
      (
        "8",
        {
          id = "8";
          name = "Oversized Printed Shirt";
          description = "Bold print oversized shirt for a laid-back summer vibe.";
          price = 799;
          imageUrl = "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=800";
          category = "Shirts";
          sizes = ["S", "M", "L", "XL", "XXL"];
          hasSameDayDelivery = true;
          hasFitAndTry = false;
          stock = 60;
          gender = "Men";
          sellerId = "admin";
          sellerName = "TBah";
          orderCount = 0;
          fulfillmentBy = #AdminFulfilled;
        },
      ),
    ];

    for ((id, product) in seed.values()) {
      products.add(id, product);
    };
  };

  public func listProducts(products : Map.Map<Types.ProductId, Types.Product>) : [Types.Product] {
    products.values().toArray();
  };

  public func getProduct(products : Map.Map<Types.ProductId, Types.Product>, id : Types.ProductId) : ?Types.Product {
    products.get(id);
  };

  // ─── Admin Product Write Helpers ───────────────────────────────────────────

  public func createProduct(
    products : Map.Map<Types.ProductId, Types.Product>,
    nextProductId : Nat,
    input : Types.ProductInput,
  ) : { #ok : Types.Product; #err : Text } {
    if (input.name == "") { return #err("Product name is required") };
    if (input.price == 0) { return #err("Price must be greater than 0") };
    let id = nextProductId.toText();
    let product : Types.Product = {
      id = id;
      name = input.name;
      description = input.description;
      price = input.price;
      imageUrl = input.imageUrl;
      category = input.category;
      sizes = input.sizes;
      hasSameDayDelivery = input.hasSameDayDelivery;
      hasFitAndTry = input.hasFitAndTry;
      stock = input.stock;
      gender = input.gender;
      sellerId = input.sellerId;
      sellerName = input.sellerName;
      orderCount = 0;
      fulfillmentBy = input.fulfillmentBy;
    };
    products.add(id, product);
    #ok(product);
  };

  public func updateProduct(
    products : Map.Map<Types.ProductId, Types.Product>,
    id : Types.ProductId,
    input : Types.ProductInput,
  ) : { #ok : Types.Product; #err : Text } {
    switch (products.get(id)) {
      case null { #err("Product not found") };
      case (?existing) {
        let updated : Types.Product = {
          existing with
          name = input.name;
          description = input.description;
          price = input.price;
          imageUrl = input.imageUrl;
          category = input.category;
          sizes = input.sizes;
          hasSameDayDelivery = input.hasSameDayDelivery;
          hasFitAndTry = input.hasFitAndTry;
          stock = input.stock;
          gender = input.gender;
          sellerId = input.sellerId;
          sellerName = input.sellerName;
          fulfillmentBy = input.fulfillmentBy;
        };
        products.add(id, updated);
        #ok(updated);
      };
    };
  };

  public func deleteProduct(
    products : Map.Map<Types.ProductId, Types.Product>,
    id : Types.ProductId,
  ) : { #ok : (); #err : Text } {
    switch (products.get(id)) {
      case null { #err("Product not found") };
      case (?_) {
        products.remove(id);
        #ok(());
      };
    };
  };

  // ─── Order Helpers ─────────────────────────────────────────────────────────

  /// Creates an order, increments orderCount on each product, and fires notifications.
  public func createOrder(
    orders : Map.Map<Types.OrderId, Types.Order>,
    products : Map.Map<Types.ProductId, Types.Product>,
    notifications : Map.Map<Types.NotificationId, Types.Notification>,
    nextOrderId : Nat,
    nextNotificationId : Nat,
    items : [Types.CartItem],
    shippingAddress : Text,
    deliveryOption : Types.DeliveryOption,
    paymentMethod : Types.PaymentMethod,
    customerName : Text,
    customerPhone : Text,
  ) : { order : Types.Order; nextNotificationId : Nat } {
    var total : Nat = 0;
    var sellerIdFromProduct : ?Text = null;
    for (item in items.values()) {
      switch (products.get(item.productId)) {
        case (?product) {
          let newCount = product.orderCount + item.quantity;
          products.add(item.productId, { product with orderCount = newCount });
          total += product.price * item.quantity;
          if (sellerIdFromProduct == null) {
            sellerIdFromProduct := ?product.sellerId;
          };
        };
        case null {};
      };
    };

    let orderId = nextOrderId.toText();
    let order : Types.Order = {
      id = orderId;
      items = items;
      total = total;
      shippingAddress = shippingAddress;
      deliveryOption = deliveryOption;
      paymentMethod = paymentMethod;
      status = #Pending;
      createdAt = Time.now();
      customerName = customerName;
      customerPhone = customerPhone;
    };
    orders.add(orderId, order);

    let adminMsg = "New order " # orderId # " placed — " # items.size().toText() # " items, ₹" # total.toText() # " — customer: " # customerName;
    let notif1 = addNotification(notifications, nextNotificationId, adminMsg, null, ?orderId);

    let sellerMsg = "Your product was ordered — Order " # orderId # ", ₹" # total.toText();
    let notif2 = addNotification(notifications, notif1.nextId, sellerMsg, sellerIdFromProduct, ?orderId);

    { order = order; nextNotificationId = notif2.nextId };
  };

  public func getOrder(orders : Map.Map<Types.OrderId, Types.Order>, id : Types.OrderId) : ?Types.Order {
    orders.get(id);
  };

  public func listOrders(orders : Map.Map<Types.OrderId, Types.Order>) : [(Types.OrderId, Types.Order)] {
    orders.entries().toArray();
  };

  public func updateOrderStatus(
    orders : Map.Map<Types.OrderId, Types.Order>,
    id : Types.OrderId,
    newStatus : Types.OrderStatus,
  ) : { #ok : Types.Order; #err : Text } {
    switch (orders.get(id)) {
      case null { #err("Order not found") };
      case (?order) {
        let updated = { order with status = newStatus };
        orders.add(id, updated);
        #ok(updated);
      };
    };
  };

  public func cancelOrder(
    orders : Map.Map<Types.OrderId, Types.Order>,
    id : Types.OrderId,
  ) : Bool {
    switch (orders.get(id)) {
      case null { false };
      case (?order) {
        orders.add(id, { order with status = #Cancelled });
        true;
      };
    };
  };

  // ─── Notification Helpers ──────────────────────────────────────────────────

  public func addNotification(
    notifications : Map.Map<Types.NotificationId, Types.Notification>,
    nextNotificationId : Nat,
    message : Text,
    sellerId : ?Text,
    orderId : ?Text,
  ) : { notification : Types.Notification; nextId : Nat } {
    let id = nextNotificationId.toText();
    let notification : Types.Notification = {
      id = id;
      message = message;
      sellerId = sellerId;
      orderId = orderId;
      createdAt = Time.now();
      isRead = false;
    };
    notifications.add(id, notification);
    { notification = notification; nextId = nextNotificationId + 1 };
  };

  public func getNotifications(
    notifications : Map.Map<Types.NotificationId, Types.Notification>,
    sellerId : ?Text,
  ) : [Types.Notification] {
    switch (sellerId) {
      case null {
        notifications.values().toArray();
      };
      case (?sid) {
        notifications.values().filter(func(n : Types.Notification) : Bool {
            switch (n.sellerId) {
              case null { true };
              case (?nSid) { nSid == sid };
            }
          }).toArray();
      };
    };
  };

  public func markNotificationRead(
    notifications : Map.Map<Types.NotificationId, Types.Notification>,
    notificationId : Types.NotificationId,
  ) : Bool {
    switch (notifications.get(notificationId)) {
      case null { false };
      case (?n) {
        notifications.add(notificationId, { n with isRead = true });
        true;
      };
    };
  };

  // ─── Fit & Try Helpers ─────────────────────────────────────────────────────

  public func recommendSize(req : Types.FitAndTryRequest) : Text {
    let chest = req.measurements.chest;
    if (chest < 84) { "XS" }
    else if (chest < 92) { "S" }
    else if (chest < 100) { "M" }
    else if (chest < 108) { "L" }
    else { "XL" };
  };
};
