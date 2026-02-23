import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [showDetails, setShowDetails] = useState(false);

  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  return (
    <div className="min-h-screen bg-[#d9d9d9]">
      <div className="mx-auto max-w-7xl px-5 py-10 md:py-12">
        <div className="mb-6 flex items-center gap-4 md:mb-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center rounded-full bg-white p-2 shadow-sm hover:bg-gray-100"
          >
            ←
          </button>

          <h1 className="font-display text-3xl font-bold text-black md:text-4xl">
            Your Cart
          </h1>
        </div>

        {cart.length === 0 ? (
          <p className="text-muted-foreground">Your cart is empty</p>
        ) : (
          <>
            {/* ================= MOBILE ================= */}
            <div className="space-y-6 md:hidden">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl bg-white p-4 shadow-sm"
                >
                  <div className="flex gap-4">
                    <div className="h-28 w-28 rounded-xl bg-gray-100 p-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-contain"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-black">
                        {item.name}
                      </h3>

                      <div className="mt-1 text-base font-bold text-black">
                        ₹ {item.price}
                      </div>

                      <p className="mt-2 text-xs text-gray-600 line-clamp-2">
                        {item.description}
                      </p>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="mt-2 inline-flex items-center gap-2 text-xs font-medium text-red-600"
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200"
                      >
                        <Minus size={16} />
                      </button>

                      <div className="flex h-9 w-12 items-center justify-center rounded-md border text-sm font-semibold">
                        {item.quantity}
                      </div>

                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <span className="text-sm font-bold">
                      ₹ {item.price * item.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* ================= DESKTOP ================= */}
            <div className="hidden md:grid md:grid-cols-[1fr_360px] md:gap-10">
              <div className="space-y-8">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl bg-white p-6 shadow-sm"
                  >
                    <div className="flex gap-6">
                      <div className="flex w-[220px] justify-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-[210px] w-[210px] object-contain"
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{item.name}</h3>

                        <div className="mt-2 text-lg font-bold">
                          ₹ {item.price}
                        </div>

                        <p className="mt-3 max-w-lg text-sm text-gray-700">
                          {item.description}
                        </p>

                        <div className="mt-6 flex items-center gap-4">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200"
                          >
                            <Minus size={16} />
                          </button>

                          <div className="flex h-9 w-12 items-center justify-center rounded-md border font-semibold">
                            {item.quantity}
                          </div>

                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200"
                          >
                            <Plus size={16} />
                          </button>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="ml-auto flex items-center gap-2 text-red-600"
                          >
                            <Trash2 size={16} />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="sticky top-24 h-fit rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="mb-6 text-center text-sm font-bold">
                  Price Details
                </h3>

                <div className="space-y-5 text-sm">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-semibold">
                        ₹ {item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="my-6 h-px bg-gray-200" />

                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹ {total}</span>
                </div>

                <div className="mt-6">
                  <Button
                    onClick={() => navigate("/checkout")}
                    className="w-full rounded-full bg-yellow-400 text-black hover:bg-yellow-500"
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </div>
            </div>

            {/* Bottom Mobile Bar */}
            {/* Bottom Mobile Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white p-4 md:hidden">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-gray-500">Total</p>
                  <p className="text-lg font-bold">₹ {total}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowDetails(true)}
                    variant="outline"
                    className="rounded-full"
                  >
                    View Details
                  </Button>

                  <Button
                    onClick={() => navigate("/checkout")}
                    className="rounded-full bg-yellow-400 text-black"
                  >
                    Checkout
                  </Button>
                </div>
              </div>
            </div>

            <div className="h-24 md:hidden" />
            {showDetails && (
              <div
                className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 md:hidden"
                onClick={() => setShowDetails(false)} // 👈 Close when clicking overlay
              >
                <div
                  className="w-full max-h-[70vh] overflow-y-auto rounded-t-3xl bg-white p-6"
                  onClick={(e) => e.stopPropagation()} // 👈 Prevent closing when clicking inside
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold">Cart Details</h3>
                    <button
                      onClick={() => setShowDetails(false)}
                      className="text-sm text-gray-500"
                    >
                      Close
                    </button>
                  </div>

                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm"
                      >
                        <div>
                          <p className="font-medium">
                            {item.quantity}x {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            ₹ {item.price} each
                          </p>
                        </div>

                        <span className="font-semibold">
                          ₹ {item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="my-4 h-px bg-gray-200" />

                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹ {total}</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
