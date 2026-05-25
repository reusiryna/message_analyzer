/**
 * main.js
 * Основна логіка Правотрон 3000
 * Обробляє всі користувацькі взаємодії та управляє потоком додатку
 */

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('verdict-form');
    const fileUpload = document.getElementById('file-upload');
    const screenshotInput = document.getElementById('screenshot');
    const fileInfo = document.getElementById('file-info');
    const submitBtn = document.getElementById('submit-btn');
    const retryBtn = document.getElementById('retry-btn');
    const shareBtn = document.getElementById('share-btn');

    // ===== Drag & Drop для завантаження файлу =====
    fileUpload.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUpload.classList.add('drag-over');
    });

    fileUpload.addEventListener('dragleave', () => {
        fileUpload.classList.remove('drag-over');
    });

    fileUpload.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUpload.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            screenshotInput.files = files;
            handleFileSelected();
        }
    });

    // Клік на область завантаження
    fileUpload.addEventListener('click', () => {
        screenshotInput.click();
    });

    // Вибір файлу через input
    screenshotInput.addEventListener('change', handleFileSelected);

    function handleFileSelected() {
        const file = screenshotInput.files[0];
        if (file) {
            fileInfo.textContent = `✓ Файл вибрано: ${file.name}`;
            fileInfo.classList.add('success');
            checkFormValidity();
        }
    }

    // ===== Обробка radio buttons =====
    document.querySelectorAll('input[type="radio"]').forEach((radio) => {
        radio.addEventListener('change', function() {
            // Оновлення CSS класу для fallback
            const parent = this.closest('.gender-option');
            if (this.checked) {
                // Видаліть клас .selected з усіх сестринських елементів
                const groupName = this.name;
                document.querySelectorAll(`input[name="${groupName}"]`).forEach((r) => {
                    r.closest('.gender-option').classList.remove('selected');
                });
                // Додайте клас до поточного елемента
                parent.classList.add('selected');
            }
            checkFormValidity();
        });
    });

    function checkFormValidity() {
        const userGender = form.querySelector('input[name="user-gender"]:checked');
        const opponentGender = form.querySelector('input[name="opponent-gender"]:checked');
        const fileSelected = screenshotInput.files.length > 0;

        submitBtn.disabled = !(userGender && opponentGender && fileSelected);
    }

    // ===== Обробка відправлення форми =====
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const userGender = form.querySelector('input[name="user-gender"]:checked').value;
        const opponentGender = form.querySelector('input[name="opponent-gender"]:checked').value;

        // Запуск фальшивого аналізу
        await fakeLoading(2500);

        // Отримання вердикту
        const verdict = getVerdict(userGender, opponentGender);

        // Генерація метрик
        const metrics = generateFakeMetrics();

        // Відображення результату
        displayResult(verdict, metrics);
    });

    // ===== Відображення результату =====
    function displayResult(verdict, metrics) {
        const formSection = document.getElementById('form-section');
        const resultSection = document.getElementById('result-section');
        const verdictText = document.getElementById('verdict-text');
        const reasonText = document.getElementById('reason-text');
        const confidenceSpan = document.querySelector('.confidence span');

        const confidenceLevel = generateFakeConfidence();

        // Вибір тексту вердикту
        if (verdict.winner === 'user') {
            verdictText.textContent = 'ВИ ПРАВІ ✓';
            verdictText.parentElement.className = 'result-verdict';
            triggerSimpleConfetti();
        } else if (verdict.winner === 'opponent') {
            verdictText.textContent = 'ВИ НЕ ПРАВІ ✗';
            verdictText.parentElement.className = 'result-verdict';
        } else {
            verdictText.textContent = 'НІЧИЯ ⚖️';
            verdictText.parentElement.className = 'result-verdict draw';
        }

        reasonText.textContent = verdict.reason;
        confidenceSpan.textContent = confidenceLevel + '%';

        // Оновлення метрик
        document.getElementById('metric-1').textContent = metrics.metric1;
        document.getElementById('metric-2').textContent = metrics.metric2;
        document.getElementById('metric-3').textContent = metrics.metric3;
        document.getElementById('metric-4').textContent = metrics.metric4;

        // Переключення секцій
        formSection.classList.remove('active');
        resultSection.classList.add('active');

        // Скрол до результату
        setTimeout(() => {
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }

    // ===== Кнопка "Спробувати ще раз" =====
    retryBtn.addEventListener('click', () => {
        const formSection = document.getElementById('form-section');
        const resultSection = document.getElementById('result-section');

        resultSection.classList.remove('active');
        formSection.classList.add('active');

        // Очищення форми
        form.reset();
        fileInfo.textContent = '';
        fileInfo.classList.remove('success');
        
        // Видаліть .selected класи
        document.querySelectorAll('.gender-option.selected').forEach((el) => {
            el.classList.remove('selected');
        });
        
        checkFormValidity();

        // Скрол до форми
        setTimeout(() => {
            formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    });

    // ===== Кнопка "Поділитися вердиктом" =====
    shareBtn.addEventListener('click', () => {
        const verdictText = document.getElementById('verdict-text').textContent;
        const reasonText = document.getElementById('reason-text').textContent;
        const confidenceLevel = document.querySelector('.confidence span').textContent;

        const shareContent = `🎯 ПРАВОТРОН 3000 вердикт:\n\n${verdictText}\n\nОбґрунтування: ${reasonText}\n\nРівень впевненості: ${confidenceLevel}`;

        // Спроба скопіювати в буфер обміну
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareContent).then(() => {
                alert('Вердикт скопійовано в буфер обміну! 📋');
            }).catch(() => {
                fallbackShare(shareContent);
            });
        } else {
            fallbackShare(shareContent);
        }
    });

    function fallbackShare(text) {
        // Для старих браузерів
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('Вердикт скопійовано! 📋');
    }

    // Ініціальна перевірка валідності та синхронізація CSS
    checkFormValidity();
    
    // Синхронізуємо initial state для :has() fallback
    document.querySelectorAll('input[type="radio"]:checked').forEach((radio) => {
        radio.closest('.gender-option').classList.add('selected');
    });
});
