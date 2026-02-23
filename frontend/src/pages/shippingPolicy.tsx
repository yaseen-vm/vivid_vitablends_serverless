import { ArrowLeft, Mail, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const ShippingPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background py-16 px-6">
      <div className="mx-auto max-w-4xl">
        {/* Back Button */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-accent"
          >
            <ArrowLeft size={18} />
            Return to Home
          </button>
        </div>

        <h1 className="text-4xl font-bold text-center mb-6">Shipping Policy</h1>

        <p className="text-center text-muted-foreground mb-12">
          At Vivid Vitablends, every product is freshly prepared in small
          batches to ensure quality and purity.
        </p>

        <Card>
          <CardContent className="space-y-8 p-8">
            {/* 1 */}
            <div>
              <h2 className="text-xl font-semibold mb-3">
                1. Order Processing Time
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Orders are processed within 1–3 business days.</li>
                <li>
                  Since our products are handmade and preservative-free, slight
                  preparation time may be required.
                </li>
                <li>
                  Orders placed on weekends or holidays are processed the next
                  working day.
                </li>
              </ul>
            </div>

            {/* 2 */}
            <div>
              <h2 className="text-xl font-semibold mb-3">2. Shipping Time</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  Delivery usually takes 3–7 business days depending on your
                  location.
                </li>
                <li>Remote areas may require additional time.</li>
              </ul>
            </div>

            {/* 3 */}
            <div>
              <h2 className="text-xl font-semibold mb-3">
                3. Shipping Charges
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  Shipping charges (if applicable) are calculated at checkout.
                </li>
                <li>
                  Free shipping may be offered on selected orders or promotional
                  periods.
                </li>
              </ul>
            </div>

            {/* 4 */}
            <div>
              <h2 className="text-xl font-semibold mb-3">4. Order Tracking</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  Once shipped, tracking details will be shared via WhatsApp or
                  SMS.
                </li>
                <li>Please ensure your phone number is correct at checkout.</li>
              </ul>
            </div>

            {/* 5 */}
            <div>
              <h2 className="text-xl font-semibold mb-3">5. Delivery Issues</h2>
              <p className="text-muted-foreground mb-3">If your order:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                <li>Is delayed beyond expected time</li>
                <li>Is damaged during transit</li>
                <li>Is missing items</li>
              </ul>

              <p className="text-muted-foreground mb-4">
                Please contact us within 24 hours of delivery at:
              </p>

              <div className="space-y-3">
                <a
                  href="mailto:hello@vividvitablends.com"
                  className="flex items-center gap-2 text-muted-foreground hover:text-accent"
                >
                  <Mail size={18} />
                  hello@vividvitablends.com
                </a>

                <a
                  href="https://wa.me/91XXXXXXXXXX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-accent"
                >
                  <Phone size={18} />
                  +91 XXXXX XXXXX
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShippingPolicy;
