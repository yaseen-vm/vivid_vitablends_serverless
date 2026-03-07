import SocialIcon from "./SocialIcon";
import { useNavigate } from "react-router-dom";
import { CONTACT_INFO } from "@/config/contacts";

const quickLinks = [
  { name: "About Us", scrollTo: "about" },
  { name: "Products", path: "/products" },
  { name: "Combos", scrollTo: "combos" },
  { name: "Contact", path: "/contact" },
];

const supportLinks = [
  { name: "Shipping Policy", path: "/shipping-policy" },
  { name: "Return Policy", path: "/return-policy" },
  { name: "FAQ", path: "/faq" },
  { name: "Privacy Policy", path: "/privacy-policy" },
];

const Footer = () => {
  const navigate = useNavigate();

  const handleQuickLink = (link: (typeof quickLinks)[0]) => {
    if (link.scrollTo) {
      navigate("/");
      setTimeout(
        () =>
          document
            .getElementById(link.scrollTo!)
            ?.scrollIntoView({ behavior: "smooth" }),
        100
      );
    } else if (link.path) {
      navigate(link.path);
    }
  };
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <h3 className="font-display text-xl font-bold text-primary">
              Vivid <span className="text-accent">Vitablends</span>
            </h3>

            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              Premium homemade food products crafted from traditional recipes
              with 100% natural ingredients.
            </p>

            <div className="mt-4 flex gap-3">
              <a
                href={CONTACT_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-all hover:border-accent hover:text-accent"
                aria-label="Instagram"
              >
                <SocialIcon type="instagram" size={18} />
              </a>

              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-all hover:border-accent hover:text-accent"
                aria-label="Email"
              >
                <SocialIcon type="email" size={18} />
              </a>

              <a
                href={CONTACT_INFO.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-all hover:border-accent hover:text-accent"
                aria-label="WhatsApp"
              >
                <SocialIcon type="whatsapp" size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Quick Links
            </h4>

            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => handleQuickLink(link)}
                    className="text-sm text-muted-foreground transition-colors hover:text-accent cursor-pointer"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Support
            </h4>

            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-sm text-muted-foreground transition-colors hover:text-accent cursor-pointer"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Vivid Vitablends. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
