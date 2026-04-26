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
  EyeOutlined,
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
  const [scrolled, setScrolled] = useState(false);
  const [lastAdded, setLastAdded] = useState<number | null>(null);

  const badgeRef = useRef<HTMLSpanElement>(null);
  const prevCount = useRef(0);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Navbar shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Badge pop + auto-open quick view when item is added
  useEffect(() => {
    if (itemCount > prevCount.current) {
      if (badgeRef.current) {
        gsap.fromTo(
          badgeRef.current,
          { scale: 0.4, rotation: -25 },
          { scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(2.5)' }
        );
      }
      // Highlight the newest item
      const newest = cart[cart.length - 1];
      if (newest) {
        setLastAdded(newest.id);
        setTimeout(() => setLastAdded(null), 2500);
      }
      // Auto-open quick view for 3.5 s so user sees what they added
      setQuickOpen(true);
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
      hoverTimeout.current = setTimeout(() => setQuickOpen(false), 3500);
    }
    prevCount.current = itemCount;
  }, [itemCount]);

  // Hover open / close with small grace delay so cursor can travel into drawer
  const openQuick = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setQuickOpen(true);
  };

  const closeQuick = () => {
    hoverTimeout.current = setTimeout(() => setQuickOpen(false), 260);
  };

  // Cart icon click → go to /cart page
  const handleCartClick = () => {
    setQuickOpen(false);
    router.push('/cart');
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 100,
      background: PALETTE.darkest,
      borderBottom: `1px solid ${scrolled ? PALETTE.dark : 'transparent'}`,
      boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.35)' : 'none',
      transition: 'border-color 0.3s, box-shadow 0.3s',
      height: 64,
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '0 32px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>

        {/* ── LOGO ─────────────────────────── */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: PALETTE.mid,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: 17, lineHeight: 1 }}>🌿</span>
          </div>
          <span style={{
            color: PALETTE.light,
            fontFamily: "'Georgia', serif",
            fontSize: 20, fontWeight: 700,
            letterSpacing: 2.5, textTransform: 'uppercase',
          }}>
            VERDA
          </span>
        </Link>

        {/* ── NAV LINKS + CART ─────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>

          {['Shop', 'Collections', 'About'].map((item) => (
            <Link
              key={item}
              href={item === 'Shop' ? '/' : '#'}
              style={{
                color: PALETTE.mid, textDecoration: 'none',
                fontSize: 12, letterSpacing: 2, textTransform: 'uppercase',
                opacity: 0.8, transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.8')}
            >
              {item}
            </Link>
          ))}

          {/* ── CART ZONE ── hover = quick view, click = /cart ── */}
          <div
            style={{ position: 'relative' }}
            onMouseEnter={openQuick}
            onMouseLeave={closeQuick}
          >
            {/* Cart button — clicking always goes to /cart */}
            <button
              onClick={handleCartClick}
              title="Go to cart"
              style={{
                background: quickOpen ? `${PALETTE.dark}88` : 'transparent',
                border: `1px solid ${quickOpen ? PALETTE.mid : PALETTE.dark}`,
                borderRadius: 10,
                width: 44, height: 44,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                color: PALETTE.light,
                fontSize: 18,
                position: 'relative',
                transition: 'border-color 0.2s, background 0.2s',
              }}
            >
              <ShoppingCartOutlined />

              {/* Animated count badge */}
              <AnimatePresence mode="wait">
                {itemCount > 0 && (
                  <motion.span
                    ref={badgeRef}
                    key={itemCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    style={{
                      position: 'absolute',
                      top: -8, right: -8,
                      background: PALETTE.mid,
                      color: PALETTE.darkest,
                      fontSize: 10, fontWeight: 800,
                      width: 20, height: 20,
                      borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: `2px solid ${PALETTE.darkest}`,
                      pointerEvents: 'none',
                    }}
                  >
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Small hover hint shown when cart has items but drawer is closed */}
            <AnimatePresence>
              {!quickOpen && itemCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 6 }}
                  style={{
                    position: 'absolute',
                    top: '50%', right: 52,
                    transform: 'translateY(-50%)',
                    background: `${PALETTE.dark}cc`,
                    border: `1px solid ${PALETTE.dark}`,
                    borderRadius: 6,
                    padding: '3px 9px',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                  }}
                >
                  <span style={{ color: `${PALETTE.light}bb`, fontSize: 10, letterSpacing: 0.4 }}>
                    <EyeOutlined style={{ marginRight: 4 }} />
                    Hover to preview
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── QUICK-VIEW DRAWER ─────────────── */}
            <AnimatePresence>
              {quickOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.97 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  onMouseEnter={openQuick}
                  onMouseLeave={closeQuick}
                  style={{
                    position: 'absolute',
                    top: 52, right: 0,
                    width: 348,
                    background: PALETTE.darkest,
                    border: `1px solid ${PALETTE.dark}`,
                    borderRadius: 18,
                    overflow: 'hidden',
                    boxShadow: '0 24px 60px rgba(0,0,0,0.55)',
                    zIndex: 200,
                  }}
                >
                  {/* Header */}
                  <div style={{
                    padding: '14px 18px 12px',
                    borderBottom: `1px solid ${PALETTE.dark}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <ShoppingCartOutlined style={{ color: PALETTE.mid, fontSize: 15 }} />
                      <span style={{
                        color: PALETTE.light,
                        fontFamily: "'Georgia', serif",
                        fontSize: 14, fontWeight: 600,
                      }}>
                        Cart Preview
                      </span>
                      {itemCount > 0 && (
                        <span style={{
                          background: `${PALETTE.mid}18`,
                          border: `1px solid ${PALETTE.dark}`,
                          color: PALETTE.mid,
                          fontSize: 10, fontWeight: 700,
                          padding: '1px 8px', borderRadius: 100,
                        }}>
                          {itemCount} item{itemCount !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setQuickOpen(false)}
                      style={{
                        background: 'transparent', border: 'none',
                        color: `${PALETTE.mid}55`, cursor: 'pointer', fontSize: 13, padding: 4,
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = PALETTE.mid)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = `${PALETTE.mid}55`)}
                    >
                      <CloseOutlined />
                    </button>
                  </div>

                  {/* Empty state */}
                  {cart.length === 0 && (
                    <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                      <div style={{ fontSize: 38, marginBottom: 10 }}>🛒</div>
                      <p style={{ color: `${PALETTE.mid}77`, fontSize: 14, margin: '0 0 16px' }}>
                        Your cart is empty
                      </p>
                      <Link href="/" style={{ textDecoration: 'none' }}>
                        <button
                          onClick={() => setQuickOpen(false)}
                          style={{
                            background: `${PALETTE.dark}55`,
                            border: `1px solid ${PALETTE.dark}`,
                            color: PALETTE.mid,
                            padding: '8px 22px', borderRadius: 8,
                            cursor: 'pointer', fontSize: 13,
                            fontFamily: "'Georgia', serif",
                          }}
                        >
                          Browse Products
                        </button>
                      </Link>
                    </div>
                  )}

                  {/* Item list */}
                  {cart.length > 0 && (
                    <div style={{
                      maxHeight: 300, overflowY: 'auto',
                      padding: '10px 12px',
                      display: 'flex', flexDirection: 'column', gap: 8,
                    }}>
                      <AnimatePresence>
                        {cart.map((item) => (
                          <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -16 }}
                            transition={{ duration: 0.2 }}
                            style={{
                              background: lastAdded === item.id
                                ? `${PALETTE.mid}18` : `${PALETTE.dark}20`,
                              border: `1px solid ${lastAdded === item.id ? PALETTE.mid : PALETTE.dark}`,
                              borderRadius: 12,
                              padding: '10px 12px',
                              display: 'flex', alignItems: 'center', gap: 10,
                              transition: 'border-color 0.4s, background 0.4s',
                              position: 'relative',
                            }}
                          >
                            {/* NEW tag */}
                            {lastAdded === item.id && (
                              <span style={{
                                position: 'absolute', top: -8, left: 10,
                                background: PALETTE.mid, color: PALETTE.darkest,
                                fontSize: 8, fontWeight: 800,
                                padding: '1px 6px', borderRadius: 4, letterSpacing: 0.5,
                              }}>
                                NEW
                              </span>
                            )}

                            {/* Thumbnail */}
                            <div style={{
                              background: '#fff', borderRadius: 8,
                              width: 42, height: 42, flexShrink: 0,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                              <img
                                src={item.image} alt={item.title}
                                style={{ maxWidth: 32, maxHeight: 32, objectFit: 'contain' }}
                              />
                            </div>

                            {/* Title + price + qty */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{
                                color: PALETTE.light, fontSize: 11, fontWeight: 600,
                                margin: '0 0 2px',
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                              }}>
                                {item.title}
                              </p>
                              <p style={{ color: `${PALETTE.mid}88`, fontSize: 11, margin: '0 0 5px' }}>
                                ${item.price} each
                              </p>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                <button
                                  onClick={(e) => { e.stopPropagation(); decreaseQty(item.id); }}
                                  style={{
                                    width: 20, height: 20, borderRadius: 5,
                                    background: `${PALETTE.dark}55`,
                                    border: `1px solid ${PALETTE.dark}`,
                                    color: PALETTE.mid, cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  }}
                                >
                                  <MinusOutlined style={{ fontSize: 8 }} />
                                </button>
                                <span style={{
                                  color: PALETTE.light, fontSize: 12, fontWeight: 700,
                                  minWidth: 16, textAlign: 'center',
                                }}>
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={(e) => { e.stopPropagation(); increaseQty(item.id); }}
                                  style={{
                                    width: 20, height: 20, borderRadius: 5,
                                    background: `${PALETTE.dark}55`,
                                    border: `1px solid ${PALETTE.dark}`,
                                    color: PALETTE.mid, cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  }}
                                >
                                  <PlusOutlined style={{ fontSize: 8 }} />
                                </button>
                              </div>
                            </div>

                            {/* Subtotal + remove */}
                            <div style={{
                              display: 'flex', flexDirection: 'column',
                              alignItems: 'flex-end', gap: 8, flexShrink: 0,
                            }}>
                              <span style={{ color: PALETTE.mid, fontWeight: 700, fontSize: 13 }}>
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                              <button
                                onClick={(e) => { e.stopPropagation(); removeFromCart(item.id); }}
                                style={{
                                  background: 'transparent', border: 'none',
                                  color: '#ef444455', cursor: 'pointer', fontSize: 12,
                                  padding: 0, transition: 'color 0.2s',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = '#ef444455')}
                              >
                                <DeleteOutlined />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Footer */}
                  {cart.length > 0 && (
                    <div style={{
                      borderTop: `1px solid ${PALETTE.dark}`,
                      padding: '14px 16px',
                      display: 'flex', flexDirection: 'column', gap: 10,
                    }}>
                      {/* Subtotal row */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{
                          color: `${PALETTE.light}77`,
                          fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase',
                        }}>
                          Subtotal
                        </span>
                        <span style={{
                          color: PALETTE.mid, fontSize: 22, fontWeight: 700,
                          fontFamily: "'Georgia', serif",
                        }}>
                          ${total.toFixed(2)}
                        </span>
                      </div>

                      {/* Go to cart CTA */}
                      <Link href="/cart" style={{ textDecoration: 'none' }}>
                        <button
                          onClick={() => setQuickOpen(false)}
                          style={{
                            width: '100%',
                            background: PALETTE.mid,
                            border: 'none',
                            color: PALETTE.darkest,
                            fontWeight: 700, fontSize: 14,
                            padding: '13px 0', borderRadius: 10,
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            fontFamily: "'Georgia', serif", letterSpacing: 0.5,
                            transition: 'opacity 0.2s',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.88')}
                          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                        >
                          <ShoppingCartOutlined />
                          Go to Cart · Checkout <ArrowRightOutlined />
                        </button>
                      </Link>

                      {/* Continue shopping */}
                      <button
                        onClick={() => setQuickOpen(false)}
                        style={{
                          width: '100%',
                          background: 'transparent',
                          border: `1px solid ${PALETTE.dark}`,
                          color: `${PALETTE.mid}88`, fontSize: 13,
                          padding: '9px 0', borderRadius: 10,
                          cursor: 'pointer', fontFamily: "'Georgia', serif",
                          transition: 'border-color 0.2s, color 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = PALETTE.mid;
                          e.currentTarget.style.color = PALETTE.mid;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = PALETTE.dark;
                          e.currentTarget.style.color = `${PALETTE.mid}88`;
                        }}
                      >
                        Continue Shopping
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
}