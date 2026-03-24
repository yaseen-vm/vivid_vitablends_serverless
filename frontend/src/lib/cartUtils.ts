import { CartItem } from "@/context/CartContext";

export function calculateCartTotals(
  items: Pick<CartItem, "price" | "quantity">[]
) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = subtotal > 1999 ? 200 : 0;
  const total = subtotal - discount;

  return {
    subtotal,
    discount,
    total,
  };
}
