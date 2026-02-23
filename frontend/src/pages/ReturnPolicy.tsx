import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const ReturnPolicy = () => {
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
          🔄 Return & Refund Policy
        </h1>

        <p className="text-center text-muted-foreground mb-12">
          Due to the nature of our food products, we maintain a strict but fair
          return policy.
        </p>

        <Card>
          <CardContent className="space-y-8 p-8">
            {/* 1 */}
            <div>
              <h2 className="text-xl font-semibold mb-3">
                1. Eligible for Replacement (Not Refund)
              </h2>

              <p className="text-muted-foreground mb-3">
                We offer replacements if:
              </p>

              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                <li>Product arrives damaged</li>
                <li>Wrong item delivered</li>
                <li>Seal is broken upon delivery</li>
              </ul>

              <p className="text-muted-foreground mb-2">You must:</p>

              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Inform us within 24 hours</li>
                <li>Share clear photos of the product and packaging</li>
              </ul>
            </div>

            {/* 2 */}
            <div>
              <h2 className="text-xl font-semibold mb-3">
                2. Not Eligible for Return
              </h2>

              <p className="text-muted-foreground mb-3">
                We cannot accept returns if:
              </p>

              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Product has been opened or consumed</li>
                <li>Taste preferences differ</li>
                <li>Incorrect shipping details were provided</li>
              </ul>
            </div>

            {/* 3 */}
            <div>
              <h2 className="text-xl font-semibold mb-3">3. Refund Process</h2>

              <p className="text-muted-foreground mb-3">If approved:</p>

              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Refund will be processed within 5–7 business days</li>
                <li>Refunds are issued to the original payment method</li>
              </ul>

              <p className="mt-4 text-muted-foreground">
                Since we are a small-batch homemade brand, we request your
                understanding.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReturnPolicy;
