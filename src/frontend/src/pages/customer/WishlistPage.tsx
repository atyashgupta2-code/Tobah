import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

// Wishlist feature has been removed. Redirect to shop.
export default function WishlistPage() {
  const navigate = useNavigate();
  useEffect(() => {
    void navigate({ to: "/shop" });
  }, [navigate]);
  return null;
}
