import { AddToCartButton } from '@/app/components/AddToCartButton';
import { BackButton } from '@/app/components/BackButton';
import { Tag } from 'antd';
import {
  CheckCircleFilled,
  StarFilled,
  SafetyCertificateOutlined,
  CarOutlined,
} from '@ant-design/icons';

type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
  category?: string;
  rating?: { rate: number; count: number };
};

async function getProduct(id: string): Promise<Product> {
  const res = await fetch(`https://fakestoreapi.com/products/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch product');
  }

  return res.json();
}

const PALETTE = {
  darkest: '#132a13',
  dark: '#31572c',
  mid: '#90a955',
  light: '#ecf39e',
};

const categoryLabels: Record<string, string> = {
  "men's clothing": "Men's Clothing",
  "women's clothing": "Women's Clothing",
  electronics: 'Electronics',
  jewelery: 'Jewelry',
};

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let product: Product;

  try {
    product = await getProduct(id);
  } catch (error: any) {
    return (
      <div style={{
        padding: 40,
        textAlign: 'center',
        background: PALETTE.darkest,
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
      }}>
        <div style={{ fontSize: 48 }}>🌿</div>
        <h2 style={{ color: PALETTE.light, fontFamily: "'Georgia', serif", fontSize: 24, fontWeight: 400 }}>
          Product not found
        </h2>
        <p style={{ color: `${PALETTE.mid}99`, fontSize: 15 }}>{error.message}</p>
      </div>
    );
  }

  const stars = product.rating?.rate ?? 4;
  const reviewCount = product.rating?.count ?? 0;

  return (
    <div style={{
      background: PALETTE.darkest,
      minHeight: '100vh',
      padding: '32px 24px 80px',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Back Button */}
        <div style={{ marginBottom: 28 }}>
          <BackButton />
        </div>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 32 }}>
          <span style={{ color: `${PALETTE.mid}88`, fontSize: 13, letterSpacing: 0.5 }}>Shop</span>
          <span style={{ color: `${PALETTE.dark}`, fontSize: 13 }}>›</span>
          <span style={{ color: `${PALETTE.mid}88`, fontSize: 13 }}>
            {categoryLabels[product.category ?? ''] ?? product.category}
          </span>
          <span style={{ color: `${PALETTE.dark}`, fontSize: 13 }}>›</span>
          <span style={{ color: PALETTE.mid, fontSize: 13 }}>
            {product.title.slice(0, 28)}…
          </span>
        </div>

        {/* Main Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 40,
          alignItems: 'start',
        }}>

          {/* ── IMAGE PANEL ─────────────────────────── */}
          <div style={{
            background: '#fff',
            borderRadius: 24,
            padding: '48px 40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 420,
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Corner accent */}
            <div style={{
              position: 'absolute', top: 0, right: 0,
              width: 80, height: 80,
              background: `${PALETTE.mid}22`,
              borderBottomLeftRadius: '100%',
            }} />
            <div style={{
              position: 'absolute', bottom: 0, left: 0,
              width: 60, height: 60,
              background: `${PALETTE.dark}18`,
              borderTopRightRadius: '100%',
            }} />

            <img
              src={product.image}
              alt={product.title}
              style={{
                maxWidth: '100%',
                maxHeight: 340,
                objectFit: 'contain',
                position: 'relative',
                zIndex: 1,
              }}
            />
          </div>

          {/* ── DETAILS PANEL ───────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Category tag */}
            <Tag style={{
              background: `${PALETTE.dark}55`,
              border: `1px solid ${PALETTE.dark}`,
              color: PALETTE.mid,
              borderRadius: 100,
              padding: '4px 14px',
              fontSize: 11,
              letterSpacing: 2,
              textTransform: 'uppercase',
              width: 'fit-content',
            }}>
              {categoryLabels[product.category ?? ''] ?? product.category}
            </Tag>

            {/* Title */}
            <h1 style={{
              color: PALETTE.light,
              fontFamily: "'Georgia', serif",
              fontSize: 'clamp(22px, 3vw, 32px)',
              fontWeight: 400,
              lineHeight: 1.3,
              margin: 0,
            }}>
              {product.title}
            </h1>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', gap: 2 }}>
                {Array(5).fill(null).map((_, i) => (
                  <StarFilled
                    key={i}
                    style={{
                      color: i < Math.round(stars) ? '#fbbf24' : `${PALETTE.dark}88`,
                      fontSize: 14,
                    }}
                  />
                ))}
              </div>
              <span style={{ color: PALETTE.mid, fontSize: 13 }}>{stars}</span>
              <span style={{ color: `${PALETTE.mid}66`, fontSize: 13 }}>
                ({reviewCount} reviews)
              </span>
            </div>

            {/* Price block */}
            <div style={{
              background: `${PALETTE.dark}33`,
              border: `1px solid ${PALETTE.dark}`,
              borderRadius: 16,
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <span style={{ color: `${PALETTE.mid}88`, fontSize: 12, display: 'block', marginBottom: 4 }}>Price</span>
                <span style={{
                  color: PALETTE.mid,
                  fontSize: 36,
                  fontWeight: 700,
                  fontFamily: "'Georgia', serif",
                }}>
                  ${product.price}
                </span>
              </div>
              <div style={{
                background: `${PALETTE.mid}22`,
                border: `1px solid ${PALETTE.dark}`,
                borderRadius: 12,
                padding: '8px 16px',
                textAlign: 'center',
              }}>
                <span style={{ color: PALETTE.mid, fontSize: 11, display: 'block', letterSpacing: 1 }}>IN STOCK</span>
                <CheckCircleFilled style={{ color: PALETTE.mid, fontSize: 18, marginTop: 4 }} />
              </div>
            </div>

            {/* Description */}
            <p style={{
              color: `${PALETTE.light}88`,
              fontSize: 15,
              lineHeight: 1.75,
              margin: 0,
            }}>
              {product.description}
            </p>

            {/* Add to Cart */}
            <AddToCartButton
              product={{
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
              }}
            />

            {/* Trust badges */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 12,
              marginTop: 4,
            }}>
              {[
                { icon: <CarOutlined />, label: 'Free delivery', sub: 'In Maseru' },
                { icon: <SafetyCertificateOutlined />, label: 'Secure order', sub: 'Via WhatsApp' },
                { icon: <CheckCircleFilled />, label: 'Cash on delivery', sub: 'Available' },
              ].map((badge) => (
                <div key={badge.label} style={{
                  background: `${PALETTE.dark}22`,
                  border: `1px solid ${PALETTE.dark}`,
                  borderRadius: 12,
                  padding: '12px 10px',
                  textAlign: 'center',
                }}>
                  <div style={{ color: PALETTE.mid, fontSize: 18, marginBottom: 4 }}>
                    {badge.icon}
                  </div>
                  <span style={{ color: PALETTE.light, fontSize: 11, display: 'block', fontWeight: 600 }}>
                    {badge.label}
                  </span>
                  <span style={{ color: `${PALETTE.mid}88`, fontSize: 10 }}>
                    {badge.sub}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}