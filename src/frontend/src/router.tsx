import { Skeleton } from "@/components/ui/skeleton";
import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { Layout } from "./components/Layout";

const Home = lazy(() => import("./pages/Home"));
const Shop = lazy(() => import("./pages/Shop"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const ProductForm = lazy(() => import("./pages/admin/ProductForm"));
const SellerRegister = lazy(() => import("./pages/SellerRegister"));
const SellerDashboard = lazy(() => import("./pages/seller/SellerDashboard"));
const SellerProductForm = lazy(
  () => import("./pages/seller/SellerProductForm"),
);
const CustomerLogin = lazy(() => import("./pages/customer/CustomerLogin"));
const MyOrders = lazy(() => import("./pages/customer/MyOrders"));
const ModelsPage = lazy(() => import("./pages/ModelsPage"));
const AdminModels = lazy(() => import("./pages/admin/AdminModels"));
const CouponCommissionPage = lazy(() => import("./pages/CouponCommissionPage"));

function PageLoader() {
  return (
    <div className="p-6 space-y-4">
      <Skeleton className="h-48 w-full rounded-2xl" />
      <Skeleton className="h-8 w-2/3 rounded-lg" />
      <Skeleton className="h-4 w-1/2 rounded" />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </Layout>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const shopRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shop",
  component: Shop,
});

const productDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/product/$id",
  component: ProductDetail,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: Cart,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: Checkout,
});

const orderConfirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/order/$id",
  component: OrderConfirmation,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminDashboard,
});

const adminOrdersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/orders",
  component: AdminOrders,
});

const adminNewProductRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/products/new",
  component: ProductForm,
});

const adminEditProductRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/products/$id/edit",
  component: ProductForm,
});

const adminModelsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/models",
  component: AdminModels,
});

const sellerRegisterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/seller/register",
  component: SellerRegister,
});

const sellerDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/seller/dashboard",
  component: SellerDashboard,
});

const sellerNewProductRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/seller/products/new",
  component: SellerProductForm,
});

const sellerEditProductRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/seller/products/$id/edit",
  component: SellerProductForm,
});

const customerLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/customer/login",
  component: CustomerLogin,
});

const myOrdersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/customer/orders",
  component: MyOrders,
});

const modelsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/models",
  component: ModelsPage,
});

const couponCommissionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/coupon-commission",
  component: CouponCommissionPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  shopRoute,
  productDetailRoute,
  cartRoute,
  checkoutRoute,
  orderConfirmationRoute,
  adminDashboardRoute,
  adminOrdersRoute,
  adminNewProductRoute,
  adminEditProductRoute,
  adminModelsRoute,
  sellerRegisterRoute,
  sellerDashboardRoute,
  sellerNewProductRoute,
  sellerEditProductRoute,
  customerLoginRoute,
  myOrdersRoute,
  modelsRoute,
  couponCommissionRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
