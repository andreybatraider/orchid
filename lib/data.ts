// Локальное хранилище данных
// Для локальной разработки: JSON файл
// Для Vercel: Vercel KV (Redis)

import { promises as fs } from 'fs';
import path from 'path';

export interface Video {
  Id: number;
  Name: string;
  description: string;
  linkyt: string;
  bglink: string;
  Game?: string; // Дисциплина (опционально для обратной совместимости)
}

export interface Tournament {
  Id: number;
  Name: string;
  Price: number | null;
  Date: string;
  Game: string;
  Comands: number | null;
}

export interface Discipline {
  Id: number;
  Name: string;
  RegistrationLink: string;
}

export interface SiteSettings {
  socialLinks: {
    youtube: string;
    twitch: string;
    vk: string;
    telegram: string;
    discord: string;
    contactUs: string;
  };
  orderButtonLink: string;
}

interface DataStore {
  portfolio: Video[];
  tournaments: Tournament[];
  disciplines: Discipline[];
  settings: SiteSettings;
}

const DATA_FILE = path.join(process.cwd(), 'data', 'store.json');

// Проверяем наличие переменных окружения для KV/Redis
const USE_KV = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;
const USE_UPSTASH = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;
const USE_REDIS_URL = process.env.REDIS_URL;
const USE_REDIS = USE_KV || USE_UPSTASH || USE_REDIS_URL;

// Работа с Vercel KV, Upstash Redis или стандартным Redis (для продакшена)
async function getKVStore(): Promise<DataStore | null> {
  if (!USE_REDIS) return null;
  
  try {
    // Пробуем использовать @vercel/kv (для Vercel KV)
    if (USE_KV) {
      const { kv } = await import('@vercel/kv');
      const data = await kv.get<DataStore>('orchid-data');
      if (data) return data;
      return {
        portfolio: [],
        tournaments: [],
        disciplines: [],
        settings: {
          socialLinks: {
            youtube: 'https://www.youtube.com/@ORCHIDCUP',
            twitch: 'https://www.twitch.tv/orchidcup',
            vk: 'https://vk.com/orchidcybercup',
            telegram: 'https://t.me/orchidcup',
            discord: '',
            contactUs: 'https://t.me/ORCHIDORG',
          },
          orderButtonLink: 'https://t.me/ORCHIDORG',
        },
      };
    }
    
    // Используем стандартный Redis через ioredis
    if (USE_REDIS_URL) {
      try {
        const Redis = (await import('ioredis')).default;
        const redis = new Redis(process.env.REDIS_URL!, {
          maxRetriesPerRequest: 3,
          enableReadyCheck: false,
          lazyConnect: true,
        });
        
        await redis.connect();
        
        try {
          const data = await redis.get('orchid-data');
          console.log('Redis GET result:', data ? 'data found' : 'no data');
          if (data) {
            const parsed = JSON.parse(data);
            console.log('Parsed Redis data:', {
              portfolio: parsed.portfolio?.length || 0,
              tournaments: parsed.tournaments?.length || 0
            });
            return parsed;
          }
          console.log('Redis returned empty, returning default store');
          return { 
      portfolio: [], 
      tournaments: [],
      disciplines: [],
      settings: {
        socialLinks: {
          youtube: 'https://www.youtube.com/@ORCHIDCUP',
          twitch: 'https://www.twitch.tv/orchidcup',
          vk: 'https://vk.com/orchidcybercup',
          telegram: 'https://t.me/orchidcup',
          discord: '',
          contactUs: 'https://t.me/ORCHIDORG',
        },
        orderButtonLink: 'https://t.me/ORCHIDORG',
      },
    };
        } finally {
          await redis.quit();
        }
      } catch (error) {
        console.error('Error reading from Redis:', error);
        return null;
      }
    }
    
    // Используем Upstash REST API
    if (USE_UPSTASH) {
      const url = process.env.UPSTASH_REDIS_REST_URL!;
      const token = process.env.UPSTASH_REDIS_REST_TOKEN!;
      
      // Читаем данные через Upstash REST API
      // Формат: POST с командой Redis в теле запроса
      const response = await fetch(`${url}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(['GET', 'orchid-data']),
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.result) {
          try {
            const parsed = JSON.parse(result.result);
            // Убедимся, что settings есть
            if (!parsed.settings) {
              parsed.settings = {
                socialLinks: {
                  youtube: 'https://www.youtube.com/@ORCHIDCUP',
                  twitch: 'https://www.twitch.tv/orchidcup',
                  vk: 'https://vk.com/orchidcybercup',
                  telegram: 'https://t.me/orchidcup',
                  discord: '',
                  contactUs: 'https://t.me/ORCHIDORG',
                },
              };
            }
            return parsed;
          } catch {
            // Если result.result уже объект, возвращаем его
            if (typeof result.result === 'object') {
              if (!result.result.settings) {
                result.result.settings = {
                  socialLinks: {
                    youtube: 'https://www.youtube.com/@ORCHIDCUP',
                    twitch: 'https://www.twitch.tv/orchidcup',
                    vk: 'https://vk.com/orchidcybercup',
                    telegram: 'https://t.me/orchidcup',
                    discord: '',
                    contactUs: 'https://t.me/ORCHIDORG',
                  },
                };
              }
              return result.result;
            }
            return {
        portfolio: [],
        tournaments: [],
        disciplines: [],
        settings: {
                socialLinks: {
                  youtube: 'https://www.youtube.com/@ORCHIDCUP',
                  twitch: 'https://www.twitch.tv/orchidcup',
                  vk: 'https://vk.com/orchidcybercup',
                  telegram: 'https://t.me/orchidcup',
                  discord: '',
                  contactUs: 'https://t.me/ORCHIDORG',
                },
                orderButtonLink: 'https://t.me/ORCHIDORG',
              },
            };
          }
        }
      }
      
      return { 
      portfolio: [], 
      tournaments: [],
      disciplines: [],
      settings: {
        socialLinks: {
          youtube: 'https://www.youtube.com/@ORCHIDCUP',
          twitch: 'https://www.twitch.tv/orchidcup',
          vk: 'https://vk.com/orchidcybercup',
          telegram: 'https://t.me/orchidcup',
          discord: '',
          contactUs: 'https://t.me/ORCHIDORG',
        },
        orderButtonLink: 'https://t.me/ORCHIDORG',
      },
    };
    }
    
    return null;
  } catch (error) {
    console.error('Error reading from KV/Redis:', error);
    return null;
  }
}

async function saveKVStore(data: DataStore): Promise<boolean> {
  if (!USE_REDIS) return false;
  
  try {
    // Пробуем использовать @vercel/kv (для Vercel KV)
    if (USE_KV) {
      const { kv } = await import('@vercel/kv');
      await kv.set('orchid-data', data);
      return true;
    }
    
    // Используем стандартный Redis через ioredis
    if (USE_REDIS_URL) {
      const Redis = (await import('ioredis')).default;
      const redis = new Redis(process.env.REDIS_URL!);
      
      try {
        await redis.set('orchid-data', JSON.stringify(data));
        return true;
      } finally {
        redis.quit();
      }
    }
    
    // Используем Upstash REST API
    if (USE_UPSTASH) {
      const url = process.env.UPSTASH_REDIS_REST_URL!;
      const token = process.env.UPSTASH_REDIS_REST_TOKEN!;
      
      // Сохраняем данные через Upstash REST API
      // Формат: POST с командой Redis в теле запроса
      const dataString = JSON.stringify(data);
      const response = await fetch(`${url}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(['SET', 'orchid-data', dataString]),
      });
      
      return response.ok;
    }
    
    return false;
  } catch (error) {
    console.error('Error saving to KV/Redis:', error);
    return false;
  }
}

