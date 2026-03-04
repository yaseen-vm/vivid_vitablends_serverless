import { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { orderApi } from "@/services/api/orderApi";
import { WHATSAPP_NUMBER } from "@/lib/config";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, clearCart } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  const buyNowItem = location.state?.buyNowItem;

  const checkoutItems = useMemo(() => {
    return buyNowItem ? [buyNowItem] : cart;
  }, [buyNowItem, cart]);

  const total = useMemo(() => {
    return checkoutItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [checkoutItems]);

  const validate = () => {
    if (!name.trim()) return "Please enter your name";

    const cleanPhone = phone.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length !== 10) {
      return "Please enter a valid 10-digit phone number";
    }

    if (!address.trim()) return "Please enter your delivery address";
    if (!city.trim()) return "Please enter your city";

    const cleanPincode = pincode.replace(/\D/g, "");
    if (!cleanPincode || cleanPincode.length !== 6) {
      return "Please enter a valid 6-digit pincode";
    }

    if (checkoutItems.length === 0) return "No products to checkout";
    return null;
  };

  const handleWhatsAppOrder = async () => {
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    try {
      await orderApi.create({
        customerName: name,
        phone: phone.replace(/\D/g, ""),
        address,
        city,
        pincode: pincode.replace(/\D/g, ""),
        items: checkoutItems.map((item) => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total,
        sendWhatsApp: true,
      });
    } catch (err) {
      toast.error("Failed to save order");
    }

    const itemsText = checkoutItems
      .map(
        (item, i) =>
          `${i + 1}. ${item.name} × ${item.quantity} = ₹${
            item.price * item.quantity
          }`
      )
      .join("\n");

    const message = `
🛒 *New Order - Vivid Vitablends*

👤 Name: ${name}
📞 Phone: ${phone}
📍 Address: ${address}, ${city} - ${pincode}

📦 Items:
${itemsText}

💰 Total: ₹${total}

Please confirm availability & delivery time.
`.trim();

    const whatsappNumber = WHATSAPP_NUMBER;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(url, "_blank");

    toast.success("Order sent to WhatsApp!");

    if (!buyNowItem) {
      clearCart();
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f2f2]">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-black hover:bg-black/5"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <h1 className="font-display text-2xl font-bold md:text-3xl">
            Checkout
          </h1>

          <div className="w-[70px]" />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          {/* LEFT FORM */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-bold">Delivery Details</h2>

            <div className="grid gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Full Name
                </label>
                <div className="flex items-center gap-2 rounded-xl border px-3 py-2">
                  <User size={18} />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Phone Number
                </label>
                <div className="flex items-center gap-2 rounded-xl border px-3 py-2">
                  <Phone size={18} />
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your 10-digit mobile number"
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Address
                </label>
                <div className="flex items-center gap-2 rounded-xl border px-3 py-2">
                  <MapPin size={18} />
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your complete delivery address"
                    className="min-h-[90px] w-full resize-none bg-transparent text-sm outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter your city"
                  className="rounded-xl border px-3 py-2 text-sm outline-none"
                />

                <input
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter 6-digit pincode"
                  className="rounded-xl border px-3 py-2 text-sm outline-none"
                />
              </div>
            </div>
          </div>

          {/* RIGHT SUMMARY */}
          <div className="sticky top-24 h-fit rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-center text-sm font-bold">
              Order Summary
            </h2>

            <div className="space-y-4 text-sm">
              {checkoutItems.map((item) => (
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

            <div className="mt-6 space-y-3">
              <Button
                onClick={handleWhatsAppOrder}
                className="w-full rounded-full bg-green-600 text-white hover:bg-green-700"
              >
                Place Order on WhatsApp
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate("/cart")}
                className="w-full rounded-full"
              >
                Back to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
