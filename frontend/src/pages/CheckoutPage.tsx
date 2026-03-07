import { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Mail, MapPin, Phone, User } from "lucide-react";
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
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [state, setState] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const validateField = (field: string, value: string) => {
    if (field === "name") {
      if (!value.trim()) return "Name is required";
      if (value.length < 2) return "Name must be at least 2 characters";
      if (!/^[a-zA-Z\s.'-]+$/.test(value)) return "Only letters allowed";
    }
    if (field === "email") {
      if (!value.trim()) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email";
    }
    if (field === "phone") {
      const cleanPhone = value.replace(/\D/g, "");
      if (!cleanPhone) return "Phone is required";
      if (cleanPhone.length !== 10) return "Must be 10 digits";
    }
    if (field === "address") {
      if (!value.trim()) return "Address is required";
    }
    if (field === "city") {
      if (!value.trim()) return "City is required";
      if (value.length < 2) return "City must be at least 2 characters";
      if (!/^[a-zA-Z\s.'-]+$/.test(value)) return "Only letters allowed";
    }
    if (field === "pincode") {
      const cleanPincode = value.replace(/\D/g, "");
      if (!cleanPincode) return "Pincode is required";
      if (cleanPincode.length !== 6) return "Must be 6 digits";
    }
    if (field === "state") {
      if (!value.trim()) return "State is required";
      if (value.length < 2) return "State must be at least 2 characters";
      if (!/^[a-zA-Z\s]+$/.test(value)) return "Only letters allowed";
    }
    return "";
  };

  const handleFieldChange = (field: string, value: string) => {
    switch (field) {
      case "name":
        setName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "phone":
        setPhone(value);
        break;
      case "address":
        setAddress(value);
        break;
      case "city":
        setCity(value);
        break;
      case "pincode":
        setPincode(value);
        break;
      case "state":
        setState(value);
        break;
    }
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    newErrors.name = validateField("name", name);
    newErrors.email = validateField("email", email);
    newErrors.phone = validateField("phone", phone);
    newErrors.address = validateField("address", address);
    newErrors.city = validateField("city", city);
    newErrors.pincode = validateField("pincode", pincode);
    newErrors.state = validateField("state", state);
    setErrors(newErrors);
    return !Object.values(newErrors).some((err) => err);
  };

  const handleWhatsAppOrder = async () => {
    if (!validate()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      await orderApi.create({
        customerName: name,
        email,
        phone: phone.replace(/\D/g, ""),
        address,
        city,
        state,
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
    } catch {
      toast.error("Failed to save order. Please check your details.");
      return;
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
📧 Email: ${email}
📞 Phone: ${phone}
📍 Address: ${address}, ${city}, ${state} - ${pincode}

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
                <div
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 ${errors.name ? "border-red-500" : ""}`}
                >
                  <User size={18} />
                  <input
                    value={name}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Email Address
                </label>
                <div
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 ${errors.email ? "border-red-500" : ""}`}
                >
                  <Mail size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Phone Number
                </label>
                <div
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 ${errors.phone ? "border-red-500" : ""}`}
                >
                  <Phone size={18} />
                  <input
                    value={phone}
                    onChange={(e) => handleFieldChange("phone", e.target.value)}
                    placeholder="Enter your 10-digit mobile number"
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Address
                </label>
                <div
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 ${errors.address ? "border-red-500" : ""}`}
                >
                  <MapPin size={18} />
                  <textarea
                    value={address}
                    onChange={(e) =>
                      handleFieldChange("address", e.target.value)
                    }
                    placeholder="Enter your complete delivery address"
                    className="min-h-[90px] w-full resize-none bg-transparent text-sm outline-none"
                  />
                </div>
                {errors.address && (
                  <p className="mt-1 text-xs text-red-500">{errors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <input
                    value={city}
                    onChange={(e) => handleFieldChange("city", e.target.value)}
                    placeholder="Enter your city"
                    className={`w-full rounded-xl border px-3 py-2 text-sm outline-none ${errors.city ? "border-red-500" : ""}`}
                  />
                  {errors.city && (
                    <p className="mt-1 text-xs text-red-500">{errors.city}</p>
                  )}
                </div>

                <div>
                  <input
                    value={pincode}
                    onChange={(e) =>
                      handleFieldChange("pincode", e.target.value)
                    }
                    placeholder="Enter 6-digit pincode"
                    className={`w-full rounded-xl border px-3 py-2 text-sm outline-none ${errors.pincode ? "border-red-500" : ""}`}
                  />
                  {errors.pincode && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.pincode}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  State/Province
                </label>
                <input
                  value={state}
                  onChange={(e) => handleFieldChange("state", e.target.value)}
                  placeholder="Enter your state or province"
                  className={`w-full rounded-xl border px-3 py-2 text-sm outline-none ${errors.state ? "border-red-500" : ""}`}
                />
                {errors.state && (
                  <p className="mt-1 text-xs text-red-500">{errors.state}</p>
                )}
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
