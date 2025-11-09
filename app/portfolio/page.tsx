// app/portfolio/page.tsx
import { fetchPortfolio, type Video } from '@/lib/api';
import { getDisciplines } from '@/lib/data';
import Image from 'next/image';

// Отключаем кэширование для динамических данных
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getPortfolio() {
  return await fetchPortfolio(0, 25);
}

async function getDisciplinesData() {
  return await getDisciplines();
}

// Функция для получения пути к иконке дисциплины
const getDisciplineIcon = (disciplineName: string | undefined): string | null => {
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

export default async function PortfolioPage() {
  const { list: videos } = await getPortfolio();

  return (
    <div className="container mx-auto px-4 py-8 mt-24">
      <h1 className="tracking-tight inline font-semibold text-[2.3rem] lg:text-5xl">Архив турниров</h1>

      {videos.length === 0 ? (
        <div className="bg-gray-900/50 p-8 rounded-lg text-center">
          <p className="text-gray-300">На данный момент видео отсутствуют</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {videos.map((video) => {
            const disciplineIcon = getDisciplineIcon(video.Game);
            
            return (
              <div
                key={video.Id}
                className="bg-gray-900/50 p-6 rounded-lg border border-gray-700 hover:border-pink-400 transition-all shadow-lg"
              >
                <div className="relative pb-[56.25%] rounded overflow-hidden mb-4 bg-gray-800">
                  {video.bglink ? (
                    <img
                      src={video.bglink || '/no-thumbnail.jpg'}
                      alt={`Обложка видео: ${video.Name}`}
                      className="absolute top-0 left-0 w-full h-full object-cover rounded-t-xl"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      Нет изображения
                    </div>
                  )}
                </div>

                <h2 className="text-xl font-bold text-pink-400 mb-2 line-clamp-2">{video.Name}</h2>
                
                {video.Game && (
                  <div className="flex items-center gap-2 mb-3">
                    {disciplineIcon && (
                      <Image 
                        src={disciplineIcon} 
                        alt={video.Game}
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                    )}
                    <p className="text-gray-300 text-sm font-medium">{video.Game}</p>
                  </div>
                )}
                
                <p className="text-gray-400 mb-4 text-sm line-clamp-3">{video.description}</p>

                {video.linkyt && (
                  <a
                    href={video.linkyt}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded transition-colors font-medium"
                  >
                    Смотреть видео
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
