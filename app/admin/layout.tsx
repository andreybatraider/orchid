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
    // Редирект с dashboard на portfolio
    if (pathname === '/admin/dashboard') {
      router.replace('/admin/portfolio');
      return;
    }
    // Не проверяем auth на странице входа
    if (pathname === '/admin') {
      setLoading(false);
      setAuthenticated(false);
      return;
    }
    // Для всех остальных страниц проверяем auth
    checkAuth();
  }, [pathname]);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/auth');
      const data = await response.json();
      if (data.authenticated) {
        setAuthenticated(true);
        setLoading(false);
      } else {
        setAuthenticated(false);
        setLoading(false);
        router.replace('/admin');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthenticated(false);
      setLoading(false);
      router.replace('/admin');
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

  // Пока загружается проверка авторизации
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <p className="text-white text-lg mb-2">Загрузка...</p>
          <p className="text-gray-400 text-sm">Проверка авторизации</p>
        </div>
      </div>
    );
  }

  // Если не авторизован, ничего не показываем (редирект уже произошел)
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <p className="text-white text-lg mb-2">Перенаправление...</p>
          <p className="text-gray-400 text-sm">Вы будете перенаправлены на страницу входа</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-gray-800/90 backdrop-blur-sm border-r border-gray-700 z-50">
        <div className="p-6">
          <Link href="/admin/portfolio" className="block mb-8">
            <h1 className="text-2xl font-bold text-pink-400">ORCHID</h1>
            <p className="text-xs text-gray-400">Админ-панель</p>
          </Link>

          <nav className="space-y-2">
            <Link
              href="/admin/portfolio"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                pathname === '/admin/portfolio'
                  ? 'bg-pink-500/20 text-pink-400 border-l-2 border-pink-400'
                  : 'text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Архив турниров
            </Link>
            <Link
              href="/admin/tournaments"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                pathname === '/admin/tournaments'
                  ? 'bg-pink-500/20 text-pink-400 border-l-2 border-pink-400'
                  : 'text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              Турниры
            </Link>
            <Link
              href="/admin/disciplines"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                pathname === '/admin/disciplines'
                  ? 'bg-pink-500/20 text-pink-400 border-l-2 border-pink-400'
                  : 'text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Дисциплины
            </Link>
            <Link
              href="/admin/settings"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                pathname === '/admin/settings'
                  ? 'bg-pink-500/20 text-pink-400 border-l-2 border-pink-400'
                  : 'text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Настройки
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

