import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Setnel — by Datum Labs',
  description: 'Risk monitoring for DeFi lending dashboards. A Datum Labs product.',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
