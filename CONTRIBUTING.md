# 🤝 Contributing to WebMaster Pro

Спасибо за интерес к улучшению WebMaster Pro! Мы приветствуем вклад от сообщества.

## 📋 Содержание

1. [Code of Conduct](#code-of-conduct)
2. [Как внести вклад](#как-внести-вклад)
3. [Настройка разработки](#настройка-разработки)
4. [Руководящие принципы](#руководящие-принципы)
5. [Процесс Pull Request](#процесс-pull-request)
6. [Стиль кода](#стиль-кода)

## 📜 Code of Conduct

Участвуя в этом проекте, вы соглашаетесь соблюдать наш [Code of Conduct](CODE_OF_CONDUCT.md).

## 🚀 Как внести вклад

### 🐛 Сообщить об ошибке
1. Проверьте [существующие issues](../../issues)
2. Создайте новый issue, используя шаблон Bug Report
3. Предоставьте максимально подробную информацию

### ✨ Предложить функцию
1. Проверьте [существующие issues](../../issues)
2. Создайте новый issue, используя шаблон Feature Request
3. Опишите проблему и предложенное решение

### 💻 Внести код
1. Fork репозитория
2. Создайте feature branch: `git checkout -b feature/amazing-feature`
3. Внесите изменения
4. Протестируйте код
5. Commit: `git commit -m 'feat: Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Создайте Pull Request

## 🛠 Настройка разработки

### Требования
- Современный браузер (Chrome, Firefox, Safari, Edge)
- Текстовый редактор (VS Code рекомендуется)
- Live Server для локальной разработки

### Установка
```bash
# Клонирование
git clone https://github.com/ваш-username/webmaster-pro.git
cd webmaster-pro

# Запуск локального сервера
# Python
python -m http.server 8000

# Node.js
npx serve .

# VS Code Live Server
# Установите расширение Live Server и нажмите "Go Live"
```

### Структура проекта
```
webmaster-pro/
├── index.html          # Главный файл приложения
├── manifest.json       # PWA манифест
├── sw.js              # Service Worker
├── robots.txt         # SEO файл
├── sitemap.xml        # Карта сайта
├── README.md          # Документация
├── LICENSE            # Лицензия
├── .github/           # GitHub шаблоны и workflows
│   ├── workflows/
│   ├── ISSUE_TEMPLATE/
│   └── pull_request_template.md
└── docs/              # Дополнительная документация
```

## 📋 Руководящие принципы

### 🎯 Принципы проекта
- **Простота**: Код должен быть понятным
- **Производительность**: Минимальные зависимости
- **Доступность**: Поддержка всех пользователей
- **Совместимость**: Работа во всех современных браузерах

### 🔍 Области для вклада
- **UI/UX улучшения**: Дизайн и пользовательский опыт
- **Новые проверки**: Дополнительные типы анализа
- **Производительность**: Оптимизация кода
- **Документация**: Улучшение документации
- **Тестирование**: Покрытие тестами
- **Переводы**: Локализация на другие языки

## 🔄 Процесс Pull Request

### Перед созданием PR
1. ✅ Убедитесь, что ваш код работает
2. ✅ Протестируйте в разных браузерах
3. ✅ Следуйте стилю кода
4. ✅ Обновите документацию
5. ✅ Напишите понятное описание

### Требования к PR
- **Понятный заголовок**: Кратко опишите изменения
- **Детальное описание**: Объясните что и зачем изменено
- **Тестирование**: Опишите как тестировали
- **Скриншоты**: Добавьте для UI изменений
- **Связанные issues**: Укажите номера issues

### Процесс ревью
1. Автоматические проверки (если настроены)
2. Ревью кода от мейнтейнеров
3. Обсуждение и возможные изменения
4. Одобрение и merge

## 🎨 Стиль кода

### HTML
```html
<!-- Используйте семантические теги -->
<main>
    <section class="analysis-section">
        <h2>Заголовок секции</h2>
        <p>Описание</p>
    </section>
</main>

<!-- Правильные отступы (4 пробела) -->
<div class="container">
    <div class="content">
        <p>Контент</p>
    </div>
</div>
```

### CSS
```css
/* Используйте CSS переменные */
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
}

/* BEM методология для классов */
.analysis-section {
    background: var(--primary-color);
}

.analysis-section__title {
    font-size: 1.5em;
}

.analysis-section__title--highlighted {
    color: var(--secondary-color);
}
```

### JavaScript
```javascript
// Используйте const/let вместо var
const analyzeBtn = document.getElementById('analyzeBtn');
let currentAnalysis = null;

// Функции с понятными названиями
function performAnalysis(url, options) {
    // Комментарии для сложной логики
    const results = processAnalysisData(url, options);
    return results;
}

// Async/await для асинхронного кода
async function fetchAnalysisData(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Analysis failed:', error);
        throw error;
    }
}
```

## 📝 Commit Messages

Используйте [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Новая функция
git commit -m "feat: добавить анализ Core Web Vitals"

# Исправление бага
git commit -m "fix: исправить ошибку экспорта в CSV"

# Документация
git commit -m "docs: обновить README с инструкциями по установке"

# Стили
git commit -m "style: улучшить адаптивность на мобильных устройствах"

# Рефакторинг
git commit -m "refactor: упростить логику анализа производительности"
```

## 🏷 Типы изменений

- `feat`: Новая функция
- `fix`: Исправление бага
- `docs`: Изменения в документации
- `style`: Стили, форматирование
- `refactor`: Рефакторинг кода
- `test`: Добавление тестов
- `chore`: Обновление зависимостей, конфигурации

## 🧪 Тестирование

### Ручное тестирование
```bash
# Проверьте в браузерах:
✅ Chrome (последние 2 версии)
✅ Firefox (последние 2 версии)  
✅ Safari (последние 2 версии)
✅ Edge (последние 2 версии)

# Проверьте на устройствах:
✅ Desktop (1920x1080, 1366x768)
✅ Tablet (iPad, Android tablet)
✅ Mobile (iPhone, Android phone)
```

### Автоматическое тестирование
```javascript
// Примеры для будущих тестов
describe('WebMaster Pro', () => {
    test('should load main interface', () => {
        // Test implementation
    });
    
    test('should perform analysis', () => {
        // Test implementation
    });
});
```

## 📞 Получение помощи

Нужна помощь? Обращайтесь:

- 💬 [GitHub Discussions](../../discussions) - для вопросов
- 🐛 [GitHub Issues](../../issues) - для багов
- 📧 Email: contribute@webmasterpro.com
- 💬 Telegram: @webmasterpro_dev

## 🎉 Признание вкладчиков

Все контрибьюторы будут добавлены в:
- README.md раздел Contributors
- CHANGELOG.md для значимых изменений
- Специальная страница благодарностей

## 📄 Лицензия

Внося вклад, вы соглашаетесь с тем, что ваши изменения будут лицензированы под [MIT License](LICENSE).

---

**Спасибо за ваш вклад в WebMaster Pro! 🚀**

*Вместе мы делаем веб лучше!* 🌐