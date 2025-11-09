@echo off
chcp 65001 >nul
echo ========================================
echo   Пуш проекта ORCHID на GitHub
echo   Репозиторий: andreybatraider/orchid
echo ========================================
echo.

echo [1/6] Проверка Git...
git --version >nul 2>&1
if errorlevel 1 (
    echo ОШИБКА: Git не установлен!
    echo Установите Git с https://git-scm.com
    pause
    exit /b 1
)
echo Git установлен: OK

echo.
echo [2/6] Инициализация Git...
if not exist .git (
    git init
    echo Git инициализирован
) else (
    echo Git уже инициализирован
)

echo.
echo [3/6] Проверка remote...
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo Добавление remote origin...
    git remote add origin https://github.com/andreybatraider/orchid.git
) else (
    echo Remote origin уже существует
    set /p replace="Заменить существующий remote? (y/n): "
    if /i "%replace%"=="y" (
        git remote remove origin
        git remote add origin https://github.com/andreybatraider/orchid.git
        echo Remote обновлен
    )
)

echo.
echo [4/6] Добавление всех файлов...
git add .
echo Файлы добавлены

echo.
echo [5/6] Создание коммита...
git commit -m "Initial commit: ORCHID project with admin panel" 2>nul
if errorlevel 1 (
    echo Предупреждение: Возможно, нет изменений для коммита
    echo Продолжаем...
)

echo.
echo [6/6] Настройка ветки и пуш...
git branch -M main 2>nul
git push -u origin main
if errorlevel 1 (
    echo.
    echo ========================================
    echo   ОШИБКА при пуше!
    echo ========================================
    echo.
    echo Возможные причины:
    echo 1. Репозиторий уже содержит файлы
    echo    Решение: git pull origin main --allow-unrelated-histories
    echo 2. Проблемы с авторизацией
    echo    Решение: Настройте Personal Access Token
    echo 3. Нет доступа к репозиторию
    echo.
    echo Попробуйте выполнить команды вручную (см. PUSH_COMMANDS.md)
    pause
    exit /b 1
)

echo.
echo ========================================
echo   УСПЕХ! Проект запушен на GitHub
echo ========================================
echo.
echo Репозиторий: https://github.com/andreybatraider/orchid
echo.
echo Следующий шаг: Деплой на Vercel
echo См. файл: QUICK_START.md
echo.
pause