// Работа с файловой системой (для локальной разработки)
async function ensureDataFile(): Promise<DataStore> {
  try {
    const dataDir = path.dirname(DATA_FILE);
    await fs.mkdir(dataDir, { recursive: true });
    
    try {
      const fileContent = await fs.readFile(DATA_FILE, 'utf-8');
      return JSON.parse(fileContent);
    } catch {
      // Файл не существует, создаем пустое хранилище
      const initialData: DataStore = {
        portfolio: [],
        tournaments: [],
        disciplines: [],
        settings: {
          socialLinks: {
            youtube: 'https://www.youtube.com/@ORCHIDCUP',
            twitch: 'https://www.twitch.tv/orchidcup',
            vk: 'https://vk.com/orchidcybercup',
            telegram: 'https://t.me/orchidcup',
            discord: '',
            contactUs: 'https://t.me/ORCHIDORG',
          },
          orderButtonLink: 'https://t.me/ORCHIDORG',
        },
      };
      await fs.writeFile(DATA_FILE, JSON.stringify(initialData, null, 2));
      return initialData;
    }
  } catch (error) {
    console.error('Error ensuring data file:', error);
    return { 
      portfolio: [], 
      tournaments: [],
      disciplines: [],
      settings: {
        socialLinks: {
          youtube: 'https://www.youtube.com/@ORCHIDCUP',
          twitch: 'https://www.twitch.tv/orchidcup',
          vk: 'https://vk.com/orchidcybercup',
          telegram: 'https://t.me/orchidcup',
          discord: '',
          contactUs: 'https://t.me/ORCHIDORG',
        },
        orderButtonLink: 'https://t.me/ORCHIDORG',
      },
    };
  }
}

