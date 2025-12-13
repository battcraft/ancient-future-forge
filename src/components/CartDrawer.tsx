import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useShop } from '@/contexts/ShopContext';
import { cn } from '@/lib/utils';

const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal, clearCart } = useShop();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    // Simulate checkout process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsCheckingOut(false);
    setCheckoutComplete(true);
    
    setTimeout(() => {
      clearCart();
      setCheckoutComplete(false);
      setIsCartOpen(false);
    }, 2000);
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-indigo-cosmic/50 backdrop-blur-sm z-50"
        onClick={() => setIsCartOpen(false)}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-parchment border-l border-border z-50 animate-slide-in-right shadow-cosmic">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-saffron" />
              <h2 className="font-display text-xl text-foreground">Sacred Cart</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                  <ShoppingBag className="w-10 h-10 text-muted-foreground" />
                </div>
                <p className="font-display text-lg text-foreground mb-2">Your cart is empty</p>
                <p className="text-sm text-muted-foreground">Begin your journey through the Academy or Bazaar</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div 
                    key={item.id}
                    className="flex gap-4 p-4 bg-card rounded-lg border border-border"
                  >
                    {item.image && (
                      <div className="w-16 h-16 rounded-md bg-muted overflow-hidden flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display text-sm text-foreground truncate">{item.title}</h4>
                      <p className="text-xs text-muted-foreground capitalize">{item.type}</p>
                      <p className="text-saffron font-medium mt-1">${item.price}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      {item.type === 'product' && (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-6 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="border-t border-border p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-display text-lg text-foreground">Total</span>
                <span className="font-display text-2xl text-saffron">${cartTotal.toFixed(2)}</span>
              </div>
              
              <Button
                variant="hero"
                className="w-full"
                onClick={handleCheckout}
                disabled={isCheckingOut || checkoutComplete}
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : checkoutComplete ? (
                  <>
                    <Check className="w-4 h-4" />
                    Order Complete!
                  </>
                ) : (
                  'Complete Your Journey'
                )}
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                Protected by the Alchemist's Guarantee
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
