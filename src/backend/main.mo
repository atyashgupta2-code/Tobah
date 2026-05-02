import Types "types/products-orders-delivery";
import Lib "lib/products-orders-delivery";
import Map "mo:core/Map";
import DeliveryMixin "mixins/products-orders-delivery-api";



actor {
  let products = Map.empty<Types.ProductId, Types.Product>();
  let orders = Map.empty<Types.OrderId, Types.Order>();
  let sellers = Map.empty<Types.SellerId, Types.Seller>();
  let notifications = Map.empty<Types.NotificationId, Types.Notification>();
  let customers = Map.empty<Types.CustomerId, Types.Customer>();
  let coupons = Map.empty<Types.CouponId, Types.Coupon>();
  let modelPhotos = Map.empty<Types.ModelPhotoId, Types.ModelPhoto>();
  let nextProductIdRef : [var Nat] = [var 100];
  let nextSellerIdRef : [var Nat] = [var 1];
  let nextNotificationIdRef : [var Nat] = [var 1];
  let nextCouponIdRef : [var Nat] = [var 1];
  let nextModelPhotoIdRef : [var Nat] = [var 1];

  // Seed product catalog on first deployment
  Lib.seedProducts(products);

  include DeliveryMixin(products, orders, sellers, notifications, customers, coupons, modelPhotos, nextProductIdRef, nextSellerIdRef, nextNotificationIdRef, nextCouponIdRef, nextModelPhotoIdRef);
};
