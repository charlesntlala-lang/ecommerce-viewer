'use client';

import { useCart } from '@/app/context/CartContext';

type Product = {
  id: number;
  title: string;
  price: number;
  image: string;
};

type CartItem = {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
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
          image: product.image,
          quantity: 1,
        } as CartItem)
      }
      className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Add to Cart 🛒
    </button>
  );
}