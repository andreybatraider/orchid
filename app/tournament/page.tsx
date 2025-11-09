import DarkVeil from "@/components/DarkVeil";
import { title } from "@/components/primitives";
import { Button } from "@heroui/button";
import { fetchTournaments, type Tournament } from '@/lib/api';
import { getDisciplines, type Discipline } from '@/lib/data';

// Отключаем кэширование для динамических данных
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getTournaments() {
  return await fetchTournaments(0, 25);
}

async function getDisciplinesData() {
  return await getDisciplines();
}

const formatPrice = (price: number | null): string => {
  if (price === null) return "Не указано";
  return `${price.toLocaleString('ru-RU')} ₽`;
};

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Дата не указана";
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch {
    return "Дата не указана";
  }
};

const formatTeamsCount = (count: number | null): string => {
  if (count === null) return "0";
  return count.toString();
};

// Функция для получения пути к иконке дисциплины
const getDisciplineIcon = (disciplineName: string): string | null => {
  if (!disciplineName) return null;
  
  const name = disciplineName.toLowerCase().trim().replace(/\s+/g, ' ');
  
  // Проверяем Dota 2 (различные варианты написания)
  if (name.includes('dota')) {
    return '/Dota2.png';
  }
  
  // Проверяем Counter-Strike 2 (различные варианты написания)
  if (name.includes('cs2') || 
      name.includes('counter-strike') || 
      name.includes('counter strike') ||
      name === 'cs 2' ||
      name.startsWith('cs2') ||
      name === 'cs2') {
    return '/CS2.png';
  }
  
  return null;
};

export default async function TournamentsPage() {
  const { list: tournaments } = await getTournaments();
  const disciplines = await getDisciplinesData();
  
  // Отладочная информация (только на сервере)
  if (process.env.NODE_ENV === 'development') {
    console.log('Tournaments page - Disciplines:', disciplines.map(d => d.Name));
    console.log('Tournaments page - Tournaments:', tournaments.map(t => ({ id: t.Id, game: t.Game })));
  }

  // Создаем маппинг названия дисциплины -> ссылка регистрации
  // Используем нормализованные ключи для лучшего сопоставления
  const disciplineMap = new Map<string, string>();
  const disciplineNameMap = new Map<string, string>(); // нормализованное имя -> оригинальное имя
  
  disciplines.forEach(discipline => {
    // Сохраняем оригинальное имя
    disciplineMap.set(discipline.Name, discipline.RegistrationLink);
    // Также сохраняем нормализованное имя (нижний регистр, без пробелов)
    const normalized = discipline.Name.toLowerCase().trim().replace(/\s+/g, ' ');
    disciplineNameMap.set(normalized, discipline.Name);
    disciplineMap.set(normalized, discipline.RegistrationLink);
  });
  
  // Функция для поиска дисциплины по названию (с учетом вариантов написания)
  const findDisciplineLink = (gameName: string): string => {
    if (!gameName) return 'https://t.me/ORCHIDORG';
    
    // Пробуем точное совпадение
    if (disciplineMap.has(gameName)) {
      return disciplineMap.get(gameName)!;
    }
    
    // Пробуем нормализованное совпадение
    const normalized = gameName.toLowerCase().trim().replace(/\s+/g, ' ');
    if (disciplineMap.has(normalized)) {
      return disciplineMap.get(normalized)!;
    }
    
    // Пробуем найти по частичному совпадению
    const entries = Array.from(disciplineMap.entries());
    for (const [key, link] of entries) {
      const keyNormalized = key.toLowerCase().trim();
      const gameNormalized = gameName.toLowerCase().trim();
      if (keyNormalized === gameNormalized || 
          keyNormalized.includes(gameNormalized) || 
          gameNormalized.includes(keyNormalized)) {
        return link;
      }
    }
    
    return 'https://t.me/ORCHIDORG';
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-24" >

      <h1 className={title()}>Турниры</h1>
      
      {tournaments.length === 0 ? (
        <div className="bg-gray-900/50 p-8 rounded-lg text-center mt-5">
          <p className="text-gray-300">На данный момент нет активных турниров</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {tournaments.map((tournament) => {
            const safeTournament = {
              Id: tournament.Id,
              Name: tournament.Name || "Без названия",
              Price: tournament.Price,
              Date: tournament.Date,
              Game: tournament.Game || "Не указана",
              Comands: tournament.Comands
            };

            // Получаем ссылку регистрации для этой дисциплины
            const registrationLink = findDisciplineLink(safeTournament.Game);
            const disciplineIcon = getDisciplineIcon(safeTournament.Game);

            return (
              <div 
                key={safeTournament.Id} 
                className="bg-gray-900/50 p-6 rounded-lg border border-gray-700 hover:border-pink-400 transition-all shadow-lg"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-pink-400">{safeTournament.Name}</h2>
                  <span className="bg-pink-900/30 text-pink-400 px-2 py-1 rounded text-xs">
                    #{safeTournament.Id}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-gray-400 text-sm">Дисциплина</p>
                    <div className="flex items-center gap-2">
                      {disciplineIcon && (
                        <img 
                          src={disciplineIcon} 
                          alt={safeTournament.Game}
                          className="w-6 h-6 object-contain"
                        />
                      )}
                      <p className="font-medium">{safeTournament.Game}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Дата</p>
                    <p className="font-medium">{formatDate(safeTournament.Date)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Призовой фонд</p>
                    <p className="font-medium">{formatPrice(safeTournament.Price)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Команд</p>
                    <p className="font-medium">{formatTeamsCount(safeTournament.Comands)}</p>
                  </div>
                </div>

                <Button 
                  as="a" 
                  href={registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-2 rounded bg-[#FF2F71]/75 "
                  
                >
                  Подать заявку
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
