'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Stats {
  portfolio: number;
  tournaments: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({ portfolio: 0, tournaments: 0 });

  useEffect(() => {
    // Проверка auth теперь в layout
    setAuthenticated(true);
    setLoading(false);
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [portfolioRes, tournamentsRes] = await Promise.all([
        fetch('/api/admin/portfolio'),
        fetch('/api/admin/tournaments'),
      ]);

      if (portfolioRes.ok) {
        const portfolioData = await portfolioRes.json();
        setStats((prev) => ({ ...prev, portfolio: portfolioData.list?.length || 0 }));
      }

      if (tournamentsRes.ok) {
        const tournamentsData = await tournamentsRes.json();
        setStats((prev) => ({ ...prev, tournaments: tournamentsData.list?.length || 0 }));
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-white">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl">
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-2">Видео в портфолио</p>
              <p className="text-3xl font-bold text-white">{stats.portfolio}</p>
            </div>
            <div className="text-4xl">🎬</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-2">Турниры</p>
              <p className="text-3xl font-bold text-white">{stats.tournaments}</p>
            </div>
            <div className="text-4xl">🏆</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-2">Всего элементов</p>
              <p className="text-3xl font-bold text-white">{stats.portfolio + stats.tournaments}</p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/portfolio">
          <div className="bg-gray-800/50 border border-gray-700 hover:border-pink-500/50 transition-all cursor-pointer h-full rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🎬</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Портфолио</h3>
                <p className="text-gray-400 text-sm">
                  Управление видео в портфолио
                </p>
                <p className="text-pink-400 text-sm mt-2">
                  {stats.portfolio} {stats.portfolio === 1 ? 'видео' : 'видео'}
                </p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/admin/tournaments">
          <div className="bg-gray-800/50 border border-gray-700 hover:border-pink-500/50 transition-all cursor-pointer h-full rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🏆</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Турниры</h3>
                <p className="text-gray-400 text-sm">
                  Управление турнирами
                </p>
                <p className="text-pink-400 text-sm mt-2">
                  {stats.tournaments} {stats.tournaments === 1 ? 'турнир' : 'турниров'}
                </p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/admin/settings">
          <div className="bg-gray-800/50 border border-gray-700 hover:border-pink-500/50 transition-all cursor-pointer h-full rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="text-4xl">⚙️</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Настройки</h3>
                <p className="text-gray-400 text-sm">
                  Настройка социальных кнопок и сайта
                </p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/" target="_blank">
          <div className="bg-gray-800/50 border border-gray-700 hover:border-pink-500/50 transition-all cursor-pointer h-full rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🌐</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Посмотреть сайт</h3>
                <p className="text-gray-400 text-sm">
                  Открыть сайт в новой вкладке
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
