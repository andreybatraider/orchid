'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './navbar';

export function ConditionalNavbar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  // Для админ-панели не показываем navbar
  if (isAdminPage) {
    return <>{children}</>;
  }

  // Для обычных страниц показываем navbar
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3">
        {/* Ваш футер */}
      </footer>
    </div>
  );
}