async function saveDataFile(data: DataStore): Promise<void> {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving data file:', error);
    throw error;
  }
}

// Общие функции для чтения/записи
async function getStore(): Promise<DataStore> {
  // Сначала пробуем KV/Redis (для Vercel)
  if (USE_REDIS) {
    const kvData = await getKVStore();
    if (kvData !== null) {
      console.log('Using Redis/KV store, data count:', {
        portfolio: kvData.portfolio.length,
        tournaments: kvData.tournaments.length
      });
      return kvData;
    }
    console.warn('Redis/KV store returned null, but USE_REDIS is true');
  }
  
  // Fallback на файловую систему (только для локальной разработки)
  // На Vercel это не сработает, но для локальной разработки нужно
  if (!process.env.VERCEL) {
    try {
      return await ensureDataFile();
    } catch (error) {
      console.error('Error reading from file system:', error);
      return { 
      portfolio: [], 
      tournaments: [],
      disciplines: [],
      settings: {
        socialLinks: {
          youtube: 'https://www.youtube.com/@ORCHIDCUP',
          twitch: 'https://www.twitch.tv/orchidcup',
          vk: 'https://vk.com/orchidcybercup',
          telegram: 'https://t.me/orchidcup',
          discord: '',
          contactUs: 'https://t.me/ORCHIDORG',
        },
        orderButtonLink: 'https://t.me/ORCHIDORG',
      },
    };
    }
  }
  
  // На Vercel без Redis возвращаем пустые данные
  console.warn('No Redis/KV configured and on Vercel, returning empty store');
  return { 
        portfolio: [],
        tournaments: [],
        disciplines: [],
        settings: {
      socialLinks: {
        youtube: 'https://www.youtube.com/@ORCHIDCUP',
        twitch: 'https://www.twitch.tv/orchidcup',
        vk: 'https://vk.com/orchidcybercup',
        telegram: 'https://t.me/orchidcup',
        discord: '',
        contactUs: 'https://t.me/ORCHIDORG',
      },
      orderButtonLink: 'https://t.me/ORCHIDORG',
    },
  };
}

async function saveStore(data: DataStore): Promise<void> {
  // Пробуем сохранить в KV/Redis (для Vercel)
  if (USE_REDIS) {
    const saved = await saveKVStore(data);
    if (saved) return;
  }
  
  // Fallback на файловую систему (для локальной разработки)
  // На Vercel это не сработает из-за read-only файловой системы
  try {
    await saveDataFile(data);
  } catch (error) {
    // На Vercel это ожидаемая ошибка, если Redis не настроен
    if (process.env.VERCEL) {
      throw new Error('Database not configured. Please set up Redis/KV database.');
    }
    throw error;
  }
}

// Чтение данных
export async function getPortfolio(): Promise<Video[]> {
  try {
    const data = await getStore();
    return data.portfolio || [];
  } catch (error) {
    console.error('Error reading portfolio:', error);
    return [];
  }
}

export async function getTournaments(): Promise<Tournament[]> {
  try {
    const data = await getStore();
    return data.tournaments || [];
  } catch (error) {
    console.error('Error reading tournaments:', error);
    return [];
  }
}

export async function getDisciplines(): Promise<Discipline[]> {
  try {
    const data = await getStore();
    return data.disciplines || [];
  } catch (error) {
    console.error('Error reading disciplines:', error);
    return [];
  }
}

// Запись данных
async function savePortfolio(portfolio: Video[]): Promise<void> {
  try {
    const data = await getStore();
    data.portfolio = portfolio;
    await saveStore(data);
  } catch (error) {
    console.error('Error saving portfolio:', error);
    throw error;
  }
}

async function saveTournaments(tournaments: Tournament[]): Promise<void> {
  try {
    const data = await getStore();
    data.tournaments = tournaments;
    await saveStore(data);
  } catch (error) {
    console.error('Error saving tournaments:', error);
    throw error;
  }
}

async function saveDisciplines(disciplines: Discipline[]): Promise<void> {
  try {
    const data = await getStore();
    data.disciplines = disciplines;
    await saveStore(data);
  } catch (error) {
    console.error('Error saving disciplines:', error);
    throw error;
  }
}

// CRUD операции для портфолио
export async function addVideo(video: Omit<Video, 'Id'>): Promise<Video> {
  const portfolio = await getPortfolio();
  const newId = portfolio.length > 0 
    ? Math.max(...portfolio.map(v => v.Id)) + 1 
    : 1;
  const newVideo: Video = { ...video, Id: newId };
  portfolio.push(newVideo);
  await savePortfolio(portfolio);
  return newVideo;
}

