import { RouterProvider } from "@tanstack/react-router";
import { CustomerProvider } from "./contexts/CustomerContext";
import { router } from "./router";

export default function App() {
  return (
    <CustomerProvider>
      <RouterProvider router={router} />
    </CustomerProvider>
  );
}
