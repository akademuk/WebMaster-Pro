# 🚀 Руководство по развертыванию WebMaster Pro

## 📋 Содержание
1. [Локальная разработка](#локальная-разработка)
2. [GitHub Pages](#github-pages)
3. [Netlify](#netlify)
4. [Vercel](#vercel)
5. [Apache/Nginx](#apachenginx)
6. [Docker](#docker)

## 🖥️ Локальная разработка

### Вариант 1: Python (рекомендуется)
```bash
# Перейдите в папку проекта
cd webmaster-pro

# Python 3
python -m http.server 8000

# Или Python 2
python -m SimpleHTTPServer 8000

# Откройте браузер: http://localhost:8000
```

### Вариант 2: Node.js
```bash
# Установите serve глобально
npm install -g serve

# Запустите сервер
serve -s . -l 3000

# Откройте браузер: http://localhost:3000
```

### Вариант 3: Live Server (VS Code)
1. Установите расширение "Live Server" в VS Code
2. Откройте `index.html`
3. Нажмите "Go Live" в статусной строке

### Вариант 4: Batch файл (Windows)
```bash
# Просто запустите
start-server.bat
```

## 🌐 GitHub Pages

### Автоматическое развертывание

1. **Fork репозитория** на GitHub
2. **Включите GitHub Pages**:
   - Settings → Pages
   - Source: GitHub Actions
3. **Push изменения** - сайт автоматически развернется

### Ручное развертывание
```bash
# Установите gh-pages
npm install -g gh-pages

# Разверните
npm run deploy
```

**URL**: `https://ваш-username.github.io/webmaster-pro`

## 📡 Netlify

### Вариант 1: Git интеграция
1. Зайдите на [netlify.com](https://netlify.com)
2. "New site from Git"
3. Выберите ваш репозиторий
4. Build settings:
   - Build command: (оставить пустым)
   - Publish directory: `/`

### Вариант 2: Drag & Drop
1. Зайдите на [netlify.com](https://netlify.com)
2. Перетащите папку проекта в Deploy area
3. Получите URL

### Настройка переадресации
Создайте файл `_redirects`:
```
/*    /index.html   200
```

## ⚡ Vercel

### CLI развертывание
```bash
# Установите Vercel CLI
npm i -g vercel

# Войдите
vercel login

# Разверните
vercel

# Для продакшена
vercel --prod
```

### Git интеграция
1. Зайдите на [vercel.com](https://vercel.com)
2. "Import Project"
3. Выберите репозиторий
4. Deploy

## 🔧 Apache Server

### .htaccess конфигурация
```apache
# Включить сжатие
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript application/json
</IfModule>

# Кэширование
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
</IfModule>

# HTTPS redirect
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

## 🔧 Nginx Server

### nginx.conf конфигурация
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name webmasterpro.com www.webmasterpro.com;
    
    # HTTPS redirect
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name webmasterpro.com www.webmasterpro.com;
    
    # SSL Configuration
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Document root
    root /var/www/webmaster-pro;
    index index.html;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_types
        text/css
        text/javascript
        application/javascript
        application/json
        image/svg+xml;
    
    # Caching
    location ~* \.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Main location
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Service Worker
    location /sw.js {
        add_header Cache-Control "no-cache";
        expires 0;
    }
}
```

## 🐳 Docker

### Dockerfile
```dockerfile
FROM nginx:alpine

# Копировать файлы
COPY . /usr/share/nginx/html

# Копировать Nginx конфиг
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открыть порт
EXPOSE 80

# Запустить Nginx
CMD ["nginx", "-g", "daemon off;"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  webmaster-pro:
    build: .
    ports:
      - "80:80"
    restart: unless-stopped
    
  # С SSL (опционально)
  webmaster-pro-ssl:
    build: .
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./ssl:/etc/ssl/certs
    restart: unless-stopped
```

### Команды Docker
```bash
# Собрать образ
docker build -t webmaster-pro .

# Запустить контейнер
docker run -d -p 8080:80 --name webmaster-pro webmaster-pro

# С docker-compose
docker-compose up -d
```

## 🔒 SSL/HTTPS Setup

### Let's Encrypt (Certbot)
```bash
# Установить certbot
sudo apt install certbot python3-certbot-nginx

# Получить сертификат
sudo certbot --nginx -d webmasterpro.com -d www.webmasterpro.com

# Автообновление
sudo crontab -e
# Добавить: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🚀 Оптимизация для продакшена

### 1. Минификация (опционально)
```bash
# Установить инструменты
npm install -g html-minifier clean-css-cli uglify-js

# Минифицировать HTML
html-minifier --collapse-whitespace --remove-comments index.html -o index.min.html

# Минифицировать CSS (если CSS в отдельном файле)
cleancss -o styles.min.css styles.css

# Минифицировать JS (если JS в отдельном файле)
uglifyjs script.js -o script.min.js -c -m
```

### 2. Сжатие изображений
```bash
# Установить imagemin
npm install -g imagemin-cli imagemin-webp imagemin-pngquant

# Оптимизировать PNG
imagemin *.png --out-dir=optimized --plugin=pngquant

# Конвертировать в WebP
imagemin *.{jpg,png} --out-dir=webp --plugin=webp
```

### 3. Проверка производительности
- **Google PageSpeed Insights**: https://pagespeed.web.dev/
- **GTmetrix**: https://gtmetrix.com/
- **WebPageTest**: https://www.webpagetest.org/

## 📊 Мониторинг

### Google Analytics
```html
<!-- Добавить в <head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Uptime мониторинг
- **UptimeRobot**: https://uptimerobot.com/
- **Pingdom**: https://www.pingdom.com/

## 🔧 Troubleshooting

### Проблемы с Service Worker
```javascript
// Очистить кэш в DevTools
// Application → Storage → Clear site data

// Или программно
navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
        registration.unregister();
    }
});
```

### Проблемы с кэшированием
```bash
# Добавить версию к файлам
index.html?v=2.0.0
sw.js?v=2.0.0
```

### CORS ошибки
```javascript
// Для локальной разработки отключить CORS в Chrome
chrome.exe --user-data-dir=/tmp/foo --disable-web-security
```

## 📞 Поддержка

Если у вас возникли проблемы с развертыванием:

1. **Проверьте логи** сервера
2. **Откройте DevTools** в браузере
3. **Создайте Issue** в GitHub репозитории
4. **Обратитесь к документации** хостинга

---

**Успешного развертывания! 🚀**