import React from 'react';
import { Star, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useShop } from '@/contexts/ShopContext';
import { cn } from '@/lib/utils';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  type: 'physical' | 'digital';
  image?: string;
  image_url?: string | null;
  in_stock?: boolean | null;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, cart } = useShop();
  const isInCart = cart.some(item => item.id === product.id);
  
  // Support both image and image_url
  const imageUrl = product.image_url || product.image || '/placeholder.svg';

  return (
    <div className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-saffron/50 transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img 
          src={imageUrl} 
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Type Badge */}
        <div className="absolute top-3 right-3">
          <span className={cn(
            "px-2 py-1 rounded-full text-xs font-medium capitalize",
            product.type === 'digital' 
              ? "bg-purple-500/10 text-purple-700 border border-purple-500/30" 
              : "bg-emerald-500/10 text-emerald-700 border border-emerald-500/30"
          )}>
            {product.type}
          </span>
        </div>
        
        {/* Out of stock overlay */}
        {product.in_stock === false && (
          <div className="absolute inset-0 bg-charcoal/60 flex items-center justify-center">
            <span className="text-parchment font-display">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display text-lg text-foreground mb-2 group-hover:text-saffron transition-colors">
          {product.title}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="font-display text-2xl text-saffron">${product.price}</span>
        </div>

        {/* Action */}
        <Button
          variant={isInCart ? "parchment" : "saffron"}
          className="w-full"
          onClick={() => !isInCart && addToCart({
            id: product.id,
            title: product.title,
            price: product.price,
            type: 'product',
            image: imageUrl,
          })}
          disabled={isInCart || product.in_stock === false}
        >
          {product.in_stock === false ? 'Out of Stock' : isInCart ? 'In Cart' : 'Add to Cart'}
        </Button>
        
        {/* Guarantee */}
        <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-muted-foreground">
          <ShieldCheck className="w-3.5 h-3.5 text-saffron" />
          Alchemist's Guarantee
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
