#!/bin/bash

echo "========================================"
echo "  Пуш проекта ORCHID на GitHub"
echo "========================================"
echo ""

echo "[1/5] Инициализация Git..."
git init

echo ""
echo "[2/5] Добавление всех файлов..."
git add .

echo ""
echo "[3/5] Создание коммита..."
git commit -m "Initial commit: ORCHID project with admin panel"

echo ""
echo "[4/5] Настройка ветки main..."
git branch -M main

echo ""
echo "[5/5] Подключение к GitHub и пуш..."
git remote add origin https://github.com/andreybatraider/orchid.git
git push -u origin main

echo ""
echo "========================================"
echo "  Готово! Проект запушен на GitHub"
echo "========================================"
echo ""
echo "Репозиторий: https://github.com/andreybatraider/orchid"
echo ""

