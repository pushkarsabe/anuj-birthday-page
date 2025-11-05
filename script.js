document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Dynamic Age Calculation ---
    const anujBirthday = new Date('2014-11-05'); 
    const today = new Date();

    function calculateAge(birthDate, currentDate) {
        const diffTime = currentDate.getTime() - birthDate.getTime();
        const ageDate = new Date(diffTime);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    const age = calculateAge(anujBirthday, today);
    const headerElement = document.getElementById('main-header');

    function getOrdinal(n) {
        if (n > 3 && n < 21) return 'th';
        switch (n % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    }

    const ordinalAge = age + getOrdinal(age);

    headerElement.innerHTML = `
        <h1>🎉 Happy ${ordinalAge} Birthday Dear Anuj! 🎉</h1>
        <p>You've officially turned ${age}! Let the celebrations begin!</p>
    `;

    // --- 2. Confetti Animation ---
    function createConfetti() {
        const confettiCount = 50;
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.animationDuration = Math.random() * 2 + 3 + 's';
            confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
            confetti.style.opacity = Math.random() + 0.5;
            document.body.appendChild(confetti);

            confetti.addEventListener('animationend', () => {
                confetti.remove();
            });
        }
    }

    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes fall {
            0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .confetti {
            position: fixed;
            width: 10px;
            height: 10px;
            border-radius: 2px;
            pointer-events: none;
            z-index: 9999;
            animation: fall linear forwards;
        }
    `;
    document.head.appendChild(style);

    // --- 3. Whack-A-Mole Game Logic ---
    const holes = document.querySelectorAll('.hole');
    const moles = document.querySelectorAll('.mole');
    const scoreDisplay = document.getElementById('score');
    const timerDisplay = document.getElementById('timer');
    const highScoreDisplay = document.getElementById('high-score');
    const startBtn = document.getElementById('start-btn');
    const playAgainBtn = document.getElementById('play-again-btn');
    const gameOverMessage = document.getElementById('game-over-message');
    const finalScoreDisplay = document.getElementById('final-score');

    let score = 0;
    let timeLeft = 30;
    let gameActive = false;
    let countdownTimer;
    let currentMole = null;
    let moleTimeout = null;

    // Get high score from localStorage or default to 0
    let highScore = parseInt(localStorage.getItem('whackAnujHighScore')) || 0;
    highScoreDisplay.textContent = highScore;

    // Function to get a random hole (different from current one)
    function randomHole() {
        const availableHoles = Array.from(holes);
        if (currentMole) {
            const currentHoleIndex = Array.from(holes).indexOf(currentMole.closest('.hole'));
            availableHoles.splice(currentHoleIndex, 1);
        }
        const randomIndex = Math.floor(Math.random() * availableHoles.length);
        return availableHoles[randomIndex];
    }

    // Function to get random time for mole to stay up
    function randomTime(min, max) {
        return Math.random() * (max - min) + min;
    }

    // Function to make a mole pop up
    function popUp() {
        if (!gameActive) return;

        const hole = randomHole();
        const mole = hole.querySelector('.mole');
        const time = randomTime(600, 1200); // Mole stays up for 0.6-1.2 seconds

        currentMole = mole;
        mole.classList.add('up');

        moleTimeout = setTimeout(() => {
            if (mole.classList.contains('up') && !mole.classList.contains('whacked')) {
                mole.classList.remove('up');
                currentMole = null;
            }

            if (gameActive) {
                // Random delay before next mole appears (200-500ms)
                setTimeout(() => {
                    if (gameActive) popUp();
                }, randomTime(200, 500));
            }
        }, time);
    }

    // Function to handle whacking a mole
    function whack(e) {
        if (!gameActive) return;

        const mole = e.currentTarget;

        // Check if mole is up and not already whacked
        if (!mole.classList.contains('up')) return;
        if (mole.classList.contains('whacked')) return;

        // Mark as whacked and hide immediately
        mole.classList.add('whacked');
        mole.classList.remove('up');

        // Increment score
        score++;
        scoreDisplay.textContent = score;

        // Visual feedback - scale down animation
        mole.style.transform = 'translateX(-50%) scale(0.7) rotate(10deg)';

        setTimeout(() => {
            mole.classList.remove('whacked');
            mole.style.transform = '';
            currentMole = null;
        }, 400);
    }

    // Function to start the game
    function startGame() {
        // Reset game state
        score = 0;
        timeLeft = 30;
        gameActive = true;
        scoreDisplay.textContent = score;
        timerDisplay.textContent = timeLeft;
        startBtn.disabled = true;
        gameOverMessage.classList.add('hidden');

        // Remove any existing moles
        moles.forEach(mole => {
            mole.classList.remove('up', 'whacked');
            mole.style.transform = '';
        });

        // Start the game
        popUp();

        // Start countdown timer
        countdownTimer = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;

            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);
    }

    // Function to end the game
    function endGame() {
        gameActive = false;
        clearInterval(countdownTimer);
        clearTimeout(moleTimeout);
        startBtn.disabled = false;

        // Remove all moles
        moles.forEach(mole => {
            mole.classList.remove('up', 'whacked');
            mole.style.transform = '';
        });

        currentMole = null;

        // Check and update high score
        if (score > highScore) {
            highScore = score;
            highScoreDisplay.textContent = highScore;
            localStorage.setItem('whackAnujHighScore', highScore);

            // Celebrate new high score with confetti!
            createConfetti();
            setTimeout(createConfetti, 300);
        }

        // Show game over message
        finalScoreDisplay.textContent = score;
        gameOverMessage.classList.remove('hidden');
    }

    // Event listeners for game buttons
    startBtn.addEventListener('click', startGame);
    playAgainBtn.addEventListener('click', startGame);

    // Add click event listeners to all moles
    moles.forEach(mole => {
        mole.addEventListener('click', whack);
    });
});