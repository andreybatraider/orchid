'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@heroui/button';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Не проверяем auth на странице входа
    if (pathname === '/admin') {
      setLoading(false);
      return;
    }
    checkAuth();
  }, [pathname]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth');
      const data = await response.json();
      if (data.authenticated) {
        setAuthenticated(true);
      } else {
        router.push('/admin');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/admin');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', {
        method: 'DELETE',
      });
      router.push('/admin');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // На странице входа не показываем layout
  if (pathname === '/admin') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-white">Загрузка...</p>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-gray-800/90 backdrop-blur-sm border-r border-gray-700 z-50">
        <div className="p-6">
          <Link href="/admin/dashboard" className="block mb-8">
            <h1 className="text-2xl font-bold text-pink-400">ORCHID</h1>
            <p className="text-xs text-gray-400">Админ-панель</p>
          </Link>

          <nav className="space-y-2">
            <Link
              href="/admin/dashboard"
              className={`block px-4 py-3 rounded-lg transition-colors ${
                pathname === '/admin/dashboard'
                  ? 'bg-pink-500/20 text-pink-400 border-l-2 border-pink-400'
                  : 'text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              📊 Dashboard
            </Link>
            <Link
              href="/admin/portfolio"
              className={`block px-4 py-3 rounded-lg transition-colors ${
                pathname === '/admin/portfolio'
                  ? 'bg-pink-500/20 text-pink-400 border-l-2 border-pink-400'
                  : 'text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              🎬 Портфолио
            </Link>
            <Link
              href="/admin/tournaments"
              className={`block px-4 py-3 rounded-lg transition-colors ${
                pathname === '/admin/tournaments'
                  ? 'bg-pink-500/20 text-pink-400 border-l-2 border-pink-400'
                  : 'text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              🏆 Турниры
            </Link>
            <Link
              href="/admin/settings"
              className={`block px-4 py-3 rounded-lg transition-colors ${
                pathname === '/admin/settings'
                  ? 'bg-pink-500/20 text-pink-400 border-l-2 border-pink-400'
                  : 'text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              ⚙️ Настройки
            </Link>
          </nav>

          <div className="mt-8 pt-8 border-t border-gray-700">
            <Button
              color="danger"
              variant="flat"
              size="sm"
              className="w-full"
              onClick={handleLogout}
            >
              Выйти
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

