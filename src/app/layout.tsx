import '@/styles/globals.css';
import { Providers } from '@/components/Providers';
import { Toaster } from '@/components/ui/sonner';

export const metadata = {
  title: {
    default: 'Form Builder AI',
    template: '%s | Form Builder AI',
  },
  description:
    'Create and manage smart forms with an AI assistant. Powerful, fast, and easy to use.',
  robots: 'index, follow',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Form Builder AI',
    description: 'Create and manage smart forms with an AI assistant.',
    url: process.env.NEXTAUTH_URL || 'https://your-domain.com',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="min-h-screen text-gray-400 dark">
        <Providers>
          {children}
          <Toaster richColors position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
