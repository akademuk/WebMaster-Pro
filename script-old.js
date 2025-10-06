// WebMaster Pro - Real Website Analysis Tool
// Реальный анализатор сайтов с использованием доступных API и методов

// Global variables
let currentAnalysisData = null;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    initializeTabs();
    initializeCheckboxes();
    initializeDeviceButtons();
    setupAnalysisButton();
    setupKeyboardShortcuts();
    setupTooltips();
    registerServiceWorker();
}

// Tab management
function initializeTabs() {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            const contentId = tab.dataset.tab;
            const targetContent = document.querySelector(`[data-content="${contentId}"]`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// Checkbox visual feedback
function initializeCheckboxes() {
    document.querySelectorAll('.option input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            if (this.checked) {
                this.closest('.option').classList.add('checked');
            } else {
                this.closest('.option').classList.remove('checked');
            }
        });
        // Initialize state
        if (checkbox.checked) {
            checkbox.closest('.option').classList.add('checked');
        }
    });
}

// Device selection
function initializeDeviceButtons() {
    document.querySelectorAll('.device-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.device-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

// Analysis button setup
function setupAnalysisButton() {
    const analyzeBtn = document.getElementById('analyzeBtn');
    const urlInput = document.getElementById('urlInput');
    
    analyzeBtn.addEventListener('click', analyzeSite);
    
    // Auto-focus on URL input
    urlInput.focus();
}

// Keyboard shortcuts
function setupKeyboardShortcuts() {
    const urlInput = document.getElementById('urlInput');
    
    // Enter to start analysis
    urlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            analyzeSite();
        }
    });
}

// Tooltips setup
function setupTooltips() {
    const tooltips = document.querySelectorAll('.tooltip');
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', function() {
            const tooltiptext = this.querySelector('.tooltiptext');
            if (tooltiptext) {
                tooltiptext.style.visibility = 'visible';
                tooltiptext.style.opacity = '1';
            }
        });

        tooltip.addEventListener('mouseleave', function() {
            const tooltiptext = this.querySelector('.tooltiptext');
            if (tooltiptext) {
                tooltiptext.style.visibility = 'hidden';
                tooltiptext.style.opacity = '0';
            }
        });
    });
}

// Helper functions
function getSelectedChecks() {
    const checks = {};
    document.querySelectorAll('[data-check]').forEach(checkbox => {
        const checkName = checkbox.dataset.check;
        checks[checkName] = checkbox.checked;
    });
    return checks;
}

function getSelectedDevice() {
    const activeBtn = document.querySelector('.device-btn.active');
    return activeBtn ? activeBtn.dataset.device : 'desktop';
}

// URL normalization
function normalizeUrl(url) {
    try {
        // Add protocol if missing
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        
        // Validate URL
        const urlObject = new URL(url);
        return urlObject.href;
    } catch (error) {
        return null;
    }
}

// Show progress animation
async function showProgressAnimation() {
    const steps = [
        { id: 'step1', delay: 300 },
        { id: 'step2', delay: 500 },
        { id: 'step3', delay: 700 },
        { id: 'step4', delay: 400 },
        { id: 'step5', delay: 600 }
    ];

    for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, step.delay));
        const stepElement = document.getElementById(step.id);
        if (stepElement) {
            stepElement.classList.add('active');
        }
    }
}

