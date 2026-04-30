import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PLMS - Professional Life Management System',
  description: 'AI-powered assistant for lawyers, doctors, architects and consultants',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
