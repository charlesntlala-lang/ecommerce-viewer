'use client';

import { useEffect, useRef, useState } from 'react';
import { useCart } from '@/app/context/CartContext';
import { Button, Steps, Tag, Input, Radio } from 'antd';
import {
  ShoppingCartOutlined,
  UserOutlined,
  CreditCardOutlined,
  FileTextOutlined,
  CheckCircleFilled,
  DeleteOutlined,
  PlusOutlined,
  MinusOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  WhatsAppOutlined,
} from '@ant-design/icons';
import { gsap } from 'gsap';

const PALETTE = {
  darkest: '#132a13',
  dark: '#31572c',
  mid: '#90a955',
  light: '#ecf39e',
};

type StepKey = 'cart' | 'details' | 'payment' | 'review' | 'success';
type PaymentMethod = 'mpesa' | 'cod';

const STEPS: { key: StepKey; label: string; icon: React.ReactNode }[] = [
  { key: 'cart', label: 'Cart', icon: <ShoppingCartOutlined /> },
  { key: 'details', label: 'Details', icon: <UserOutlined /> },
  { key: 'payment', label: 'Payment', icon: <CreditCardOutlined /> },
  { key: 'review', label: 'Review', icon: <FileTextOutlined /> },
];

const stepIndex: Record<StepKey, number> = {
  cart: 0, details: 1, payment: 2, review: 3, success: 4,
};