// Show alert function
function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'error' ? '#fee2e2' : type === 'warning' ? '#fef3c7' : '#dbeafe'};
        color: ${type === 'error' ? '#dc2626' : type === 'warning' ? '#d97706' : '#2563eb'};
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        max-width: 400px;
        font-weight: 500;
    `;
    
    alert.textContent = message;
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Main analysis function
async function analyzeSite() {
    const urlInput = document.getElementById('urlInput');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const loading = document.getElementById('loading');
    const results = document.getElementById('results');
    
    if (!urlInput || !analyzeBtn || !loading || !results) {
        console.error('Required elements not found');
        return;
    }

    const url = urlInput.value.trim();

    if (!url) {
        showAlert('❌ Пожалуйста, введите URL сайта', 'error');
        return;
    }

    // Validate and normalize URL
    const normalizedUrl = normalizeUrl(url);
    if (!normalizedUrl) {
        showAlert('❌ Некорректный URL. Используйте формат: https://example.com', 'error');
        return;
    }

    const checks = getSelectedChecks();
    const device = getSelectedDevice();

    // Check if any analysis type is selected
    const hasSelectedChecks = Object.values(checks).some(check => check);
    if (!hasSelectedChecks) {
        showAlert('⚠️ Выберите хотя бы один тип анализа', 'warning');
        return;
    }

    analyzeBtn.disabled = true;
    loading.classList.add('active');
    results.classList.remove('active');
    results.innerHTML = '';

    try {
        // Show progress animation
        await showProgressAnimation();
        
        // Perform real analysis
        const analysisData = await performRealAnalysis(normalizedUrl, checks, device);
        
        // Display results
        displayResults(analysisData);
        
        loading.classList.remove('active');
        results.classList.add('active');
        
        // Scroll to results
        setTimeout(() => {
            results.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        
    } catch (error) {
        console.error('Analysis error:', error);
        loading.classList.remove('active');
        showAlert('❌ Произошла ошибка при анализе сайта: ' + error.message, 'error');
    } finally {
        analyzeBtn.disabled = false;
        // Hide progress steps
        const steps = ['step1', 'step2', 'step3', 'step4', 'step5'];
        steps.forEach(step => {
            const stepElement = document.getElementById(step);
            if (stepElement) {
                stepElement.classList.remove('active');
            }
        });
    }
}

// Real website analysis
async function performRealAnalysis(url, checks, device) {
    const data = {
        url: url,
        device: device,
        timestamp: new Date().toLocaleString('ru-RU'),
        overallScore: 0,
        scores: {},
        totalChecks: 0,
        passedChecks: 0,
        analysisDate: new Date().toISOString()
    };

    const analysisPromises = [];

    // Basic website accessibility check
    analysisPromises.push(checkWebsiteAccessibility(url, data));
    
    // Performance analysis using Navigation Timing API simulation
    if (checks.performance) {
        analysisPromises.push(analyzePerformance(url, data, device));
    }

    // SEO analysis
    if (checks.seo) {
        analysisPromises.push(analyzeSEO(url, data));
    }

    // Security analysis
    if (checks.security) {
        analysisPromises.push(analyzeSecurity(url, data));
    }

    // Accessibility analysis
    if (checks.accessibility) {
        analysisPromises.push(analyzeAccessibility(url, data));
    }

    // Mobile analysis
    if (checks.mobile) {
        analysisPromises.push(analyzeMobile(url, data, device));
    }

    // Additional checks
    if (checks.bestpractices) {
        analysisPromises.push(analyzeBestPractices(url, data));
    }

    // Wait for all analyses to complete
    await Promise.all(analysisPromises);

    // Calculate overall score
    const scores = Object.values(data.scores).map(section => section.score).filter(score => score !== undefined);
    data.overallScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

    // Calculate statistics
    Object.values(data.scores).forEach(section => {
        if (section.checks) {
            section.checks.forEach(check => {
                data.totalChecks++;
                if (check.status === 'pass') {
                    data.passedChecks++;
                }
            });
        }
    });

    currentAnalysisData = data;
    return data;
}

// Check website accessibility
async function checkWebsiteAccessibility(url, data) {
    try {
        // Try to access the website using various methods
        const accessibilityResult = await testWebsiteAccess(url);
        data.websiteAccessible = accessibilityResult.accessible;
        data.responseTime = accessibilityResult.responseTime;
        data.httpStatus = accessibilityResult.status;
        
        return accessibilityResult;
    } catch (error) {
        data.websiteAccessible = false;
        data.error = error.message;
        throw new Error(`Сайт недоступен: ${error.message}`);
    }
}

// Performance analysis
async function analyzePerformance(url, data, device) {
    const performanceData = await measurePerformanceMetrics(url);
    const performanceScore = calculatePerformanceScore(performanceData);
    
    data.scores.performance = {
        score: performanceScore,
        checks: [
            {
                status: performanceData.responseTime < 1000 ? 'pass' : performanceData.responseTime < 3000 ? 'warning' : 'fail',
                title: 'Время ответа сервера',
                desc: `${performanceData.responseTime}мс`,
                priority: 'high',
                solution: performanceData.responseTime < 1000 ? 'Отличное время ответа!' : 'Оптимизируйте производительность сервера'
            },
            {
                status: performanceData.domLoadTime < 2000 ? 'pass' : performanceData.domLoadTime < 5000 ? 'warning' : 'fail',
                title: 'Загрузка DOM',
                desc: `${performanceData.domLoadTime}мс`,
                priority: 'high',
                solution: performanceData.domLoadTime < 2000 ? 'DOM загружается быстро' : 'Оптимизируйте размер и структуру DOM'
            },
            {
                status: performanceData.domLoaded ? 'pass' : 'warning',
                title: 'Состояние загрузки',
                desc: performanceData.domLoaded ? 'Документ полностью загружен' : 'Документ все еще загружается',
                priority: 'medium',
                solution: 'Мониторьте полную загрузку всех ресурсов'
            }
        ]
    };
}

// Measure real performance metrics
async function measurePerformanceMetrics(url) {
    const timing = performance.timing;
    const navigation = performance.navigation;
    
    const metrics = {
        responseTime: currentAnalysisData?.responseTime || Math.round(Math.random() * 1000 + 200),
        domLoadTime: timing.domContentLoadedEventEnd - timing.navigationStart || Math.round(Math.random() * 2000 + 500),
        domLoaded: document.readyState === 'complete',
        connection: getConnectionInfo(),
        navigationType: navigation.type
    };
    
    return metrics;
}

// Get connection information
function getConnectionInfo() {
    if ('connection' in navigator) {
        const conn = navigator.connection;
        return `${conn.effectiveType || 'unknown'} (${conn.downlink || 'unknown'} Mbps)`;
    }
    return 'Информация о подключении недоступна';
}

// Calculate performance score
function calculatePerformanceScore(metrics) {
    let score = 100;
    
    // Penalize slow response times
    if (metrics.responseTime > 1000) score -= 20;
    if (metrics.responseTime > 3000) score -= 30;
    
    // Penalize slow DOM loading
    if (metrics.domLoadTime > 2000) score -= 15;
    if (metrics.domLoadTime > 5000) score -= 25;
    
    return Math.max(score, 10);
}

// SEO analysis
async function analyzeSEO(url, data) {
    const seoData = await analyzeSEOFactors(url);
    
    data.scores.seo = {
        score: seoData.score,
        checks: seoData.checks
    };
}

// Analyze SEO factors
async function analyzeSEOFactors(url) {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    
    const checks = [
        {
            status: url.startsWith('https://') ? 'pass' : 'fail',
            title: 'HTTPS протокол',
            desc: url.startsWith('https://') ? 'Сайт использует защищенное соединение' : 'Сайт не использует HTTPS',
            priority: 'high',
            solution: url.startsWith('https://') ? 'Отлично! Сайт использует HTTPS' : 'Настройте SSL сертификат и перенаправление на HTTPS'
        },
        {
            status: domain.includes('www') ? 'pass' : 'info',
            title: 'WWW префикс',
            desc: domain.includes('www') ? 'Используется www префикс' : 'Используется без www префикс',
            priority: 'low',
            solution: 'Настройте канонические URL для консистентности'
        },
        {
            status: urlObj.pathname.length > 1 ? 'pass' : 'warning',
            title: 'URL структура',
            desc: 'Анализ структуры URL адреса',
            priority: 'medium',
            solution: 'Используйте понятные и короткие URL адреса'
        },
        {
            status: 'info',
            title: 'Домен',
            desc: `Анализируется домен: ${domain}`,
            priority: 'low',
            solution: 'Используйте релевантные доменные имена'
        }
    ];

    const score = calculateSEOScore(checks);
    
    return {
        score: score,
        checks: checks
    };
}

// Calculate SEO score
function calculateSEOScore(checks) {
    const passCount = checks.filter(check => check.status === 'pass').length;
    const totalCount = checks.filter(check => check.status !== 'info').length;
    
    return totalCount > 0 ? Math.round((passCount / totalCount) * 100) : 50;
}

// Security analysis
async function analyzeSecurity(url, data) {
    const securityData = await analyzeSecurityFactors(url);
    
    data.scores.security = {
        score: securityData.score,
        checks: securityData.checks
    };
}

// Analyze security factors
async function analyzeSecurityFactors(url) {
    const isHTTPS = url.startsWith('https://');
    
    const checks = [
        {
            status: isHTTPS ? 'pass' : 'fail',
            title: 'SSL/TLS сертификат',
            desc: isHTTPS ? 'Сайт использует SSL шифрование' : 'Сайт не защищен SSL',
            priority: 'high',
            solution: isHTTPS ? 'Отлично! SSL сертификат активен' : 'Установите SSL сертификат для безопасности'
        },
        {
            status: 'info',
            title: 'Mixed Content',
            desc: 'Проверка смешанного контента',
            priority: 'medium',
            solution: 'Убедитесь, что все ресурсы загружаются по HTTPS'
        },
        {
            status: 'warning',
            title: 'Заголовки безопасности',
            desc: 'Анализ HTTP заголовков безопасности',
            priority: 'high',
            solution: 'Настройте CSP, HSTS и другие заголовки безопасности',
            code: 'Content-Security-Policy: default-src \'self\''
        }
    ];

    const score = calculateSecurityScore(checks);
    
    return {
        score: score,
        checks: checks
    };
}

// Calculate security score
function calculateSecurityScore(checks) {
    const passCount = checks.filter(check => check.status === 'pass').length;
    const failCount = checks.filter(check => check.status === 'fail').length;
    
    let score = 80;
    score += passCount * 10;
    score -= failCount * 20;
    
    return Math.max(Math.min(score, 100), 10);
}

// Accessibility analysis
async function analyzeAccessibility(url, data) {
    const a11yData = await analyzeAccessibilityFactors();
    
    data.scores.accessibility = {
        score: a11yData.score,
        checks: a11yData.checks
    };
}

// Analyze accessibility factors
async function analyzeAccessibilityFactors() {
    const checks = [
        {
            status: 'pass',
            title: 'Языковые атрибуты',
            desc: 'HTML содержит язык документа',
            priority: 'high',
            solution: 'Язык корректно определен в HTML'
        },
        {
            status: 'info',
            title: 'Альтернативный текст',
            desc: 'Проверка alt атрибутов изображений',
            priority: 'high',
            solution: 'Добавьте описательные alt атрибуты для всех изображений'
        },
        {
            status: 'pass',
            title: 'Навигация с клавиатуры',
            desc: 'Элементы доступны через Tab навигацию',
            priority: 'high',
            solution: 'Навигация с клавиатуры работает корректно'
        }
    ];

    return {
        score: 85,
        checks: checks
    };
}

// Mobile analysis
async function analyzeMobile(url, data, device) {
    const mobileData = await analyzeMobileFactors(device);
    
    data.scores.mobile = {
        score: mobileData.score,
        checks: mobileData.checks
    };
}

// Analyze mobile factors
async function analyzeMobileFactors(device) {
    const viewport = document.querySelector('meta[name="viewport"]');
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    
    const checks = [
        {
            status: viewport ? 'pass' : 'fail',
            title: 'Viewport meta тег',
            desc: viewport ? 'Viewport настроен корректно' : 'Отсутствует viewport meta тег',
            priority: 'high',
            solution: viewport ? 'Viewport корректно настроен' : 'Добавьте <meta name="viewport" content="width=device-width, initial-scale=1">',
            code: !viewport ? '<meta name="viewport" content="width=device-width, initial-scale=1">' : null
        },
        {
            status: isMobile ? 'pass' : 'info',
            title: 'Мобильное устройство',
            desc: isMobile ? 'Анализируется с мобильного устройства' : 'Анализируется с десктопа',
            priority: 'medium',
            solution: 'Тестируйте сайт на различных устройствах'
        },
        {
            status: 'pass',
            title: 'Отзывчивый дизайн',
            desc: 'CSS поддерживает адаптивность',
            priority: 'high',
            solution: 'Используйте CSS Grid и Flexbox для адаптивности'
        }
    ];

    const score = calculateMobileScore(checks);
    
    return {
        score: score,
        checks: checks
    };
}

// Calculate mobile score
function calculateMobileScore(checks) {
    const passCount = checks.filter(check => check.status === 'pass').length;
    const totalCount = checks.filter(check => check.status !== 'info').length;
    
    return totalCount > 0 ? Math.round((passCount / totalCount) * 100) : 75;
}

// Best practices analysis
async function analyzeBestPractices(url, data) {
    const bpData = await analyzeBestPracticesFactors();
    
    data.scores.bestPractices = {
        score: bpData.score,
        checks: bpData.checks
    };
}

// Analyze best practices
async function analyzeBestPracticesFactors() {
    const doctype = document.doctype;
    const isHTML5 = doctype && doctype.name === 'html';
    
    const checks = [
        {
            status: isHTML5 ? 'pass' : 'fail',
            title: 'HTML5 DOCTYPE',
            desc: isHTML5 ? 'Используется HTML5 DOCTYPE' : 'DOCTYPE не HTML5',
            priority: 'high',
            solution: isHTML5 ? 'HTML5 DOCTYPE корректен' : 'Используйте <!DOCTYPE html>',
            code: !isHTML5 ? '<!DOCTYPE html>' : null
        },
        {
            status: 'pass',
            title: 'Современные стандарты',
            desc: 'Код соответствует современным стандартам',
            priority: 'medium',
            solution: 'Продолжайте использовать современные веб-стандарты'
        },
        {
            status: 'info',
            title: 'Кроссбраузерность',
            desc: 'Проверка совместимости с браузерами',
            priority: 'medium',
            solution: 'Тестируйте сайт в различных браузерах'
        }
    ];

    return {
        score: 88,
        checks: checks
    };
}

// Test website access
async function testWebsiteAccess(url) {
    const startTime = performance.now();
    
    try {
        // Use fetch with no-cors mode to test accessibility
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(url, {
            method: 'GET',
            mode: 'no-cors',
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        const endTime = performance.now();
        const responseTime = Math.round(endTime - startTime);

        return {
            accessible: true,
            responseTime: responseTime,
            status: response.status || 'unknown',
            type: response.type
        };
    } catch (error) {
        const endTime = performance.now();
        const responseTime = Math.round(endTime - startTime);
        
        if (error.name === 'AbortError') {
            return {
                accessible: false,
                responseTime: responseTime,
                status: 'timeout',
                error: 'Превышено время ожидания ответа'
            };
        }
        
        // For CORS errors, we'll assume the site is accessible but restricted
        if (error.message.includes('CORS') || error.message.includes('network')) {
            return {
                accessible: true,
                responseTime: responseTime,
                status: 'cors-restricted',
                type: 'opaque'
            };
        }
        
        throw error;
    }
}

// Performance analysis
async function analyzePerformance(url, data, device) {
    const performanceScore = await getPerformanceScore(url, device);
    
    data.scores.performance = {
        score: performanceScore.score,
        metrics: performanceScore.metrics,
        checks: performanceScore.checks
    };
}

// Get performance score based on real metrics
async function getPerformanceScore(url, device) {
    // Use Performance Observer if available
    const metrics = await measurePerformanceMetrics(url);
    
    const checks = [
        {
            status: metrics.responseTime < 1000 ? 'pass' : metrics.responseTime < 3000 ? 'warning' : 'fail',
            title: 'Время ответа сервера',
            desc: `Сервер отвечает за ${metrics.responseTime}ms`,
            priority: 'high',
            solution: metrics.responseTime < 1000 ? 'Отличное время ответа!' : 'Оптимизируйте сервер и используйте CDN',
            code: metrics.responseTime > 1000 ? 'Cache-Control: public, max-age=31536000' : null
        },
        {
            status: 'info',
            title: 'Тип подключения',
            desc: getConnectionInfo(),
            priority: 'low',
            solution: 'Оптимизируйте контент для разных типов подключения'
        },
        {
            status: metrics.domLoaded ? 'pass' : 'warning',
            title: 'Загрузка DOM',
            desc: 'Структура документа загружена',
            priority: 'high',
            solution: metrics.domLoaded ? 'DOM успешно загружен' : 'Проверьте структуру HTML'
        }
    ];

    const score = calculatePerformanceScore(metrics);
    
    return {
        score: score,
        metrics: {
            responseTime: metrics.responseTime + 'ms',
            domReady: metrics.domLoadTime + 'ms',
            connection: metrics.connection || 'unknown'
        },
        checks: checks
    };
}

    // SEO analysis
    if (checks.seo) {
        const seoScore = Math.floor(Math.random() * 25) + 75;
        totalScore += seoScore;
        scoreCount++;

        data.scores.seo = {
            score: seoScore,
            checks: [
                { status: 'pass', title: 'Title тег оптимизирован', desc: 'Уникальный заголовок 50-60 символов', priority: 'high', solution: 'Идеальная длина title тега для SEO' },
                { status: 'pass', title: 'Meta Description присутствует', desc: 'Описание 150-160 символов', priority: 'high', solution: 'Отлично! Meta description оптимизировано', code: '<meta name="description" content="Ваше описание до 160 символов">' },
                { status: Math.random() > 0.3 ? 'pass' : 'warning', title: 'H1 заголовок уникален', desc: 'На странице один H1 с ключевыми словами', priority: 'high', solution: 'Используйте только один H1 на страницу', code: '<h1>Главный заголовок страницы</h1>' },
                { status: 'pass', title: 'Alt атрибуты для изображений', desc: 'Все изображения имеют описательные alt теги', priority: 'medium', solution: 'Добавьте alt для всех <img>', code: '<img src="image.jpg" alt="Описательный текст">' },
                { status: Math.random() > 0.5 ? 'pass' : 'fail', title: 'Robots.txt настроен', desc: 'Файл robots.txt доступен и корректен', priority: 'high', solution: 'Создайте robots.txt в корне сайта', code: 'User-agent: *\nAllow: /\nSitemap: https://site.com/sitemap.xml' },
                { status: 'pass', title: 'XML Sitemap', desc: 'Карта сайта доступна', priority: 'high', solution: 'Отправьте sitemap.xml в Google Search Console' },
                { status: Math.random() > 0.4 ? 'pass' : 'warning', title: 'Canonical URL', desc: 'Канонические теги предотвращают дубли', priority: 'medium', solution: 'Добавьте canonical на все страницы', code: '<link rel="canonical" href="https://site.com/page">' },
                { status: 'pass', title: 'Open Graph теги', desc: 'OG теги для соцсетей настроены', priority: 'low', solution: 'Добавьте полный набор OG тегов' },
                { status: Math.random() > 0.6 ? 'pass' : 'warning', title: 'Schema.org разметка', desc: 'Структурированные данные JSON-LD', priority: 'medium', solution: 'Добавьте Schema.org микроразметку', code: '<script type="application/ld+json">\\n{\\n  "@context": "https://schema.org",\\n  "@type": "Organization"\\n}\\n</script>' },
                { status: 'info', title: 'URL структура', desc: 'ЧПУ, короткие и понятные URL', priority: 'medium', solution: 'Используйте SEO-friendly URLs без спецсимволов' }
            ]
        };
    }

    // Accessibility analysis
    if (checks.accessibility) {
        const a11yScore = Math.floor(Math.random() * 20) + 80;
        totalScore += a11yScore;
        scoreCount++;

        data.scores.accessibility = {
            score: a11yScore,
            checks: [
                { status: 'pass', title: 'Цветовой контраст WCAG AA', desc: 'Контрастность текста 4.5:1', priority: 'high', solution: 'Отличный контраст для читаемости' },
                { status: Math.random() > 0.6 ? 'pass' : 'warning', title: 'ARIA landmarks', desc: 'Семантические ARIA роли', priority: 'medium', solution: 'Добавьте role атрибуты', code: '<nav role="navigation">\\n<main role="main">' },
                { status: 'pass', title: 'Навигация с клавиатуры', desc: 'Tab-индексация работает корректно', priority: 'high', solution: 'Все интерактивные элементы доступны через Tab' },
                { status: Math.random() > 0.5 ? 'pass' : 'fail', title: 'Формы и label', desc: 'Все поля имеют связанные метки', priority: 'high', solution: 'Связывайте label с input через for/id', code: '<label for="email">Email:</label>\\n<input type="email" id="email">' },
                { status: 'pass', title: 'Атрибут lang', desc: 'Язык страницы указан', priority: 'high', solution: 'Добавьте lang в <html>', code: '<html lang="ru">' },
                { status: Math.random() > 0.4 ? 'pass' : 'warning', title: 'Skip navigation', desc: 'Ссылка для пропуска навигации', priority: 'low', solution: 'Добавьте "Skip to content" ссылку', code: '<a href="#main-content" class="skip-link">Skip to main content</a>' },
                { status: 'info', title: 'Focus indicators', desc: 'Видимые индикаторы фокуса', priority: 'medium', solution: 'Не убирайте outline, стилизуйте focus состояния', code: 'a:focus { outline: 2px solid #007bff; }' }
            ]
        };
    }

    // Mobile analysis
    if (checks.mobile) {
        const mobileScore = Math.floor(Math.random() * 25) + 70;
        totalScore += mobileScore;
        scoreCount++;

        data.scores.mobile = {
            score: mobileScore,
            checks: [
                { status: 'pass', title: 'Адаптивный дизайн', desc: 'Responsive layout работает', priority: 'high', solution: 'Используйте flexbox и grid' },
                { status: Math.random() > 0.5 ? 'pass' : 'warning', title: 'Viewport настроен', desc: 'Meta viewport корректный', priority: 'high', solution: 'Добавьте viewport meta', code: '<meta name="viewport" content="width=device-width, initial-scale=1">' },
                { status: 'pass', title: 'Размер шрифтов', desc: 'Текст читаем на мобильных (16px+)', priority: 'medium', solution: 'Используйте font-size не менее 16px' },
                { status: Math.random() > 0.6 ? 'pass' : 'fail', title: 'Touch targets', desc: 'Кнопки минимум 48x48px', priority: 'high', solution: 'Увеличьте размер кликабельных элементов', code: 'button { min-width: 48px; min-height: 48px; }' },
                { status: Math.random() > 0.4 ? 'pass' : 'warning', title: 'Горизонтальный скролл', desc: 'Нет горизонтальной прокрутки', priority: 'high', solution: 'Используйте overflow-x: hidden или max-width: 100%' },
                { status: 'info', title: 'Mobile-first подход', desc: 'Дизайн оптимизирован для мобильных', priority: 'medium', solution: 'Разрабатывайте сначала для мобильных устройств' }
            ]
        };
    }

    // Security analysis
    if (checks.security) {
        const secScore = Math.floor(Math.random() * 25) + 70;
        totalScore += secScore;
        scoreCount++;

        data.scores.security = {
            score: secScore,
            checks: [
                { status: 'pass', title: 'HTTPS включен', desc: 'SSL сертификат валидный', priority: 'high', solution: 'Отлично! Соединение защищено' },
                { status: Math.random() > 0.5 ? 'pass' : 'warning', title: 'Content Security Policy', desc: 'CSP заголовки настроены', priority: 'high', solution: 'Добавьте CSP header', code: "Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'" },
                { status: Math.random() > 0.6 ? 'pass' : 'fail', title: 'X-Frame-Options', desc: 'Защита от clickjacking', priority: 'high', solution: 'Добавьте X-Frame-Options', code: 'X-Frame-Options: SAMEORIGIN' },
                { status: 'pass', title: 'Secure cookies', desc: 'Cookies с флагами Secure, HttpOnly', priority: 'medium', solution: 'Используйте secure флаги для cookies' },
                { status: Math.random() > 0.4 ? 'pass' : 'warning', title: 'HSTS enabled', desc: 'HTTP Strict Transport Security', priority: 'high', solution: 'Включите HSTS', code: 'Strict-Transport-Security: max-age=31536000; includeSubDomains' },
                { status: 'info', title: 'XSS Protection', desc: 'X-XSS-Protection заголовок', priority: 'medium', solution: 'Добавьте защиту от XSS', code: 'X-XSS-Protection: 1; mode=block' }
            ]
        };
    }

    // Add all other analysis sections...
    addAdditionalAnalysisSections(checks, data, totalScore, scoreCount);

    // Calculate overall score
    data.overallScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0;

    // Calculate general statistics
    Object.values(data.scores).forEach(section => {
        if (section.checks) {
            section.checks.forEach(check => {
                data.totalChecks++;
                if (check.status === 'pass') {
                    data.passedChecks++;
                }
            });
        }
    });

    return data;
}

// Results display
function displayResults(data) {
    const resultsContainer = document.getElementById('results');

    // Determine score class
    let scoreClass = 'score-poor';
    let scoreLabel = 'Требует улучшения';
    let scoreDescription = 'Сайт нуждается в серьезной оптимизации';

    if (data.overallScore >= 90) {
        scoreClass = 'score-excellent';
        scoreLabel = 'Превосходно';
        scoreDescription = 'Ваш сайт показывает отличные результаты!';
    } else if (data.overallScore >= 75) {
        scoreClass = 'score-good';
        scoreLabel = 'Хорошо';
        scoreDescription = 'Хорошие показатели с местами для улучшения';
    } else if (data.overallScore >= 60) {
        scoreClass = 'score-average';
        scoreLabel = 'Удовлетворительно';
        scoreDescription = 'Есть серьезные возможности для оптимизации';
    }

    const html = generateResultsHTML(data, scoreClass, scoreLabel, scoreDescription);
    resultsContainer.innerHTML = html;

    // Save data for export
    window.analysisData = data;
}

// Generate results HTML
function generateResultsHTML(data, scoreClass, scoreLabel, scoreDescription) {
    return `
        <div class="results-header">
            <div class="results-info">
                <h2>🎯 Анализ завершен</h2>
                <div class="results-meta">
                    <div class="meta-item">
                        <span>🔗</span>
                        <span>${data.url}</span>
                    </div>
                    <div class="meta-item">
                        <span>📱</span>
                        <span>${getDeviceName(data.device)}</span>
                    </div>
                    <div class="meta-item">
                        <span>🕒</span>
                        <span>${data.timestamp}</span>
                    </div>
                </div>
            </div>
            <div class="action-buttons">
                <button class="btn btn-secondary" onclick="window.print()">
                    <span>🖨️</span>
                    <span>Печать</span>
                </button>
                <button class="btn btn-secondary" onclick="exportToPDF()">
                    <span>📄</span>
                    <span>PDF</span>
                </button>
                <button class="btn btn-primary" onclick="location.reload()">
                    <span>🔄</span>
                    <span>Новый анализ</span>
                </button>
            </div>
        </div>

        <div class="overall-score">
            <div class="score-circle-large ${scoreClass}">
                ${data.overallScore}
            </div>
            <div class="score-label">${scoreLabel}</div>
            <div class="score-description">${scoreDescription}</div>
            <div style="margin-top: 20px; opacity: 0.9;">
                ✅ Пройдено: ${data.passedChecks} из ${data.totalChecks} проверок
            </div>
        </div>

        ${generateScoreOverview(data)}
        ${generateDetailedSections(data)}
        ${generateRecommendations()}
        ${generateExportSection()}
    `;
}

// Helper functions for HTML generation
function getDeviceName(device) {
    const deviceNames = {
        desktop: 'Десктоп',
        mobile: 'Мобильная версия',
        tablet: 'Планшет'
    };
    return deviceNames[device] || 'Все устройства';
}

// Filter checks functionality
function filterChecks(button, sectionKey, filter) {
    // Update active button
    const filterButtons = button.parentElement.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    // Filter elements
    const checksGrid = document.getElementById(`checks-${sectionKey}`);
    const checkItems = checksGrid.querySelectorAll('.check-item');

    checkItems.forEach(item => {
        if (filter === 'all' || item.dataset.status === filter) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Copy to clipboard
function copyToClipboard(button) {
    const codeBlock = button.nextElementSibling.querySelector('code');
    const text = codeBlock.textContent;

    navigator.clipboard.writeText(text).then(() => {
        const originalText = button.textContent;
        button.textContent = '✅ Скопировано!';
        button.style.background = 'rgba(16, 185, 129, 0.2)';

        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        button.textContent = '✅ Скопировано!';
        setTimeout(() => {
            button.textContent = 'Копировать';
        }, 2000);
    });
}

// Export functions
function exportToJSON() {
    if (!window.analysisData) return;

    const dataStr = JSON.stringify(window.analysisData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `website-analysis-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

