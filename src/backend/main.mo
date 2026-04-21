import Types "types/products-orders-delivery";
import Lib "lib/products-orders-delivery";
import Map "mo:core/Map";
import List "mo:core/List";
import DeliveryMixin "mixins/products-orders-delivery-api";
import Migration "migration";

(with migration = Migration.run)
actor {
  let products = Map.empty<Types.ProductId, Types.Product>();
  let orders = Map.empty<Types.OrderId, Types.Order>();
  let sellers = Map.empty<Types.SellerId, Types.Seller>();
  let notifications = Map.empty<Types.NotificationId, Types.Notification>();
  let nextProductIdCounter = List.singleton<Nat>(100);
  let nextSellerIdCounter = List.singleton<Nat>(1);
  let nextNotificationIdCounter = List.singleton<Nat>(1);

  // Seed product catalog on first deployment
  Lib.seedProducts(products);

  include DeliveryMixin(products, orders, sellers, notifications, nextProductIdCounter, nextSellerIdCounter, nextNotificationIdCounter);
};
