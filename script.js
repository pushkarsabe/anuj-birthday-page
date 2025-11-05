document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Dynamic Age Calculation ---

    // **IMPORTANT: Set Anuj's actual birth date here**
    const anujBirthday = new Date('2014-11-05'); // Example: Nov 5, 2014
    
    const today = new Date();

    function calculateAge(birthDate, currentDate) {
        const diffTime = currentDate.getTime() - birthDate.getTime();
        const ageDate = new Date(diffTime); // milliseconds since epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    const age = calculateAge(anujBirthday, today);
    const headerElement = document.getElementById('main-header');

    // Determine the correct ordinal suffix for the age (e.g., 1st, 2nd, 3rd, 11th)
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

    // Inject the dynamic content into the header
    headerElement.innerHTML = `
        <h1>🎉 Happy ${ordinalAge} Birthday Dear Anuj! 🎉</h1>
        <p>You've officially turned ${age}! Let the celebrations begin!</p>
    `;

    // --- 2. Interactive Heart Script (Optional JS control, mostly done with CSS) ---
    // The main heart logic is now fully managed by the CSS :hover.

    // --- 3. Confetti Animation (Simulated Confetti) ---
    // A simple function to add a visual celebration effect
    function createConfetti() {
        const confettiCount = 50;
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.animationDuration = Math.random() * 2 + 3 + 's'; // 3-5s
            confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
            confetti.style.opacity = Math.random() + 0.5;
            document.body.appendChild(confetti);

            // Clean up confetti elements after animation
            confetti.addEventListener('animationend', () => {
                confetti.remove();
            });
        }
    }

    // Add a simple CSS style for the confetti animation in the JS for quick deployment
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
});