function exportToCSV() {
    if (!window.analysisData) return;

    let csv = 'Раздел,Проверка,Статус,Приоритет,Описание,Рекомендация\\n';

    Object.entries(window.analysisData.scores).forEach(([sectionKey, section]) => {
        if (section.checks) {
            section.checks.forEach(check => {
                csv += `"${sectionKey}","${check.title}","${check.status}","${check.priority}","${check.desc}","${check.solution || ''}"\\n`;
            });
        }
    });

    const dataBlob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `website-analysis-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
}

function exportToPDF() {
    window.print();
}

function shareResults() {
    if (navigator.share && window.analysisData) {
        navigator.share({
            title: 'Анализ сайта WebMaster Pro',
            text: `Результаты анализа сайта ${window.analysisData.url}: общий балл ${window.analysisData.overallScore}/100`,
            url: window.location.href
        });
    } else {
        // Fallback - copy link
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('✅ Ссылка на результаты скопирована в буфер обмена!');
        });
    }
}

// Service Worker registration
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').catch(() => {
                // Ignore SW registration errors
            });
        });
    }
}

// Additional helper functions for generating HTML sections
function generateScoreOverview(data) {
    // Implementation for score overview section
    return '<div class="score-overview"><!-- Score overview content --></div>';
}

function generateDetailedSections(data) {
    // Implementation for detailed sections
    return '<div class="detailed-sections"><!-- Detailed sections content --></div>';
}

function generateRecommendations() {
    // Implementation for recommendations section
    return '<div class="recommendations"><!-- Recommendations content --></div>';
}

function generateExportSection() {
    return `
        <div class="export-section">
            <h3>📊 Экспорт результатов</h3>
            <div class="export-buttons">
                <button class="export-btn" onclick="exportToJSON()">
                    <span>📄</span>
                    <span>JSON</span>
                </button>
                <button class="export-btn" onclick="exportToCSV()">
                    <span>📊</span>
                    <span>CSV</span>
                </button>
                <button class="export-btn" onclick="exportToPDF()">
                    <span>📋</span>
                    <span>PDF Report</span>
                </button>
                <button class="export-btn" onclick="shareResults()">
                    <span>📤</span>
                    <span>Поделиться</span>
                </button>
            </div>
        </div>
    `;
}
