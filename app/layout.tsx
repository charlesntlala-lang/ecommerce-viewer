'use client';

import './globals.css';
import { CartProvider } from './context/CartContext';
import { Navbar} from './components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <head>
        <style>{`
          :root {
            --c-darkest: #132a13;
            --c-dark: #31572c;
            --c-mid: #90a955;
            --c-light: #ecf39e;
          }

          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }

          body {
            background: var(--c-darkest);
            color: var(--c-light);
            font-family: 'Georgia', serif;
            min-height: 100vh;
          }

          /* Ant Design token overrides */
          .ant-btn-primary {
            background: var(--c-mid) !important;
            border-color: var(--c-mid) !important;
            color: var(--c-darkest) !important;
            font-weight: 700 !important;
          }

          .ant-btn-primary:hover {
            background: var(--c-light) !important;
            border-color: var(--c-light) !important;
          }

          .ant-input,
          .ant-input-affix-wrapper {
            background: rgba(49, 87, 44, 0.25) !important;
            border-color: var(--c-dark) !important;
            color: var(--c-light) !important;
            border-radius: 10px !important;
          }

          .ant-input::placeholder {
            color: rgba(144, 169, 85, 0.5) !important;
          }

          .ant-input:focus,
          .ant-input-affix-wrapper:focus {
            border-color: var(--c-mid) !important;
            box-shadow: 0 0 0 2px rgba(144, 169, 85, 0.2) !important;
          }

          .ant-select-selector {
            background: rgba(49, 87, 44, 0.25) !important;
            border-color: var(--c-dark) !important;
            color: var(--c-light) !important;
          }

          /* Scrollbar */
          ::-webkit-scrollbar { width: 6px; }
          ::-webkit-scrollbar-track { background: var(--c-darkest); }
          ::-webkit-scrollbar-thumb { background: var(--c-dark); border-radius: 3px; }
          ::-webkit-scrollbar-thumb:hover { background: var(--c-mid); }

          /* Smooth scroll */
          html { scroll-behavior: smooth; }
        `}</style>
      </head>
      <body style={{ paddingTop: 64, background: '#132a13' }}>
        <CartProvider>
          <Navbar />

          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </CartProvider>
      </body>
    </html>
  );
}