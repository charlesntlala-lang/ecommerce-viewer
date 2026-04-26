'use client';

import { useCart } from '@/app/context/CartContext';

type Product = {
  id: number;
  title: string;
  price: number;
  image: string; // ✅ ADD THIS
};

export function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <button
      onClick={() =>
        addToCart({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image, // ✅ FIX HERE
          quantity: 1,
        })
      }
      className="
        mt-4 px-6 py-3 
        bg-blue-600 text-white font-medium 
        rounded-lg shadow-md
        transition-all duration-200
        hover:bg-blue-700 hover:scale-105 hover:shadow-lg
        active:scale-95
        flex items-center justify-center gap-2
      "
    >
      Add to Cart <span className="animate-bounce">🛒</span>
    </button>
  );
}