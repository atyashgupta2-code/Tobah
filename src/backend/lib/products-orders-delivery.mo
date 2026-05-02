import Types "../types/products-orders-delivery";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Iter "mo:core/Iter";

module {
  // ─── Customer Helpers ──────────────────────────────────────────────────────

  /// Registers a customer by phone number. Returns existing customer if phone already registered.
  public func registerCustomer(
    customers : Map.Map<Types.CustomerId, Types.Customer>,
    name : Text,
    phone : Text,
  ) : Types.Customer {
    switch (customers.get(phone)) {
      case (?existing) { existing };
      case null {
        let customer : Types.Customer = {
          id = phone;
          name = name;
          phone = phone;
          createdAt = Time.now();
        };
        customers.add(phone, customer);
        customer;
      };
    };
  };

  public func getCustomer(
    customers : Map.Map<Types.CustomerId, Types.Customer>,
    phone : Text,
  ) : ?Types.Customer {
    customers.get(phone);
  };

  public func listOrdersByCustomer(
    orders : Map.Map<Types.OrderId, Types.Order>,
    phone : Text,
  ) : [Types.Order] {
    orders.values().filter(func(o : Types.Order) : Bool { o.customerId == phone }).toArray();
  };

  /// Returns all orders that contain at least one product from the given seller, sorted by createdAt descending.
  public func listOrdersBySeller(
    orders : Map.Map<Types.OrderId, Types.Order>,
    products : Map.Map<Types.ProductId, Types.Product>,
    sellerId : Text,
  ) : [Types.Order] {
    orders.values().filter(func(o : Types.Order) : Bool {
      o.items.find(func(item : Types.CartItem) : Bool {
        switch (products.get(item.productId)) {
          case (?p) { p.sellerId == sellerId };
          case null { false };
        };
      }) != null
    }).toArray().sort(func(a : Types.Order, b : Types.Order) : { #less; #equal; #greater } {
      if (a.createdAt > b.createdAt) { #less }
      else if (a.createdAt < b.createdAt) { #greater }
      else { #equal }
    });
  };

  /// Registers a seller, deduplicating by email OR phone.
  /// Returns existing seller if either matches; creates new entry otherwise.
  /// Address is mandatory.
  public func registerSeller(
    sellers : Map.Map<Types.SellerId, Types.Seller>,
    nextSellerId : Nat,
    input : Types.SellerInput,
  ) : { #ok : Types.Seller; #err : Text } {
    if (input.address == "") { return #err("Supplier address is required") };
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
          address = input.address;
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
        let toRemove = products.entries().filter(func(pair : (Types.ProductId, Types.Product)) : Bool { pair.1.sellerId == id }).toArray();
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

    // Use a fixed past timestamp (Jan 1 2024 in nanoseconds) as base for seeds
    let baseTs : Int = 1704067200000000000;

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
          subcategory = null;
          sellerId = "admin";
          sellerName = "TBah";
          orderCount = 0;
          fulfillmentBy = #AdminFulfilled;
          isTrending = false;
          isNewArrival = false;
          createdAt = baseTs;
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
          subcategory = null;
          sellerId = "admin";
          sellerName = "TBah";
          orderCount = 0;
          fulfillmentBy = #AdminFulfilled;
          isTrending = false;
          isNewArrival = false;
          createdAt = baseTs;
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
          subcategory = null;
          sellerId = "admin";
          sellerName = "TBah";
          orderCount = 0;
          fulfillmentBy = #AdminFulfilled;
          isTrending = false;
          isNewArrival = false;
          createdAt = baseTs;
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
          subcategory = null;
          sellerId = "admin";
          sellerName = "TBah";
          orderCount = 0;
          fulfillmentBy = #AdminFulfilled;
          isTrending = false;
          isNewArrival = false;
          createdAt = baseTs;
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
          subcategory = null;
          sellerId = "admin";
          sellerName = "TBah";
          orderCount = 0;
          fulfillmentBy = #AdminFulfilled;
          isTrending = false;
          isNewArrival = false;
          createdAt = baseTs;
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
          subcategory = null;
          sellerId = "admin";
          sellerName = "TBah";
          orderCount = 0;
          fulfillmentBy = #AdminFulfilled;
          isTrending = false;
          isNewArrival = false;
          createdAt = baseTs;
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
          subcategory = null;
          sellerId = "admin";
          sellerName = "TBah";
          orderCount = 0;
          fulfillmentBy = #AdminFulfilled;
          isTrending = false;
          isNewArrival = false;
          createdAt = baseTs;
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
          subcategory = null;
          sellerId = "admin";
          sellerName = "TBah";
          orderCount = 0;
          fulfillmentBy = #AdminFulfilled;
          isTrending = false;
          isNewArrival = false;
          createdAt = baseTs;
        },
      ),
      (
        "9",
        {
          id = "9";
          name = "Handwoven Kantha Jacket";
          description = "Traditional kantha-work jacket with colourful hand-stitched embroidery.";
          price = 2499;
          imageUrl = "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800";
          category = "Handicrafts";
          sizes = ["S", "M", "L", "XL"];
          hasSameDayDelivery = false;
          hasFitAndTry = false;
          stock = 10;
          gender = "Handicrafts";
          subcategory = null;
          sellerId = "admin";
          sellerName = "TBah";
          orderCount = 0;
          fulfillmentBy = #AdminFulfilled;
          isTrending = false;
          isNewArrival = false;
          createdAt = baseTs;
        },
      ),
      (
        "10",
        {
          id = "10";
          name = "Block Print Tote Bag";
          description = "Hand block-printed canvas tote bag with natural dyes. One-of-a-kind.";
          price = 699;
          imageUrl = "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800";
          category = "Accessories";
          sizes = ["One Size"];
          hasSameDayDelivery = true;
          hasFitAndTry = false;
          stock = 35;
          gender = "Other";
          subcategory = null;
          sellerId = "admin";
          sellerName = "TBah";
          orderCount = 0;
          fulfillmentBy = #AdminFulfilled;
          isTrending = false;
          isNewArrival = false;
          createdAt = baseTs;
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
      subcategory = input.subcategory;
      sellerId = input.sellerId;
      sellerName = input.sellerName;
      orderCount = 0;
      fulfillmentBy = input.fulfillmentBy;
      isTrending = input.isTrending;
      isNewArrival = false; // new products are NOT auto-marked as new arrival
      createdAt = Time.now();
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
          subcategory = input.subcategory;
          sellerId = input.sellerId;
          sellerName = input.sellerName;
          fulfillmentBy = input.fulfillmentBy;
          isTrending = input.isTrending;
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

  /// Admin toggles the isTrending flag on a product.
  public func setProductTrending(
    products : Map.Map<Types.ProductId, Types.Product>,
    id : Types.ProductId,
    trending : Bool,
  ) : { #ok : Types.Product; #err : Text } {
    switch (products.get(id)) {
      case null { #err("Product not found") };
      case (?existing) {
        let updated : Types.Product = { existing with isTrending = trending };
        products.add(id, updated);
        #ok(updated);
      };
    };
  };

  /// Returns all products where isNewArrival == true (admin-controlled).
  public func getNewArrivals(products : Map.Map<Types.ProductId, Types.Product>) : [Types.Product] {
    products.values().filter(func(p : Types.Product) : Bool { p.isNewArrival }).toArray();
  };

  /// Admin sets or unsets a product as a New Arrival.
  public func setNewArrival(
    products : Map.Map<Types.ProductId, Types.Product>,
    id : Types.ProductId,
    isNewArrival : Bool,
  ) : { #ok : Types.Product; #err : Text } {
    switch (products.get(id)) {
      case null { #err("Product not found") };
      case (?existing) {
        let updated : Types.Product = { existing with isNewArrival = isNewArrival };
        products.add(id, updated);
        #ok(updated);
      };
    };
  };

  // ─── Coupon Helpers ────────────────────────────────────────────────────────

  /// Admin creates a new coupon. Rejects duplicate codes.
  public func createCoupon(
    coupons : Map.Map<Types.CouponId, Types.Coupon>,
    nextCouponId : Nat,
    input : Types.CouponInput,
  ) : { #ok : Types.Coupon; #err : Text } {
    if (input.code == "") { return #err("Coupon code is required") };
    if (input.discountPercent == 0 or input.discountPercent > 100) {
      return #err("Discount percent must be between 1 and 100");
    };
    // Check for duplicate code (case-insensitive)
    let upperCode = input.code.toUpper();
    let duplicate = coupons.values().find(func(c : Types.Coupon) : Bool {
      c.code.toUpper() == upperCode
    });
    switch (duplicate) {
      case (?_) { return #err("Coupon code already exists") };
      case null {};
    };
    let id = nextCouponId.toText();
    let coupon : Types.Coupon = {
      id = id;
      code = upperCode;
      discountPercent = input.discountPercent;
      isActive = true;
      description = input.description;
      createdAt = Time.now();
    };
    coupons.add(id, coupon);
    #ok(coupon);
  };

  /// Public lookup by code — used at checkout to validate and apply a coupon.
  public func getCouponByCode(
    coupons : Map.Map<Types.CouponId, Types.Coupon>,
    code : Text,
  ) : ?Types.Coupon {
    let upperCode = code.toUpper();
    coupons.values().find(func(c : Types.Coupon) : Bool {
      c.code == upperCode and c.isActive
    });
  };

  /// Admin lists all coupons (active and inactive).
  public func listCoupons(coupons : Map.Map<Types.CouponId, Types.Coupon>) : [Types.Coupon] {
    coupons.values().toArray();
  };

  /// Admin deletes a coupon by id.
  public func deleteCoupon(
    coupons : Map.Map<Types.CouponId, Types.Coupon>,
    id : Types.CouponId,
  ) : { #ok : (); #err : Text } {
    switch (coupons.get(id)) {
      case null { #err("Coupon not found") };
      case (?_) {
        coupons.remove(id);
        #ok(());
      };
    };
  };

  /// Admin toggles a coupon active/inactive.
  public func toggleCoupon(
    coupons : Map.Map<Types.CouponId, Types.Coupon>,
    id : Types.CouponId,
  ) : { #ok : Types.Coupon; #err : Text } {
    switch (coupons.get(id)) {
      case null { #err("Coupon not found") };
      case (?existing) {
        let updated : Types.Coupon = { existing with isActive = not existing.isActive };
        coupons.add(id, updated);
        #ok(updated);
      };
    };
  };

  // ─── Model Photo Helpers ───────────────────────────────────────────────────

  /// Admin adds a model showcase photo.
  public func addModelPhoto(
    modelPhotos : Map.Map<Types.ModelPhotoId, Types.ModelPhoto>,
    nextModelPhotoId : Nat,
    imageUrl : Text,
    caption : ?Text,
  ) : { #ok : Types.ModelPhoto; #err : Text } {
    if (imageUrl == "") { return #err("Image URL is required") };
    let id = nextModelPhotoId.toText();
    let photo : Types.ModelPhoto = {
      id = id;
      imageUrl = imageUrl;
      caption = caption;
      createdAt = Time.now();
    };
    modelPhotos.add(id, photo);
    #ok(photo);
  };

  /// Public: list all model showcase photos ordered by newest first.
  public func listModelPhotos(modelPhotos : Map.Map<Types.ModelPhotoId, Types.ModelPhoto>) : [Types.ModelPhoto] {
    modelPhotos.values().toArray().sort(func(a : Types.ModelPhoto, b : Types.ModelPhoto) : { #less; #equal; #greater } {
      if (a.createdAt > b.createdAt) { #less }
      else if (a.createdAt < b.createdAt) { #greater }
      else { #equal }
    });
  };

  /// Admin deletes a model showcase photo.
  public func deleteModelPhoto(
    modelPhotos : Map.Map<Types.ModelPhotoId, Types.ModelPhoto>,
    id : Types.ModelPhotoId,
  ) : { #ok : (); #err : Text } {
    switch (modelPhotos.get(id)) {
      case null { #err("Model photo not found") };
      case (?_) {
        modelPhotos.remove(id);
        #ok(());
      };
    };
  };

  // ─── Seller Earnings Helpers ───────────────────────────────────────────────

  /// Computes total revenue for a seller from orders with status #Placed or #Accepted.
  /// Revenue = sum of (product.price × item.quantity) for items where product.sellerId == sellerId.
  public func getSellerEarnings(
    orders : Map.Map<Types.OrderId, Types.Order>,
    products : Map.Map<Types.ProductId, Types.Product>,
    sellerId : Text,
  ) : Types.SellerEarnings {
    // Accumulate per-product stats in a mutable map: productId -> (name, totalRevenue, orderCount)
    let breakdown = Map.empty<Text, { name : Text; var revenue : Nat; var count : Nat }>();
    var totalEarnings : Nat = 0;
    var totalOrderCount : Nat = 0;

    for ((_, order) in orders.entries()) {
      // Only count Placed or Accepted orders
      let countable = switch (order.status) {
        case (#Placed) { true };
        case (#Accepted) { true };
        case (_) { false };
      };
      if (countable) {
        var orderHasSellerItems = false;
        for (item in order.items.values()) {
          switch (products.get(item.productId)) {
            case (?product) {
              if (product.sellerId == sellerId) {
                let revenue = product.price * item.quantity;
                totalEarnings += revenue;
                orderHasSellerItems := true;
                switch (breakdown.get(item.productId)) {
                  case (?entry) {
                    entry.revenue += revenue;
                    entry.count += 1;
                  };
                  case null {
                    breakdown.add(item.productId, { name = product.name; var revenue = revenue; var count = 1 });
                  };
                };
              };
            };
            case null {};
          };
        };
        if (orderHasSellerItems) { totalOrderCount += 1 };
      };
    };

    let productBreakdown = breakdown.entries().toArray().map(
      func((pid, entry) : (Text, { name : Text; var revenue : Nat; var count : Nat })) : Types.ProductEarningBreakdown {
        { productId = pid; productName = entry.name; totalRevenue = entry.revenue; orderCount = entry.count }
      }
    );

    { totalEarnings = totalEarnings; orderCount = totalOrderCount; productBreakdown = productBreakdown };
  };

  // ─── Order Helpers ─────────────────────────────────────────────────────────

  /// Creates an order, increments orderCount on each product, and fires TWO notifications:
  /// 1. To the supplier (sellerId = seller's ID) with full customer info
  /// 2. To admin (sellerId = null) with supplier info and order details
  /// Optionally applies a coupon code and computes discount.
  public func createOrder(
    orders : Map.Map<Types.OrderId, Types.Order>,
    products : Map.Map<Types.ProductId, Types.Product>,
    sellers : Map.Map<Types.SellerId, Types.Seller>,
    notifications : Map.Map<Types.NotificationId, Types.Notification>,
    coupons : Map.Map<Types.CouponId, Types.Coupon>,
    nextOrderId : Nat,
    nextNotificationId : Nat,
    items : [Types.CartItem],
    shippingAddress : Text,
    deliveryOption : Types.DeliveryOption,
    paymentMethod : Types.PaymentMethod,
    customerName : Text,
    customerPhone : Text,
    customerId : Types.CustomerId,
    couponCode : ?Text,
  ) : { order : Types.Order; nextNotificationId : Nat } {
    var total : Nat = 0;
    var sellerIdFromProduct : ?Text = null;
    var sellerNameFromProduct : Text = "Unknown Supplier";
    for (item in items.values()) {
      switch (products.get(item.productId)) {
        case (?product) {
          let newCount = product.orderCount + item.quantity;
          products.add(item.productId, { product with orderCount = newCount });
          total += product.price * item.quantity;
          if (sellerIdFromProduct == null) {
            sellerIdFromProduct := ?product.sellerId;
            sellerNameFromProduct := product.sellerName;
          };
        };
        case null {};
      };
    };

    // Resolve coupon discount
    let (resolvedCouponCode, discountAmount) : (?Text, ?Nat) = switch (couponCode) {
      case null { (null, null) };
      case (?code) {
        switch (getCouponByCode(coupons, code)) {
          case null { (null, null) }; // invalid/inactive coupon → ignore
          case (?coupon) {
            let discount = total * coupon.discountPercent / 100;
            (?(coupon.code), ?discount);
          };
        };
      };
    };

    // Apply discount to total
    let finalTotal : Nat = switch (discountAmount) {
      case null { total };
      case (?d) { if (d > total) { 0 } else { total - d } };
    };

    // Look up supplier address for richer admin notification
    let sellerAddress : Text = switch (sellerIdFromProduct) {
      case null { "" };
      case (?sid) {
        switch (sellers.get(sid)) {
          case (?s) { s.address };
          case null { "" };
        };
      };
    };

    let orderId = nextOrderId.toText();
    let order : Types.Order = {
      id = orderId;
      items = items;
      total = finalTotal;
      shippingAddress = shippingAddress;
      deliveryOption = deliveryOption;
      paymentMethod = paymentMethod;
      status = #Placed;
      createdAt = Time.now();
      customerName = customerName;
      customerPhone = customerPhone;
      customerId = customerId;
      fulfillmentChoice = null;
      couponCode = resolvedCouponCode;
      discountAmount = discountAmount;
    };
    orders.add(orderId, order);

    // Notification 1: to supplier — includes full customer info
    let sellerMsg = "New order #" # orderId # " received! Customer: " # customerName # " | Phone: " # customerPhone # " | Delivery address: " # shippingAddress # " | Total: ₹" # finalTotal.toText() # " | " # items.size().toText() # " item(s). Please accept or reject this order.";
    let notif1 = addNotification(notifications, nextNotificationId, sellerMsg, sellerIdFromProduct, ?orderId);

    // Notification 2: to admin — includes supplier info
    let adminSellerInfo = switch (sellerIdFromProduct) {
      case null { "TBah Admin" };
      case (?sid) { sellerNameFromProduct # " (ID: " # sid # ")" # (if (sellerAddress != "") { " | Address: " # sellerAddress } else { "" }) };
    };
    let adminMsg = "New order #" # orderId # " placed — " # items.size().toText() # " item(s), ₹" # finalTotal.toText() # " | Customer: " # customerName # " (" # customerPhone # ") | Supplier: " # adminSellerInfo;
    let notif2 = addNotification(notifications, notif1.nextId, adminMsg, null, ?orderId);

    { order = order; nextNotificationId = notif2.nextId };
  };

  public func getOrder(orders : Map.Map<Types.OrderId, Types.Order>, id : Types.OrderId) : ?Types.Order {
    orders.get(id);
  };

  public func listOrders(orders : Map.Map<Types.OrderId, Types.Order>) : [(Types.OrderId, Types.Order)] {
    orders.entries().toArray().sort(func(a : (Types.OrderId, Types.Order), b : (Types.OrderId, Types.Order)) : { #less; #equal; #greater } {
      if (a.1.createdAt > b.1.createdAt) { #less }
      else if (a.1.createdAt < b.1.createdAt) { #greater }
      else { #equal }
    });
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

  /// Supplier accepts an order — records delivery choice, updates status to #Accepted,
  /// and fires an admin notification.
  /// Returns the updated order and the new nextNotificationId.
  public func acceptOrder(
    orders : Map.Map<Types.OrderId, Types.Order>,
    notifications : Map.Map<Types.NotificationId, Types.Notification>,
    nextNotificationId : Nat,
    orderId : Types.OrderId,
    fulfillmentChoice : Types.FulfillmentBy,
    sellerName : Text,
  ) : { result : { #ok : Types.Order; #err : Text }; nextNotificationId : Nat } {
    switch (orders.get(orderId)) {
      case null { { result = #err("Order not found"); nextNotificationId = nextNotificationId } };
      case (?order) {
        let updated : Types.Order = { order with status = #Accepted; fulfillmentChoice = ?fulfillmentChoice };
        orders.add(orderId, updated);

        let deliveryLabel = switch (fulfillmentChoice) {
          case (#SellerFulfilled) { "Supplier" };
          case (#AdminFulfilled) { "Admin" };
        };
        let adminMsg = "Order #" # orderId # " accepted by supplier " # sellerName # ". Delivery will be handled by: " # deliveryLabel # ".";
        let notif = addNotification(notifications, nextNotificationId, adminMsg, null, ?orderId);

        { result = #ok(updated); nextNotificationId = notif.nextId };
      };
    };
  };

  /// Supplier rejects an order — updates status to #Rejected and fires an admin notification.
  /// No notification is sent to the customer.
  /// Returns the updated order and the new nextNotificationId.
  public func rejectOrder(
    orders : Map.Map<Types.OrderId, Types.Order>,
    notifications : Map.Map<Types.NotificationId, Types.Notification>,
    nextNotificationId : Nat,
    orderId : Types.OrderId,
    sellerName : Text,
  ) : { result : { #ok : Types.Order; #err : Text }; nextNotificationId : Nat } {
    switch (orders.get(orderId)) {
      case null { { result = #err("Order not found"); nextNotificationId = nextNotificationId } };
      case (?order) {
        let updated : Types.Order = { order with status = #Rejected };
        orders.add(orderId, updated);

        let adminMsg = "Order #" # orderId # " was rejected by supplier " # sellerName # ". Admin action may be required.";
        let notif = addNotification(notifications, nextNotificationId, adminMsg, null, ?orderId);

        { result = #ok(updated); nextNotificationId = notif.nextId };
      };
    };
  };

  /// Customer cancels an order. Allowed for any status EXCEPT #Shipped and #Delivered.
  public func cancelOrder(
    orders : Map.Map<Types.OrderId, Types.Order>,
    id : Types.OrderId,
  ) : { #ok : (); #err : Text } {
    switch (orders.get(id)) {
      case null { #err("Order not found") };
      case (?order) {
        switch (order.status) {
          case (#Shipped) { #err("Cannot cancel an order that has already been shipped") };
          case (#Delivered) { #err("Cannot cancel an order that has already been delivered") };
          case (#Cancelled) { #err("Order is already cancelled") };
          case (_) {
            orders.add(id, { order with status = #Cancelled });
            #ok(());
          };
        };
      };
    };
  };

  // ─── Coupon Order Stats ────────────────────────────────────────────────────

  /// Returns order counts for a given coupon code.
  /// totalOrders = all orders where couponCode matches (case-insensitive).
  /// successfulOrders = orders with status #Placed, #Confirmed, #Processing,
  ///                    #Shipped, #Delivered, #Accepted, or #Completed
  ///                    (i.e. not #Cancelled, #Rejected, or #Pending).
  public func getCouponOrderStats(
    orders : Map.Map<Types.OrderId, Types.Order>,
    code : Text,
  ) : ?{ couponCode : Text; totalOrders : Nat; successfulOrders : Nat } {
    let upperCode = code.toUpper();
    var total : Nat = 0;
    var successful : Nat = 0;
    for ((_, order) in orders.entries()) {
      switch (order.couponCode) {
        case null {};
        case (?oc) {
          if (oc.toUpper() == upperCode) {
            total += 1;
            let isSuccessful = switch (order.status) {
              case (#Placed)      { true };
              case (#Confirmed)   { true };
              case (#Processing)  { true };
              case (#Shipped)     { true };
              case (#Delivered)   { true };
              case (#Accepted)    { true };
              case (#Cancelled)   { false };
              case (#Rejected)    { false };
              case (#Pending)     { false };
            };
            if (isSuccessful) { successful += 1 };
          };
        };
      };
    };
    // Only return a result if the code was actually referenced (even 0 orders),
    // but we need at least evidence the code exists OR total > 0.
    // Return null only if code is empty.
    if (upperCode == "") { null }
    else {
      ?{ couponCode = upperCode; totalOrders = total; successfulOrders = successful }
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
        // Admin: return only notifications with sellerId = null (admin-targeted)
        notifications.values().filter(func(n : Types.Notification) : Bool {
          switch (n.sellerId) {
            case null { true };
            case (?_) { false };
          }
        }).toArray();
      };
      case (?sid) {
        // Supplier: return only notifications targeted at this specific seller
        notifications.values().filter(func(n : Types.Notification) : Bool {
          switch (n.sellerId) {
            case null { false };
            case (?nSid) { nSid == sid };
          }
        }).toArray();
      };
    };
  };

  /// Returns ALL notifications (for admin overview / unrestricted access).
  public func getAllNotifications(
    notifications : Map.Map<Types.NotificationId, Types.Notification>,
  ) : [Types.Notification] {
    notifications.values().toArray();
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
