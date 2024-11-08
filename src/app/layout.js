// src/app/layout.js
import { Providers } from '@/components/shared/Providers';
import '@/styles/globals.css';

export const metadata = {
  title: 'مولد القصائد العربية',
  description: 'An Arabic Poetry Generation Application',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

