import DarkVeil from "@/components/DarkVeil";

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
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
          maxWidth: '1200px', // или другой подходящий размер
          margin: '0 auto',   // автоматические отступы по бокам
          padding: '0 20px'   // отступы от краев
        }}></section>
        {children}
      </div>
    </section>
  );
}
