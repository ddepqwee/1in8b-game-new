# Лотерея рождения

Игра о том, как место рождения определяет жизнь. Один код на JavaScript, три обёртки:

| Платформа | Обёртка | Папка | Как собирается |
|---|---|---|---|
| iOS (App Store) | Capacitor 8 | `ios/` | GitHub Actions на macOS → TestFlight (`.github/workflows/ios.yml`) |
| Android (Google Play) | Capacitor 8 | `android/` | GitHub Actions → `.aab` → внутреннее тестирование (`.github/workflows/android.yml`) |
| Steam (Windows, macOS, Linux) | Electron 38 + steamworks.js | `desktop/` | GitHub Actions → загрузка в Steam, ветка beta (`.github/workflows/steam.yml`) |
| Браузер | — | `www/` | открыть `www/index.html` или `npm run serve` |

## Структура

- `www/` — сама игра: `index.html` (интерфейс и анимации), `engine.js` (правила и симуляция), `data/` (страны, имена, контент).
- `src/platform.js` — мост к платформе: вибрация, статус-бар, сохранения в нативное хранилище, достижения Steam.
- `desktop/` — главный процесс Electron и preload.
- `scripts/` — `vendor.js` (шрифты и библиотеки внутрь игры, чтобы она работала без интернета), `icons.js`, `screenshots.js`.
- `store/` — иконки, скриншоты под размеры магазинов, тексты, политика конфиденциальности, список достижений Steam.
- `assets/` — исходники иконки и заставки для `npx capacitor-assets generate`.

## Команды

```bash
npm install
npm run vendor          # обязательно перед любой сборкой
npm run desktop         # запустить десктопную версию
npm run desktop:build   # собрать десктоп под текущую ОС в dist-desktop/
npx cap sync            # перенести www/ в проекты iOS и Android
npx cap open android    # открыть в Android Studio
npx cap open ios        # открыть в Xcode (только на Mac)
npm run shots           # пересоздать скриншоты для магазинов
```

## Что нужно, чтобы выпустить

### Общее
1. Пустой репозиторий на GitHub, куда будет залит этот проект.
2. Окончательное название и идентификатор приложения (сейчас `com.birthlottery.game`; поменять до первой загрузки в магазины, потом нельзя).
3. Страница с политикой конфиденциальности: `store/privacy-policy.html` можно выложить через GitHub Pages. Заполнить имя и email.

### App Store
1. Apple Developer Program, $99 в год.
2. В App Store Connect создать приложение с bundle id из пункта 2.
3. Ключ App Store Connect API (Issuer ID, Key ID, файл .p8) и сертификат Apple Distribution (.p12).
4. Секреты в GitHub: `APPLE_TEAM_ID`, `APPSTORE_ISSUER_ID`, `APPSTORE_KEY_ID`, `APPSTORE_PRIVATE_KEY`, `IOS_DIST_CERT_P12_BASE64`, `IOS_DIST_CERT_PASSWORD`.
5. Свой Mac не нужен: сборка идёт на macOS-машине GitHub.

### Google Play
1. Google Play Console, $25 один раз. Для нового личного аккаунта Google требует закрытое тестирование с 12 тестировщиками в течение 14 дней перед выходом в продакшен.
2. Ключ подписи: `keytool -genkey -v -keystore release.jks -alias birthlottery -keyalg RSA -keysize 2048 -validity 10000`. Хранить в надёжном месте, без него обновления не выпустить.
3. Секреты в GitHub: `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`, при автозагрузке `PLAY_SERVICE_ACCOUNT_JSON`.

### Steam
1. Steamworks, $100 за игру (возвращается после $1000 выручки).
2. В панели Steamworks: три депо (Windows, macOS, Linux), достижения из `store/steam-achievements.csv`, ветка beta.
3. В GitHub: переменная `STEAM_APP_ID`, секреты `STEAM_USERNAME` и `STEAM_CONFIG_VDF` (отдельный аккаунт сборщика, см. документацию game-ci/steam-deploy).
4. Для проверки достижений до получения своего ID можно запустить с `STEAM_APP_ID=480` (тестовое приложение Valve).

## Языки

Русский и английский. Язык берётся из системы (русский для ru, be, kk, ky, uz, tg, иначе английский) и переключается в настройках, выбор хранится в `lottery.lang`.

- `www/i18n.js` определяет `LANG` и функцию `tr("по-русски", "in English")` для строк интерфейса и движка.
- `www/data/lang-en.js` заменяет тексты карточек, событий, черт, профессий, мечт и достижений; там же английские названия стран.
- `www/data/names-en.js` — имена латиницей в том же порядке, что и в `names.js`, поэтому «Рождение дня» даёт одного и того же человека на обоих языках.
- Внутри данных страны по-прежнему называются по-русски (`c.n`), для показа используется `c.name`.

Новая карточка или событие: добавить текст в `lang-en.js` по `id`.

## Настройки игрока

Кнопка ⚙ в правом верхнем углу (или `Esc` на компьютере): звук, быстрые анимации, мягкий режим (без войн, преступлений, насилия и аварий), подсказки для первых жизней, сброс прогресса. Хранятся в `lottery.settings`.

На компьютере игра управляется с клавиатуры: `1`–`5` выбор варианта, `Enter` или `Пробел` дальше.

## Что ещё не сделано

- Название приложения под иконкой на английском (строки в `ios/App/App/*.lproj` и `android/app/src/main/res/values-en`). Сейчас везде «Лотерея рождения».
- Покупка «полной версии» в мобильных магазинах (RevenueCat).
- Таблица результатов «Рождения дня» (нужен сервер).
- Капсулы и трейлер для страницы Steam, баннер 1024×500 для Google Play.
- Сборки iOS и Android ни разу не запускались: в рабочей среде нет Xcode и Android SDK. Первый прогон GitHub Actions может потребовать правок.