export async function updateVideo(id: number, video: Partial<Video>): Promise<Video | null> {
  const portfolio = await getPortfolio();
  const index = portfolio.findIndex(v => v.Id === id);
  if (index === -1) return null;
  portfolio[index] = { ...portfolio[index], ...video, Id: id };
  await savePortfolio(portfolio);
  return portfolio[index];
}

export async function deleteVideo(id: number): Promise<boolean> {
  const portfolio = await getPortfolio();
  const index = portfolio.findIndex(v => v.Id === id);
  if (index === -1) return false;
  portfolio.splice(index, 1);
  await savePortfolio(portfolio);
  return true;
}

// CRUD операции для турниров
export async function addTournament(tournament: Omit<Tournament, 'Id'>): Promise<Tournament> {
  const tournaments = await getTournaments();
  const newId = tournaments.length > 0 
    ? Math.max(...tournaments.map(t => t.Id)) + 1 
    : 1;
  const newTournament: Tournament = { ...tournament, Id: newId };
  tournaments.push(newTournament);
  await saveTournaments(tournaments);
  return newTournament;
}

export async function updateTournament(id: number, tournament: Partial<Tournament>): Promise<Tournament | null> {
  const tournaments = await getTournaments();
  const index = tournaments.findIndex(t => t.Id === id);
  if (index === -1) return null;
  tournaments[index] = { ...tournaments[index], ...tournament, Id: id };
  await saveTournaments(tournaments);
  return tournaments[index];
}

export async function deleteTournament(id: number): Promise<boolean> {
  const tournaments = await getTournaments();
  const index = tournaments.findIndex(t => t.Id === id);
  if (index === -1) return false;
  tournaments.splice(index, 1);
  await saveTournaments(tournaments);
  return true;
}

// CRUD операции для дисциплин
export async function addDiscipline(discipline: Omit<Discipline, 'Id'>): Promise<Discipline> {
  const disciplines = await getDisciplines();
  const newId = disciplines.length > 0 
    ? Math.max(...disciplines.map(d => d.Id)) + 1 
    : 1;
  const newDiscipline: Discipline = { ...discipline, Id: newId };
  disciplines.push(newDiscipline);
  await saveDisciplines(disciplines);
  return newDiscipline;
}

export async function updateDiscipline(id: number, discipline: Partial<Discipline>): Promise<Discipline | null> {
  const disciplines = await getDisciplines();
  const index = disciplines.findIndex(d => d.Id === id);
  if (index === -1) return null;
  disciplines[index] = { ...disciplines[index], ...discipline, Id: id };
  await saveDisciplines(disciplines);
  return disciplines[index];
}

export async function deleteDiscipline(id: number): Promise<boolean> {
  const disciplines = await getDisciplines();
  const index = disciplines.findIndex(d => d.Id === id);
  if (index === -1) return false;
  disciplines.splice(index, 1);
  await saveDisciplines(disciplines);
  return true;
}

// Функции для работы с настройками
export async function getSettings(): Promise<SiteSettings> {
  try {
    const data = await getStore();
    // Если settings нет, возвращаем дефолтные
    if (!data.settings) {
      return {
        socialLinks: {
          youtube: 'https://www.youtube.com/@ORCHIDCUP',
          twitch: 'https://www.twitch.tv/orchidcup',
          vk: 'https://vk.com/orchidcybercup',
          telegram: 'https://t.me/orchidcup',
          discord: '',
          contactUs: 'https://t.me/ORCHIDORG',
        },
        orderButtonLink: 'https://t.me/ORCHIDORG',
      };
    }
    // Убедимся, что orderButtonLink есть
    if (!data.settings.orderButtonLink) {
      data.settings.orderButtonLink = 'https://t.me/ORCHIDORG';
    }
    return data.settings;
  } catch (error) {
    console.error('Error reading settings:', error);
    return {
      socialLinks: {
        youtube: 'https://www.youtube.com/@ORCHIDCUP',
        twitch: 'https://www.twitch.tv/orchidcup',
        vk: 'https://vk.com/orchidcybercup',
        telegram: 'https://t.me/orchidcup',
        discord: '',
        contactUs: 'https://t.me/ORCHIDORG',
      },
      orderButtonLink: 'https://t.me/ORCHIDORG',
    };
  }
}

async function saveSettings(settings: SiteSettings): Promise<void> {
  try {
    const data = await getStore();
    data.settings = settings;
    await saveStore(data);
  } catch (error) {
    console.error('Error saving settings:', error);
    throw error;
  }
}

export async function updateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  const currentSettings = await getSettings();
  const newSettings: SiteSettings = {
    ...currentSettings,
    ...settings,
    socialLinks: {
      ...currentSettings.socialLinks,
      ...(settings.socialLinks || {}),
    },
  };
  await saveSettings(newSettings);
  return newSettings;
}
