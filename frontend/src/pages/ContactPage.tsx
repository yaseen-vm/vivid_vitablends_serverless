import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useMessageSubmit } from "@/hooks/useMessageSubmit";

const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters"),
  email: z
    .string()
    .email("Enter a valid email")
    .max(200, "Email must not exceed 200 characters"),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || val === "" || /^\d{10}$/.test(val),
      "Phone must be 10 digits"
    ),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must not exceed 2000 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const Contact = () => {
  const navigate = useNavigate();
  const mutation = useMessageSubmit();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    mutation.mutate(data, {
      onSuccess: () => form.reset(),
    });
  };

  return (
    <div className="min-h-screen bg-background py-16 px-6">
      <div className="mx-auto max-w-6xl">
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

        <h1 className="text-4xl font-bold text-center mb-4">Contact Us</h1>

        <p className="text-center text-muted-foreground mb-12">
          We'd love to hear from you. Reach out using the details below or send
          us a message.
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          {/* LEFT SIDE - CONTACT INFO */}
          <div className="space-y-6">
            {/* Phone */}
            <Card className="transition hover:shadow-lg">
              <CardContent className="flex items-center gap-4 p-6">
                <Phone className="text-accent" />
                <div>
                  <h4 className="font-semibold">Phone</h4>
                  <a
                    href="tel:+919999999999"
                    className="text-muted-foreground hover:text-accent"
                  >
                    +91 99999 99999
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Email */}
            <Card className="transition hover:shadow-lg">
              <CardContent className="flex items-center gap-4 p-6">
                <Mail className="text-accent" />
                <div>
                  <h4 className="font-semibold">Email</h4>
                  <a
                    href="mailto:support@vividvitablends.com"
                    className="text-muted-foreground hover:text-accent"
                  >
                    support@vividvitablends.com
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* WhatsApp */}
            <Card className="transition hover:shadow-lg">
              <CardContent className="flex items-center gap-4 p-6">
                <Phone className="text-accent" />
                <div>
                  <h4 className="font-semibold">WhatsApp</h4>
                  <a
                    href="https://wa.me/919999999999"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-accent"
                  >
                    +91 99999 99999
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Address */}
            <Card className="transition hover:shadow-lg">
              <CardContent className="flex items-center gap-4 p-6">
                <MapPin className="text-accent" />
                <div>
                  <h4 className="font-semibold">Address</h4>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Cheruvaranam,Kerala,India"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-accent"
                  >
                    Cheruvaranam, Kerala, India
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT SIDE - FORM */}
          <Card>
            <CardContent className="p-8">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <div>
                  <Input placeholder="Your Name" {...form.register("name")} />
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.name?.message}
                  </p>
                </div>

                <div>
                  <Input
                    placeholder="Email Address"
                    {...form.register("email")}
                  />
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.email?.message}
                  </p>
                </div>

                <div>
                  <Input
                    placeholder="Phone Number (Optional)"
                    {...form.register("phone")}
                  />
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.phone?.message}
                  </p>
                </div>

                <div>
                  <Textarea
                    placeholder="Your Message"
                    rows={5}
                    {...form.register("message")}
                  />
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.message?.message}
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={mutation.isPending || !form.formState.isValid}
                >
                  {mutation.isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* SOCIAL SECTION */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold mb-6">Follow Us</h3>

          <div className="flex justify-center gap-6">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-border transition hover:border-accent hover:text-accent hover:scale-110"
            >
              <Instagram size={22} />
            </a>

            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-border transition hover:border-accent hover:text-accent hover:scale-110"
            >
              <Facebook size={22} />
            </a>

            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-border transition hover:border-accent hover:text-accent hover:scale-110"
            >
              <Twitter size={22} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
