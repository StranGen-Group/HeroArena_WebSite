# Hero Arena Website

React-приложение для игры Hero Arena с поддержкой многоязычности и анимациями.

## 📁 Структура проекта

### Папка `src/`

```
src/
├── assets/         # Статические ресурсы (изображения, стили)
├── component/      # UI компоненты
│   ├── contact/
│   ├── footer/
│   ├── header/
│   ├── hero/
│   ├── preloader/
│   ├── section/
│   ├── slider/
│   └── video/
├── constants/      # 🆕 Константы приложения
│   ├── animation.js      # Константы для анимаций
│   ├── links.js          # Внешние ссылки
│   ├── slider.js         # Конфигурация слайдера
│   ├── translations.js    # Переводы
│   └── index.js          # Экспорты
├── context/       # React контексты
│   └── LanguageContext.js
├── hooks/         # Пользовательские хуки
│   └── useInView.js
├── utils/         # 🆕 Утилиты
│   └── scroll.js         # Функции для работы со скроллом
├── App.js
└── index.js
```

## 🆕 Новые улучшения

### 1. Константы (`src/constants/`)

- **`animation.js`** - Константы для анимаций (пороги, задержки)
- **`links.js`** - Все внешние ссылки и ID секций
- **`slider.js`** - Данные для слайдера
- **`translations.js`** - Переводы на 3 языка (EN, RU, UZ)

### 2. Утилиты (`src/utils/`)

- **`scroll.js`** - Функции для работы со скроллом

### 3. Оптимизация компонентов

- Компоненты используют константы вместо хардкода
- Уменьшено дублирование кода
- Единообразная структура
- Использование маппинга для повторяющихся элементов

## 🌍 Многоязычность

Поддержка 3 языков:
- 🇺🇸 English (EN)
- 🇷🇺 Русский (RU)
- 🇺🇿 O'zbekcha (UZ)

Переключение через кнопку в хедере.

## ✨ Анимации при скролле

Анимации запускаются когда элементы появляются в viewport:
- `fade-in-left` - Появление слева
- `fade-in-right` - Появление справа
- `fade-in-up` - Появление снизу
- `fade-in-down` - Появление сверху

## 🚀 Запуск проекта

```bash
# Установка зависимостей
npm install

# Запуск dev сервера
npm start

# Сборка для production
npm run build
```

## 📦 Основные зависимости

- React 19.1.1
- Swiper 12.0.3 (для слайдера)
- SCSS для стилей

## 🖼 Images

Source art lives in `art-source/` (outside `src/`, never bundled). Run
`npm run images` after changing it to regenerate the WebP derivatives and the
Open Graph share image that the components import.

## 🎨 Themes

Colour lives in `src/assets/styles/tokens.scss` as CSS custom properties, with a
dark override under `[data-theme="dark"]`. The theme is applied to `<html>`
before React mounts by an inline script in `public/index.html`.

## 📊 Analytics

`@vercel/analytics` (cookieless, no consent banner needed) plus Speed Insights.
Events go through `src/utils/analytics.js` — never import the vendor SDK
directly in a component.

## 🎨 Архитектурные принципы

1. **Разделение ответственности** - Константы, компоненты, утилиты разделены
2. **Переиспользуемость** - Константы и утилиты используются во всех компонентах
3. **Масштабируемость** - Легко добавлять новые языки, секции, анимации
4. **Читаемость** - Чистый код с понятной структурой

