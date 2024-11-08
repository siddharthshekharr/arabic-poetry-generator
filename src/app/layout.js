import { Providers } from '@/components/shared/Providers';
import '@/styles/globals.css';
import { Toaster } from "sonner";

export const metadata = {
  title: 'مولد القصائد العربية',
  description: 'An Arabic Poetry Generation Application',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <Providers>
          {children}
          <Toaster
            richColors
            position="top-center"
            toastOptions={{
              style: {
                direction: 'rtl',
                fontFamily: 'Noto Kufi Arabic, sans-serif',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}