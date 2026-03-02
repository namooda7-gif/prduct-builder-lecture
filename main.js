class LottoBall extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const number = this.getAttribute('number') || 0;
    const color = this.getColorForNumber(number);

    this.shadowRoot.innerHTML = `
      <style>
        :host {
            display: inline-block;
            opacity: 0; /* Initially hidden for animation */
        }
        .ball {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #fff, ${color});
          color: #fff;
          font-size: 1.8rem;
          font-weight: bold;
          text-shadow: 0 0 5px rgba(0,0,0,0.4);
          box-shadow: 
            inset -5px -5px 15px rgba(0,0,0,0.3),
            0 5px 10px rgba(0,0,0,0.5);
          font-family: 'Inter', sans-serif;
        }
      </style>
      <div class="ball">${number}</div>
    `;
  }

  getColorForNumber(num) {
    const number = parseInt(num, 10);
    if (number <= 10) return '#fbc400'; // 노란색
    if (number <= 20) return '#69c8f2'; // 파란색
    if (number <= 30) return '#ff7272'; // 빨간색
    if (number <= 40) return '#aaa';    // 회색
    return '#b0d840';               // 녹색
  }
}

customElements.define('lotto-ball', LottoBall);

// --- Lotto Generation --- 
const generateBtn = document.getElementById('generate-btn');
const lottoNumbersContainer = document.getElementById('lotto-numbers');

generateBtn.addEventListener('click', () => {
  lottoNumbersContainer.innerHTML = '';
  const numbers = new Set();

  while (numbers.size < 6) {
    const randomNumber = Math.floor(Math.random() * 45) + 1;
    numbers.add(randomNumber);
  }

  const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

  sortedNumbers.forEach((number, index) => {
    const ball = document.createElement('lotto-ball');
    ball.setAttribute('number', number);
    ball.style.animation = `appear 0.5s ease-out forwards`;
    ball.style.animationDelay = `${index * 0.15}s`;

    lottoNumbersContainer.appendChild(ball);
  });
});

// --- Theme Switch --- 
const themeToggleButton = document.getElementById('theme-toggle-btn');
const docElement = document.documentElement; // <html> element

// Function to set the theme
const setTheme = (theme) => {
  docElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
};

// Check for saved theme in localStorage
const savedTheme = localStorage.getItem('theme');

// Check for system preference
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

// Initial theme setup
if (savedTheme) {
    setTheme(savedTheme);
} else if (prefersDark.matches) {
    setTheme('dark');
} else {
    setTheme('light');
}

// Listener for the toggle button
themeToggleButton.addEventListener('click', () => {
    const currentTheme = docElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        setTheme('light');
    } else {
        setTheme('dark');
    }
});

// Listener for system preference changes
prefersDark.addEventListener('change', (e) => {
    // Only change if there's no manually saved theme
    if (!localStorage.getItem('theme')) {
        if (e.matches) {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    }
});
