"use client";

import { useEffect, useRef, useState } from "react";
import { Badge, Button, Card, Col, Row, Spin, Tag, Typography } from "antd";
import {
  ShoppingCartOutlined,
  StarFilled,
  FireOutlined,
  ArrowRightOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const { Title, Text } = Typography;

type Product = {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
  rating: { rate: number; count: number };
};

const PALETTE = {
  darkest: "#132a13",
  dark: "#31572c",
  mid: "#90a955",
  light: "#ecf39e",
};

const categoryLabels: Record<string, string> = {
  "men's clothing": "Men's",
  "women's clothing": "Women's",
  electronics: "Electronics",
  jewelery: "Jewelry",
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [cart, setCart] = useState<number[]>([]);

  const heroRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((r) => r.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  // Hero entrance animation
  useEffect(() => {
    if (!heroRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".hero-headline", {
        y: 80,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.12,
      });
      gsap.from(".hero-sub", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        delay: 0.5,
        ease: "power2.out",
      });
      gsap.from(".hero-cta", {
        scale: 0.85,
        opacity: 0,
        duration: 0.8,
        delay: 0.75,
        ease: "back.out(1.7)",
      });
      gsap.from(".hero-badge", {
        x: 60,
        opacity: 0,
        duration: 0.9,
        delay: 0.9,
        ease: "power2.out",
      });

      // Floating orbs
      gsap.to(".orb-1", {
        y: -28,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".orb-2", {
        y: 22,
        x: -15,
        duration: 4.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.8,
      });
      gsap.to(".orb-3", {
        y: -18,
        x: 10,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.5,
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  // Marquee scroll
  useEffect(() => {
    if (!marqueeRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(".marquee-track", {
        xPercent: -50,
        duration: 22,
        repeat: -1,
        ease: "linear",
      });
    }, marqueeRef);
    return () => ctx.revert();
  }, []);

  // Banner pop
  useEffect(() => {
    if (!bannerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".promo-card", {
        scrollTrigger: { trigger: bannerRef.current, start: "top 80%" },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
      });
    }, bannerRef);
    return () => ctx.revert();
  }, []);

  // Product cards scroll entrance
  useEffect(() => {
    if (!gridRef.current || loading) return;
    const ctx = gsap.context(() => {
      gsap.from(".product-card", {
        scrollTrigger: { trigger: gridRef.current, start: "top 85%" },
        y: 60,
        opacity: 0,
        duration: 0.7,
        stagger: 0.07,
        ease: "power2.out",
      });
    }, gridRef);
    return () => ctx.revert();
  }, [loading]);

  const addToCart = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    setCart((prev) => [...prev, id]);
    const btn = e.currentTarget as HTMLElement;
    gsap.to(btn, {
      scale: 1.3,
      duration: 0.15,
      yoyo: true,
      repeat: 1,
      ease: "power1.inOut",
    });
  };

  const featured = products.slice(0, 3);
  const rest = products.slice(3);

  return (
    <div style={{ background: PALETTE.darkest, minHeight: "100vh", fontFamily: "'Georgia', serif" }}>

      {/* ── NAVIGATION ─────────────────────────────────── */}

      {/* ── HERO ──────────────────────────────────────── */}
      <div
        ref={heroRef}
        style={{
          minHeight: "88vh",
          background: `radial-gradient(ellipse 80% 70% at 50% 0%, ${PALETTE.dark}55 0%, transparent 70%), ${PALETTE.darkest}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          padding: "80px 40px",
        }}
      >
        {/* Floating orbs */}
        <div className="orb-1" style={{
          position: "absolute", top: "12%", left: "8%",
          width: 280, height: 280, borderRadius: "50%",
          background: `radial-gradient(circle, ${PALETTE.dark}55 0%, transparent 70%)`,
          filter: "blur(2px)",
        }} />
        <div className="orb-2" style={{
          position: "absolute", bottom: "18%", right: "6%",
          width: 380, height: 380, borderRadius: "50%",
          background: `radial-gradient(circle, ${PALETTE.mid}22 0%, transparent 70%)`,
          filter: "blur(4px)",
        }} />
        <div className="orb-3" style={{
          position: "absolute", top: "50%", right: "20%",
          width: 180, height: 180, borderRadius: "50%",
          background: `radial-gradient(circle, ${PALETTE.light}18 0%, transparent 70%)`,
          filter: "blur(2px)",
        }} />

        {/* Grid lines overlay */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.06,
          backgroundImage: `linear-gradient(${PALETTE.mid} 1px, transparent 1px), linear-gradient(90deg, ${PALETTE.mid} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }} />

        {/* Hero content */}
        <div style={{ textAlign: "center", position: "relative", zIndex: 2, maxWidth: 780 }}>
          <div className="hero-headline" style={{
            display: "inline-block",
            background: `${PALETTE.dark}55`,
            border: `1px solid ${PALETTE.dark}`,
            borderRadius: 100,
            padding: "6px 20px",
            marginBottom: 28,
          }}>
            <Text style={{ color: PALETTE.mid, fontSize: 12, letterSpacing: 3, textTransform: "uppercase" }}>
              🌿 New Arrivals · Spring 2025
            </Text>
          </div>

          <Title className="hero-headline" style={{
            color: PALETTE.light,
            fontSize: "clamp(44px, 7vw, 86px)",
            margin: "0 0 8px",
            fontFamily: "'Georgia', serif",
            lineHeight: 1.05,
            fontWeight: 400,
          }}>
            Step Into
          </Title>
          <Title className="hero-headline" style={{
            color: PALETTE.mid,
            fontSize: "clamp(44px, 7vw, 86px)",
            margin: "0 0 24px",
            fontFamily: "'Georgia', serif",
            lineHeight: 1.05,
            fontWeight: 700,
          }}>
            Something Real.
          </Title>

          <Text className="hero-sub" style={{
            display: "block",
            color: `${PALETTE.light}99`,
            fontSize: 18,
            maxWidth: 520,
            margin: "0 auto 44px",
            lineHeight: 1.7,
          }}>
            Curated goods for the discerning eye. Premium quality, thoughtfully sourced, delivered to your door.
          </Text>

          <div className="hero-cta" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              size="large"
              icon={<ArrowRightOutlined />}
              iconPosition="end"
              style={{
                background: PALETTE.mid,
                border: "none",
                color: PALETTE.darkest,
                fontWeight: 700,
                height: 52,
                padding: "0 36px",
                borderRadius: 12,
                fontSize: 15,
                letterSpacing: 0.5,
              }}
              onClick={() => gridRef.current?.scrollIntoView({ behavior: "smooth" })}
            >
              Shop Collection
            </Button>
            <Button
              size="large"
              style={{
                background: "transparent",
                border: `1px solid ${PALETTE.dark}`,
                color: PALETTE.light,
                height: 52,
                padding: "0 36px",
                borderRadius: 12,
                fontSize: 15,
              }}
            >
              View Lookbook
            </Button>
          </div>

          {/* Social proof */}
          <div className="hero-badge" style={{
            marginTop: 52,
            display: "flex",
            gap: 36,
            justifyContent: "center",
            flexWrap: "wrap",
          }}>
            {[
              { label: "Happy customers", value: "14,000+" },
              { label: "Premium brands", value: "200+" },
              { label: "Countries shipped", value: "45+" },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <Text style={{ display: "block", color: PALETTE.light, fontSize: 22, fontWeight: 700 }}>{s.value}</Text>
                <Text style={{ color: `${PALETTE.mid}99`, fontSize: 12, letterSpacing: 1, textTransform: "uppercase" }}>{s.label}</Text>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MARQUEE ───────────────────────────────────── */}
      <div
        ref={marqueeRef}
        style={{
          background: PALETTE.mid,
          padding: "14px 0",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        <div className="marquee-track" style={{ display: "inline-block" }}>
          {Array(8).fill(null).map((_, i) => (
            <span key={i} style={{ marginRight: 48, color: PALETTE.darkest, fontWeight: 700, fontSize: 13, letterSpacing: 3, textTransform: "uppercase" }}>
              ✦ Free Shipping Over $75 &nbsp;&nbsp; ✦ New Arrivals Weekly &nbsp;&nbsp; ✦ Verified Reviews &nbsp;&nbsp; ✦ 30-Day Returns
            </span>
          ))}
        </div>
      </div>

      {/* ── PROMO BANNERS ─────────────────────────────── */}
      <div ref={bannerRef} style={{ padding: "64px 40px", maxWidth: 1280, margin: "0 auto" }}>
        <Row gutter={[20, 20]}>
          {[
            { icon: "🔥", tag: "HOT DEAL", title: "Electronics Sale", sub: "Up to 40% off top brands", bg: `${PALETTE.dark}88` },
            { icon: "💎", tag: "EXCLUSIVE", title: "Luxury Jewelry", sub: "New collection is here", bg: `${PALETTE.dark}55` },
            { icon: "⚡", tag: "FLASH", title: "Flash Sale", sub: "48 hours only · Don't miss out", bg: `${PALETTE.dark}70` },
          ].map((b, i) => (
            <Col xs={24} md={8} key={i}>
              <div className="promo-card" style={{
                background: b.bg,
                border: `1px solid ${PALETTE.dark}`,
                borderRadius: 16,
                padding: "32px 28px",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                transition: "transform 0.3s, border-color 0.3s",
              }}
                onMouseEnter={(e) => gsap.to(e.currentTarget, { y: -6, duration: 0.3, borderColor: PALETTE.mid })}
                onMouseLeave={(e) => gsap.to(e.currentTarget, { y: 0, duration: 0.3, borderColor: PALETTE.dark })}
              >
                <div style={{ fontSize: 36, marginBottom: 12 }}>{b.icon}</div>
                <Tag style={{ background: PALETTE.mid, border: "none", color: PALETTE.darkest, fontWeight: 700, fontSize: 10, letterSpacing: 2, marginBottom: 10 }}>
                  {b.tag}
                </Tag>
                <Title level={4} style={{ color: PALETTE.light, margin: "8px 0 4px", fontFamily: "'Georgia', serif" }}>{b.title}</Title>
                <Text style={{ color: `${PALETTE.mid}cc`, fontSize: 13 }}>{b.sub}</Text>
                <div style={{ marginTop: 20 }}>
                  <Text style={{ color: PALETTE.mid, fontSize: 13, letterSpacing: 1 }}>
                    Shop now <ArrowRightOutlined />
                  </Text>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* ── FEATURED SPOTLIGHT ────────────────────────── */}
      {!loading && featured.length > 0 && (
        <div style={{ padding: "0 40px 64px", maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
            <FireOutlined style={{ color: PALETTE.mid, fontSize: 20 }} />
            <Title level={2} style={{ color: PALETTE.light, margin: 0, fontFamily: "'Georgia', serif", fontWeight: 400 }}>
              Staff Picks
            </Title>
            <div style={{ flex: 1, height: 1, background: `${PALETTE.dark}88`, marginLeft: 12 }} />
          </div>
          <Row gutter={[20, 20]}>
            {featured.map((p, i) => (
              <Col xs={24} md={8} key={p.id}>
                <a href={`/products/${p.id}`} style={{ textDecoration: "none", display: "block" }}>
                  <div style={{
                    background: `${PALETTE.dark}33`,
                    border: `1px solid ${PALETTE.dark}`,
                    borderRadius: 20,
                    overflow: "hidden",
                    position: "relative",
                    transition: "all 0.3s",
                  }}
                    onMouseEnter={(e) => {
                      gsap.to(e.currentTarget, { y: -8, duration: 0.3, ease: "power2.out" });
                      (e.currentTarget.querySelector(".hover-overlay") as HTMLElement)!.style.opacity = "1";
                    }}
                    onMouseLeave={(e) => {
                      gsap.to(e.currentTarget, { y: 0, duration: 0.3 });
                      (e.currentTarget.querySelector(".hover-overlay") as HTMLElement)!.style.opacity = "0";
                    }}
                  >
                    {i === 0 && (
                      <div style={{
                        position: "absolute", top: 16, left: 16, zIndex: 2,
                        background: PALETTE.mid, borderRadius: 8, padding: "4px 12px",
                      }}>
                        <Text style={{ color: PALETTE.darkest, fontWeight: 700, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase" }}>
                          ✦ Editor's Choice
                        </Text>
                      </div>
                    )}
                    {/* Image area */}
                    <div style={{ background: "#fff", padding: "40px 32px", display: "flex", justifyContent: "center", alignItems: "center", height: 240 }}>
                      <img src={p.image} alt={p.title} style={{ maxHeight: 160, maxWidth: "100%", objectFit: "contain", transition: "transform 0.4s" }} />
                    </div>
                    {/* Hover overlay */}
                    <div className="hover-overlay" style={{
                      position: "absolute", inset: 0, background: `${PALETTE.darkest}88`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      opacity: 0, transition: "opacity 0.3s",
                    }}>
                      <Button
                        icon={<ShoppingCartOutlined />}
                        size="large"
                        style={{ background: PALETTE.mid, border: "none", color: PALETTE.darkest, fontWeight: 700, borderRadius: 12 }}
                        onClick={(e) => addToCart(p.id, e)}
                      >
                        Quick Add
                      </Button>
                    </div>

                    <div style={{ padding: "20px 24px 24px" }}>
                      <Tag style={{ background: `${PALETTE.dark}55`, border: `1px solid ${PALETTE.dark}`, color: PALETTE.mid, fontSize: 11, marginBottom: 8 }}>
                        {categoryLabels[p.category] ?? p.category}
                      </Tag>
                      <Text style={{ display: "block", color: PALETTE.light, fontWeight: 600, fontSize: 14, marginBottom: 10, lineHeight: 1.4 }}>
                        {p.title.length > 52 ? p.title.slice(0, 52) + "…" : p.title}
                      </Text>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Text style={{ color: PALETTE.mid, fontSize: 20, fontWeight: 700 }}>${p.price}</Text>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <StarFilled style={{ color: "#fbbf24", fontSize: 12 }} />
                          <Text style={{ color: `${PALETTE.light}99`, fontSize: 12 }}>{p.rating?.rate} ({p.rating?.count})</Text>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </Col>
            ))}
          </Row>
        </div>
      )}

      {/* ── SECTION DIVIDER ────────────────────────────── */}
      <div style={{ padding: "0 40px 64px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{
          background: `linear-gradient(135deg, ${PALETTE.dark}55 0%, ${PALETTE.darkest} 100%)`,
          border: `1px solid ${PALETTE.dark}`,
          borderRadius: 20,
          padding: "48px 52px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 24,
        }}>
          <div>
            <Title level={2} style={{ color: PALETTE.light, margin: "0 0 8px", fontFamily: "'Georgia', serif", fontWeight: 400 }}>
              The Full Collection
            </Title>
            <Text style={{ color: `${PALETTE.mid}99`, fontSize: 15 }}>
              {products.length} premium products, handpicked for quality
            </Text>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {Object.values(categoryLabels).map((cat) => (
              <Tag key={cat} style={{
                background: `${PALETTE.dark}44`,
                border: `1px solid ${PALETTE.dark}`,
                color: PALETTE.mid,
                cursor: "pointer",
                padding: "6px 16px",
                borderRadius: 100,
                fontSize: 13,
              }}>
                {cat}
              </Tag>
            ))}
          </div>
        </div>
      </div>

      {/* ── PRODUCT GRID ──────────────────────────────── */}
      <div ref={gridRef} style={{ padding: "0 40px 80px", maxWidth: 1280, margin: "0 auto" }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
            <Spin size="large" style={{ color: PALETTE.mid }} />
          </div>
        ) : (
          <Row gutter={[20, 20]}>
            {rest.map((p) => (
              <Col xs={12} sm={8} md={6} key={p.id}>
                <a href={`/products/${p.id}`} style={{ textDecoration: "none", display: "block" }}>
                  <div
                    className="product-card"
                    style={{
                      background: hoveredId === p.id ? `${PALETTE.dark}44` : `${PALETTE.dark}22`,
                      border: `1px solid ${hoveredId === p.id ? PALETTE.mid : PALETTE.dark}`,
                      borderRadius: 16,
                      overflow: "hidden",
                      transition: "border-color 0.3s, background 0.3s",
                      cursor: "pointer",
                    }}
                    onMouseEnter={() => setHoveredId(p.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <div style={{ background: "#fff", padding: "24px 16px", height: 170, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                      <img
                        src={p.image}
                        alt={p.title}
                        style={{
                          maxHeight: 120, maxWidth: "100%", objectFit: "contain",
                          transform: hoveredId === p.id ? "scale(1.08)" : "scale(1)",
                          transition: "transform 0.4s ease",
                        }}
                      />
                    </div>
                    <div style={{ padding: "14px 16px 16px" }}>
                      <Text style={{ display: "block", color: `${PALETTE.light}bb`, fontSize: 12, marginBottom: 6, lineHeight: 1.4 }}>
                        {p.title.length > 42 ? p.title.slice(0, 42) + "…" : p.title}
                      </Text>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                        <Text style={{ color: PALETTE.mid, fontWeight: 700, fontSize: 16 }}>${p.price}</Text>
                        <button
                          onClick={(e) => addToCart(p.id, e)}
                          style={{
                            background: hoveredId === p.id ? PALETTE.mid : "transparent",
                            border: `1px solid ${PALETTE.dark}`,
                            borderRadius: 8,
                            padding: "5px 10px",
                            cursor: "pointer",
                            transition: "background 0.3s",
                            color: hoveredId === p.id ? PALETTE.darkest : PALETTE.mid,
                            fontSize: 13,
                          }}
                        >
                          <ShoppingCartOutlined />
                        </button>
                      </div>
                    </div>
                  </div>
                </a>
              </Col>
            ))}
          </Row>
        )}
      </div>

      {/* ── FOOTER ────────────────────────────────────── */}
      <footer style={{
        background: `${PALETTE.dark}33`,
        borderTop: `1px solid ${PALETTE.dark}`,
        padding: "48px 40px",
        textAlign: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: PALETTE.mid, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 14 }}>🌿</span>
          </div>
          <Title level={4} style={{ color: PALETTE.light, margin: 0, fontFamily: "'Georgia', serif", letterSpacing: 2 }}>VERDA</Title>
        </div>
        <Text style={{ color: `${PALETTE.mid}88`, fontSize: 13 }}>
          © 2025 Verda Store · Crafted with care · All rights reserved
        </Text>
      </footer>
    </div>
  );
}