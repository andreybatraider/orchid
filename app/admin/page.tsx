'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Проверяем, авторизован ли пользователь
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth');
      const data = await response.json();
      if (data.authenticated) {
        router.push('/admin/portfolio');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/admin/portfolio');
      } else {
        setError(data.error || 'Неверный пароль');
      }
    } catch (error) {
      setError('Ошибка при входе. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Админ-панель
        </h1>
        <form onSubmit={handleLogin}>
          <Input
            type="password"
            label="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4"
            variant="bordered"
            isRequired
          />
          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}
          <Button
            type="submit"
            color="primary"
            className="w-full bg-[#FF2F71]"
            isLoading={loading}
          >
            Войти
          </Button>
        </form>
      </div>
    </div>
  );
}

