'use client';

import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import {
  ShoppingCartOutlined,
  DeleteOutlined,
  PlusOutlined,
  MinusOutlined,
  ArrowRightOutlined,
  CloseOutlined,
  MenuOutlined,
} from '@ant-design/icons';

const PALETTE = {
  darkest: '#132a13',
  dark: '#31572c',
  mid: '#90a955',
  light: '#ecf39e',
};

export function Navbar() {
  const { cart, increaseQty, decreaseQty, removeFromCart } = useCart();
  const router = useRouter();

  const [quickOpen, setQuickOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const badgeRef = useRef<HTMLSpanElement>(null);
  const prevCount = useRef(0);

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Badge animation
  useEffect(() => {
    if (itemCount > prevCount.current && badgeRef.current) {
      gsap.fromTo(
        badgeRef.current,
        { scale: 0.5 },
        { scale: 1, duration: 0.4, ease: 'back.out(3)' }
      );
    }
    prevCount.current = itemCount;
  }, [itemCount]);

  const handleCartClick = () => {
    if (isMobile) {
      setQuickOpen(!quickOpen);
    } else {
      router.push('/cart');
    }
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 100,
      background: PALETTE.darkest,
      borderBottom: `1px solid ${PALETTE.dark}`,
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '0 16px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>

        {/* LOGO */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 30,
            height: 30,
            borderRadius: 6,
            background: PALETTE.mid,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            🌿
          </div>
          <span style={{
            color: PALETTE.light,
            fontSize: isMobile ? 16 : 20,
            fontWeight: 700,
          }}>
            VERDA
          </span>
        </Link>

        {/* DESKTOP NAV */}
        {!isMobile && (
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            {['Shop', 'Collections', 'About'].map((item) => (
              <Link key={item} href="#">
                <span style={{ color: PALETTE.mid, fontSize: 12 }}>
                  {item}
                </span>
              </Link>
            ))}
          </div>
        )}

        {/* RIGHT SIDE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

          {/* CART */}
          <button
            onClick={handleCartClick}
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              border: `1px solid ${PALETTE.dark}`,
              background: 'transparent',
              color: PALETTE.light,
              position: 'relative',
            }}
          >
            <ShoppingCartOutlined />

            {itemCount > 0 && (
              <span
                ref={badgeRef}
                style={{
                  position: 'absolute',
                  top: -6,
                  right: -6,
                  background: PALETTE.mid,
                  color: PALETTE.darkest,
                  fontSize: 10,
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {itemCount}
              </span>
            )}
          </button>

          {/* MOBILE MENU BUTTON */}
          {isMobile && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                border: `1px solid ${PALETTE.dark}`,
                background: 'transparent',
                color: PALETTE.light,
              }}
            >
              {menuOpen ? <CloseOutlined /> : <MenuOutlined />}
            </button>
          )}
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && isMobile && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            style={{
              overflow: 'hidden',
              background: PALETTE.darkest,
              borderTop: `1px solid ${PALETTE.dark}`,
            }}
          >
            {['Shop', 'Collections', 'About'].map((item) => (
              <Link key={item} href="#">
                <div style={{
                  padding: 16,
                  borderBottom: `1px solid ${PALETTE.dark}`,
                  color: PALETTE.mid,
                }}>
                  {item}
                </div>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE CART DRAWER */}
      <AnimatePresence>
        {quickOpen && isMobile && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            style={{
              position: 'fixed',
              bottom: 0,
              width: '100%',
              background: PALETTE.darkest,
              borderTop: `1px solid ${PALETTE.dark}`,
              padding: 16,
              maxHeight: '60vh',
              overflowY: 'auto',
            }}
          >
            {cart.length === 0 ? (
              <p style={{ color: PALETTE.mid }}>Cart is empty</p>
            ) : (
              cart.map((item) => (
                <div key={item.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 12,
                }}>
                  <span style={{ color: PALETTE.light }}>{item.title}</span>
                  <span style={{ color: PALETTE.mid }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))
            )}

            <button
              onClick={() => router.push('/cart')}
              style={{
                width: '100%',
                marginTop: 12,
                padding: 12,
                background: PALETTE.mid,
                border: 'none',
                borderRadius: 8,
                fontWeight: 700,
              }}
            >
              Checkout (${total.toFixed(2)})
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}