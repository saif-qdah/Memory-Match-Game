// الأشكال اللي رح تظهر ع الكروت (8 أزواج = 16 كرت)
const emojis = ['⚽', '🚗', '🎮', '🍕', '🚀', '💎', '💡', '🦁', '⚽', '🚗', '🎮', '🍕', '🚀', '💎', '💡', '🦁'];
let flippedCards = [];
let matchedCount = 0;
let moves = 7;
let timerInterval = null;
let seconds = 0;
let gameStarted = false;

const grid = document.getElementById('grid');
const movesText = document.getElementById('moves');
const timerText = document.getElementById('timer');
const bestTimeText = document.getElementById('best-time');

// تشغيل اللعبة فوراً عند فتح الصفحة
initGame();

function initGame() {
    // 1. خلط الكروت بشكل عشوائي
    emojis.sort(() => Math.random() - 0.5);
    grid.innerHTML = '';
    
    // 2. إنشاء الكروت داخل الـ HTML بالـ JS
    emojis.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.emoji = emoji;
        card.dataset.index = index;

        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">❓</div>
                <div class="card-back">${emoji}</div>
            </div>
        `;
        
        card.addEventListener('click', flipCard);
        grid.appendChild(card);
    });

    // 3. عرض أفضل وقت مخزن بالجهاز
    displayBestTime();
}

function flipCard() {
    // شروط لمنع الضغط ع الكرت (إذا مصلح، أو ملفوف أصلاً، أو لافين كرتين)
    if (this.classList.contains('flipped') || this.classList.contains('matched') || flippedCards.length === 2) return;

    // تشغيل العداد مع أول ضغطة
    if (!gameStarted) {
        startTimer();
        gameStarted = true;
    }

    this.classList.add('flipped');
    flippedCards.push(this);

    if (flippedCards.length === 2) {
       moves--; // بنقص محاولة لأن اللاعب غلط أو جرب
movesText.innerText = moves;

// شرط الخسارة: إذا خلصت المحاولات وما فتح كل الكروت
if (moves === 0 && matchedCount !== emojis.length) {
    clearInterval(timerInterval);
    setTimeout(() => {
        alert("💀 جيم أوفر! خلصت محاولاتك، حاول مرة ثانية!");
        resetGame(); // إعادة تصفير اللعبة تلقائياً
    }, 500);
    return;
}
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.emoji === card2.dataset.emoji) {
        // تطابقوا!
        card1.classList.add('matched');
        card2.classList.add('matched');
        flippedCards = [];
        matchedCount += 2;

        // إذا فتح كل الكروت يفوز
        if (matchedCount === emojis.length) {
            clearInterval(timerInterval);
            saveBestTime();
            setTimeout(() => alert(`كفوووو لعييببـ ${moves} محاولة و بوقت ${formatTime(seconds)}`), 500);
        }
    } else {
        // ما تطابقوا، نرجع نغطيهم بعد ثانية
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

// العداد
function startTimer() {
    seconds = 0;
    timerInterval = setInterval(() => {
        seconds++;
        timerText.innerText = formatTime(seconds);
    }, 1000);
}

function formatTime(sec) {
    const mins = Math.floor(sec / 60).toString().padStart(2, '0');
    const secs = (sec % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
}

// حفظ النتيجة بالجهاز (localStorage)
function saveBestTime() {
    const currentBest = localStorage.getItem('bestTime');
    if (!currentBest || seconds < parseInt(currentBest)) {
        localStorage.setItem('bestTime', seconds);
        displayBestTime();
    }
}

function displayBestTime() {
    const best = localStorage.getItem('bestTime');
    bestTimeText.innerText = best ? formatTime(parseInt(best)) : '--:--';
}

// إعادة تشغيل اللعبة
function resetGame() {
    clearInterval(timerInterval);
    seconds = 0;
    moves = 7;
    matchedCount = 0;
    flippedCards = [];
    gameStarted = false;
    timerText.innerText = "00:00";
    movesText.innerText = "7";
    initGame();
}
