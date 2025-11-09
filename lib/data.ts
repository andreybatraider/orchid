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
}

export interface Tournament {
  Id: number;
  Name: string;
  Price: number | null;
  Date: string;
  Game: string;
  Comands: number | null;
}

interface DataStore {
  portfolio: Video[];
  tournaments: Tournament[];
}

const DATA_FILE = path.join(process.cwd(), 'data', 'store.json');

// Проверяем наличие переменных окружения для KV/Redis
const USE_KV = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;
const USE_UPSTASH = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;
const USE_REDIS = USE_KV || USE_UPSTASH;

// Работа с Vercel KV или Upstash Redis (для продакшена)
async function getKVStore(): Promise<DataStore | null> {
  if (!USE_REDIS) return null;
  
  try {
    // Пробуем использовать @vercel/kv (для Vercel KV)
    if (USE_KV) {
      const { kv } = await import('@vercel/kv');
      const data = await kv.get<DataStore>('orchid-data');
      return data || { portfolio: [], tournaments: [] };
    }
    
    // Используем Upstash REST API
    if (USE_UPSTASH) {
      const url = process.env.UPSTASH_REDIS_REST_URL!;
      const token = process.env.UPSTASH_REDIS_REST_TOKEN!;
      
      // Читаем данные через Upstash REST API (GET команда)
      const response = await fetch(`${url}/get/orchid-data`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.result) {
          try {
            return JSON.parse(result.result);
          } catch {
            return { portfolio: [], tournaments: [] };
          }
        }
      }
      
      return { portfolio: [], tournaments: [] };
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
    
    // Используем Upstash REST API
    if (USE_UPSTASH) {
      const url = process.env.UPSTASH_REDIS_REST_URL!;
      const token = process.env.UPSTASH_REDIS_REST_TOKEN!;
      
      // Сохраняем данные через Upstash REST API (SET команда)
      const dataString = JSON.stringify(data);
      const response = await fetch(`${url}/set/orchid-data/${encodeURIComponent(dataString)}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
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
      };
      await fs.writeFile(DATA_FILE, JSON.stringify(initialData, null, 2));
      return initialData;
    }
  } catch (error) {
    console.error('Error ensuring data file:', error);
    return { portfolio: [], tournaments: [] };
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
    if (kvData) return kvData;
  }
  
  // Fallback на файловую систему (для локальной разработки)
  // На Vercel это не сработает, но для локальной разработки нужно
  try {
    return await ensureDataFile();
  } catch (error) {
    // На Vercel файловая система read-only, возвращаем пустые данные
    console.warn('File system not available, using empty store');
    return { portfolio: [], tournaments: [] };
  }
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
    return data.portfolio;
  } catch (error) {
    console.error('Error reading portfolio:', error);
    return [];
  }
}

export async function getTournaments(): Promise<Tournament[]> {
  try {
    const data = await getStore();
    return data.tournaments;
  } catch (error) {
    console.error('Error reading tournaments:', error);
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
