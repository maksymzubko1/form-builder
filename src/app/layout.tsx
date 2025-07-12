import '@/styles/globals.css';

export const metadata = {
  title: 'Form Builder AI',
  description: 'Создавай умные формы с AI-помощником',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
    <body className="min-h-screen bg-gray-50 text-gray-900">
    <main>{children}</main>
    </body>
    </html>
  );
}