export default function CartPage() {
  const { cart, removeFromCart, increaseQty, decreaseQty } = useCart();

  const [step, setStep] = useState<StepKey>('cart');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [payment, setPayment] = useState<PaymentMethod>('mpesa');

  const panelRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const isValidPhone = (num: string) => /^\+266\d{8}$/.test(num);

  // Animate panel on step change
  useEffect(() => {
    if (!panelRef.current) return;
    gsap.fromTo(
      panelRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
    );
  }, [step]);

  // Success animation
  useEffect(() => {
    if (step !== 'success' || !successRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.success-icon', {
        scale: 0,
        rotation: -180,
        duration: 0.7,
        ease: 'back.out(1.7)',
      });
      gsap.from('.success-text', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        delay: 0.4,
        stagger: 0.12,
        ease: 'power2.out',
      });
      gsap.to('.success-ring', {
        scale: 1.6,
        opacity: 0,
        duration: 1.2,
        repeat: 3,
        ease: 'power1.out',
      });
    }, successRef);
    return () => ctx.revert();
  }, [step]);

  const sendOrder = () => {
    const message = `
Hi 👋, I would like to place an order:

👤 Name: ${name}
📞 Phone: ${phone}
🏠 Delivery Address: ${address}
💳 Payment: ${payment === 'mpesa' ? 'M-Pesa' : 'Cash on Delivery'}

🛒 Order Items:
${cart.map((i) => `• ${i.title} (x${i.quantity}) = $${(i.price * i.quantity).toFixed(2)}`).join('\n')}

💰 Total: $${total.toFixed(2)}

Please confirm my order 🙏`;

    window.open(
      `https://wa.me/26669256516?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  const handleSuccess = () => {
    setStep('success');
    setTimeout(() => {
      sendOrder();
      cart.forEach((item) => removeFromCart(item.id));
      setTimeout(() => { window.location.href = '/'; }, 1800);
    }, 1200);
  };

  const inputStyle = {
    background: `${PALETTE.dark}25`,
    border: `1px solid ${PALETTE.dark}`,
    color: PALETTE.light,
    borderRadius: 10,
    padding: '10px 14px',
    width: '100%',
    fontSize: 15,
    outline: 'none',
    fontFamily: "'Georgia', serif",
    transition: 'border-color 0.2s',
  } as React.CSSProperties;

  return (
    <div style={{
      background: PALETTE.darkest,
      minHeight: '100vh',
      padding: '40px 20px 80px',
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>

        {/* ── HEADER ─────────────────────────────── */}
        {step !== 'success' && (
          <div style={{ marginBottom: 40 }}>
            <h1 style={{
              color: PALETTE.light,
              fontFamily: "'Georgia', serif",
              fontSize: 28,
              fontWeight: 400,
              margin: '0 0 8px',
            }}>
              Your Order
            </h1>
            <p style={{ color: `${PALETTE.mid}88`, fontSize: 13, margin: '0 0 32px' }}>
              {cart.length} item{cart.length !== 1 ? 's' : ''} · ${total.toFixed(2)} total
            </p>

            {/* Step indicator */}
            <div style={{ display: 'flex', gap: 0 }}>
              {STEPS.map((s, i) => {
                const current = stepIndex[step];
                const isDone = i < current;
                const isActive = i === current;
                return (
                  <div key={s.key} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                    <div style={{ textAlign: 'center', flex: 'none' }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: isDone ? PALETTE.mid : isActive ? `${PALETTE.dark}88` : `${PALETTE.dark}33`,
                        border: `2px solid ${isActive ? PALETTE.mid : isDone ? PALETTE.mid : PALETTE.dark}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: isDone ? PALETTE.darkest : isActive ? PALETTE.mid : `${PALETTE.mid}55`,
                        fontSize: 14,
                        transition: 'all 0.4s',
                        margin: '0 auto 6px',
                      }}>
                        {isDone ? <CheckCircleFilled /> : s.icon}
                      </div>
                      <span style={{
                        fontSize: 11, letterSpacing: 1,
                        textTransform: 'uppercase',
                        color: isActive ? PALETTE.mid : `${PALETTE.mid}55`,
                      }}>
                        {s.label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div style={{
                        flex: 1,
                        height: 2,
                        background: i < current ? PALETTE.mid : `${PALETTE.dark}55`,
                        margin: '0 6px',
                        marginBottom: 22,
                        transition: 'background 0.4s',
                      }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── PANEL ──────────────────────────────── */}
        <div ref={panelRef}>

          {/* ── CART STEP ── */}
          {step === 'cart' && (
            <div>
              {cart.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '80px 20px',
                  background: `${PALETTE.dark}22`,
                  borderRadius: 20,
                  border: `1px solid ${PALETTE.dark}`,
                }}>
                  <div style={{ fontSize: 52, marginBottom: 16 }}>🌿</div>
                  <p style={{ color: `${PALETTE.light}88`, fontSize: 18, marginBottom: 24 }}>
                    Your cart is empty
                  </p>
                  <Button
                    onClick={() => window.location.href = '/'}
                    style={{
                      background: PALETTE.mid,
                      border: 'none',
                      color: PALETTE.darkest,
                      fontWeight: 700,
                      height: 44,
                      padding: '0 28px',
                      borderRadius: 10,
                    }}
                  >
                    Browse Products
                  </Button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {cart.map((item) => (
                    <div key={item.id} style={{
                      background: `${PALETTE.dark}22`,
                      border: `1px solid ${PALETTE.dark}`,
                      borderRadius: 16,
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                    }}>
                      {/* Image */}
                      <div style={{
                        background: '#fff',
                        borderRadius: 10,
                        padding: 8,
                        width: 64, height: 64,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <img src={item.image || ''} style={{ maxWidth: 48, maxHeight: 48, objectFit: 'contain' }} />
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          color: PALETTE.light, fontSize: 14, fontWeight: 600,
                          margin: '0 0 4px',
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>
                          {item.title}
                        </p>
                        <p style={{ color: `${PALETTE.mid}99`, fontSize: 13, margin: 0 }}>
                          ${item.price} each
                        </p>
                      </div>

                      {/* Qty controls */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                        <button
                          onClick={() => decreaseQty(item.id)}
                          style={{
                            width: 28, height: 28, borderRadius: 8,
                            background: `${PALETTE.dark}55`,
                            border: `1px solid ${PALETTE.dark}`,
                            color: PALETTE.mid, cursor: 'pointer', fontSize: 14,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          <MinusOutlined style={{ fontSize: 10 }} />
                        </button>
                        <span style={{ color: PALETTE.light, fontWeight: 700, minWidth: 20, textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => increaseQty(item.id)}
                          style={{
                            width: 28, height: 28, borderRadius: 8,
                            background: `${PALETTE.dark}55`,
                            border: `1px solid ${PALETTE.dark}`,
                            color: PALETTE.mid, cursor: 'pointer', fontSize: 14,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          <PlusOutlined style={{ fontSize: 10 }} />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <span style={{ color: PALETTE.mid, fontWeight: 700, fontSize: 15, minWidth: 60, textAlign: 'right', flexShrink: 0 }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>

                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{
                          background: 'transparent', border: 'none',
                          color: `#ef444488`, cursor: 'pointer', fontSize: 16,
                          padding: 4, flexShrink: 0,
                          transition: 'color 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#ef444488')}
                      >
                        <DeleteOutlined />
                      </button>
                    </div>
                  ))}

                  {/* Order total */}
                  <div style={{
                    background: `${PALETTE.dark}33`,
                    border: `1px solid ${PALETTE.dark}`,
                    borderRadius: 16,
                    padding: '18px 24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 8,
                  }}>
                    <span style={{ color: `${PALETTE.light}88`, fontSize: 14 }}>Order Total</span>
                    <span style={{ color: PALETTE.mid, fontSize: 24, fontWeight: 700 }}>
                      ${total.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => setStep('details')}
                    style={{
                      width: '100%',
                      background: PALETTE.mid,
                      border: 'none',
                      color: PALETTE.darkest,
                      fontWeight: 700,
                      fontSize: 16,
                      padding: '16px 0',
                      borderRadius: 14,
                      cursor: 'pointer',
                      marginTop: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      fontFamily: "'Georgia', serif",
                      letterSpacing: 0.5,
                    }}
                  >
                    Continue to Details <ArrowRightOutlined />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── DETAILS STEP ── */}
          {step === 'details' && (
            <div style={{
              background: `${PALETTE.dark}22`,
              border: `1px solid ${PALETTE.dark}`,
              borderRadius: 20,
              padding: '32px 28px',
            }}>
              <h2 style={{ color: PALETTE.light, fontFamily: "'Georgia', serif", fontWeight: 400, fontSize: 22, margin: '0 0 24px' }}>
                Delivery Details
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ color: `${PALETTE.mid}`, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
                    Full Name
                  </label>
                  <input
                    style={inputStyle}
                    placeholder="e.g. Thabo Mokoena"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={(e) => (e.target.style.borderColor = PALETTE.mid)}
                    onBlur={(e) => (e.target.style.borderColor = PALETTE.dark)}
                  />
                </div>

                <div>
                  <label style={{ color: `${PALETTE.mid}`, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
                    Phone Number
                  </label>
                  <input
                    style={inputStyle}
                    placeholder="+266XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onFocus={(e) => (e.target.style.borderColor = PALETTE.mid)}
                    onBlur={(e) => (e.target.style.borderColor = PALETTE.dark)}
                  />
                  <p style={{ color: `${PALETTE.mid}66`, fontSize: 11, margin: '6px 0 0', letterSpacing: 0.5 }}>
                    Lesotho format: +266 followed by 8 digits
                  </p>
                </div>

                <div>
                  <label style={{ color: `${PALETTE.mid}`, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
                    Delivery Address
                  </label>
                  <textarea
                    style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }}
                    placeholder="Street, area, landmark..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    onFocus={(e) => (e.target.style.borderColor = PALETTE.mid)}
                    onBlur={(e) => (e.target.style.borderColor = PALETTE.dark)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
                <button
                  onClick={() => setStep('cart')}
                  style={{
                    flex: 1,
                    background: `${PALETTE.dark}33`,
                    border: `1px solid ${PALETTE.dark}`,
                    color: PALETTE.mid,
                    padding: '14px 0',
                    borderRadius: 12,
                    cursor: 'pointer',
                    fontSize: 14,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    fontFamily: "'Georgia', serif",
                  }}
                >
                  <ArrowLeftOutlined /> Back
                </button>
                <button
                  onClick={() => {
                    if (!name || !phone || !address) return alert('Please fill all fields');
                    if (!isValidPhone(phone)) return alert('Phone must be +266 followed by 8 digits');
                    setStep('payment');
                  }}
                  style={{
                    flex: 2,
                    background: PALETTE.mid,
                    border: 'none',
                    color: PALETTE.darkest,
                    fontWeight: 700,
                    padding: '14px 0',
                    borderRadius: 12,
                    cursor: 'pointer',
                    fontSize: 15,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    fontFamily: "'Georgia', serif",
                  }}
                >
                  Next: Payment <ArrowRightOutlined />
                </button>
              </div>
            </div>
          )}

          {/* ── PAYMENT STEP ── */}
          {step === 'payment' && (
            <div style={{
              background: `${PALETTE.dark}22`,
              border: `1px solid ${PALETTE.dark}`,
              borderRadius: 20,
              padding: '32px 28px',
            }}>
              <h2 style={{ color: PALETTE.light, fontFamily: "'Georgia', serif", fontWeight: 400, fontSize: 22, margin: '0 0 24px' }}>
                Payment Method
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { key: 'mpesa', icon: '💳', label: 'M-Pesa', sub: 'Pay via mobile money' },
                  { key: 'cod', icon: '💵', label: 'Cash on Delivery', sub: 'Pay when your order arrives' },
                ].map((opt) => (
                  <div
                    key={opt.key}
                    onClick={() => setPayment(opt.key as PaymentMethod)}
                    style={{
                      background: payment === opt.key ? `${PALETTE.mid}18` : `${PALETTE.dark}22`,
                      border: `2px solid ${payment === opt.key ? PALETTE.mid : PALETTE.dark}`,
                      borderRadius: 14,
                      padding: '18px 20px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      transition: 'all 0.25s',
                    }}
                  >
                    <span style={{ fontSize: 28 }}>{opt.icon}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: PALETTE.light, fontWeight: 600, margin: 0, fontSize: 15 }}>{opt.label}</p>
                      <p style={{ color: `${PALETTE.mid}88`, fontSize: 12, margin: 0 }}>{opt.sub}</p>
                    </div>
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%',
                      border: `2px solid ${payment === opt.key ? PALETTE.mid : PALETTE.dark}`,
                      background: payment === opt.key ? PALETTE.mid : 'transparent',
                      transition: 'all 0.2s',
                    }} />
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
                <button
                  onClick={() => setStep('details')}
                  style={{
                    flex: 1, background: `${PALETTE.dark}33`,
                    border: `1px solid ${PALETTE.dark}`, color: PALETTE.mid,
                    padding: '14px 0', borderRadius: 12, cursor: 'pointer', fontSize: 14,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    fontFamily: "'Georgia', serif",
                  }}
                >
                  <ArrowLeftOutlined /> Back
                </button>
                <button
                  onClick={() => setStep('review')}
                  style={{
                    flex: 2, background: PALETTE.mid, border: 'none',
                    color: PALETTE.darkest, fontWeight: 700, padding: '14px 0',
                    borderRadius: 12, cursor: 'pointer', fontSize: 15,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    fontFamily: "'Georgia', serif",
                  }}
                >
                  Review Order <ArrowRightOutlined />
                </button>
              </div>
            </div>
          )}

          {/* ── REVIEW STEP ── */}
          {step === 'review' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h2 style={{ color: PALETTE.light, fontFamily: "'Georgia', serif", fontWeight: 400, fontSize: 22, margin: 0 }}>
                Order Summary
              </h2>

              {/* Customer info */}
              <div style={{
                background: `${PALETTE.dark}22`,
                border: `1px solid ${PALETTE.dark}`,
                borderRadius: 16,
                padding: '20px 24px',
              }}>
                <p style={{ color: `${PALETTE.mid}`, fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', margin: '0 0 12px' }}>
                  Delivery Info
                </p>
                {[
                  { label: 'Name', value: name },
                  { label: 'Phone', value: phone },
                  { label: 'Address', value: address },
                  { label: 'Payment', value: payment === 'mpesa' ? 'M-Pesa 💳' : 'Cash on Delivery 💵' },
                ].map((row) => (
                  <div key={row.label} style={{
                    display: 'flex', justifyContent: 'space-between',
                    padding: '7px 0',
                    borderBottom: `1px solid ${PALETTE.dark}44`,
                  }}>
                    <span style={{ color: `${PALETTE.mid}88`, fontSize: 13 }}>{row.label}</span>
                    <span style={{ color: PALETTE.light, fontSize: 13, fontWeight: 600 }}>{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {cart.map((item) => (
                  <div key={item.id} style={{
                    background: `${PALETTE.dark}22`,
                    border: `1px solid ${PALETTE.dark}`,
                    borderRadius: 12,
                    padding: '12px 16px',
                    display: 'flex', alignItems: 'center', gap: 12,
                  }}>
                    <div style={{
                      background: '#fff', borderRadius: 8,
                      width: 44, height: 44, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <img src={item.image} style={{ maxWidth: 36, maxHeight: 36, objectFit: 'contain' }} />
                    </div>
                    <span style={{ flex: 1, color: `${PALETTE.light}cc`, fontSize: 13 }}>
                      {item.title.slice(0, 44)}…
                    </span>
                    <span style={{ color: `${PALETTE.mid}88`, fontSize: 12 }}>×{item.quantity}</span>
                    <span style={{ color: PALETTE.mid, fontWeight: 700, fontSize: 14 }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div style={{
                background: `${PALETTE.dark}44`,
                border: `1px solid ${PALETTE.mid}55`,
                borderRadius: 16,
                padding: '20px 24px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ color: PALETTE.light, fontSize: 16 }}>Total Amount</span>
                <span style={{ color: PALETTE.mid, fontSize: 28, fontWeight: 700 }}>${total.toFixed(2)}</span>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => setStep('payment')}
                  style={{
                    flex: 1, background: `${PALETTE.dark}33`,
                    border: `1px solid ${PALETTE.dark}`, color: PALETTE.mid,
                    padding: '14px 0', borderRadius: 12, cursor: 'pointer', fontSize: 14,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    fontFamily: "'Georgia', serif",
                  }}
                >
                  <ArrowLeftOutlined /> Back
                </button>
                <button
                  onClick={handleSuccess}
                  style={{
                    flex: 2, background: '#25D366', border: 'none',
                    color: '#fff', fontWeight: 700, padding: '14px 0',
                    borderRadius: 12, cursor: 'pointer', fontSize: 15,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    fontFamily: "'Georgia', serif",
                  }}
                >
                  <WhatsAppOutlined style={{ fontSize: 18 }} />
                  Confirm & Send via WhatsApp
                </button>
              </div>
            </div>
          )}

          {/* ── SUCCESS STEP ── */}
          {step === 'success' && (
            <div
              ref={successRef}
              style={{
                textAlign: 'center',
                padding: '80px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 16,
              }}
            >
              {/* Animated ring + icon */}
              <div style={{ position: 'relative', width: 100, height: 100 }}>
                <div className="success-ring" style={{
                  position: 'absolute', inset: 0,
                  borderRadius: '50%',
                  background: `${PALETTE.mid}33`,
                  transform: 'scale(1)',
                }} />
                <div className="success-icon" style={{
                  position: 'relative', zIndex: 1,
                  width: 100, height: 100, borderRadius: '50%',
                  background: PALETTE.mid,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <CheckCircleFilled style={{ color: PALETTE.darkest, fontSize: 44 }} />
                </div>
              </div>

              <h2 className="success-text" style={{
                color: PALETTE.light,
                fontFamily: "'Georgia', serif",
                fontSize: 28, fontWeight: 400,
                margin: 0,
              }}>
                Order Placed!
              </h2>
              <p className="success-text" style={{ color: `${PALETTE.mid}aa`, fontSize: 15, margin: 0 }}>
                Sending your order to WhatsApp...
              </p>
              <p className="success-text" style={{ color: `${PALETTE.mid}66`, fontSize: 13 }}>
                Redirecting to home in a moment
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}