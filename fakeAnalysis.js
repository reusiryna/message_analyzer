/**
 * fakeAnalysis.js
 * Модуль для створення ілюзії глибокого аналізу
 * Включає фальшивий прогрес-бар, генерацію псевдотекстів та анімацій
 */

const fakeMessages = [
    'Аналізуємо метадані...',
    'Визначаємо пасивно-агресивний індекс...',
    'Радимось із всесвітньою справедливістю...',
    'Калібруємо детектор истины...',
    'Запитуємо у алгоритму чоловічо-жіночих взаємин...',
    'Проводимо нейролінгвістичний розбір...',
    'Вивчаємо паралінгвістичні маркери...',
    'Гнучимо простір-час суперечки...',
    'Анвідуємо вічні істини...'
];

let messageIndex = 0;

async function fakeLoading(duration = 2500) {
    return new Promise((resolve) => {
        const formSection = document.getElementById('form-section');
        const loadingSection = document.getElementById('loading-section');
        const progressText = document.getElementById('progress-text');

        formSection.classList.remove('active');
        loadingSection.classList.add('active');

        const startTime = Date.now();
        messageIndex = 0;

        const messageInterval = setInterval(() => {
            if (messageIndex < fakeMessages.length) {
                progressText.textContent = fakeMessages[messageIndex];
                messageIndex++;
            }
        }, duration / (fakeMessages.length + 1));

        setTimeout(() => {
            clearInterval(messageInterval);
            loadingSection.classList.remove('active');
            resolve();
        }, duration);
    });
}

function generateFakeConfidence() {
    // Майже завжди 99%+
    const base = 99 + Math.random() * 0.9;
    return base.toFixed(1);
}

/**
 * Симулює конфеті ефект (простий варіант без бібліотеки)
 */
function triggerSimpleConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');

    const particles = [];
    const colors = ['#e2b04a', '#ff6b9d', '#4a90e2', '#2ecc71'];

    for (let i = 0; i < 50; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: -10,
            vx: (Math.random() - 0.5) * 4,
            vy: Math.random() * 3 + 2,
            size: Math.random() * 3 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            opacity: 1
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];

            ctx.fillStyle = p.color.slice(0, 7) + Math.floor(p.opacity * 255).toString(16).padStart(2, '0');
            ctx.fillRect(p.x, p.y, p.size, p.size);

            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1; // гравітація
            p.opacity -= 0.01;

            if (p.opacity <= 0 || p.y > canvas.height) {
                particles.splice(i, 1);
            }
        }

        if (particles.length > 0) {
            requestAnimationFrame(animate);
        }
    }

    animate();
}

/**
 * Конвертує результат у текст для шерингу
 */
function generateShareText(verdict) {
    return `Я щойно перевірив(ла) на Правотрон 3000, хто правий у нашій суперечці... Результат: ${verdict}`;
}
