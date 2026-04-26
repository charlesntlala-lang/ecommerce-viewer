'use client';

import { useState } from 'react';
import { useCart } from '@/app/context/CartContext';
import Link from 'next/link';

export default function MiniCartDrawer() {
  const {
    cart,
    increaseQty,
    decreaseQty,
    removeFromCart,
  } = useCart();

  const [open, setOpen] = useState(false);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <>
      {/* 🧭 CART ICON BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="relative px-4 py-2 bg-black text-white rounded"
      >
        🛒 Cart

        {/* 🔴 COUNT BADGE */}
        {cart.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
            {cart.reduce((a, b) => a + b.quantity, 0)}
          </span>
        )}
      </button>

      {/* 🧭 DRAWER OVERLAY */}
      {open && (
        <div className="fixed inset-0 z-50 flex">

          {/* DARK BACKDROP */}
          <div
            className="flex-1 bg-black/40"
            onClick={() => setOpen(false)}
          />

          {/* DRAWER */}
          <div className="w-96 bg-white h-full shadow-lg p-4 overflow-y-auto">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">Your Cart</h2>

              <button
                onClick={() => setOpen(false)}
                className="text-gray-500"
              >
                ✖
              </button>
            </div>

            {/* EMPTY STATE */}
            {cart.length === 0 && (
              <p className="text-gray-500">
                Your cart is empty 🛒
              </p>
            )}

            {/* ITEMS */}
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 border-b py-3"
              >

                {/* IMAGE */}
                <img
                  src={item.image}
                  className="w-14 h-14 object-contain"
                />

                {/* INFO */}
                <div className="flex-1">
                  <p className="font-medium text-sm">
                    {item.title}
                  </p>

                  <p className="text-xs text-gray-500">
                    ${item.price}
                  </p>

                  {/* QTY CONTROLS */}
                  <div className="flex items-center gap-2 mt-1">

                    <button
                      onClick={() => decreaseQty(item.id)}
                      className="px-2 bg-gray-200 rounded"
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => increaseQty(item.id)}
                      className="px-2 bg-gray-200 rounded"
                    >
                      +
                    </button>

                  </div>
                </div>

                {/* REMOVE */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 text-sm"
                >
                  ✖
                </button>

              </div>
            ))}

            {/* TOTAL */}
            <div className="mt-4 font-bold">
              Total: ${total.toFixed(2)}
            </div>

            {/* ACTION BUTTONS */}
            <div className="mt-4 space-y-2">

              <Link href="/cart">
                <button
                  onClick={() => setOpen(false)}
                  className="w-full bg-blue-600 text-white py-2 rounded"
                >
                  View Full Cart →
                </button>
              </Link>

              <button
                onClick={() => setOpen(false)}
                className="w-full bg-gray-200 py-2 rounded"
              >
                Continue Shopping
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
}