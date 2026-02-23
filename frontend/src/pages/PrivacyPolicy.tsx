import { ArrowLeft, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const PrivacyPolicy = () => {
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

        <h1 className="text-4xl font-bold text-center mb-2">
          🔐 Privacy Policy
        </h1>

        <p className="text-center text-muted-foreground mb-2">
          Effective Date: [Add Date]
        </p>

        <p className="text-center text-muted-foreground mb-12">
          At Vivid Vitablends, we value your privacy and are committed to
          protecting your information.
        </p>

        <Card>
          <CardContent className="space-y-8 p-8">
            {/* 1 */}
            <div>
              <h2 className="text-xl font-semibold mb-3">
                1. Information We Collect
              </h2>

              <p className="text-muted-foreground mb-3">We may collect:</p>

              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Name</li>
                <li>Phone number</li>
                <li>Email address</li>
                <li>Delivery address</li>
                <li>Order details</li>
              </ul>
            </div>

            {/* 2 */}
            <div>
              <h2 className="text-xl font-semibold mb-3">
                2. How We Use Your Information
              </h2>

              <p className="text-muted-foreground mb-3">
                Your data is used only to:
              </p>

              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                <li>Process and deliver orders</li>
                <li>Communicate order updates</li>
                <li>Respond to queries</li>
                <li>Improve our services</li>
              </ul>

              <p className="text-muted-foreground">
                We do not sell, trade, or share your personal information with
                third parties for marketing purposes.
              </p>
            </div>

            {/* 3 */}
            <div>
              <h2 className="text-xl font-semibold mb-3">
                3. Payment Information
              </h2>

              <p className="text-muted-foreground">
                We do not store your payment details. Payments are handled
                securely via verified payment methods.
              </p>
            </div>

            {/* 4 */}
            <div>
              <h2 className="text-xl font-semibold mb-3">4. Data Security</h2>

              <p className="text-muted-foreground">
                We take reasonable measures to protect your data from
                unauthorized access.
              </p>
            </div>

            {/* 5 */}
            <div>
              <h2 className="text-xl font-semibold mb-3">5. Cookies</h2>

              <p className="text-muted-foreground">
                Our website may use basic cookies to enhance browsing
                experience.
              </p>
            </div>

            {/* 6 */}
            <div>
              <h2 className="text-xl font-semibold mb-3">6. Contact</h2>

              <p className="text-muted-foreground mb-4">
                If you have questions about this policy, contact:
              </p>

              <a
                href="mailto:hello@vividvitablends.com"
                className="flex items-center gap-2 text-muted-foreground hover:text-accent"
              >
                <Mail size={18} />
                hello@vividvitablends.com
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Recommendation Section */}
        <div className="mt-12 p-6 bg-muted/40 rounded-xl text-sm text-muted-foreground">
          <p className="font-semibold mb-3">💡 Recommendation</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Terms & Conditions page</li>
            <li>Cancellation Policy</li>
            <li>Disclaimer (especially for health powders)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
