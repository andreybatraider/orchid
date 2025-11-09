import { NextRequest, NextResponse } from 'next/server';
import { getSettings } from '@/lib/data';

// Публичный API для получения настроек (для navbar)
export async function GET(request: NextRequest) {
  try {
    const settings = await getSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    // Возвращаем дефолтные настройки при ошибке
    return NextResponse.json({
      socialLinks: {
        youtube: 'https://www.youtube.com/@ORCHIDCUP',
        twitch: 'https://www.twitch.tv/orchidcup',
        vk: 'https://vk.com/orchidcybercup',
        telegram: 'https://t.me/orchidcup',
        discord: '',
        contactUs: 'https://t.me/ORCHIDORG',
      },
    });
  }
}

