'use client';

import { title } from "@/components/primitives";
import { useEffect, useState } from "react";

interface SiteSettings {
  orderButtonLink: string;
}

export default function ServicesPage() {
  const [orderLink, setOrderLink] = useState('https://t.me/ORCHIDORG');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        if (data.orderButtonLink) {
          setOrderLink(data.orderButtonLink);
        }
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-24">
      <h1 className={title()}>Услуги</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Пакет СТАРТ */}
        <div className="bg-gray-900/30 border border-gray-700 rounded-xl p-6 flex flex-col hover:border-pink-500 transition-all">
          <div className="flex-grow">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-pink-400">ПАКЕТ «СТАРТ»</h2>
            </div>

            <div className="mb-6">
              <h3 className="text-gray-400 font-semibold mb-2">Для кого:</h3>
              <p>Клубы, которые хотят простой турнир без лишнего, но с чёткой организацией</p>
            </div>

            <div className="mb-6">
              <h3 className="text-gray-400 font-semibold mb-2">Что входит:</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-pink-400 mr-2">•</span>
                  <span>Разработка турнирной сетки (Single/Double Elim, GSL и пр.)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-400 mr-2">•</span>
                  <span>Шаблон пресс-релиза турнира</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-400 mr-2">•</span>
                  <span>Онлайн-регистрация игроков/команд</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-400 mr-2">•</span>
                  <span>Создание афиши (одна статичная)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-400 mr-2">•</span>
                  <span>Судейство и сопровождение матчей</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-400 mr-2">•</span>
                  <span>Ведение групп/сеток в real-time</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-auto space-y-4">
            <div className="flex items-center text-sm text-gray-400">
              <span className="mr-2">🕒</span>
              <span>Срок подготовки: 3–4 дня</span>
            </div>
            <a
              href={orderLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
            >
              <button className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-lg transition-colors">
                Заказать
              </button>
            </a>
          </div>
        </div>

        {/* Пакет КОМЬЮНИТИ */}
        <div className="bg-gray-900/30 border border-purple-700 rounded-xl p-6 flex flex-col hover:border-purple-500 transition-all">
          <div className="flex-grow">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-purple-400">ПАКЕТ «КОМЬЮНИТИ»</h2>
            </div>

            <div className="mb-6">
              <h3 className="text-gray-400 font-semibold mb-2">Для кого:</h3>
              <p>Клубы, которые хотят привлечь локальное сообщество и усилить вовлечённость</p>
            </div>

            <div className="mb-6">
              <h3 className="text-gray-400 font-semibold mb-2">Что входит:</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>Всё из базового пакета</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>Полная кастомизация под клуб</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>Оформление афиши, поста и 3 сторис</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>Графика с результатами, Худ драфтов</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>Контент для соцсетей клуба</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-auto space-y-4">
            <div className="flex items-center text-sm text-gray-400">
              <span className="mr-2">🕒</span>
              <span>Срок подготовки: 3–5 дней</span>
            </div>
            <a
              href={orderLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
            >
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors">
                Заказать
              </button>
            </a>
          </div>
        </div>

        {/* Пакет ШОУ */}
        <div className="bg-gray-900/30 border border-yellow-700 rounded-xl p-6 flex flex-col hover:border-yellow-500 transition-all">
          <div className="flex-grow">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-yellow-400">ПАКЕТ «ШОУ»</h2>
            </div>

            <div className="mb-6">
              <h3 className="text-gray-400 font-semibold mb-2">Для кого:</h3>
              <p>Клубы, которые хотят максимум вау-эффекта, хайлайты и медиа-активности</p>
            </div>

            <div className="mb-6">
              <h3 className="text-gray-400 font-semibold mb-2">Что входит:</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  <span>Всё из расширенного пакета</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  <span>Придумываем уникальную айдентику турнира</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  <span>Промо-ролик (30–45 секунд)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  <span>Трансляция турнира с кастом</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  <span>Пост-турнирный highlight-ролик</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-auto space-y-4">
            <div className="flex items-center text-sm text-gray-400">
              <span className="mr-2">🕒</span>
              <span>Срок подготовки: 5–7 дней</span>
            </div>
            <a
              href={orderLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
            >
              <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg transition-colors">
                Заказать
              </button>
            </a>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center text-lg text-gray-300">
        <p>СТОИМОСТЬ ВАРЬИРУЕТСЯ ОТ ВАШЕГО ЗАПРОСА!!!</p>
        <p className="mt-2">Конкретные условия обсуждаются индивидуально</p>
      </div>
    </div>
  );
}
