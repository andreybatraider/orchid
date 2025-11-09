import DarkVeil from "@/components/DarkVeil";
import { title, subtitle } from "@/components/primitives";
import { Button, ButtonGroup } from "@heroui/button";

export default function Home() {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 0,
      overflow: 'auto',          // Добавляем flex
      justifyContent: 'center', // Центрируем по горизонтали
      alignItems: 'center'     // Центрируем по вертикали
    }}>
      {/* Фон */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1
      }}>
        <DarkVeil />
      </div>

      {/* Основной контент - добавляем max-width и margin auto для лучшего контроля */}
      <section className="flex flex-col gap-2 py-8 md:py-10" style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '1300px', // или другой подходящий размер
        margin: '0 auto',   // автоматические отступы по бокам
        padding: '0 20px'   // отступы от краев
      }}>
        <div className="inline-block max-w mt-[200px]">
          <span className={title()}>ORCHID&nbsp;</span>
          <div className={subtitle({ class: "mt-4 max-w-[50rem]" })}>
            <p className="text-xl mb-6">
              — команда, превращающая обычные соревнования в полноценное шоу. Мы знаем, как привлечь игроков, зажечь аудиторию и сделать так, чтобы о вашем ивенте говорили ещё долго после финального матча.
            </p>

            <div className="mb-8">
              <p className="mb-4">
                Каждый турнир — это продуманный сценарий: оформление, креатив, стримы, движ в соцсетях, работа с участниками и зрителями. Мы не просто проводим игры — мы создаём события, которые бьют в сердца комьюнити.
              </p>
            </div>

            <div className="text-yellow-500 p-6 rounded-lg">
              <p className="mb-4">
                Нам доверяют бренды, клубы и команды по всей стране. Мы поднимаем уровень киберспорта, объединяя игроков, зрителей и бизнес в одном потоке.
              </p>
            </div>

            <h2 className="text-2xl font-bold mb-4 text-white">
              Мы не просто запускаем турниры. Мы предлагаем уникальные решения для брендов в мире киберспорта.
            </h2></div>
        </div>

        <div className="flex gap-3">
          <a href="https://t.me/ORCHIDORG"><Button color="primary" className="bg-[#FF2F71] text-lg px-10 rounded" size="lg">Связаться</Button></a>
        </div>


      </section>
      <div className="max-w-[77rem] mx-auto px-4 sm:px-6 lg:px-8 mt-12"></div>
    </div>
  );
}
