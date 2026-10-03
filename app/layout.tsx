import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'TAN TECH SUPPORT — Your Trusted Digital Partner',
  description: 'Your Trusted Digital Partner — Multi-service digital platform offering digital services, online marketplace, delivery service, and vehicle booking.',
  openGraph: {
    title: 'TAN TECH SUPPORT — Your Trusted Digital Partner',
    description: 'Your Trusted Digital Partner — Multi-service digital platform offering digital services, online marketplace, delivery service, and vehicle booking.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TAN TECH SUPPORT — Your Trusted Digital Partner',
    description: 'Your Trusted Digital Partner — Multi-service digital platform offering digital services, online marketplace, delivery service, and vehicle booking.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
