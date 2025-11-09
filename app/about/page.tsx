import { title } from "@/components/primitives";

export default function AboutPage() {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-1 w-full gap-2 mt-24">
        <div className="">
          <div className="max-w-3xl mx-auto p-4 font-sans text-gray-200 leading-relaxed">
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-white mb-2 tracking-wide">ORCHID</div>
              <div className="text-md text-gray-300 font-light">Турнирное агентство полного цикла</div>
            </div>

            <div className="bg-gray-800/70 p-4 rounded-lg mb-6 text-center text-md">
              <div>Мы объединяем профессиональный опыт, креативный подход и техническую точность, чтобы создавать турниры, которые действительно впечатляют — <span className="text-white font-semibold">как участников, так и зрителей.</span></div>
            </div>

            <div className="mb-8">
              <div className="text-white text-xl font-bold border-b-2 border-white pb-2 mb-4">Чем мы занимаемся:</div>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="text-xl mr-3">●</div>
                  <div><span className="font-semibold">Организуем кастомные турниры</span> для компьютерных клубов в дисциплинах CS2, Dota 2 и других;</div>
                </div>
                <div className="flex items-start">
                  <div className="text-xl mr-3">●</div>
                  <div><span className="font-semibold">Проводим корпоративные чемпионаты</span> — как эффективный инструмент тимбилдинга;</div>
                </div>
                <div className="flex items-start">
                  <div className="text-xl mr-3">●</div>
                  <div><span className="font-semibold">Реализуем события под любые цели</span> — от шоу-матчей до сезонных лиг;</div>
                </div>
                <div className="flex items-start">
                  <div className="text-xl mr-3">●</div>
                  <div><span className="font-semibold">Запускаем турниры под брендом ORCHID</span> — уникальные проекты с авторской концепцией.</div>
                </div>
              </div>
            </div>

            <div className="bg-purple-900/30 p-4 rounded-lg mb-6 text-md">
              <div>В нашем распоряжении — опытная команда организаторов, судейский штаб, продакшн-дизайн и надёжная система управления проектами.<br/><span className="font-semibold">Каждое событие</span> — это продуманное киберспортивное решение.</div>
            </div>

            <div className="text-center text-white text-lg font-bold mt-6">
              ORCHID — мы не копируем. Мы создаём.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
