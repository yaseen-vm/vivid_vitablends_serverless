import { Leaf, Home, ShieldCheck, BookOpen } from "lucide-react";

const promises = [
  { icon: Leaf, title: "100% Natural", desc: "Pure ingredients,no chemicals " },
  { icon: Home, title: "Homemade", desc: "Crafted in small batches" },
  {
    icon: ShieldCheck,
    title: "No Preservatives",
    desc: "Fresh & preservative-free",
  },
  {
    icon: BookOpen,
    title: "Traditional Recipe",
    desc: "Passed down generations",
  },
];

const BrandPromise = () => {
  return (
    <section className="section-padding bg-secondary">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {promises.map((p) => (
            <div
              key={p.title}
              className={`card-hover flex flex-col items-center rounded-lg bg-card p-4 text-center md:p-8`}
            >
              {/* Smaller icon container on mobile */}
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 md:h-14 md:w-14">
                <p.icon size={20} className="text-accent md:size-[28px]" />
              </div>

              {/* Smaller title on mobile */}
              <h3 className="font-display mb-0 text-sm font-bold text-foreground md:text-lg">
                {p.title}
              </h3>

              {/* Smaller description on mobile */}
              <p className="mt-0  text-xs text-muted-foreground md:text-sm">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandPromise;
