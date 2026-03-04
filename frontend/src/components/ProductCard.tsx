import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types/Product";

type ProductCardProps = {
  product: Product;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const isOutOfStock = product.inStock === false;

  const handleBuyNow = () => {
    navigate("/checkout", {
      state: {
        buyNowItem: {
          ...product,
          quantity: 1,
        },
      },
    });
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      description: product.description,
      image: product.image,
      price: product.price,
    });
  };

  return (
    <Card className="overflow-hidden transition hover:shadow-lg">
      <div className="flex h-48 items-center justify-center bg-muted relative">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-auto object-contain"
          loading="lazy"
        />
        {isOutOfStock && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            Out of Stock
          </Badge>
        )}
      </div>

      <CardContent className="p-6">
        <h3 className="mb-2 text-xl font-semibold">{product.name}</h3>

        <p className="mb-4 text-muted-foreground">{product.description}</p>

        <div className="mb-4">
          <span className="text-lg font-bold text-green-600">
            ₹{product.price}
          </span>
        </div>

        <div className="flex gap-3">
          <Button
            className="w-1/2"
            onClick={handleBuyNow}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? "Out of Stock" : "Buy Now"}
          </Button>

          <Button
            variant="outline"
            className="w-1/2"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
