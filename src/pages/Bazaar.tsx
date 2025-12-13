import React, { useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';
import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

type ProductType = 'all' | 'physical' | 'digital';

const Bazaar: React.FC = () => {
  const [activeType, setActiveType] = useState<ProductType>('all');

  const filteredProducts = activeType === 'all' 
    ? products 
    : products.filter(p => p.type === activeType);

  const types: { id: ProductType; label: string }[] = [
    { id: 'all', label: 'All Products' },
    { id: 'physical', label: 'Physical' },
    { id: 'digital', label: 'Digital' },
  ];

  return (
    <div className="min-h-screen pt-20 bg-parchment">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-b from-indigo-deep to-primary">
        <div className="container mx-auto px-4 text-center">
          <span className="inline-block text-saffron text-sm font-medium tracking-wider uppercase mb-4">
            The Bazaar
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-parchment mb-6">
            Sacred Tools & Artifacts
          </h1>
          <p className="text-parchment/80 text-lg max-w-2xl mx-auto mb-8">
            Curated instruments for your practice. Physical tools handcrafted with intention, 
            and digital assets engineered for transformation.
          </p>
          
          {/* Guarantee Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-parchment/10 border border-parchment/20">
            <ShieldCheck className="w-5 h-5 text-saffron" />
            <span className="text-parchment text-sm">
              Protected by the <span className="font-display">Alchemist's Guarantee</span>
            </span>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-10 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 p-1 bg-muted rounded-lg">
              {types.map((type) => (
                <Button
                  key={type.id}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "font-display tracking-wide",
                    activeType === type.id && "bg-card shadow-sm"
                  )}
                  onClick={() => setActiveType(type.id)}
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <p className="text-muted-foreground mb-8">
            {filteredProducts.length} product{filteredProducts.length !== 1 && 's'} available
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4">
              The Alchemist's Guarantee
            </h2>
            <p className="text-muted-foreground mb-6">
              Every product in our Bazaar carries our sacred promise. If any item does not 
              resonate with your practice or meet your expectations within 30 days, we will 
              transmute your investment back to you—no questions asked.
            </p>
            <p className="text-sm text-charcoal-muted italic">
              "What doesn't serve your evolution, returns to the source."
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Bazaar;
