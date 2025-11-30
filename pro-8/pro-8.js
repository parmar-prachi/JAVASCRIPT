//  COUNTDOWN TIMER :

let countdownInterval;

function startCountdown() {
    const eventDate = new Date("Jan 1, 2026 00:00:00").getTime();

    countdownInterval = setInterval(function () {

        const now = new Date().getTime();
        const diff = eventDate - now; 
        
        // Calculates the difference in milliseconds between the event date and now.
        // If diff is positive the event is still in the future; if zero or negative it's started or passed.

        if (diff <= 0) {
            clearInterval(countdownInterval);
            document.getElementById("countdownDisplay").innerHTML =
                "Time’s up! The event has started 🎉";
            return;
        }

        // 1 day = 86400000 ms , 1 hour = 3600000 ms ,  1 minute = 60000 ms , 1 second = 1000 ms

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));  
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById("countdownDisplay").innerHTML =
            `${days} Days ${hours} Hours ${mins} Minutes ${secs} Seconds`;

    }, 1000);
}

document.getElementById("startBtn").onclick = startCountdown;
document.getElementById("pauseBtn").onclick = function () {
    clearInterval(countdownInterval);
};

//   QUOTE SLIDER :

let quotes = [
    "Success is not final, failure is not fatal.",
    "Believe you can and you're halfway there.",
    "Dream big. Work hard. Stay focused.",
    "The harder you work, the luckier you get.",
    "Every moment is a fresh beginning.",
    "Push yourself, because no one else will."
];

let index = 0;
let quoteInterval;

function displayQuote() {
    document.getElementById("quoteText").innerText = quotes[index];
}

function nextQuote() {
    index = (index + 1) % quotes.length;
    displayQuote();
}

function prevQuote() {
    index = (index - 1 + quotes.length) % quotes.length;
    displayQuote();
}

quoteInterval = setInterval(nextQuote, 4000); 
document.getElementById("nextBtn").onclick = nextQuote;
document.getElementById("prevBtn").onclick = prevQuote;

displayQuote();

// MODAL POPUP :

setTimeout(() => {
    document.getElementById("welcomeModal").style.display = "flex";
}, 5000);

document.getElementById("closeModalBtn").onclick = function () {
    document.getElementById("welcomeModal").style.display = "none";
};

