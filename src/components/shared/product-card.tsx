"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import type { BusinessProduct } from "@/lib/types";
import { formatKES } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { productImage } from "@/lib/product-images";
import { useCart } from "@/components/order/cart-provider";

interface ProductCardProps {
  product: BusinessProduct;
  businessId: string;
  className?: string;
}

export function ProductCard({ product, businessId, className }: ProductCardProps) {
  const { items, addItem, updateQuantity } = useCart();
  const [qty, setQty] = useState(1);
  const cartItem = items.find(
    (i) => i.businessId === businessId && i.productId === product.id
  );

  const handleAdd = () => {
    addItem({ businessId, productId: product.id, quantity: qty });
    setQty(1);
  };

  return (
    <Card className={cn("group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-layered", className)}>
      <div className="relative h-28 overflow-hidden bg-gradient-to-br from-slate-100 via-white to-[#0052FF]/5" aria-hidden>
        <Image
          src={productImage(product.image)}
          alt=""
          fill
          sizes="(min-width: 1280px) 14rem, (min-width: 1024px) 18rem, (min-width: 640px) 45vw, 92vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-radial-glow" />
        {product.popular && (
          <Badge variant="accent" className="absolute left-3 top-3">
            Popular
          </Badge>
        )}
        {product.stock <= product.stockLow && (
          <Badge variant="warning" className="absolute right-3 top-3">
            Low stock
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[15px] font-semibold leading-snug text-foreground">{product.name}</h3>
        <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
          {product.description}
        </p>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-xl font-bold tracking-tight text-foreground">{formatKES(product.price)}</span>
          <span className="font-mono text-[11px] uppercase text-muted-foreground">/ {product.unit}</span>
          {product.oldPrice && (
            <span className="text-xs text-muted-foreground line-through">{formatKES(product.oldPrice)}</span>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2 pt-1">
          {cartItem ? (
            <div className="flex flex-1 items-center justify-between rounded-lg border border-border bg-muted/50 p-1">
              <button
                onClick={() => updateQuantity(businessId, product.id, cartItem.quantity - 1)}
                aria-label={`Decrease ${product.name} quantity`}
                className="flex size-8 items-center justify-center rounded-md border border-border bg-white text-foreground transition-colors hover:border-[#0052FF]/40 hover:text-[#0052FF]"
              >
                <Minus className="size-3.5" aria-hidden />
              </button>
              <span className="text-sm font-semibold tabular-nums" aria-live="polite">
                {cartItem.quantity} in cart
              </span>
              <button
                onClick={() => updateQuantity(businessId, product.id, cartItem.quantity + 1)}
                aria-label={`Increase ${product.name} quantity`}
                className="flex size-8 items-center justify-center rounded-md border border-border bg-white text-foreground transition-colors hover:border-[#0052FF]/40 hover:text-[#0052FF]"
              >
                <Plus className="size-3.5" aria-hidden />
              </button>
            </div>
          ) : (
            <SelectQuantity value={qty} onChange={setQty} name={product.name} />
          )}
          {!cartItem && (
            <Button onClick={handleAdd} className="flex-1 px-3" aria-label={`Add ${product.name} to cart`}>
              <ShoppingCart className="size-4" aria-hidden />
              Add
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

function SelectQuantity({
  value,
  onChange,
  name,
}: {
  value: number;
  onChange: (n: number) => void;
  name: string;
}) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-white p-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        aria-label={`Decrease quantity for ${name}`}
        className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Minus className="size-3.5" aria-hidden />
      </button>
      <span className="w-6 text-center text-sm font-semibold tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(20, value + 1))}
        aria-label={`Increase quantity for ${name}`}
        className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Plus className="size-3.5" aria-hidden />
      </button>
    </div>
  );
}