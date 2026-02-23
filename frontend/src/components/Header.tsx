import { useState } from "react";
import { ShoppingCart, Menu, X, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { cart } = useCart();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { label: "Home", type: "route", to: "/" },
    { label: "Health Powders", type: "route", to: "/health-powders" },
    { label: "Premium Pickles", type: "route", to: "/premium-pickles" },
    { label: "Combos", type: "scroll", to: "combos" },
    { label: "About", type: "scroll", to: "about" },
  ];

  const handleScroll = (id: string) => {
    navigate("/");
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10">
        <Link to="/" className="font-display text-2xl font-bold text-amber-500">
          Vivid <span className="text-amber-400">Vitablends</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) =>
            link.type === "route" ? (
              <Link
                key={link.label}
                to={link.to}
                className="text-sm font-medium text-foreground/70 hover:text-accent"
              >
                {link.label}
              </Link>
            ) : (
              <button
                key={link.label}
                onClick={() => handleScroll(link.to)}
                className="text-sm font-medium text-foreground/70 hover:text-accent"
              >
                {link.label}
              </button>
            )
          )}
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-3">
          <Link
            to="/cart"
            className="relative rounded-lg p-2 text-foreground/70 hover:bg-secondary"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            className="rounded-lg p-2 text-foreground/70 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-border bg-card px-5 py-4 md:hidden">
          {navLinks.map((link) =>
            link.type === "route" ? (
              <Link
                key={link.label}
                to={link.to}
                className="block py-3 text-sm font-medium text-foreground/70 hover:text-accent"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ) : (
              <button
                key={link.label}
                onClick={() => {
                  handleScroll(link.to);
                  setMobileOpen(false);
                }}
                className="block w-full py-3 text-left text-sm font-medium text-foreground/70 hover:text-accent"
              >
                {link.label}
              </button>
            )
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;
