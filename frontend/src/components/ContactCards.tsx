import { Mail, Phone, MessageCircle, Star } from "lucide-react";
import { useState } from "react";
import { useReviewSubmit } from "@/hooks/useReviewSubmit";

const getStarColor = (value: number) => {
  switch (value) {
    case 1:
      return "text-red-500 fill-red-500";
    case 2:
      return "text-orange-500 fill-orange-500";
    case 3:
      return "text-amber-400 fill-amber-400";
    case 4:
      return "text-yellow-400 fill-yellow-400";
    case 5:
      return "text-green-500 fill-green-500";
    default:
      return "text-gray-300";
  }
};

const contacts = [
  { icon: Mail, label: "Email Us", href: "mailto:hello@vividvitablends.com" },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    href: "https://wa.me/919876543210",
  },
  { icon: Phone, label: "Call Us", href: "tel:+919876543210" },
];

const ContactCards = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const mutation = useReviewSubmit();
  const isFormValid =
    rating > 0 && name.trim().length >= 2 && message.trim().length >= 5;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    mutation.mutate(
      { name, rating, comment: message },
      {
        onSuccess: () => {
          setRating(0);
          setName("");
          setMessage("");
        },
      }
    );
  };

  return (
    <section className="section-padding bg-secondary">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        {/* Heading */}
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-accent">
            Get in Touch
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">
            We'd Love to Hear from You
          </h2>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-3 gap-3 md:gap-5">
          {contacts.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="card-hover flex flex-col items-center rounded-lg bg-card p-4 text-center transition-all md:p-8"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 md:h-14 md:w-14">
                <c.icon size={20} className="text-accent md:size-[26px]" />
              </div>
              <h3 className="font-serif text-sm font-bold text-foreground md:text-lg">
                {c.label}
              </h3>
            </a>
          ))}
        </div>

        {/* Review Form */}
        <div className="mx-auto mt-16 max-w-3xl rounded-xl bg-card p-8 shadow-sm">
          <h3 className="mb-6 text-center font-display text-2xl font-bold text-foreground">
            Leave Us a Message
          </h3>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* ⭐ Star Rating */}
            <div className="text-center">
              <p className="mb-3 text-sm font-medium text-foreground">
                Your Rating
              </p>

              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      size={30}
                      className={
                        star <= (hover || rating)
                          ? getStarColor(hover || rating)
                          : "text-gray-300"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Name
              </label>
              <input
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>

            {/* Message */}
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Message / Review
              </label>
              <textarea
                rows={4}
                placeholder="Share your experience or question..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <button
              type="submit"
              disabled={!isFormValid || mutation.isPending}
              className="w-full rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {mutation.isPending ? "Submitting..." : "Submit Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactCards;
