'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';

interface SiteSettings {
  socialLinks: {
    youtube: string;
    twitch: string;
    vk: string;
    telegram: string;
    discord: string;
    contactUs: string;
  };
}

export default function AdminSettings() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>({
    socialLinks: {
      youtube: '',
      twitch: '',
      vk: '',
      telegram: '',
      discord: '',
      contactUs: '',
    },
  });

  useEffect(() => {
    // Проверка auth теперь в layout
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        alert('Настройки сохранены успешно!');
      } else {
        alert('Ошибка при сохранении настроек');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Ошибка при сохранении настроек');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof SiteSettings['socialLinks'], value: string) => {
    setSettings({
      ...settings,
      socialLinks: {
        ...settings.socialLinks,
        [field]: value,
      },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-white">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-white mb-6">Настройки сайта</h1>

      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <div className="pb-4 mb-6">
          <h2 className="text-xl font-bold text-white">Социальные кнопки</h2>
          <p className="text-sm text-gray-400 mt-1">
            Укажите ссылки для кнопок в шапке сайта
          </p>
        </div>
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="YouTube"
              placeholder="https://www.youtube.com/@..."
              value={settings.socialLinks.youtube}
              onChange={(e) => handleChange('youtube', e.target.value)}
              variant="bordered"
              classNames={{
                input: 'text-white',
                label: 'text-gray-300',
              }}
            />

            <Input
              label="Twitch (любая ссылка)"
              placeholder="https://www.twitch.tv/..."
              value={settings.socialLinks.twitch}
              onChange={(e) => handleChange('twitch', e.target.value)}
              variant="bordered"
              classNames={{
                input: 'text-white',
                label: 'text-gray-300',
              }}
            />

            <Input
              label="VK (ВКонтакте)"
              placeholder="https://vk.com/..."
              value={settings.socialLinks.vk}
              onChange={(e) => handleChange('vk', e.target.value)}
              variant="bordered"
              classNames={{
                input: 'text-white',
                label: 'text-gray-300',
              }}
            />

            <Input
              label="Telegram (любая ссылка)"
              placeholder="https://t.me/..."
              value={settings.socialLinks.telegram}
              onChange={(e) => handleChange('telegram', e.target.value)}
              variant="bordered"
              classNames={{
                input: 'text-white',
                label: 'text-gray-300',
              }}
            />

            <Input
              label="Discord (любая ссылка)"
              placeholder="https://discord.gg/..."
              value={settings.socialLinks.discord}
              onChange={(e) => handleChange('discord', e.target.value)}
              variant="bordered"
              classNames={{
                input: 'text-white',
                label: 'text-gray-300',
              }}
            />

            <Input
              label="Связаться с нами (любая ссылка)"
              placeholder="https://t.me/..."
              value={settings.socialLinks.contactUs}
              onChange={(e) => handleChange('contactUs', e.target.value)}
              variant="bordered"
              classNames={{
                input: 'text-white',
                label: 'text-gray-300',
              }}
            />

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                color="primary"
                className="bg-[#FF2F71] text-white"
                isLoading={saving}
              >
                Сохранить ссылки
              </Button>
              <Button
                type="button"
                variant="flat"
                onClick={() => router.push('/admin/dashboard')}
              >
                Отмена
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

