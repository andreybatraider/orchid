# 🚀 Пуш на GitHub - ПРЯМО СЕЙЧАС

## Репозиторий: https://github.com/andreybatraider/orchid

## ⚡ Быстрый способ (Windows)

Просто запустите файл **`push-to-github.bat`** двойным кликом!

Или в PowerShell:
```powershell
.\push-to-github.bat
```

## 📝 Команды вручную

Если хотите выполнить вручную, скопируйте и выполните:

```bash
git init
git add .
git commit -m "Initial commit: ORCHID project with admin panel"
git branch -M main
git remote add origin https://github.com/andreybatraider/orchid.git
git push -u origin main
```

## ⚠️ Если репозиторий уже содержит файлы

Если в репозитории уже есть README.md или другие файлы:

```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

## ✅ После пуша

1. Проверьте: https://github.com/andreybatraider/orchid
2. Деплой на Vercel: см. `QUICK_START.md`

## 🆘 Проблемы?

См. `PUSH_COMMANDS.md` для решения проблем.

