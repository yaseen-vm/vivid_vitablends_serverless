import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
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

        <h1 className="text-4xl font-bold text-center mb-4">
          ❓ Frequently Asked Questions
        </h1>

        <p className="text-center text-muted-foreground mb-12">
          Find answers to the most common questions about our products and
          ordering process.
        </p>

        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              1. Are your products really preservative-free?
            </AccordionTrigger>
            <AccordionContent>
              Yes. All our products are made using traditional methods without
              artificial preservatives.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>2. How long do pickles last?</AccordionTrigger>
            <AccordionContent>
              When stored properly in a cool, dry place, our pickles last 3–6
              months. Always use a dry spoon.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>
              3. How should I store health powders?
            </AccordionTrigger>
            <AccordionContent>
              Keep them in an airtight container away from moisture.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>4. Do you offer COD?</AccordionTrigger>
            <AccordionContent>
              Currently, orders are confirmed via WhatsApp. Payment methods will
              be confirmed during order processing.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger>5. Can I customize combo packs?</AccordionTrigger>
            <AccordionContent>
              Yes. Please contact us on WhatsApp for custom bundles.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6">
            <AccordionTrigger>6. Where do you deliver?</AccordionTrigger>
            <AccordionContent>We deliver across India.</AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-7">
            <AccordionTrigger>7. How do I place an order?</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-6 space-y-2">
                <li>Add products to cart</li>
                <li>Proceed to checkout</li>
                <li>Confirm via WhatsApp</li>
                <li>We’ll handle the rest</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default FAQ;
