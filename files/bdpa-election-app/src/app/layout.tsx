// OWNER: Student A (root layout) — but each student edits their own page.tsx
// PURPOSE: The HTML shell rendered around every page. Includes the nav bar.
//
// REQUIREMENT: 8 (persistent navigation), 15 (responsive)

import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/navigation/Navigation';

export const metadata: Metadata = {
  title: 'BDPA Elections',
  description: 'Secure IRV-based electronic election system',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <Navigation />
        <main className="container mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
