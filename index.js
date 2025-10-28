

const quoteContainer = document.getElementById("content");
const quoteInput = document.getElementById("quote-input");
const timerDisplay = document.getElementById("timer");
const newGameButton = document.getElementById("new-game-btn");
const quoteCounterDisplay = document.getElementById("quote-counter");
const score = document.getElementById("score");

let currentQuote = "";
let timerId;
let timerDuration = 15;
let currentIndex = 0;
let quoteCounter = -1;

const getQuotes = async () => {
  const targetUrl = "https://type.fit/api/quotes";

  try {
    // 🩵 Use a stable proxy that returns JSON directly (no parsing needed)
    const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`);
    if (!response.ok) throw new Error("Failed to fetch quotes");

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return [
      { text: "Practice makes perfect.", author: "Anonymous" },
      { text: "Keep typing and stay focused!", author: "AI Buddy" }
    ]; // fallback quotes
  }
};



const renderQuote = async () => {
  clearInterval(timerId);

  const quotes = await getQuotes();
  const randomIndex = Math.floor(Math.random() * quotes.length);
  currentQuote = quotes[randomIndex].text;
  const randomQuote = quotes[randomIndex];

  const html = randomQuote.text
    .split("")
    .map((char, index) => {
      return `<span id="char-${index}" class="text-3xl opacity-30">${char}</span>`;
    })
    .join("");

  quoteContainer.innerHTML = html;

  timerDuration = 15;
  currentIndex = 0;

  updateTimerDisplay();

  quoteInput.value = "";
  quoteInput.disabled = false;
  quoteCounterDisplay.style.display = "none"; // Hide counter during the game

  timerId = setInterval(() => {
    timerDuration--;
    updateTimerDisplay();

    if (timerDuration === 0) {
      clearInterval(timerId);

      quoteContainer.innerHTML =
        '<p class="text-red-500 text-center">Game Over</p>';
      quoteInput.disabled = true;
      newGameButton.disabled = false;

      // Show quote counter when game over
      quoteCounterDisplay.textContent = `${quoteCounter}`;
      quoteCounterDisplay.style.display = "block";
      score.style.display = "block";
    }
  }, 1000);

  if (!newGameButton.disabled) {
    quoteCounter++;
    updateQuoteCounterDisplay();
  }
};

const updateTimerDisplay = () => {
  timerDisplay.textContent = `${timerDuration} `;
};

const updateQuoteCounterDisplay = () => {
  quoteCounterDisplay.textContent = `${quoteCounter}`;
};

document.addEventListener("keydown", (e) => {
  if (quoteInput.disabled) return;

  const charSpan = document.getElementById(`char-${currentIndex}`);
  if (e.key === currentQuote[currentIndex]) {
    charSpan.classList.add("opacity-100");
    currentIndex++;
    if (currentIndex === currentQuote.length) {
      clearInterval(timerId);
      renderQuote();
    }
  } else {
    charSpan.classList.remove("opacity-100");
    timerDuration--;
    updateTimerDisplay();

    if (timerDuration === 0) {
      clearInterval(timerId);
      quoteContainer.innerHTML =
        '<p class="text-red-500 text-center">Game Over</p>';
      quoteInput.disabled = true;
      newGameButton.disabled = false;

      // Show quote counter when game over
      quoteCounterDisplay.textContent = `${quoteCounter}`;
      quoteCounterDisplay.style.display = "block";
      score.style.display = "block";
    }
  }
});

newGameButton.addEventListener("click", () => {
  quoteInput.disabled = false;
  quoteCounterDisplay.style.display = "none";
  score.style.display = "none";
  renderQuote();
  newGameButton.disabled = true;
});

renderQuote();
